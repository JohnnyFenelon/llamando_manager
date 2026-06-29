-- Llamando Manager production schema

DROP TABLE IF EXISTS call_logs;
DROP TABLE IF EXISTS customers;
DROP TABLE IF EXISTS app_users;

-- ============================================================
-- USERS (agents & supervisors)
-- ============================================================
CREATE TABLE IF NOT EXISTS app_users (
  id            TEXT PRIMARY KEY,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(160) NOT NULL,
  password_hash TEXT NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'agent' CHECK (role IN ('agent', 'supervisor')),
  status        VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Case-insensitive unique email (handled via lowercase conversion in code)
CREATE UNIQUE INDEX ASYNC IF NOT EXISTS idx_app_users_email ON app_users (email);
CREATE INDEX ASYNC IF NOT EXISTS idx_app_users_role ON app_users (role);

-- ============================================================
-- CUSTOMERS (CRM leads)
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id             TEXT PRIMARY KEY,
  name           VARCHAR(160) NOT NULL,
  phone          VARCHAR(40) NOT NULL,
  email          VARCHAR(160),
  status         VARCHAR(20) NOT NULL DEFAULT 'new'
                   CHECK (status IN ('new', 'contacted', 'qualified', 'closed_won', 'closed_lost')),
  assigned_agent VARCHAR(120) NOT NULL DEFAULT 'Unassigned',
  interest       VARCHAR(20) NOT NULL DEFAULT 'Medium',
  notes          TEXT NOT NULL DEFAULT '',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC IF NOT EXISTS idx_customers_status ON customers (status);
CREATE INDEX ASYNC IF NOT EXISTS idx_customers_assigned_agent ON customers (assigned_agent);
CREATE INDEX ASYNC IF NOT EXISTS idx_customers_created_at ON customers (created_at);

-- ============================================================
-- CALL LOGS (audit of outbound calls)
-- ============================================================
CREATE TABLE IF NOT EXISTS call_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id      TEXT,
  agent_name       VARCHAR(120) NOT NULL,
  outcome          VARCHAR(40),
  notes            TEXT,
  duration_seconds INT NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX ASYNC IF NOT EXISTS idx_call_logs_customer_id ON call_logs (customer_id);
CREATE INDEX ASYNC IF NOT EXISTS idx_call_logs_created_at ON call_logs (created_at);
