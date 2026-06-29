import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    // 0. Drop existing conflicting tables
    await query(`DROP TABLE IF EXISTS call_logs`);
    await query(`DROP TABLE IF EXISTS customers`);
    await query(`DROP TABLE IF EXISTS app_users`);

    // 1. Create tables and indexes
    await query(`
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
    `);

    await query(`
      CREATE UNIQUE INDEX ASYNC IF NOT EXISTS idx_app_users_email ON app_users (email);
      CREATE INDEX ASYNC IF NOT EXISTS idx_app_users_role ON app_users (role);
    `);

    await query(`
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
    `);

    await query(`
      CREATE INDEX ASYNC IF NOT EXISTS idx_customers_status ON customers (status);
      CREATE INDEX ASYNC IF NOT EXISTS idx_customers_assigned_agent ON customers (assigned_agent);
      CREATE INDEX ASYNC IF NOT EXISTS idx_customers_created_at ON customers (created_at);
    `);

    await query(`
      CREATE TABLE IF NOT EXISTS call_logs (
        id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id      TEXT,
        agent_name       VARCHAR(120) NOT NULL,
        outcome          VARCHAR(40),
        notes            TEXT,
        duration_seconds INT NOT NULL DEFAULT 0,
        created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await query(`
      CREATE INDEX ASYNC IF NOT EXISTS idx_call_logs_customer_id ON call_logs (customer_id);
      CREATE INDEX ASYNC IF NOT EXISTS idx_call_logs_created_at ON call_logs (created_at);
    `);

    // 2. Insert seed users
    await query(`
      INSERT INTO app_users (id, name, email, password_hash, role, status) VALUES
        ('u1', 'Sarah Connor', 'sarah@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
        ('u2', 'Yuki Tanaka',  'yuki@connect-bpo.com',  '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
        ('u3', 'Chen Wei',     'chen@connect-bpo.com',  '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
        ('u4', 'Aarav Patel',  'aarav@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
        ('u5', 'Mei Ling',     'mei@connect-bpo.com',   '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'supervisor', 'Active'),
        ('u_admin', 'Angela',  'workforce@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'supervisor', 'Active'),
        ('u_agent', 'Agent Demo', 'agent@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active')
      ON CONFLICT (id) DO NOTHING;
    `);

    // 3. Cleanup old stats and insert Dominican Republic test leads
    await query(`
      DELETE FROM call_logs;
      DELETE FROM customers WHERE id NOT IN ('test_c1', 'test_c2');
    `);

    await query(`
      INSERT INTO customers (id, name, phone, email, status, assigned_agent, interest, notes) VALUES
        ('test_c1', 'Juan Pérez',       '+1 (809) 709-0770', 'juan.perez@example.com', 'new', 'Unassigned', 'High', 'na (6/28/2026) | na (6/28/2026) | na (6/28/2026) | Outbound calling test lead 1 (DR).'),
        ('test_c2', 'María Rodríguez',  '+1 (849) 566-0770', 'maria.rod@example.com', 'new', 'Unassigned', 'High', 'Outbound calling test lead 2 (DR)')
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        phone = EXCLUDED.phone,
        email = EXCLUDED.email,
        status = EXCLUDED.status,
        assigned_agent = EXCLUDED.assigned_agent,
        interest = EXCLUDED.interest,
        notes = EXCLUDED.notes;
    `);

    return NextResponse.json({ success: true, message: "Database schema and seed data initialized successfully!" });
  } catch (error: any) {
    console.error("Database setup failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
