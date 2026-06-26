-- ===================================================
-- Call Center CRM & AI Scheduler Schema
-- Optimized for AWS Aurora DSQL (PostgreSQL-Compatible)
-- ===================================================

-- Note: Aurora DSQL natively supports UUID generation via gen_random_uuid().
-- Foreign Key (REFERENCES) constraints are not supported in Aurora DSQL 
-- to optimize distributed write performance across global clusters.

-- 1. TENANTS TABLE
CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. USERS (Agents and Supervisors)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Password column added for agent access
    role VARCHAR(50) NOT NULL CHECK (role IN ('supervisor', 'agent')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CUSTOMERS (CRM Lead Database)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    lead_status VARCHAR(50) NOT NULL CHECK (lead_status IN ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')),
    assigned_agent_id UUID,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. AGENT SCHEDULES (Morning, Afternoon, Night, Weekends)
CREATE TABLE agent_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    schedule_date DATE NOT NULL,
    shift_type VARCHAR(50) NOT NULL CHECK (shift_type IN ('morning', 'afternoon', 'night', 'weekend')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_agent_date_shift UNIQUE (agent_id, schedule_date, shift_type)
);

-- 5. CALL LOGS (Outbound logs from Amazon Connect Integration)
CREATE TABLE call_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    duration_sec INTEGER NOT NULL CHECK (duration_sec >= 0),
    call_status VARCHAR(50) NOT NULL CHECK (call_status IN ('answered', 'no_answer', 'busy', 'failed')),
    call_result VARCHAR(50) NOT NULL CHECK (call_result IN ('pitch_made', 'no_interest', 'follow_up_scheduled', 'lead_won', 'lead_lost')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. WEEKLY PARAMETERS & FORECAST INPUTS
CREATE TABLE weekly_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    weekly_users_volume INTEGER NOT NULL CHECK (weekly_users_volume >= 0),
    agents_morning INTEGER NOT NULL DEFAULT 0,
    agents_afternoon INTEGER NOT NULL DEFAULT 0,
    agents_night INTEGER NOT NULL DEFAULT 0,
    agents_weekend INTEGER NOT NULL DEFAULT 0,
    agents_total_month INTEGER NOT NULL DEFAULT 0,
    pursuit_target INTEGER NOT NULL DEFAULT 0,
    leads_purchased INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DAILY CRM METRICS (Workforce Dashboard Aggregate)
CREATE TABLE daily_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    metric_date DATE NOT NULL UNIQUE,
    calls_made INTEGER NOT NULL DEFAULT 0,
    avg_duration_sec NUMERIC(10, 2) DEFAULT 0,
    leads_closed INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- INDEXES FOR HIGH-PERFORMANCE DISTRIBUTED QUERIES
-- ==========================================================
CREATE INDEX ASYNC idx_customers_agent ON customers(assigned_agent_id);
CREATE INDEX ASYNC idx_schedules_date ON agent_schedules(schedule_date);
CREATE INDEX ASYNC idx_call_logs_date ON call_logs(created_at);
CREATE INDEX ASYNC idx_customers_tenant_status ON customers(tenant_id, lead_status);
