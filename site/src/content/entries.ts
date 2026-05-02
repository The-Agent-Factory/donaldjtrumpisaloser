export type Category =
  | 'civil-judgments'
  | 'criminal-cases'
  | 'bankruptcies'
  | 'failed-businesses'
  | 'failed-properties'
  | 'defamation'
  | 'election-losses'
  | 'failed-lawsuits'
  | 'convicted-associates'
  | 'regulatory-penalties'
  | 'promises-vs-outcomes'
  | 'second-term-court-losses';

export type EntryStatus = 'closed' | 'ongoing' | 'on-appeal' | 'vacated';

export interface Source {
  label: string;
  url?: string;
}

export interface Entry {
  id: string;
  slug: string;
  title: string;
  date: string;
  dateRange?: { start: string; end: string };
  category: Category;
  tags: string[];
  status: EntryStatus;
  jurisdiction?: string;
  dollarAmount?: number;
  summary: string;
  outcome: string;
  narrative?: string;
  sources: Source[];
  relatedIds?: string[];
  lastUpdated: string;
  contributor?: string;
}

export const entries: Entry[] = [
  {
    id: 'A1',
    slug: 'trump-taj-mahal-bankruptcy-1991',
    title: 'Trump Taj Mahal Chapter 11 bankruptcy',
    date: '1991-07-16',
    category: 'bankruptcies',
    tags: ['bankruptcy', 'atlantic-city', 'casino', '1991', 'chapter-11'],
    status: 'closed',
    jurisdiction: 'D.N.J.',
    dollarAmount: 675000000,
    summary:
      'The Trump Taj Mahal Atlantic City casino, financed with about $675 million in junk bonds at roughly 14% interest, defaulted on a $47.3 million bond payment and filed for Chapter 11 protection on July 16, 1991 in the District of New Jersey (No. 91-13321). Donald Trump ceded approximately 50% of his equity in the property as part of the restructuring. The filing was the first of six Trump-related Chapter 11 cases between 1991 and 2014.',
    outcome:
      'Trump surrendered roughly 50% equity in the Taj Mahal under a Chapter 11 plan after defaulting on a $47.3 million bond payment.',
    narrative:
      'The Trump Taj Mahal opened in Atlantic City in April 1990 as the largest casino in the United States, financed with approximately $675 million in junk bonds carrying interest of roughly 14%. The capital structure required casino revenues that the property never produced. By the spring of 1991, the Taj Mahal was unable to service its debt, and on July 16, 1991, Trump Taj Mahal Associates filed a voluntary petition for Chapter 11 protection in the United States Bankruptcy Court for the District of New Jersey, case number 91-13321, after defaulting on a $47.3 million bond interest payment.\n\nUnder the negotiated plan of reorganization, Donald Trump ceded approximately 50% of his equity in the casino to bondholders in exchange for a reduction in interest rates and an extension of maturities. He retained the Trump name on the property and a management role. The reorganization was completed in October 1991. Contemporaneous reporting by the New York Times and the Associated Press, and a later reconstruction by Russ Buettner and others for the Times in 2016, documented that Trump personally extracted millions of dollars in salary, bonuses, and perquisites from the Taj Mahal and related Atlantic City entities even as bondholders, contractors, and small vendors absorbed losses.\n\nThe Taj Mahal filing was followed within eight months by Chapter 11 petitions for Trump Castle Associates and Trump Plaza Associates, both filed March 9, 1992. Together with the November 1992 Plaza Hotel restructuring, the 2004 filing of Trump Hotels and Casino Resorts, and the 2009 and 2014 filings of Trump Entertainment Resorts, the Taj Mahal case marked the beginning of a record of corporate insolvencies that no other major real estate developer of comparable scale matched in the same period. The Taj Mahal itself closed permanently on October 10, 2016, and the 34-story tower was imploded on February 17, 2021.',
    sources: [
      { label: 'American Bankruptcy Institute, summary of Trump Taj Mahal Chapter 11' },
      {
        label:
          'New York Times, Russ Buettner et al., "How Donald Trump Bankrupted His Atlantic City Casinos, But Still Earned Millions," June 11, 2016',
      },
    ],
    relatedIds: ['A4', 'A5', 'A6', 'A19'],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'A4',
    slug: 'plaza-hotel-bankruptcy-1992',
    title: 'Plaza Hotel (Manhattan) bankruptcy',
    date: '1992-11-04',
    category: 'bankruptcies',
    tags: ['bankruptcy', 'manhattan', 'hotel', '1992', 'chapter-11'],
    status: 'closed',
    jurisdiction: 'S.D.N.Y.',
    dollarAmount: 550000000,
    summary:
      'The Plaza Hotel in Manhattan, purchased by Donald Trump for $390 million in 1988, filed for Chapter 11 protection on November 4, 1992 with more than $550 million in debt. Trump retained 51% on paper but lost operational control of the property under the reorganization plan. The filing was the fourth Trump-related Chapter 11 case in roughly sixteen months.',
    outcome:
      'Trump kept 51% of the Plaza Hotel on paper but surrendered operational control under the Chapter 11 plan.',
    sources: [
      { label: 'UPI Archives, November 4, 1992' },
      { label: 'New York Times, December 12, 1992' },
    ],
    relatedIds: ['A1', 'A5'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'A5',
    slug: 'trump-hotels-casino-resorts-bankruptcy-2004',
    title: 'Trump Hotels and Casino Resorts Chapter 11',
    date: '2004-11-21',
    category: 'bankruptcies',
    tags: ['bankruptcy', 'casino', '2004', 'chapter-11', 'atlantic-city'],
    status: 'closed',
    jurisdiction: 'D.N.J.',
    dollarAmount: 1800000000,
    summary:
      'Trump Hotels and Casino Resorts Inc. filed for Chapter 11 protection on November 21, 2004 with about $1.8 billion in debt. The reorganization included a $400 million bailout from DLJ Merchant Banking and reduced Trump\'s ownership stake from a range of 47-56% down to 27%. The company emerged as Trump Entertainment Resorts, which would itself file Chapter 11 in 2009.',
    outcome:
      'Trump\'s equity stake was cut from 47-56% to 27% under a Chapter 11 plan with a $400 million DLJ bailout.',
    sources: [
      { label: 'Associated Press, November 22, 2004' },
      { label: 'Los Angeles Times, August 11, 2004' },
    ],
    relatedIds: ['A1', 'A6'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'A6',
    slug: 'trump-entertainment-resorts-bankruptcies-2009-2014',
    title: 'Trump Entertainment Resorts Chapter 11 (2009 and 2014)',
    date: '2009-02-17',
    dateRange: { start: '2009-02-17', end: '2016-02-29' },
    category: 'bankruptcies',
    tags: ['bankruptcy', 'casino', 'atlantic-city', '2009', '2014', 'chapter-11'],
    status: 'closed',
    jurisdiction: 'D. Del.',
    dollarAmount: 53100000,
    summary:
      'Trump Entertainment Resorts filed Chapter 11 on February 17, 2009 after missing a $53.1 million bond interest payment. Donald Trump resigned as chairman and his stake was reduced to about 10%. The company refiled for Chapter 11 on September 9, 2014 (D. Del., No. 14-12103); the Trump Plaza closed on September 16, 2014; and the company emerged from bankruptcy in February 2016 under Icahn Enterprises.',
    outcome:
      'Trump resigned as chairman, his stake fell to about 10%, and the company filed two Chapter 11 cases between 2009 and 2014.',
    sources: [
      { label: 'CNBC, September 9, 2014' },
      { label: 'Associated Press (Wayne Parry), August 6, 2014' },
      { label: 'BBC, August 4, 2016' },
    ],
    relatedIds: ['A1', 'A5', 'A19'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'A8',
    slug: 'trump-university-settlement',
    title: 'Trump University settlement',
    date: '2018-04-09',
    dateRange: { start: '2005-01-01', end: '2018-04-09' },
    category: 'civil-judgments',
    tags: ['fraud', 'class-action', 'settlement', 'education'],
    status: 'closed',
    jurisdiction: 'S.D. Cal.',
    dollarAmount: 26000000,
    summary:
      'Trump University, an unaccredited education business that operated from 2005 to 2010, settled three lawsuits, two California class actions and a New York Attorney General enforcement action, for $25 million plus a $1 million New York penalty. Final approval was granted on April 9, 2018 by Judge Gonzalo Curiel after the Ninth Circuit affirmed. Trump settled shortly after winning the 2016 election.',
    outcome:
      'Trump paid a combined $26 million to settle three Trump University suits, with final approval entered April 9, 2018.',
    sources: [
      { label: 'NPR, March 31, 2017' },
      { label: 'ABC News, April 9, 2018' },
      { label: 'New York Attorney General press releases on Trump University settlement' },
    ],
    relatedIds: ['B5'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'A10',
    slug: 'trump-shuttle-1989-1992',
    title: 'Trump Shuttle airline collapse',
    date: '1992-04-07',
    dateRange: { start: '1989-06-01', end: '1992-04-07' },
    category: 'failed-businesses',
    tags: ['airline', 'default', '1990', '1992'],
    status: 'closed',
    dollarAmount: 365000000,
    summary:
      'Donald Trump purchased the Eastern Airlines Shuttle for $365 million in 1988-1989 and rebranded it as Trump Shuttle. The airline never reported a profit, defaulted on its loans in September 1990, and was merged into Shuttle, Inc. on April 7, 1992 before being rebranded as USAir Shuttle. Reported losses on the venture totalled about $128 million.',
    outcome:
      'Trump Shuttle defaulted in September 1990 and was merged out of existence on April 7, 1992 with reported losses of about $128 million.',
    sources: [
      { label: 'Washington Post, contemporaneous reporting on Trump Shuttle default and merger, 1990-1992' },
      { label: 'New York Times, contemporaneous reporting on Trump Shuttle, 1989-1992' },
    ],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'A18',
    slug: 'usfl-antitrust-verdict-1986',
    title: 'USFL antitrust trial against the NFL',
    date: '1986-07-29',
    category: 'failed-lawsuits',
    tags: ['antitrust', 'sports', 'usfl', 'nfl', '1986'],
    status: 'closed',
    jurisdiction: 'S.D.N.Y.',
    dollarAmount: 3,
    summary:
      'In 1984 the United States Football League, led by New Jersey Generals owner Donald Trump, filed a $1.69 billion antitrust suit against the National Football League. On July 29, 1986, a federal jury in Manhattan found the NFL liable on one count of monopolization and awarded the USFL $1, trebled to $3 under federal antitrust law. The league suspended operations on August 4, 1986.',
    outcome:
      'The USFL won a single count of antitrust liability, was awarded $3 in trebled damages, and folded six days after the verdict.',
    narrative:
      'The United States Football League launched in 1983 as a spring-season alternative to the National Football League. Donald Trump bought the New Jersey Generals in September 1983 and quickly became the most prominent voice arguing for a confrontational strategy against the NFL: shift the USFL to a fall schedule, sue the NFL for antitrust violations, and force a merger or large damages payout. Other USFL owners, who had built their economics around a spring season, resisted; Trump prevailed.\n\nIn October 1984 the USFL filed a $1.69 billion antitrust suit against the NFL in the United States District Court for the Southern District of New York, alleging monopolization of professional football and of the major-network television contracts. The trial began in May 1986 before Judge Peter K. Leisure. On July 29, 1986, the jury found the NFL liable on one count of monopolization in violation of Section 2 of the Sherman Act but rejected the broader television-monopoly theory and awarded only $1 in damages. Under Section 4 of the Clayton Act, that figure was automatically trebled, producing a final judgment of $3.\n\nThe verdict ended the USFL as a going concern. The league suspended operations on August 4, 1986, six days after the judgment. Total league losses across its three seasons of play were estimated at about $163 million in 1986 dollars, equivalent to about $390 million in 2024 dollars. The Second Circuit affirmed the judgment in 1988. The case is taught in antitrust casebooks as an example of a plaintiff winning liability but failing to prove damages, and the ESPN 30 for 30 documentary "Small Potatoes: Who Killed the USFL?" (2009) traces the strategic choices that led the USFL to bet its existence on the suit.',
    sources: [
      { label: 'Washington Post, "Jury Finds NFL Violated Antitrust Law," July 30, 1986' },
      { label: 'ESPN 30 for 30, "Small Potatoes: Who Killed the USFL?" (2009)' },
    ],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'A20',
    slug: 'djt-stock-tmtg-truth-social',
    title: 'DJT stock and Trump Media and Technology Group performance',
    date: '2024-03-26',
    dateRange: { start: '2024-03-26', end: '2026-04-24' },
    category: 'failed-businesses',
    tags: ['stock', 'truth-social', 'tmtg', 'djt', 'spac'],
    status: 'ongoing',
    dollarAmount: 712060000,
    summary:
      'Trump Media and Technology Group went public on NASDAQ as DJT through a SPAC merger on March 26, 2024 at an opening day close of $57.99 and a market capitalization of about $7.9-8 billion. For full year 2025 the company reported revenue of $3.68 million and a net loss of $712.06 million. By late April 2026 the share price was about $9.74 and market capitalization had fallen to about $2.7-2.8 billion.',
    outcome:
      'TMTG reported a $712 million net loss on $3.68 million in 2025 revenue while DJT shares fell from a $57.99 IPO close to about $9.74 by late April 2026.',
    narrative:
      'Trump Media and Technology Group, the parent company of Truth Social, became a publicly traded company on March 26, 2024 through a merger with the special purpose acquisition company Digital World Acquisition Corp. The new ticker, DJT, opened on NASDAQ and closed its first session at $57.99, briefly giving the company a market capitalization of about $7.9-8 billion. Donald Trump\'s stake in the merged entity was worth several billion dollars at that close, instantly returning him to the Forbes 400, the list he had been removed from in October 2023.\n\nThe operating reality of the company did not match the listing-day enthusiasm. Truth Social, the company\'s flagship product, generated 2025 full-year revenue of $3.68 million against a net loss of $712.06 million, according to filings disclosed in the company\'s February 27, 2026 press release announcing the spin-off of Truth Social into a separate publicly traded entity. By comparison, the loss was equivalent to roughly 193 times the company\'s reported annual revenue, a ratio that has no peer among NASDAQ-listed media companies of similar size.\n\nManagement turnover accelerated in 2026. Devin Nunes departed as chief executive officer, and Kevin McGurn was appointed interim chief executive officer on April 21, 2026. By late April 2026 DJT closed at about $9.74 per share, an 83% decline from the opening close, and market capitalization had fallen to roughly $2.7-2.8 billion. SEC Form 8-K filings disclosed multiple capital raises, share issuances, and shifts in corporate strategy across 2024-2026, including a pivot toward bitcoin and decentralized finance products. The performance of DJT relative to its IPO close and to comparable media companies makes it one of the worst-performing major U.S. SPAC mergers of the 2020s.',
    sources: [
      { label: 'TMTG SEC Form 8-K filings, 2024-2026' },
      { label: 'TMTG press release announcing Truth Social spin-off, February 27, 2026' },
      { label: 'CNBC, "Trump Media closes first day at $57.99," March 26, 2024' },
      { label: 'Yahoo Finance / Stock Analysis DJT historical price data' },
    ],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'B1',
    slug: 'carroll-ii-verdict-2023',
    title: 'E. Jean Carroll, Carroll II, $5 million verdict',
    date: '2023-05-09',
    category: 'defamation',
    tags: ['defamation', 'sexual-abuse', 'carroll', '2023'],
    status: 'on-appeal',
    jurisdiction: 'S.D.N.Y.',
    dollarAmount: 5000000,
    summary:
      'A federal jury in the Southern District of New York found Donald Trump liable for sexual abuse and defamation of E. Jean Carroll on May 9, 2023, awarding $5 million. The Second Circuit affirmed on December 30, 2024 and denied en banc rehearing in June 2025. Trump petitioned the Supreme Court for review in November 2025.',
    outcome:
      'Trump was found liable for sexual abuse and defamation and ordered to pay Carroll $5 million; affirmed on appeal December 30, 2024.',
    sources: [
      { label: 'NPR, "Jury finds Trump liable for sexual abuse," May 9, 2023' },
      { label: 'Justia, Carroll v. Trump, No. 23-793 (2d Cir. 2024)' },
    ],
    relatedIds: ['B2'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'B2',
    slug: 'carroll-i-defamation-83m-2024',
    title: 'E. Jean Carroll, Carroll I, $83.3 million defamation verdict',
    date: '2024-01-26',
    category: 'defamation',
    tags: ['defamation', 'carroll', '2024', 'damages'],
    status: 'on-appeal',
    jurisdiction: 'S.D.N.Y.',
    dollarAmount: 83300000,
    summary:
      'A federal jury awarded E. Jean Carroll $83.3 million on January 26, 2024 in the Carroll I defamation case, based on Donald Trump\'s June 2019 statements denying her sexual assault allegation. Trump posted a bond of about $91.6 million to stay enforcement during appeal. The Second Circuit affirmed the judgment on September 8, 2025.',
    outcome:
      'Trump was ordered to pay $83.3 million for defamation; the Second Circuit affirmed on September 8, 2025 and Trump posted a $91.6 million bond.',
    narrative:
      'On January 26, 2024, a federal jury in the United States District Court for the Southern District of New York awarded E. Jean Carroll $83.3 million in compensatory and punitive damages in the case known as Carroll I, *Carroll v. Trump*, No. 19-cv-11764. The award broke down to $18.3 million in compensatory damages, $11 million for the cost of a reputation-repair campaign, and $65 million in punitive damages. The verdict was based on statements Donald Trump made in June 2019, while serving as president, in which he denied Carroll\'s allegation that he had sexually assaulted her in a Bergdorf Goodman dressing room in the mid-1990s and called her account a fabrication.\n\nThe Carroll I trial was procedurally narrow: liability for defamation had been established by the prior Carroll II verdict on May 9, 2023, in which a different federal jury found Trump liable for sexual abuse and defamation and awarded $5 million. The 2024 jury was tasked only with determining damages for the 2019 statements. Trump testified for about three minutes before being cut off by Judge Lewis A. Kaplan for non-responsive answers; he then walked out of the courtroom during Carroll\'s closing argument.\n\nTo stay enforcement during appeal, Trump posted a bond of approximately $91.6 million, secured in part by Federal Insurance Company, a Chubb subsidiary. On September 8, 2025, the United States Court of Appeals for the Second Circuit affirmed the judgment. The Second Circuit had earlier affirmed the Carroll II verdict on December 30, 2024 and denied en banc rehearing in June 2025. Trump filed a petition for a writ of certiorari with the Supreme Court of the United States on the Carroll II case in November 2025; a separate cert petition is expected on Carroll I. The combined Carroll judgments total $88.3 million in damages plus bond and interest costs, the largest defamation award against any sitting or former U.S. president in the modern record.',
    sources: [
      { label: 'NPR, "Trump ordered to pay E. Jean Carroll $83.3 million," January 26, 2024' },
      { label: 'PBS NewsHour, coverage of Second Circuit affirmance, September 8, 2025' },
    ],
    relatedIds: ['B1'],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'B3',
    slug: 'ny-civil-fraud-judgment-engoron-2024',
    title: 'New York civil fraud judgment and August 2025 reversal of penalty',
    date: '2024-02-16',
    dateRange: { start: '2024-02-16', end: '2025-08-21' },
    category: 'civil-judgments',
    tags: ['fraud', 'new-york', 'engoron', 'appeal', '2024', '2025'],
    status: 'vacated',
    jurisdiction: 'N.Y. Sup. Ct., 1st Dep\'t',
    dollarAmount: 464000000,
    summary:
      'On February 16, 2024, New York Supreme Court Justice Arthur Engoron ordered Donald Trump and co-defendants to pay about $464 million ($354,868,768 in disgorgement plus $98.6 million in prejudgment interest) for persistent financial statement fraud. On August 21, 2025, the Appellate Division First Department threw out the entire monetary penalty as constitutionally excessive in a 323-page opinion (5-0 on the penalty, divided on liability). The case is on further appeal to the New York Court of Appeals; the underlying liability finding was not vacated.',
    outcome:
      'The $464 million monetary penalty was vacated as excessive on August 21, 2025; the underlying liability finding was not vacated and the case is on further appeal.',
    narrative:
      'On February 16, 2024, New York Supreme Court Justice Arthur F. Engoron entered judgment in *People of the State of New York v. Donald J. Trump et al.*, the civil fraud action brought by Attorney General Letitia James in September 2022. Engoron found Donald Trump, his two adult sons, the Trump Organization, and several controlled entities liable for persistent fraud under New York Executive Law Section 63(12) for years of inflated financial statements used to obtain favorable loan and insurance terms. He ordered disgorgement of $354,868,768 in ill-gotten gains and added $98.6 million in prejudgment interest, for a total monetary penalty of about $464 million. He also imposed multi-year bans on Trump\'s service as an officer or director of any New York corporation and on the participation of Donald Trump Jr. and Eric Trump in Trump Organization management roles.\n\nTrump appealed and posted a $175 million bond, after the Appellate Division reduced the bond requirement from a full supersedeas amount in March 2024. Oral argument was held in September 2024 before a five-judge panel of the Appellate Division, First Department. On August 21, 2025, the panel issued a 323-page opinion that vacated the entire monetary penalty as constitutionally excessive under the Eighth Amendment\'s Excessive Fines Clause. On the question of penalty, the court was unanimous, 5-0. On the underlying findings of liability, the panel was divided, but a majority preserved the core liability ruling that Trump and the Trump Organization had violated Section 63(12).\n\nThe Attorney General sought review by the New York Court of Appeals, the state\'s highest court. As of the cutoff date, the case remains on appeal. The August 2025 reversal eliminated, for the time being, the largest single monetary judgment ever entered against Trump in any forum, but it did not vacate the predicate finding that the financial statements at issue were fraudulent. Reporting by CBS News and ABC News on the August 2025 reversal noted that the Appellate Division specifically declined to disturb the trial court\'s factual findings on the use of false valuations.',
    sources: [
      {
        label: 'New York Attorney General press release on judgment, February 16, 2024',
      },
      { label: 'CBS News, coverage of August 21, 2025 Appellate Division reversal' },
      { label: 'ABC News, coverage of August 21, 2025 Appellate Division reversal' },
    ],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'B5',
    slug: 'trump-foundation-dissolution-2018',
    title: 'Trump Foundation dissolution and $2 million judgment',
    date: '2019-11-07',
    dateRange: { start: '2018-12-18', end: '2019-11-07' },
    category: 'civil-judgments',
    tags: ['foundation', 'charity', 'fraud', 'new-york'],
    status: 'closed',
    jurisdiction: 'N.Y. Sup. Ct.',
    dollarAmount: 2000000,
    summary:
      'The Donald J. Trump Foundation was dissolved by court order on December 18, 2018 after the New York Attorney General sued over self-dealing and political misuse of charitable funds. On November 7, 2019, a New York court entered a $2 million judgment against Donald Trump. Trump made 19 admissions of personal misuse of foundation assets. A combined $3.8 million was distributed to eight charities approved by the court.',
    outcome:
      'The foundation was dissolved, Trump paid a $2 million judgment, admitted 19 instances of misuse, and $3.8 million was redistributed to eight charities.',
    sources: [
      { label: 'New York Attorney General press releases on Trump Foundation dissolution and judgment' },
      { label: 'Washington Post, David Fahrenthold reporting, November 7, 2019' },
    ],
    relatedIds: ['A8'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'B6',
    slug: 'trump-organization-tax-fraud-conviction-2022',
    title: 'Trump Organization criminal tax fraud conviction',
    date: '2022-12-06',
    category: 'criminal-cases',
    tags: ['criminal', 'tax-fraud', 'trump-organization', '2022', 'felony'],
    status: 'closed',
    jurisdiction: 'N.Y. Sup. Ct., New York Co.',
    dollarAmount: 1610000,
    summary:
      'On December 6, 2022, a New York jury convicted the Trump Corporation and Trump Payroll Corp. on all 17 counts in the Manhattan District Attorney\'s criminal tax fraud case, including scheme to defraud, conspiracy, criminal tax fraud, and falsifying business records. Justice Juan Merchan imposed the maximum statutory fine of $1.61 million on January 13, 2023. Donald Trump was not personally a defendant.',
    outcome:
      'Two Trump Organization entities were convicted on all 17 counts and fined the statutory maximum of $1.61 million.',
    narrative:
      'On December 6, 2022, after roughly two days of deliberations, a jury in New York County Supreme Court convicted the Trump Corporation and Trump Payroll Corp., the two principal operating entities of the Trump Organization, on all 17 counts charged by the Manhattan District Attorney\'s Office. The counts included scheme to defraud in the first degree, conspiracy in the fourth degree, criminal tax fraud in the third degree, and falsifying business records in the first degree. The case was brought by then-District Attorney Cyrus Vance Jr. and tried under his successor, Alvin Bragg.\n\nThe core conduct, charged across roughly fifteen years, was a scheme in which senior Trump Organization executives, principally Chief Financial Officer Allen Weisselberg, were paid significant portions of their compensation in off-the-books fringe benefits, including luxury apartments, private school tuition, leased Mercedes-Benz vehicles, and bonuses routed as if they were independent contractor payments. The arrangement allowed the executives to evade personal income taxes and the corporate entities to evade payroll taxes. Weisselberg testified for the prosecution under his August 2022 plea agreement to fifteen felonies; he served five months at Rikers Island and later pleaded guilty in March 2024 to a separate perjury count tied to his civil fraud testimony.\n\nOn January 13, 2023, Justice Juan M. Merchan imposed the maximum statutory penalty available under New York law against a corporate defendant: $1,610,000 across the two entities. The fine was the largest criminal tax penalty ever imposed in New York County against a closely held real estate company. Donald Trump was not named as a defendant in the criminal case, and his children were not charged. The conviction stands as the only criminal corporate conviction of the Trump Organization on record. It preceded by less than eighteen months Trump\'s personal felony conviction on May 30, 2024 in the Manhattan falsifying business records case, also tried before Justice Merchan.',
    sources: [
      { label: 'NPR, coverage of Trump Organization conviction, December 6, 2022' },
      { label: 'PBS NewsHour, coverage of Trump Organization sentencing, January 13, 2023' },
      { label: 'Associated Press, coverage of Trump Organization conviction and sentencing' },
    ],
    relatedIds: ['B7', 'B8'],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'B8',
    slug: 'ny-felony-conviction-34-counts-2024',
    title: 'New York felony conviction on 34 counts of falsifying business records',
    date: '2024-05-30',
    dateRange: { start: '2024-05-30', end: '2025-01-10' },
    category: 'criminal-cases',
    tags: ['criminal', 'felony', 'falsifying-records', 'new-york', '2024'],
    status: 'on-appeal',
    jurisdiction: 'N.Y. Sup. Ct., New York Co.',
    summary:
      'On May 30, 2024, a Manhattan jury convicted Donald Trump on all 34 counts of falsifying business records in the first degree, making him the first former president of the United States convicted of a felony. Justice Juan Merchan imposed an unconditional discharge on January 10, 2025, leaving the conviction intact without a sentence of incarceration, fine, or probation. Trump filed his notice of appeal in October 2025.',
    outcome:
      'Trump was convicted on all 34 felony counts on May 30, 2024 and received an unconditional discharge on January 10, 2025; the appeal is pending.',
    narrative:
      'On May 30, 2024, after roughly two days of deliberation, a New York County jury returned a unanimous verdict of guilty on all 34 counts of falsifying business records in the first degree in *People of the State of New York v. Donald J. Trump*, indictment number 71543-2023. The case, tried over six weeks before Justice Juan M. Merchan, centered on payments routed through Michael Cohen to Stephanie Clifford in October 2016 and on the way those payments were recorded in Trump Organization books in 2017 as legal expenses. New York prosecutors charged the records offenses as felonies on the theory that the falsifications were committed with intent to commit or conceal another crime, principally a violation of New York election law.\n\nTrump became the first former president of the United States to be convicted of a felony, and the first sitting or former president to be convicted of any crime. Sentencing was repeatedly delayed by motions tied to the Supreme Court\'s July 1, 2024 decision in *Trump v. United States*, the federal presidential immunity case, and by the November 2024 election. On January 10, 2025, ten days before Trump returned to the presidency, Justice Merchan imposed an unconditional discharge: a sentence that leaves the conviction on the record but imposes no incarceration, no probation, and no fine. Merchan explained that he was constrained by the unique posture of a president-elect and by Department of Justice positions on the prosecution of sitting presidents.\n\nTrump filed his notice of appeal in October 2025 and the case is pending before the New York Appellate Division, First Department, with merits briefing underway as of the cutoff date. The conviction stands as a matter of New York criminal record. The federal classified documents case in the Southern District of Florida had earlier been dismissed by Judge Aileen Cannon on July 15, 2024, the federal January 6 case was dismissed without prejudice by Special Counsel Jack Smith on November 25, 2024, and the Georgia RICO case was dismissed on November 26, 2025 by Judge Scott McAfee. The New York 34-count conviction therefore remains the only Trump criminal conviction on the record.',
    sources: [
      { label: 'CNN, coverage of New York jury verdict, May 30, 2024' },
      { label: 'NPR, coverage of unconditional discharge sentencing, January 10, 2025' },
      { label: 'ABC News, coverage of Trump appeal filing, October 2025' },
    ],
    relatedIds: ['B6', 'B7', 'B17'],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'B15',
    slug: 'trump-v-simon-and-schuster-dismissed-2025',
    title: 'Trump v. Simon and Schuster (Bob Woodward audiobook) dismissed',
    date: '2025-07-18',
    category: 'failed-lawsuits',
    tags: ['dismissed', 'media', 'woodward', '2025'],
    status: 'closed',
    jurisdiction: 'S.D.N.Y.',
    dollarAmount: 49980000,
    summary:
      'Donald Trump filed a $49.98 million lawsuit against Simon and Schuster and Bob Woodward in January 2023 over the audiobook release of taped interviews from the Rage tapes. The case (S.D.N.Y., No. 23-06883) was dismissed with prejudice by Judge Paul Gardephe on July 18, 2025.',
    outcome:
      'The $49.98 million suit was dismissed with prejudice on July 18, 2025 by Judge Paul Gardephe.',
    sources: [
      { label: 'CNN, coverage of dismissal of Trump v. Simon and Schuster, July 18, 2025' },
      { label: 'Reuters, coverage of dismissal of Trump v. Simon and Schuster, July 18, 2025' },
    ],
    relatedIds: ['B16'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'B16',
    slug: 'trump-v-cnn-dismissed-affirmed-2025',
    title: 'Trump v. CNN, Inc. dismissed and affirmed on appeal',
    date: '2025-11-18',
    dateRange: { start: '2023-07-28', end: '2025-11-18' },
    category: 'failed-lawsuits',
    tags: ['dismissed', 'media', 'cnn', 'eleventh-circuit', '2023', '2025'],
    status: 'closed',
    jurisdiction: '11th Cir.',
    dollarAmount: 475000000,
    summary:
      'Donald Trump filed a $475 million defamation lawsuit against CNN in October 2022 over the network\'s use of the phrase "Big Lie." The case was dismissed by Judge Raag Singhal on July 28, 2023. The Eleventh Circuit affirmed the dismissal in *Trump v. CNN, Inc.*, No. 23-13282 (11th Cir. Nov. 18, 2025).',
    outcome:
      'The $475 million suit was dismissed in 2023 and the Eleventh Circuit affirmed on November 18, 2025.',
    sources: [
      { label: 'CNN, coverage of dismissal, July 28, 2023' },
      { label: 'NPR, coverage of Eleventh Circuit affirmance, November 18, 2025' },
      { label: 'The Hill, coverage of Trump v. CNN' },
    ],
    relatedIds: ['B15'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'C1',
    slug: '2020-presidential-election-loss',
    title: '2020 presidential election certified results',
    date: '2020-12-14',
    dateRange: { start: '2020-11-03', end: '2021-01-06' },
    category: 'election-losses',
    tags: ['election', '2020', 'biden', 'electoral-college'],
    status: 'closed',
    summary:
      'In the certified results of the 2020 U.S. presidential election, Joseph R. Biden received 81,283,501 votes (51.3%) to Donald Trump\'s 74,223,975 (46.8%). The Electoral College vote was 306-232. Key state margins for Biden included Pennsylvania (+80,555), Michigan (+154,188), Wisconsin (+20,682), Arizona (+10,457), and Georgia (+11,779). Georgia conducted a hand-count audit, certified November 19, 2020, that confirmed the Biden win.',
    outcome:
      'Trump lost the 2020 election by 7,059,526 popular votes and 74 electoral votes; results were certified by all 50 states and the Electoral College on December 14, 2020.',
    sources: [
      { label: 'FEC, Federal Elections 2020' },
      { label: 'National Archives, Electoral College records, 2020' },
      { label: 'Georgia Secretary of State, hand-count audit certification, November 19, 2020' },
    ],
    relatedIds: ['C2'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'C2',
    slug: 'post-2020-election-lawsuit-graveyard',
    title: 'Post-2020 election lawsuits',
    date: '2021-11-30',
    dateRange: { start: '2020-11-04', end: '2021-12-31' },
    category: 'failed-lawsuits',
    tags: ['election', '2020', 'lawsuits', 'dismissed'],
    status: 'closed',
    summary:
      'Marc Elias\'s Democracy Docket tracker counted 69 post-election lawsuits by November 2021 (62 already resolved by January 2021). Russell Wheeler at the Brookings Institution tabulated 194 individual judicial votes across 42 post-election cases; only 14% of those judicial votes favored Trump positions, and only 1% in federal cases. On December 11, 2020, the Supreme Court rejected *Texas v. Pennsylvania* on standing grounds.',
    outcome:
      'Across 42 post-election cases tracked by Brookings, 86% of individual judicial votes went against Trump positions; the Supreme Court rejected Texas v. Pennsylvania on December 11, 2020.',
    sources: [
      { label: 'Russell Wheeler, Brookings Institution, "Trump\'s judicial campaign to upend the 2020 election," November 30, 2021' },
      { label: 'Brennan Center for Justice, post-election litigation tracker' },
      { label: 'Campaign Legal Center, 2020 election litigation summary' },
    ],
    relatedIds: ['C1'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'C5',
    slug: '2022-marquee-trump-endorsed-losses',
    title: '2022 marquee Trump-endorsed candidate losses',
    date: '2022-12-06',
    dateRange: { start: '2022-11-08', end: '2022-12-06' },
    category: 'election-losses',
    tags: ['election', '2022', 'midterms', 'endorsements'],
    status: 'closed',
    summary:
      'In the 2022 midterms, Trump-endorsed candidates lost a number of high-profile statewide races: Mehmet Oz lost Pennsylvania Senate to John Fetterman 51.2-46.5; Herschel Walker lost the Georgia Senate runoff (December 6, 2022) to Raphael Warnock 51.4-48.6; Blake Masters lost Arizona Senate to Mark Kelly 51.4-46.5; Kari Lake lost Arizona Governor to Katie Hobbs 50.3-49.6; Doug Mastriano lost Pennsylvania Governor to Josh Shapiro by about 15 points; Tudor Dixon lost Michigan Governor to Gretchen Whitmer 54.5-43.9; Don Bolduc lost New Hampshire Senate to Maggie Hassan 53.5-44.4; Tim Michels lost Wisconsin Governor to Tony Evers 51.2-47.8.',
    outcome:
      'Eight high-profile Trump-endorsed statewide candidates lost in the 2022 cycle, including the Georgia Senate runoff that determined Senate control.',
    sources: [
      { label: 'Associated Press, 2022 election results' },
      { label: 'Cook Political Report, 2022 race ratings and results' },
      { label: 'NBC News, 2022 election results' },
    ],
    relatedIds: ['C1', 'C4'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'D2',
    slug: '2018-2019-china-tariffs-farmer-payments',
    title: '2018-2019 China tariffs and Market Facilitation Program payments',
    date: '2019-12-31',
    dateRange: { start: '2018-07-01', end: '2019-12-31' },
    category: 'promises-vs-outcomes',
    tags: ['tariffs', 'trade', 'china', 'farmers', '2018', '2019'],
    status: 'closed',
    dollarAmount: 23000000000,
    summary:
      'USDA Market Facilitation Program payments to U.S. farmers harmed by retaliatory Chinese tariffs totalled about $23 billion ($8.6 billion in 2018, $14.4 billion in 2019), within an authorized package of up to $28 billion. Federal Reserve and academic studies (Amiti, Redding, Weinstein, NBER 25672, 2019; Fajgelbaum, Goldberg, Kennedy, Khandelwal, QJE, 2020) found nearly full pass-through of the tariffs to U.S. importers and consumers.',
    outcome:
      'U.S. taxpayers funded about $23 billion in Market Facilitation Program payments while peer-reviewed studies found nearly full tariff pass-through to U.S. importers and consumers.',
    sources: [
      { label: 'GAO-22-104259, USDA Market Facilitation Program' },
      { label: 'CRS Report IF11289' },
      { label: 'Amiti, Redding, Weinstein, NBER Working Paper 25672 (2019)' },
      { label: 'Fajgelbaum, Goldberg, Kennedy, Khandelwal, Quarterly Journal of Economics (2020)' },
    ],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'G1',
    slug: 'michael-cohen-conviction-2018',
    title: 'Michael Cohen federal convictions',
    date: '2018-12-12',
    dateRange: { start: '2018-08-21', end: '2018-12-12' },
    category: 'convicted-associates',
    tags: ['cohen', 'campaign-finance', 'tax', 'sdny', '2018'],
    status: 'closed',
    jurisdiction: 'S.D.N.Y.',
    summary:
      'Michael Cohen, Donald Trump\'s longtime personal attorney, pleaded guilty on August 21, 2018 in the Southern District of New York to eight counts including campaign finance violations made, in the prosecutors\' words, "in coordination with and at the direction of" Trump. Cohen pleaded guilty again on November 29, 2018 to lying to Congress. He was sentenced on December 12, 2018 to three years in federal prison.',
    outcome:
      'Cohen pleaded guilty to eight federal counts plus a separate count of lying to Congress, and was sentenced to three years in federal prison on December 12, 2018.',
    sources: [
      { label: 'United States v. Cohen, S.D.N.Y., No. 1:18-cr-00602' },
      { label: 'DOJ U.S. Attorney for S.D.N.Y. press releases on Michael Cohen, August and December 2018' },
    ],
    relatedIds: ['G2', 'G3'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'G7',
    slug: 'rudy-giuliani-disbarment-and-judgments',
    title: 'Rudy Giuliani disbarments, $148 million Freeman verdict, bankruptcy',
    date: '2024-09-26',
    dateRange: { start: '2023-12-15', end: '2024-10-31' },
    category: 'convicted-associates',
    tags: ['giuliani', 'disbarment', 'defamation', 'bankruptcy', '2023', '2024'],
    status: 'closed',
    jurisdiction: 'D.D.C.',
    dollarAmount: 148000000,
    summary:
      'Rudy Giuliani was disbarred in New York on July 2, 2024 and in the District of Columbia on September 26, 2024. On December 15, 2023, a federal jury in *Freeman v. Giuliani* awarded Ruby Freeman and Shaye Moss $148 million in defamation damages. Giuliani filed for bankruptcy on December 21, 2023; the case was dismissed in July 2024. His Manhattan apartment and other assets were ordered surrendered in October 2024.',
    outcome:
      'Giuliani was disbarred in two jurisdictions, ordered to pay $148 million in defamation damages, dismissed from bankruptcy protection, and ordered to surrender his Manhattan apartment.',
    sources: [
      { label: 'New York State Appellate Division order disbarring Giuliani, July 2, 2024' },
      { label: 'D.C. Court of Appeals order disbarring Giuliani, September 26, 2024' },
      { label: 'Freeman v. Giuliani, D.D.C. jury verdict, December 15, 2023' },
    ],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'H1',
    slug: 'liberation-day-tariffs-2025',
    title: '"Liberation Day" tariffs (EO 14257)',
    date: '2025-04-02',
    category: 'second-term-court-losses',
    tags: ['tariffs', 'ieepa', '2025', 'executive-order'],
    status: 'vacated',
    dollarAmount: 179000000000,
    summary:
      'Executive Order 14257, signed April 2, 2025, imposed a 10% baseline tariff on nearly all imports plus higher country-specific "reciprocal" tariffs under IEEPA authority. The S&P 500 fell about 10.5% over April 3-4, 2025. Country-specific tariffs were paused April 9, 2025. The effective tariff rate peaked at about 21%, the highest in a century. Tariff revenue through July 1, 2025 reached about $97.3 billion. Manufacturing employment fell in nine of ten months after Liberation Day, a net loss of 89,000 jobs.',
    outcome:
      'Equity markets fell about 10.5% in two days, the effective tariff rate hit a century-high of about 21%, and manufacturing lost a net 89,000 jobs in the ten months after Liberation Day.',
    sources: [
      { label: '90 Fed. Reg. 15041 (Executive Order 14257)' },
      { label: 'CSIS analysis of Liberation Day tariffs' },
      { label: 'Council on Foreign Relations, tariff tracker' },
      { label: 'Penn-Wharton Budget Model, IEEPA tariff revenue projections' },
    ],
    relatedIds: ['H2', 'H9'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'H2',
    slug: 'scotus-ieepa-tariff-ruling-2026',
    title: 'Supreme Court IEEPA tariff ruling, Learning Resources / V.O.S. Selections',
    date: '2026-02-20',
    category: 'second-term-court-losses',
    tags: ['scotus', 'tariffs', 'ieepa', '2026', 'roberts'],
    status: 'closed',
    jurisdiction: 'U.S. Supreme Court',
    dollarAmount: 179000000000,
    summary:
      'On February 20, 2026, the Supreme Court ruled 6-3 in *Learning Resources, Inc. v. Trump* / *Trump v. V.O.S. Selections, Inc.*, slip opinion 24-1287, that "IEEPA does not authorize the President to impose tariffs." Chief Justice Roberts wrote for the majority, joined by Justices Sotomayor, Kagan, Gorsuch, Barrett, and Jackson. Justices Thomas, Alito, and Kavanaugh dissented. About $160-179 billion in IEEPA tariffs were ruled unlawful ab initio.',
    outcome:
      'The Supreme Court held 6-3 that IEEPA does not authorize presidential tariffs, voiding $160-179 billion in IEEPA tariffs and forcing a pivot to Section 122 of the Trade Act of 1974.',
    narrative:
      'On February 20, 2026, the Supreme Court of the United States issued its decision in the consolidated cases *Learning Resources, Inc. v. Trump* and *Trump v. V.O.S. Selections, Inc.*, slip opinion 24-1287. The Court ruled 6-3 that "IEEPA does not authorize the President to impose tariffs." Chief Justice John Roberts wrote for the majority, joined by Justices Sonia Sotomayor, Elena Kagan, Neil Gorsuch, Amy Coney Barrett, and Ketanji Brown Jackson. Justices Clarence Thomas, Samuel Alito, and Brett Kavanaugh dissented.\n\nThe cases consolidated challenges to the tariffs imposed under Executive Order 14257, the "Liberation Day" tariffs of April 2, 2025, and to a series of follow-on country-specific tariff orders, all grounded in the International Emergency Economic Powers Act of 1977. The administration had argued that IEEPA\'s authority to "regulate" foreign transactions during a declared national emergency included the power to impose tariffs. The majority rejected that reading, applying the major-questions doctrine and concluding that Congress had not, in IEEPA\'s text or history, delegated tariff-imposition authority to the executive. The Court read tariff power as a core legislative power that Congress had granted only through narrower, more specific statutes such as Section 232 of the Trade Expansion Act of 1962, Section 301 of the Trade Act of 1974, and Section 122 of the same Act.\n\nThe ruling voided about $160-179 billion in IEEPA tariffs ab initio, according to estimates by the Penn-Wharton Budget Model and tariff law analyses by Holland and Knight and K&L Gates. Within days, the administration pivoted to Section 122 of the Trade Act of 1974, which permits a 15% tariff on imports for up to 150 days to address balance-of-payments deficits. In March 2026, twenty-four state attorneys general filed suit challenging the Section 122 reauthorization, arguing the administration had not satisfied the statutory predicates. The combined effect of the Liberation Day tariffs, the SCOTUS ruling, and the pivot to Section 122 made the IEEPA defeat the largest single court loss of Donald Trump\'s second term measured in dollars affected.',
    sources: [
      { label: 'SCOTUS slip opinion 24-1287, February 20, 2026' },
      { label: 'Holland and Knight client alert, "Supreme Court strikes down IEEPA tariffs"' },
      { label: 'K&L Gates analysis of Learning Resources / V.O.S. Selections decision' },
    ],
    relatedIds: ['H1'],
    lastUpdated: '2026-04-29',
    contributor: 'Editorial staff',
  },
  {
    id: 'H8',
    slug: 'approval-ratings-collapse-2025-2026',
    title: 'Second-term approval rating collapse',
    date: '2026-04-23',
    dateRange: { start: '2025-01-20', end: '2026-04-23' },
    category: 'promises-vs-outcomes',
    tags: ['polling', 'approval', '2025', '2026'],
    status: 'ongoing',
    summary:
      'Silver Bulletin recorded a second-term low of -18.8 net (39.0% approve, 57.7% disapprove) on April 23, 2026. Gallup recorded 34% approval in late November 2025, matching all-time lows. CNN/SSRS in late March 2026 found economy net approval of -38, foreign affairs -28, and inflation -45 (the lowest in the series). NBC News/SurveyMonkey in April 2026 recorded 37% overall approval and 32% on the economy.',
    outcome:
      'By April 23, 2026 Silver Bulletin recorded a -18.8 net approval (39.0/57.7), with Gallup at 34% approval and CNN/SSRS inflation approval at -45, the lowest in the series.',
    sources: [
      { label: 'Silver Bulletin approval tracker, April 23, 2026' },
      { label: 'Gallup, late November 2025 approval reading' },
      { label: 'CNN/SSRS poll, late March 2026' },
      { label: 'Brookings Institution polling roundup' },
    ],
    relatedIds: ['H10', 'H11'],
    lastUpdated: '2026-04-29',
  },
  {
    id: 'H11',
    slug: 'government-shutdown-43-days-2025',
    title: '43-day government shutdown, October-November 2025',
    date: '2025-11-12',
    dateRange: { start: '2025-10-01', end: '2025-11-12' },
    category: 'promises-vs-outcomes',
    tags: ['shutdown', 'government', '2025', 'cbo'],
    status: 'closed',
    dollarAmount: 7000000000,
    summary:
      'The federal government shutdown that ran from October 1 to November 12, 2025 lasted 43 days, the longest in U.S. history. CBO estimated $7 billion in lost output by October 31. About 750,000 workers were furloughed daily; 1.4 million essential workers worked without pay. Air-traffic-control shortages produced over 16,700 flight delays and 2,282 cancellations in a single weekend. Partial DHS shutdowns followed in early 2026.',
    outcome:
      'The 43-day shutdown was the longest in U.S. history, cost about $7 billion in lost output by October 31, and produced over 16,700 weekend flight delays.',
    sources: [
      { label: 'NPR, coverage of 43-day government shutdown, October-November 2025' },
      { label: 'Committee for a Responsible Federal Budget, shutdown cost analysis' },
    ],
    lastUpdated: '2026-04-29',
  },
];

export function getEntryBySlug(slug: string): Entry | undefined {
  return entries.find((entry) => entry.slug === slug);
}

export function getEntriesByCategory(category: Category): Entry[] {
  return entries.filter((entry) => entry.category === category);
}
