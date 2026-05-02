import type { Source } from './entries';

export interface Promise {
  id: string;
  said: string;
  happened: string;
  status: 'kept' | 'broken' | 'partially-kept' | 'reversed' | 'no-measurable-outcome';
  date: string;
  sources: Source[];
}

export const promises: Promise[] = [
  {
    id: 'P1',
    said: 'End the Ukraine war in 24 hours.',
    happened: 'No comprehensive ceasefire was achieved. After the February 28, 2025 Oval Office meeting with Zelenskyy, U.S. aid and intelligence sharing were briefly paused. A Ukraine-U.S. Mineral Resources Agreement was signed April 30, 2025, and a $310 million sale of F-16 parts was approved May 2, 2025, but the war continued.',
    status: 'broken',
    date: '2025-04-30',
    sources: [
      { label: 'NPR coverage of February 28, 2025 Oval Office meeting' },
      { label: 'CFR analysis of Ukraine policy reversals, 2025' },
    ],
  },
  {
    id: 'P2',
    said: 'Mexico will pay for the wall.',
    happened: 'CBP reported 458 miles constructed during the first term, of which 373 miles replaced existing fencing and 85 miles were new primary or secondary barrier. About $6 billion was appropriated by Congress and about $10 billion was repurposed from the Department of Defense. Mexico did not pay.',
    status: 'broken',
    date: '2021-01-22',
    sources: [
      { label: 'CBP border wall status report, January 22, 2021' },
      { label: 'GAO-21-372' },
    ],
  },
  {
    id: 'P3',
    said: 'Bring back manufacturing jobs.',
    happened: 'BLS data show U.S. manufacturing employment at about 12.38 million in January 2017, peaking at about 12.79 million in January 2020, and falling to about 12.20 million by January 2021, a net decline of about 178,000 jobs across the first term.',
    status: 'broken',
    date: '2021-01-31',
    sources: [
      { label: 'BLS Current Employment Statistics, series CES3000000001' },
      { label: 'Bureau of Labor Statistics historical employment tables' },
    ],
  },
  {
    id: 'P4',
    said: 'Bring back coal.',
    happened: 'BLS data show coal mining jobs fell from about 50,500 in January 2017 to about 41,200 in December 2020, a decline of roughly 18%. EIA data show U.S. coal production fell from about 774 million short tons in 2017 to about 535 million short tons in 2020.',
    status: 'broken',
    date: '2020-12-31',
    sources: [
      { label: 'BLS series CES1021210001' },
      { label: 'EIA Annual Coal Report' },
    ],
  },
  {
    id: 'P5',
    said: 'I wanted to always play it down.',
    happened: 'U.S. COVID-19 deaths surpassed 400,000 on January 19, 2021. The United States accounted for about 19.5% of reported global deaths while comprising about 4% of world population. Trump made the statement to Bob Woodward on March 19, 2020, released in the Rage tapes in September 2020.',
    status: 'broken',
    date: '2021-01-19',
    sources: [
      { label: 'Johns Hopkins Coronavirus Resource Center' },
      { label: 'CDC COVID Data Tracker' },
      { label: 'Bob Woodward, Rage (2020), audio released September 2020' },
    ],
  },
  {
    id: 'P6',
    said: 'Tariffs are paid by foreign countries.',
    happened: 'Federal Reserve and academic studies (Amiti, Redding, Weinstein, NBER 25672, 2019; Fajgelbaum, Goldberg, Kennedy, Khandelwal, QJE, 2020) found nearly full pass-through of 2018-2019 China tariffs to U.S. importers and consumers. USDA Market Facilitation Program payments to U.S. farmers totalled about $23 billion across 2018-2019.',
    status: 'broken',
    date: '2020-12-31',
    sources: [
      { label: 'Amiti, Redding, Weinstein, NBER Working Paper 25672 (2019)' },
      { label: 'Fajgelbaum, Goldberg, Kennedy, Khandelwal, Quarterly Journal of Economics (2020)' },
      { label: 'GAO-22-104259' },
    ],
  },
  {
    id: 'P7',
    said: 'The tax cuts will pay for themselves.',
    happened: 'CBO and JCT projected a $1.456 trillion conventional deficit increase from the Tax Cuts and Jobs Act over 2018-2027. The CBO April 2018 update projected a total deficit increase of about $2.3 trillion over 2018-2028 including debt service. S&P 500 share buybacks rose to a record of about $806 billion in 2018.',
    status: 'broken',
    date: '2018-04-30',
    sources: [
      { label: 'CBO Budget and Economic Outlook 2018' },
      { label: 'CRS Report R48485' },
      { label: 'S&P Dow Jones Indices buyback report 2018' },
    ],
  },
  {
    id: 'P8',
    said: 'Lock her up.',
    happened: 'Trump v. Hillary Clinton et al. (RICO) was dismissed; the court imposed $937,989.39 in sanctions against Trump and Alina Habba. The Eleventh Circuit affirmed on November 26, 2025. No criminal case against Hillary Clinton was filed.',
    status: 'reversed',
    date: '2025-11-26',
    sources: [
      { label: 'Eleventh Circuit affirmance, November 26, 2025' },
      { label: 'S.D. Fla. sanctions order in Trump v. Clinton' },
    ],
  },
  {
    id: 'P9',
    said: 'I won the 2020 election.',
    happened: 'Certified results: Joseph R. Biden 81,283,501 (51.3%) to Trump 74,223,975 (46.8%); Electoral College 306-232. Russell Wheeler at Brookings tabulated 194 individual judicial votes across 42 post-election cases; 14% of judges sided with Trump (1% in federal cases). The Supreme Court rejected Texas v. Pennsylvania on December 11, 2020.',
    status: 'broken',
    date: '2021-01-06',
    sources: [
      { label: 'FEC Federal Elections 2020' },
      { label: 'National Archives Electoral College records' },
      { label: 'Russell Wheeler, Brookings, November 30, 2021' },
    ],
  },
  {
    id: 'P10',
    said: 'Drain the swamp.',
    happened: 'Allen Weisselberg pleaded guilty to 15 felonies in August 2022 and to perjury in March 2024. Michael Cohen, Paul Manafort, Roger Stone, Steve Bannon, Peter Navarro, and Rick Gates were all convicted or pleaded guilty to federal offenses connected to Trump or his campaigns.',
    status: 'broken',
    date: '2024-03-04',
    sources: [
      { label: 'PBS NewsHour coverage of Weisselberg pleas' },
      { label: 'DOJ press releases for Cohen, Manafort, Stone, Bannon, Navarro, Gates' },
    ],
  },
  {
    id: 'P11',
    said: 'Truth Social will be massively successful.',
    happened: 'Trump Media and Technology Group reported 2025 full-year revenue of $3.68 million and a net loss of $712.06 million. The DJT share price fell from a $57.99 IPO opening close on March 26, 2024 to about $9.74 by late April 2026. Devin Nunes departed as CEO and Kevin McGurn was appointed interim CEO on April 21, 2026.',
    status: 'broken',
    date: '2026-04-24',
    sources: [
      { label: 'TMTG SEC Form 8-K filings' },
      { label: 'TMTG press release, February 27, 2026' },
      { label: 'Yahoo Finance / Stock Analysis DJT historical data' },
    ],
  },
  {
    id: 'P12',
    said: 'DOGE will save $2 trillion.',
    happened: 'The savings goal trajectory moved from $2 trillion (October 2024) to $1 trillion (early 2025) to $150 billion FY2026 (April 2025). Independent analyses by PolitiFact, the Wall Street Journal, the New York Times, AEI, and CNN found that less than half of claimed savings were supported by basic documentation. The largest single claimed contract cancellation was revised from $8 billion to $8 million. FY2025 federal spending was $7.05 trillion.',
    status: 'broken',
    date: '2025-10-31',
    sources: [
      { label: 'TIME analysis of DOGE savings claims' },
      { label: 'CNN reporting on DOGE documentation' },
      { label: 'Newsweek coverage of OPM Director Scott Kupor statements, October 2025' },
    ],
  },
];
