-- Seed data for prosite database

-- Admin user (password: admin123456)
INSERT INTO admin_users (id, email, password_hash, role, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440001',
  'admin@prosite.com',
  '$2a$12$gRb44bbOAAtcGVyHGnhX5uTX1POj4h2RYYby1ryLTdBXxc2Q3Bo62',
  'super_admin',
  CAST(strftime('%s', 'now') AS INTEGER)
);

-- Test client (password: test123456)
INSERT INTO clients (id, email, password_hash, billing_end, active, created_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440002',
  'test@example.com',
  '$2a$12$L.nZUB9ixE/OKdhoB37YGuM0r.tlt6F8XRbSTJ99UnBHJVU.Js/CS',
  CAST(strftime('%s', datetime('now', '+30 days')) AS INTEGER),
  1,
  CAST(strftime('%s', 'now') AS INTEGER)
);

-- Test castles
INSERT INTO castles (id, client_id, name, settings_json, updated_at)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  'Castelo Principal',
  '{"autoFight":true,"autoUpgrade":false,"autoCollect":true,"maxTroops":5000,"defenseStrategy":"balanced"}',
  CAST(strftime('%s', 'now') AS INTEGER)
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440002',
  'Castelo Secundário',
  '{"autoFight":false,"autoUpgrade":true,"autoCollect":true,"maxTroops":3000,"defenseStrategy":"defensive"}',
  CAST(strftime('%s', 'now') AS INTEGER)
);

-- Templates
INSERT INTO templates (id, name, settings_json, created_at, updated_at)
VALUES 
(
  '550e8400-e29b-41d4-a716-446655440005',
  'Template Agressivo',
  '{"autoFight":true,"autoUpgrade":true,"autoCollect":true,"maxTroops":10000,"defenseStrategy":"aggressive"}',
  CAST(strftime('%s', 'now') AS INTEGER),
  CAST(strftime('%s', 'now') AS INTEGER)
),
(
  '550e8400-e29b-41d4-a716-446655440006',
  'Template Defensivo',
  '{"autoFight":false,"autoUpgrade":true,"autoCollect":true,"maxTroops":7000,"defenseStrategy":"defensive"}',
  CAST(strftime('%s', 'now') AS INTEGER),
  CAST(strftime('%s', 'now') AS INTEGER)
);