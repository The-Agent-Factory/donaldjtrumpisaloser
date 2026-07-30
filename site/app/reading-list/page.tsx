import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { BookshopLink } from "@/components/monetization/BookshopLink";

export const metadata: Metadata = {
  title: "Reading list",
  description: "A curated bibliography of primary and secondary works.",
  alternates: { canonical: "/reading-list/" },
};

const BOOKS = [
  { author: "Mary L. Trump", title: "Too Much and Never Enough", isbn: "9781982141462" },
  { author: "Bob Woodward", title: "Fear: Trump in the White House", isbn: "9781501175510" },
  { author: "Bob Woodward", title: "Rage", isbn: "9781982131739" },
  { author: "Bob Woodward, Robert Costa", title: "Peril", isbn: "9781982182915" },
  { author: "Bob Woodward", title: "War", isbn: "9781668052303" },
  { author: "David Cay Johnston", title: "The Making of Donald Trump", isbn: "9781612196329" },
  { author: "Timothy L. O'Brien", title: "TrumpNation", isbn: "9780446697552" },
  { author: "Michael Cohen", title: "Disloyal: A Memoir", isbn: "9781510764699" },
  { author: "Cassidy Hutchinson", title: "Enough", isbn: "9781668028285" },
  { author: "Maggie Haberman", title: "Confidence Man", isbn: "9780593297346" },
  { author: "Jonathan Karl", title: "Tired of Winning", isbn: "9780593656327" },
  { author: "Michael Wolff", title: "Fire and Fury", isbn: "9781250158062" },
  { author: "Anne Applebaum", title: "Twilight of Democracy", isbn: "9780385545808" },
  { author: "Timothy Snyder", title: "On Tyranny", isbn: "9780804190114" },
  { author: "Heather Cox Richardson", title: "Democracy Awakening", isbn: "9780593652961" },
];

export default function ReadingListPage() {
  return (
    <Section>
      <Container size="narrow">
        <h1 className="font-serif mb-3">Reading list</h1>
        <p className="font-ui text-base mb-8" style={{ color: "var(--text-muted)" }}>
          A curated bibliography. Links route to Bookshop.org, which supports
          independent bookstores. The site receives a small affiliate fee on
          purchases at no extra cost to you. No purchase is required.
        </p>
        <ul className="space-y-4">
          {BOOKS.map((b) => (
            <li key={b.isbn} className="border rule p-4" style={{ background: "var(--surface)" }}>
              <div className="font-serif text-lg">
                <BookshopLink isbn={b.isbn}>{b.title}</BookshopLink>
              </div>
              <div className="font-ui text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                {b.author}
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
