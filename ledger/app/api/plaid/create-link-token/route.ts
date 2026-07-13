import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { plaidClient, PLAID_PRODUCTS, PLAID_COUNTRY_CODES } from "@/lib/plaid/client";
import { CountryCode, Products } from "plaid";

export async function POST() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await plaidClient.linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "Ledger",
    products: PLAID_PRODUCTS as Products[],
    country_codes: PLAID_COUNTRY_CODES as CountryCode[],
    language: "en",
    webhook: process.env.PLAID_WEBHOOK_URL,
  });

  return NextResponse.json({ linkToken: response.data.link_token });
}
