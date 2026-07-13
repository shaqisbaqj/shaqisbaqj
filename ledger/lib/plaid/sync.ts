import "server-only";
import { plaidClient } from "@/lib/plaid/client";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { AccountBase, Transaction as PlaidTransaction } from "plaid";

const DEBT_TYPES = new Set(["credit", "loan"]);

/**
 * Pulls current balances + the transaction delta for one linked item and
 * upserts them into Supabase. Called right after Plaid Link exchange, and
 * again from a scheduled job / webhook to keep things current — there's no
 * "click refresh" step for the user, per the live-sync requirement.
 */
export async function syncPlaidItem(plaidItemRowId: string) {
  const db = createAdminSupabaseClient();

  const { data: item, error: itemError } = await db
    .from("plaid_items")
    .select("id, household_id, plaid_access_token")
    .eq("id", plaidItemRowId)
    .single();
  if (itemError || !item) throw new Error(itemError?.message ?? "Plaid item not found");

  const accessToken = item.plaid_access_token as string;

  const accountsRes = await plaidClient.accountsGet({ access_token: accessToken });
  await upsertAccounts(db, item.household_id, item.id, accountsRes.data.accounts);

  const { data: accountRows } = await db
    .from("accounts")
    .select("id, plaid_account_id")
    .eq("plaid_item_id", item.id);
  const accountIdByPlaidId = new Map(
    (accountRows ?? []).map((a) => [a.plaid_account_id, a.id]),
  );

  let cursor: string | undefined;
  let hasMore = true;
  const added: PlaidTransaction[] = [];
  while (hasMore) {
    const res = await plaidClient.transactionsSync({
      access_token: accessToken,
      cursor,
    });
    added.push(...res.data.added);
    hasMore = res.data.has_more;
    cursor = res.data.next_cursor;
  }

  if (added.length > 0) {
    const rows = added
      .map((t) => {
        const accountId = accountIdByPlaidId.get(t.account_id);
        if (!accountId) return null;
        return {
          household_id: item.household_id,
          account_id: accountId,
          plaid_transaction_id: t.transaction_id,
          amount: t.amount,
          date: t.date,
          name: t.name,
          merchant_name: t.merchant_name ?? null,
          category: t.personal_finance_category?.primary ?? t.category?.[0] ?? null,
          pending: t.pending,
        };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);

    if (rows.length > 0) {
      await db.from("transactions").upsert(rows, { onConflict: "plaid_transaction_id" });
    }
  }

  return { accountCount: accountsRes.data.accounts.length, transactionCount: added.length };
}

async function upsertAccounts(
  db: ReturnType<typeof createAdminSupabaseClient>,
  householdId: string,
  plaidItemRowId: string,
  accounts: AccountBase[],
) {
  const rows = accounts.map((a) => ({
    household_id: householdId,
    plaid_item_id: plaidItemRowId,
    plaid_account_id: a.account_id,
    name: a.name,
    official_name: a.official_name,
    type: a.type,
    subtype: a.subtype,
    mask: a.mask,
    is_debt: DEBT_TYPES.has(a.type),
    current_balance: a.balances.current,
    available_balance: a.balances.available,
    iso_currency_code: a.balances.iso_currency_code ?? "USD",
    updated_at: new Date().toISOString(),
  }));

  await db.from("accounts").upsert(rows, { onConflict: "plaid_account_id" });
}
