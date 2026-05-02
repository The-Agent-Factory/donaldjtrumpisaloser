import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

export default function NotFound() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-3">404 — entry not found</h1>
        <p className="font-ui text-base mb-6" style={{ color: "var(--text-muted)" }}>
          The page you requested is not in the archive. It may have moved, or
          it may not exist yet.
        </p>
        <Link href="/cases/" className="font-ui underline">
          Browse all cases
        </Link>
      </Container>
    </Section>
  );
}
