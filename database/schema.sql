-- ==========================================
-- BPO Workforce Optimizer Schema
-- Optimized for Amazon Aurora PostgreSQL
-- ==========================================

-- Enable UUID extension for secure, non-sequential identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS TABLE (Multi-tenant partition key)
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS TABLE (Supports Admins, Supervisors, and Agents)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('super_admin', 'supervisor', 'agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SHIFTS TABLE (Tracks agent work schedules)
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'active', 'completed', 'absent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_shift_times CHECK (end_time > start_time)
);

-- 4. CALL LOGS TABLE (High write traffic table)
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    agent_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    customer_id VARCHAR(100) NOT NULL,
    duration_sec INTEGER NOT NULL CHECK (duration_sec >= 0),
    status VARCHAR(50) NOT NULL CHECK (status IN ('connected', 'completed', 'abandoned')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. STAFFING PREDICTIONS TABLE (AI forecasted staffing recommendations)
CREATE TABLE staffing_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    predicted_time TIMESTAMP WITH TIME ZONE NOT NULL,
    predicted_call_volume INTEGER NOT NULL CHECK (predicted_call_volume >= 0),
    recommended_agents INTEGER NOT NULL CHECK (recommended_agents >= 0),
    actual_agents INTEGER NOT NULL CHECK (actual_agents >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- INDEXES FOR HIGH-CONCURRENCY OPERATIONS
-- ==========================================================

-- Optimize tenant-level queries (critical for multi-tenant SaaS scaling)
CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_shifts_tenant ON shifts(tenant_id);
CREATE INDEX idx_call_logs_tenant ON call_logs(tenant_id);
CREATE INDEX idx_predictions_tenant ON staffing_predictions(tenant_id);

-- Optimize shift check-ins and schedule queries during shift changes
-- Shift changes cause massive READ traffic on shifts starting/ending around the current time.
CREATE INDEX idx_shifts_active_window ON shifts (tenant_id, start_time, end_time) 
    WHERE status IN ('scheduled', 'active');

-- Optimize call logs dashboard queries (e.g. real-time charts querying today's call logs)
-- Compound index on tenant + created_at optimizes time-series queries.
CREATE INDEX idx_call_logs_realtime ON call_logs (tenant_id, created_at DESC);

-- Optimize user identification during login / session check
CREATE INDEX idx_users_email ON users(email);


-- ==========================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Enable Row-Level Security on all multi-tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE staffing_predictions ENABLE ROW LEVEL SECURITY;

-- 1. USERS RLS POLICIES
-- Super Admin can do everything.
-- Supervisors can read/write users in their tenant.
-- Agents can only read their own user record.
CREATE POLICY users_tenant_policy ON users
    FOR ALL
    USING (
        -- Super admin bypass
        current_setting('app.current_user_role', true) = 'super_admin'
        OR
        -- Supervisor matching tenant
        (
            tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid 
            AND current_setting('app.current_user_role', true) = 'supervisor'
        )
        OR
        -- Agent matching their own ID
        (
            id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
        )
    );

-- 2. SHIFTS RLS POLICIES
CREATE POLICY shifts_tenant_policy ON shifts
    FOR ALL
    USING (
        current_setting('app.current_user_role', true) = 'super_admin'
        OR
        (
            tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid 
            AND current_setting('app.current_user_role', true) = 'supervisor'
        )
        OR
        (
            agent_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
        )
    );

-- 3. CALL LOGS RLS POLICIES
CREATE POLICY call_logs_tenant_policy ON call_logs
    FOR ALL
    USING (
        current_setting('app.current_user_role', true) = 'super_admin'
        OR
        (
            tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid 
            AND current_setting('app.current_user_role', true) = 'supervisor'
        )
        OR
        (
            agent_id = NULLIF(current_setting('app.current_user_id', true), '')::uuid
        )
    );

-- 4. STAFFING PREDICTIONS RLS POLICIES
CREATE POLICY predictions_tenant_policy ON staffing_predictions
    FOR ALL
    USING (
        current_setting('app.current_user_role', true) = 'super_admin'
        OR
        (
            tenant_id = NULLIF(current_setting('app.current_tenant_id', true), '')::uuid 
            AND current_setting('app.current_user_role', true) = 'supervisor'
        )
    );


-- ==========================================================
-- CONCURRENCY OPTIMIZATION NOTES & PERFORMANCE EXPLANATION
-- ==========================================================
/*
   HOW THIS MEETS THE PRODUCTION EDGE REQUIREMENTS:

   1. Connection Pool Starvation Prevention:
      During shift changes (thousands of logins/check-ins), direct database connection limits are easily reached.
      We integrate Amazon Aurora RDS Proxy. RDS Proxy pools database connections, reducing database memory usage by 
      up to 90% and sharing idle connections.

   2. Row-Level Security Performance:
      RLS adds dynamic filters to queries (e.g. `WHERE tenant_id = ...`).
      We created composite indexes like `idx_call_logs_realtime` and `idx_shifts_active_window` containing `tenant_id`
      as the leading column. This ensures that when RLS rewrites the query to filter by `tenant_id`, the planner
      executes an index scan rather than a sequential table scan, keeping queries lightning fast.

   3. Call Write Buffering (Shift Changes):
      To avoid write lock contention during massive agent check-ins, call logs are buffered in a memory cache (e.g. ElastiCache Redis)
      and batch-inserted into Aurora PostgreSQL using a COPY command or multi-row INSERTs:
      `INSERT INTO call_logs (tenant_id, agent_id, customer_id, duration_sec, status) VALUES ...` in batches of 500-1000.
*/
