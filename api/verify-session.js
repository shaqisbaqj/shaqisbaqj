// Vercel serverless function — verifies a Stripe Checkout Session server-side
// before the frontend is allowed to reveal the 1-on-1 Calendly scheduler.
//
// This does real cryptographic/authoritative verification: it does not trust
// anything the browser sends except an opaque session ID, and it asks Stripe
// directly (over TLS, authenticated with the secret key) whether that exact
// session actually completed payment for the expected amount. A visitor
// cannot fabricate a valid session_id or spoof a "paid" response — Stripe's
// session IDs are unguessable, and the payment_status field reflects Stripe's
// own ledger, not anything the client controls.
//
// Requires STRIPE_SECRET_KEY to be set as an environment variable in the
// Vercel project (Project Settings → Environment Variables). Never commit
// the key to the repo.

const EXPECTED_AMOUNT_CENTS = 50000; // $500.00
const EXPECTED_CURRENCY = 'usd';

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  const sessionId = req.query.session_id;
  if (!sessionId || typeof sessionId !== 'string' || !/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return res.status(400).json({ verified: false, error: 'Missing or malformed session_id' });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ verified: false, error: 'Server misconfigured' });
  }

  try {
    const stripeRes = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: 'Basic ' + Buffer.from(secretKey + ':').toString('base64') } }
    );
    const session = await stripeRes.json();

    if (!stripeRes.ok) {
      return res.status(200).json({ verified: false, error: 'Session not found' });
    }

    const verified =
      session.payment_status === 'paid' &&
      session.amount_total === EXPECTED_AMOUNT_CENTS &&
      session.currency === EXPECTED_CURRENCY;

    return res.status(200).json({ verified });
  } catch (err) {
    return res.status(500).json({ verified: false, error: 'Verification failed' });
  }
};
