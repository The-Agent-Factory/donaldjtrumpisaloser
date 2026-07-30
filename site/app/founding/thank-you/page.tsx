import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Membership confirmed",
  description: "Your founding membership is confirmed.",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

async function getSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId);
    return {
      email: s.customer_details?.email || s.customer_email || null,
      tier: (s.metadata?.tier as string) || null,
      paid: s.payment_status === "paid" || s.status === "complete",
    };
  } catch {
    return null;
  }
}

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const session = await getSession(session_id);
  const founding = session?.tier === "founding";

  return (
    <Section>
      <Container>
        <p
          className="font-mono"
          style={{ fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--color-ledger-olive)", marginBottom: 12 }}
        >
          Entered into the ledger
        </p>
        <h1 className="font-serif mb-4">
          {session?.paid ? "Your membership is confirmed." : "Thank you."}
        </h1>
        <p className="font-ui text-base mb-8 max-w-2xl" style={{ color: "var(--text-muted)" }}>
          {founding
            ? "You are a founding member. Your support funds the next year of verification, new entries, and keeping the record free for everyone."
            : "Your support funds the verification, new entries, and upkeep that keep this record worth citing."}
          {session?.email ? ` A receipt is on its way to ${session.email}.` : ""}
        </p>

        {founding && (
          <div className="surface mb-8" style={{ border: "1px solid var(--rule)", padding: "20px" }}>
            <h2 className="font-serif mb-2" style={{ fontSize: "1.375rem" }}>Your first citation bundle</h2>
            <p className="font-ui text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Founding members get downloadable citation bundles for research use. The first one is
              ready in your member area.
            </p>
            <Link
              href="/members"
              className="font-mono"
              style={{
                display: "inline-block",
                fontSize: 12,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "12px 20px",
                border: "1.5px solid var(--color-ledger-olive)",
                background: "var(--color-ledger-olive)",
                color: "var(--color-bond-paper)",
              }}
            >
              Open member area
            </Link>
          </div>
        )}

        <Link href="/" className="font-mono" style={{ fontSize: 12, letterSpacing: "0.04em", color: "var(--text-muted)" }}>
          {"\u2190"} Back to the archive
        </Link>
      </Container>
    </Section>
  );
}
