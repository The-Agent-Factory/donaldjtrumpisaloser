import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { EntryCard } from "@/components/EntryCard";
import { BirthdayHero } from "@/components/BirthdayHero";
import { entries } from "@/content/entries";

export const metadata: Metadata = {
  title: "Happy Birthday, Loser",
  description:
    "Birthday edition of the archive. Donald J. Trump was born June 14, 1946. The record, fully sourced: bankruptcies, felony counts, defamation judgments, and more.",
  alternates: { canonical: "/birthday/" },
  openGraph: {
    title: "Happy Birthday, Loser · donaldjtrumpisaloser.com",
    description:
      "Born June 14, 1946. The archive marks the occasion the only way it knows how: with the record, fully sourced.",
    url: "/birthday/",
    type: "website",
  },
};

export default function BirthdayPage() {
  // A few of the heaviest-hitting, well-sourced entries as "presents,"
  // spanning criminal, civil, defamation, bankruptcy, election, and associate.
  const gifts = ["B8", "B3", "B2", "A1", "C1", "G1"]
    .map((id) => entries.find((e) => e.id === id))
    .filter((e): e is NonNullable<typeof e> => Boolean(e))
    .slice(0, 6);

  return (
    <>
      <BirthdayHero />

      {gifts.length > 0 && (
        <Section className="border-t rule">
          <Container>
            <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
              <h2 className="font-serif">A few presents from the file room</h2>
              <Link href="/cases/" className="font-ui text-sm underline">
                All cases
              </Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {gifts.map((e) => (
                <EntryCard key={e.id} entry={e} />
              ))}
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
