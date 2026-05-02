import type { Category } from './entries';

export interface CategoryDef {
  id: Category;
  label: string;
  description: string;
  slug: string;
  glyph: string;
}

export const categories: CategoryDef[] = [
  {
    id: 'civil-judgments',
    label: 'Civil Judgments and Settlements',
    description: 'Court judgments, settlements, and verdicts in civil cases against Donald Trump or Trump-affiliated entities.',
    slug: 'civil-judgments',
    glyph: 'Gavel',
  },
  {
    id: 'criminal-cases',
    label: 'Criminal Cases and Convictions',
    description: 'Criminal indictments, convictions, and sentences involving Trump or the Trump Organization.',
    slug: 'criminal-cases',
    glyph: 'HandcuffsSimple',
  },
  {
    id: 'bankruptcies',
    label: 'Bankruptcies and Corporate Insolvencies',
    description: 'Chapter 11 filings and corporate restructurings of Trump-controlled or Trump-branded entities.',
    slug: 'bankruptcies',
    glyph: 'Bank',
  },
  {
    id: 'failed-businesses',
    label: 'Failed Businesses and Discontinued Products',
    description: 'Trump-branded products and ventures that were discontinued, sold off, or shut down.',
    slug: 'failed-businesses',
    glyph: 'Storefront',
  },
  {
    id: 'failed-properties',
    label: 'Failed Real Estate Projects and Closed Properties',
    description: 'Trump-branded real estate projects that were canceled, sold, demolished, or de-branded.',
    slug: 'failed-properties',
    glyph: 'Buildings',
  },
  {
    id: 'defamation',
    label: 'Defamation and Tort Findings',
    description: 'Civil findings of defamation, sexual abuse, and related tort liability.',
    slug: 'defamation',
    glyph: 'Megaphone',
  },
  {
    id: 'election-losses',
    label: 'Election Losses and Certified Results',
    description: 'Certified election outcomes in which Trump or Trump-endorsed candidates lost.',
    slug: 'election-losses',
    glyph: 'Vote',
  },
  {
    id: 'failed-lawsuits',
    label: 'Failed Lawsuits Filed by Trump',
    description: 'Lawsuits filed by Trump or affiliated entities that were dismissed, sanctioned, or affirmed against him on appeal.',
    slug: 'failed-lawsuits',
    glyph: 'FileX',
  },
  {
    id: 'convicted-associates',
    label: 'Convicted Associates and Co-defendants',
    description: 'Criminal convictions, pleas, and sanctions of close Trump associates and co-defendants.',
    slug: 'convicted-associates',
    glyph: 'Scales',
  },
  {
    id: 'regulatory-penalties',
    label: 'Regulatory Penalties and Agency Findings',
    description: 'Civil penalties imposed by federal and state regulators on Trump or Trump-controlled entities.',
    slug: 'regulatory-penalties',
    glyph: 'Stamp',
  },
  {
    id: 'promises-vs-outcomes',
    label: 'Promises versus Outcomes',
    description: 'Campaign and policy promises measured against documented results.',
    slug: 'promises-vs-outcomes',
    glyph: 'ListChecks',
  },
  {
    id: 'second-term-court-losses',
    label: 'Second-Term Executive Actions Blocked or Reversed',
    description: 'Second-term executive orders and policies that were enjoined, vacated, or reversed in court since January 2025.',
    slug: 'second-term-court-losses',
    glyph: 'Scroll',
  },
];
