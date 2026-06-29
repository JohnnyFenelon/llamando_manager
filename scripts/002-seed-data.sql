-- Seed data for Llamando Manager
-- Passwords are hashed with bcrypt via pgcrypto's crypt()/gen_salt('bf'),
-- which produces standard $2a$ hashes compatible with bcryptjs in the app.
-- Idempotent: re-running will not duplicate rows.

-- ------------------------------------------------------------
-- Users (default demo password: "1234" — change in production)
-- ------------------------------------------------------------
INSERT INTO app_users (id, name, email, password_hash, role, status) VALUES
  ('u1', 'Sarah Connor', 'sarah@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
  ('u2', 'Yuki Tanaka',  'yuki@connect-bpo.com',  '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
  ('u3', 'Chen Wei',     'chen@connect-bpo.com',  '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
  ('u4', 'Aarav Patel',  'aarav@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active'),
  ('u5', 'Mei Ling',     'mei@connect-bpo.com',   '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'supervisor', 'Active'),
  ('u_admin', 'Angela',  'workforce@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'supervisor', 'Active'),
  ('u_agent', 'Agent Demo', 'agent@connect-bpo.com', '$2b$10$LPprJJk68.jkTyEEkWX/L./1sa6a6sxOy0tpxK5tTtwtgaxbGeM0C', 'agent', 'Active')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- Customers (CRM leads) & Call Logs Cleanup (Remove Fake Stats)
-- ------------------------------------------------------------
DELETE FROM call_logs;
DELETE FROM customers WHERE id NOT IN ('test_c1', 'test_c2');

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
