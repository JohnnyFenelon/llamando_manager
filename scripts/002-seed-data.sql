-- Seed data for Llamando Manager
-- Passwords are hashed with bcrypt via pgcrypto's crypt()/gen_salt('bf'),
-- which produces standard $2a$ hashes compatible with bcryptjs in the app.
-- Idempotent: re-running will not duplicate rows.

-- ------------------------------------------------------------
-- Users (default demo password: "1234" — change in production)
-- ------------------------------------------------------------
INSERT INTO app_users (id, name, email, password_hash, role, status) VALUES
  ('u1', 'Sarah Connor', 'sarah@connect-bpo.com', crypt('1234', gen_salt('bf')), 'agent', 'Active'),
  ('u2', 'Yuki Tanaka',  'yuki@connect-bpo.com',  crypt('1234', gen_salt('bf')), 'agent', 'Active'),
  ('u3', 'Chen Wei',     'chen@connect-bpo.com',  crypt('1234', gen_salt('bf')), 'agent', 'Active'),
  ('u4', 'Aarav Patel',  'aarav@connect-bpo.com', crypt('1234', gen_salt('bf')), 'agent', 'Active'),
  ('u5', 'Mei Ling',     'mei@connect-bpo.com',   crypt('1234', gen_salt('bf')), 'supervisor', 'Active'),
  ('u_admin', 'Angela',  'workforce@connect-bpo.com', crypt('1234', gen_salt('bf')), 'supervisor', 'Active'),
  ('u_agent', 'Agent Demo', 'agent@connect-bpo.com', crypt('1234', gen_salt('bf')), 'agent', 'Active')
ON CONFLICT (id) DO NOTHING;

-- ------------------------------------------------------------
-- Customers (CRM leads)
-- ------------------------------------------------------------
INSERT INTO customers (id, name, phone, email, status, assigned_agent, interest, notes) VALUES
  ('c1', 'Apex Technologies Ltd', '+1 (555) 019-2834', 'procurement@apextech.com', 'new', 'Yuki Tanaka', 'High', 'Purchased lead. Cloud migration services.'),
  ('c2', 'Global Logistics Inc',  '+1 (555) 024-8172', 'john.b@globallogistics.com', 'contacted', 'Chen Wei', 'Medium', 'Left voicemail. Call back during morning.'),
  ('c3', 'InnoTech Solutions',    '+1 (555) 031-9281', 'sandra@innotech.io', 'qualified', 'Aarav Patel', 'High', 'Spoke to Director. Sending proposal.'),
  ('c4', 'Nova Retail Group',     '+1 (555) 042-7711', 'ops@novaretail.com', 'closed_won', 'Yuki Tanaka', 'Closed', 'Closed 3-year enterprise contract.'),
  ('c5', 'Quantum Labs',          '+1 (555) 056-1188', 'billing@quantum.edu', 'new', 'Unassigned', 'Low', 'Acquired via lead gen portal.'),
  ('c6', 'Stellar Logistics',     '+1 (555) 067-2345', 'freight@stellar.com', 'contacted', 'Chen Wei', 'Low', 'Gatekeeper was hostile. Try direct line.'),
  ('c7', 'Prime Finance Corp',    '+1 (555) 078-4392', 'info@primefinance.com', 'qualified', 'Sarah Connor', 'High', 'Highly interested in customer care outsourcing.'),
  ('c8', 'Vanguard Tech',         '+1 (555) 089-3012', 'hr@vanguard.tech', 'closed_lost', 'Sarah Connor', 'None', 'No budget for outsource services.'),
  ('test_c1', 'Juan Pérez',       '+1 (809) 709-0770', 'juan.perez@example.com', 'new', 'Unassigned', 'High', 'Outbound calling test lead 1 (DR).'),
  ('test_c2', 'María Rodríguez',  '+1 (849) 566-0770', 'maria.rod@example.com', 'new', 'Unassigned', 'High', 'Outbound calling test lead 2 (DR).')
ON CONFLICT (id) DO NOTHING;
