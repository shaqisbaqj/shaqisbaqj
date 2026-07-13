export type PaySchedule =
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly"
  | "irregular";

export type Recurrence =
  | "once"
  | "weekly"
  | "biweekly"
  | "semimonthly"
  | "monthly";

export interface Household {
  id: string;
  name: string;
  created_at: string;
}

export interface HouseholdMember {
  household_id: string;
  user_id: string;
  display_name: string | null;
  role: "owner" | "member";
  joined_at: string;
}

export interface FinancialProfile {
  household_id: string;
  onboarding_complete: boolean;
  income_monthly: number | null;
  pay_schedule: PaySchedule | null;
  risk_notes: string | null;
  goals_summary: string | null;
  answers: Record<string, unknown>;
  updated_at: string;
}

export interface Account {
  id: string;
  household_id: string;
  plaid_item_id: string | null;
  plaid_account_id: string | null;
  name: string;
  official_name: string | null;
  type: string;
  subtype: string | null;
  mask: string | null;
  is_debt: boolean;
  current_balance: number | null;
  available_balance: number | null;
  apr: number | null;
  iso_currency_code: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  household_id: string;
  account_id: string;
  plaid_transaction_id: string | null;
  amount: number;
  date: string;
  name: string;
  merchant_name: string | null;
  category: string | null;
  pending: boolean;
  created_at: string;
}

export interface Goal {
  id: string;
  household_id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  created_by: string;
  status: "active" | "achieved" | "abandoned";
  created_at: string;
}

export interface Debt {
  id: string;
  household_id: string;
  account_id: string | null;
  name: string;
  balance: number;
  apr: number;
  minimum_payment: number;
  created_at: string;
}

export interface CashFlowEvent {
  id: string;
  household_id: string;
  name: string;
  amount: number;
  event_date: string;
  recurrence: Recurrence;
  category: string | null;
  source: "manual" | "plaid";
  account_id: string | null;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  household_id: string;
  user_id: string | null;
  role: "user" | "assistant";
  content: string;
  created_at: string;
}
