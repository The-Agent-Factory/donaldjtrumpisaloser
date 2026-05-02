import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Submit a fact",
  description: "Submit a tip, correction, or proposed entry for editorial review.",
  alternates: { canonical: "/submit/" },
};

export default function SubmitPage() {
  const endpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT || "";
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-3">Submit a fact</h1>
        <p className="font-ui text-base mb-8" style={{ color: "var(--text-muted)" }}>
          Two independent sources are required for any new entry; one primary
          document plus one secondary report is the gold standard. Editorial
          review within seven days. Three outcomes: accept, defer, reject (with
          a templated reason).
        </p>
        <form
          action={endpoint || "#"}
          method="POST"
          className="grid gap-4"
        >
          <label className="grid gap-1 font-ui text-sm">
            Short claim (one sentence)
            <textarea
              name="claim"
              required
              rows={2}
              className="px-3 py-2 border rule font-ui"
              style={{ background: "var(--surface)" }}
            />
          </label>
          <label className="grid gap-1 font-ui text-sm">
            Primary source URL
            <input
              type="url"
              name="primary_source"
              required
              className="px-3 py-2 border rule font-ui"
              style={{ background: "var(--surface)" }}
            />
          </label>
          <label className="grid gap-1 font-ui text-sm">
            Secondary source URL
            <input
              type="url"
              name="secondary_source"
              required
              className="px-3 py-2 border rule font-ui"
              style={{ background: "var(--surface)" }}
            />
          </label>
          <label className="grid gap-1 font-ui text-sm">
            Suggested category
            <input
              type="text"
              name="category"
              className="px-3 py-2 border rule font-ui"
              style={{ background: "var(--surface)" }}
            />
          </label>
          <label className="grid gap-1 font-ui text-sm">
            Your email
            <input
              type="email"
              name="email"
              required
              className="px-3 py-2 border rule font-ui"
              style={{ background: "var(--surface)" }}
            />
          </label>
          <label className="grid gap-1 font-ui text-sm">
            Optional handle for credit
            <input
              type="text"
              name="handle"
              className="px-3 py-2 border rule font-ui"
              style={{ background: "var(--surface)" }}
            />
          </label>
          <button
            type="submit"
            className="justify-self-start px-5 py-3 border rule font-ui text-sm uppercase tracking-wider"
            style={{ background: "var(--primary)", color: "var(--bg)" }}
          >
            Submit for review
          </button>
          {!endpoint && (
            <p className="font-ui text-xs" style={{ color: "var(--text-muted)" }}>
              Submissions endpoint not configured. Set
              {" "}<code>NEXT_PUBLIC_FORM_ENDPOINT</code>{" "}
              in <code>.env</code> to enable.
            </p>
          )}
        </form>
      </Container>
    </Section>
  );
}
