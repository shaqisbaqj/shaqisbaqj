-- Local/dev seed data. Run after migrations to preview the UI without a
-- live Plaid connection. Replace the two user_id values with real Clerk
-- user ids (or your own, from the Clerk dashboard) before running.

insert into households (id, name) values
  ('00000000-0000-0000-0000-000000000001', 'The Household');

insert into household_members (household_id, user_id, display_name, role) values
  ('00000000-0000-0000-0000-000000000001', 'user_replace_with_clerk_id_1', 'You', 'owner'),
  ('00000000-0000-0000-0000-000000000001', 'user_replace_with_clerk_id_2', 'Riley', 'member');

insert into financial_profiles (household_id, onboarding_complete, income_monthly, pay_schedule, risk_notes, goals_summary, answers) values
  ('00000000-0000-0000-0000-000000000001', true, 9200, 'biweekly',
   'Worried about the car loan APR and how thin things get the week before payday.',
   'Build a 3-month emergency fund, pay off the car loan by next spring.',
   '{"employment": "both salaried", "dependents": 0}');

insert into accounts (id, household_id, name, type, subtype, mask, is_debt, current_balance, apr) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Joint Checking', 'depository', 'checking', '4821', false, 4312.60, null),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'High-Yield Savings', 'depository', 'savings', '9042', false, 11800.00, null),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Chase Sapphire', 'credit', 'credit card', '2210', true, 2140.33, 24.99),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Toyota Loan', 'loan', 'auto', '5588', true, 14320.00, 6.9),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Federal Student Loan', 'loan', 'student', '7734', true, 21870.45, 4.5);

insert into goals (household_id, name, target_amount, current_amount, target_date, created_by) values
  ('00000000-0000-0000-0000-000000000001', 'Emergency Fund', 15000, 11800, '2026-12-01', 'user_replace_with_clerk_id_1'),
  ('00000000-0000-0000-0000-000000000001', 'Save $5k for Riley''s trip', 5000, 2150, '2026-09-01', 'user_replace_with_clerk_id_2'),
  ('00000000-0000-0000-0000-000000000001', 'Payoff Chase Sapphire', 2140.33, 0, '2026-11-01', 'user_replace_with_clerk_id_1');

insert into debts (household_id, account_id, name, balance, apr, minimum_payment) values
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000003', 'Chase Sapphire', 2140.33, 24.99, 75),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', 'Toyota Loan', 14320.00, 6.9, 412),
  ('00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000005', 'Federal Student Loan', 21870.45, 4.5, 260);

insert into cash_flow_events (household_id, name, amount, event_date, recurrence, category, source) values
  ('00000000-0000-0000-0000-000000000001', 'Paycheck (You)', 3450, '2026-07-15', 'biweekly', 'income', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Paycheck (Riley)', 2650, '2026-07-17', 'biweekly', 'income', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Rent', -2400, '2026-07-01', 'monthly', 'housing', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Toyota Loan Payment', -412, '2026-07-05', 'monthly', 'debt', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Student Loan Payment', -260, '2026-07-08', 'monthly', 'debt', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Chase Sapphire Min Payment', -75, '2026-07-10', 'monthly', 'debt', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Utilities', -180, '2026-07-12', 'monthly', 'housing', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Daycare', -1100, '2026-07-14', 'monthly', 'family', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Groceries (est.)', -650, '2026-07-18', 'monthly', 'living', 'manual'),
  ('00000000-0000-0000-0000-000000000001', 'Car Insurance', -140, '2026-07-22', 'monthly', 'insurance', 'manual');

insert into chat_messages (household_id, user_id, role, content) values
  ('00000000-0000-0000-0000-000000000001', 'user_replace_with_clerk_id_1', 'user', 'Can we afford the trip Riley wants to book in September?'),
  ('00000000-0000-0000-0000-000000000001', null, 'assistant', 'Close, but tight. Your Save-for-trip goal is at $2,150 of $5,000 with 8 weeks left — you''d need about $356/week to hit it, and your average discretionary cash after bills is closer to $210/week. If you shift $150/mo from the Chase Sapphire payoff (it''s already ahead of pace) toward the trip goal, you land right at $5k by September 1.');
