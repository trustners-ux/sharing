import { LearningModule } from '@/types/learning';
import { schemeTypesPart2Sections } from './scheme-types-part2';

export const schemeTypesModule: LearningModule = {
  id: 'scheme-types',
  title: 'Types of Mutual Fund Schemes',
  slug: 'scheme-types',
  icon: 'Layers',
  description:
    'Master the complete SEBI categorization of mutual fund schemes — equity, debt, hybrid, solution-oriented, and passive funds. Essential for recommending the right fund to every client.',
  level: 'intermediate',
  color: 'from-purple-500 to-indigo-600',
  estimatedTime: '75 min',
  sections: [
    // ─── Section 1: SEBI Categorization ─────────────────────────────────
    {
      id: 'sebi-categorization',
      title: 'SEBI Categorization — Why 36 Categories?',
      slug: 'sebi-categorization',
      content: {
        definition:
          'SEBI\'s Mutual Fund Categorization and Rationalization circular (October 6, 2017) mandates that all mutual fund schemes in India be classified into exactly 36 categories across 5 broad groups — Equity (11 categories), Debt (16 categories), Hybrid (7 categories), Solution-Oriented (2 categories), and Other Schemes (2 categories). Each AMC is permitted to offer only one scheme per category, with the exception of Index Funds, ETFs, and Fund of Funds.',
        explanation:
          'In my 25 years in this industry, I have seen the "scheme jungle" problem firsthand. Before 2017, there were over 2,000 mutual fund schemes in India and most investors — even experienced distributors — could not tell the difference between a "Growth Fund," a "Opportunities Fund," and a "Select Fund" from the same AMC. Two large-cap funds from the same AMC would hold virtually identical portfolios but carry different names and different expense ratios. SEBI Chairman Ajay Tyagi decided enough was enough. The October 2017 circular did three revolutionary things: first, it defined exactly what each category means with strict portfolio composition rules (for example, a Large Cap fund MUST hold at least 80% in the top 100 stocks by market cap — no ambiguity). Second, it limited each AMC to one scheme per category, which meant AMCs had to merge dozens of overlapping schemes. Third, it created a uniform naming convention so investors can compare apples to apples across AMCs. Here is what most training programs will not tell you: this circular fundamentally changed how we recommend funds. Before 2017, you could recommend five "large-cap" funds from the same AMC. Now, each AMC has exactly one. This makes your job easier — compare the single large-cap offering from each AMC and pick the best one for your client.',
        realLifeExample:
          'Rajesh, a distributor in Nagpur, had a client named Suresh who held 12 mutual fund schemes across 3 AMCs. When we sat down and analyzed the portfolios after the SEBI categorization circular, we discovered that 5 of those 12 schemes were essentially large-cap funds with different names — "Growth Fund," "Equity Plus," "Blue Chip," "Top 100," and "Frontline." The overlap was staggering — HDFC Bank, Reliance Industries, and Infosys appeared in all five portfolios. After the SEBI-mandated mergers, those 5 schemes became 3 distinct categories: one Large Cap, one Flexi Cap, and one Focused Fund. Suresh\'s portfolio finally made sense. His overall equity allocation dropped from a perceived 12 schemes to 7 truly diversified holdings. Rajesh told me, "I wish SEBI had done this 10 years earlier — my clients finally understand what they own."',
        keyPoints: [
          'SEBI issued the Mutual Fund Categorization circular on October 6, 2017, effective from early 2018 after scheme mergers',
          'Total categories: 36 — divided into Equity (11), Debt (16), Hybrid (7), Solution-Oriented (2), Other (2)',
          'Each AMC can offer only ONE scheme per category — exceptions are Index Funds, ETFs, and Fund of Funds',
          'The circular mandates strict portfolio composition rules — e.g., Large Cap must have min 80% in top 100 stocks',
          'AMCs were required to merge or wind up schemes that did not fit any of the 36 categories',
          'AMFI publishes the market capitalization list (Large/Mid/Small classification) semi-annually — this is the official reference',
          'The goal was to reduce investor confusion, prevent mis-selling, and enable true comparison across AMCs',
          'NISM exam frequently asks: "How many categories are there under SEBI categorization?" — Answer: 36',
        ],
        faq: [
          {
            question: 'Why did SEBI limit schemes to 36 categories?',
            answer:
              'Before 2017, AMCs launched schemes with fancy names that made it nearly impossible for investors to compare funds. Two "large-cap" funds from the same AMC could have completely different mandates. SEBI\'s 36-category framework ensures clear definitions, prevents scheme proliferation, and allows investors to make genuine comparisons across AMCs. As a distributor, this is your best friend — you can now confidently tell a client what a fund will and will not do.',
          },
          {
            question: 'Can an AMC launch two Large Cap funds?',
            answer:
              'No. Under SEBI categorization, each AMC can offer only one scheme per category. The exceptions are Index Funds, ETFs, and Fund of Funds where multiple schemes tracking different indices are permitted. So an AMC can have one Nifty 50 Index Fund and one Nifty Next 50 Index Fund, but only one actively managed Large Cap fund.',
          },
          {
            question: 'What happened to existing schemes that did not fit the 36 categories?',
            answer:
              'AMCs were given time to either merge non-conforming schemes into the defined categories or wind them up. This led to a massive wave of scheme mergers in 2018-2019. For example, an AMC that had three separate large-cap-style funds had to merge them into one. Investors were given exit options without exit load during the merger period.',
          },
          {
            question: 'What is the AMFI market cap list and how often is it updated?',
            answer:
              'AMFI (Association of Mutual Funds in India) publishes a list classifying all listed stocks into Large Cap (top 100 by full market capitalization), Mid Cap (101st to 250th), and Small Cap (251st and below). This list is updated semi-annually based on average market capitalization data. All AMCs must follow this list for determining compliance with category-wise allocation norms.',
          },
          {
            question: 'Does the 36-category rule apply to passive funds and ETFs?',
            answer:
              'Index Funds, ETFs, and Fund of Funds are exceptions to the one-scheme-per-category rule. An AMC can offer multiple Index Funds tracking different indices (Nifty 50, Nifty Next 50, Nifty Midcap 150, etc.) and multiple ETFs. However, each actively managed category is still limited to one scheme per AMC.',
          },
        ],
        mcqs: [
          {
            question:
              'How many categories of mutual fund schemes are defined under SEBI\'s categorization and rationalization circular?',
            options: ['24', '30', '36', '42'],
            correctAnswer: 2,
            explanation:
              'SEBI\'s October 2017 circular defines exactly 36 categories of mutual fund schemes across 5 groups: Equity (11), Debt (16), Hybrid (7), Solution-Oriented (2), and Other Schemes (2). This is one of the most frequently tested questions in the NISM VA exam.',
          },
          {
            question:
              'Under SEBI categorization, which type of scheme is EXEMPT from the one-scheme-per-category restriction?',
            options: ['ELSS Funds', 'Sectoral Funds', 'Index Funds and ETFs', 'Balanced Advantage Funds'],
            correctAnswer: 2,
            explanation:
              'Index Funds, ETFs, and Fund of Funds are exempt from the one-scheme-per-category rule. An AMC can offer multiple Index Funds or ETFs tracking different indices. All actively managed categories are restricted to one scheme per AMC.',
          },
          {
            question:
              'The AMFI market capitalization list, used for classifying stocks as Large/Mid/Small Cap, is updated:',
            options: ['Monthly', 'Quarterly', 'Semi-annually', 'Annually'],
            correctAnswer: 2,
            explanation:
              'AMFI updates the market capitalization list semi-annually (every six months). This list determines which stocks qualify as Large Cap (top 100), Mid Cap (101-250), and Small Cap (251st onwards). All mutual fund schemes must follow this list for portfolio compliance.',
          },
          {
            question: 'The primary objective of SEBI\'s 2017 mutual fund categorization circular was to:',
            options: [
              'Increase the number of mutual fund schemes available to investors',
              'Allow AMCs to launch multiple schemes in the same category',
              'Reduce investor confusion by defining clear, non-overlapping scheme categories',
              'Eliminate all debt mutual fund schemes',
            ],
            correctAnswer: 2,
            explanation:
              'The primary objective was to reduce investor confusion by creating clear, standardized, and non-overlapping categories so that investors can compare similar schemes across AMCs on a like-for-like basis.',
          },
        ],
        summaryNotes: [
          'SEBI categorization: 36 categories in 5 groups — Equity (11), Debt (16), Hybrid (7), Solution-Oriented (2), Other (2) — memorize this breakdown',
          'One AMC, one scheme per category — exceptions only for Index Funds, ETFs, and Fund of Funds',
          'AMFI market cap list (updated semi-annually) is the official reference for Large/Mid/Small Cap stock classification',
          'The circular was issued October 6, 2017 — it transformed the Indian mutual fund landscape by forcing scheme mergers and standardizing naming',
          'For NISM: remember "36 categories, 5 groups, 1 scheme per category" — this trio covers most exam questions on categorization',
        ],
        relatedTopics: ['equity-large-mid-small', 'debt-short-duration', 'nav-calculation'],
      },
    },

    // ─── Section 2: Equity — Large, Mid, Small, Flexi, Multi Cap ────────
    {
      id: 'equity-large-mid-small',
      title: 'Equity Funds — Large Cap, Mid Cap, Small Cap, Flexi Cap, Multi Cap',
      slug: 'equity-large-mid-small',
      content: {
        definition:
          'Under SEBI categorization, equity mutual funds based on market capitalization are classified into five distinct categories: Large Cap Fund (minimum 80% in top 100 stocks), Mid Cap Fund (minimum 65% in 101st-250th stocks), Small Cap Fund (minimum 65% in 251st and beyond), Flexi Cap Fund (minimum 65% in equity with flexibility across all market caps), and Multi Cap Fund (minimum 75% in equity with mandatory minimum 25% each in large, mid, and small cap). Stock classification is based on the AMFI market capitalization list updated semi-annually.',
        explanation:
          'Here is what most training programs will not tell you — the difference between Flexi Cap and Multi Cap confuses even experienced distributors. Let me break it down the way I explain it to my team. Large Cap funds are your "sleep well at night" funds — they invest in India\'s top 100 companies by market capitalization. Think Reliance, TCS, HDFC Bank, Infosys. These are companies that have survived multiple market cycles. The minimum mandate is 80% in large caps, giving the fund manager only 20% flexibility. Mid Cap funds target the "sweet spot" — companies ranked 101st to 250th. These are established businesses that still have significant growth runway. Think Persistent Systems, Coforge, or Indian Hotels. The mandate is minimum 65% in mid caps. Small Cap funds go after the 251st stock and beyond — smaller companies with potential for explosive growth but also higher risk. Think of companies like KPIT Technologies before they became multi-baggers. Minimum 65% in small caps. Now, Flexi Cap is the fund manager\'s playground — minimum 65% in equity overall, but complete freedom to allocate across large, mid, and small as they see fit. If the manager thinks small caps are overheated, they can shift 70% to large caps. Multi Cap, introduced in 2020, is different — it forces diversification with mandatory 25% minimum in each segment (large, mid, small), with total equity at minimum 75%. The remaining 25% can be allocated freely. This distinction is a NISM exam favorite.',
        realLifeExample:
          'Priya, a 35-year-old IT professional in Bengaluru, came to me with ₹50,000/month to invest via SIP. Here is how I used the market-cap categories to build her portfolio:\n\nLarge Cap (₹20,000/month): I recommended ICICI Prudential Bluechip Fund. With 80%+ in top 100 stocks, this provides stability. Over 10 years, large cap funds have delivered roughly 11-13% CAGR with moderate volatility.\n\nMid Cap (₹15,000/month): I chose Kotak Emerging Equity Fund. Mid caps have historically outperformed large caps over longer periods but with sharper drawdowns. Priya has a 15-year horizon, so she can ride out the volatility.\n\nSmall Cap (₹10,000/month): I selected Nippon India Small Cap Fund. I told Priya clearly — this fund can fall 40-50% in a bear market but has the potential to deliver 15-18% CAGR over 15+ years.\n\nFlexi Cap (₹5,000/month): I added Parag Parikh Flexi Cap Fund as the "all-weather" allocation. The fund manager dynamically shifts between market caps based on valuations.\n\nI deliberately did not add a Multi Cap fund because her mid and small cap allocations already covered those segments. Multi Cap would have created overlap since it mandates 25% in each segment anyway.',
        keyPoints: [
          'Large Cap Fund: minimum 80% in top 100 stocks by market capitalization as per AMFI list',
          'Mid Cap Fund: minimum 65% in stocks ranked 101st to 250th by market capitalization',
          'Small Cap Fund: minimum 65% in stocks ranked 251st and below by market capitalization',
          'Flexi Cap Fund: minimum 65% in equity overall, with complete freedom across market cap segments',
          'Multi Cap Fund: minimum 75% in equity with mandatory minimum 25% each in large cap, mid cap, and small cap',
          'AMFI publishes the Large/Mid/Small Cap stock classification list semi-annually — AMCs must follow this for compliance',
          'Large Cap is most suitable for conservative equity investors; Small Cap for aggressive investors with long horizons',
          'Flexi Cap gives the fund manager maximum flexibility; Multi Cap forces diversification across all three segments',
        ],
        formula:
          'Market Capitalization = Current Share Price x Total Outstanding Shares\n\nLarge Cap: Stocks ranked 1st to 100th by full market capitalization\nMid Cap: Stocks ranked 101st to 250th\nSmall Cap: Stocks ranked 251st and below\n\nMinimum equity allocation by category:\nLarge Cap = 80% in large caps\nMid Cap = 65% in mid caps\nSmall Cap = 65% in small caps\nFlexi Cap = 65% in equity (any cap)\nMulti Cap = 75% in equity (min 25% each in large, mid, small)',
        numericalExample:
          'Ravi invests ₹5,00,000 in a Multi Cap Fund. Per SEBI mandate, the fund must maintain:\n\nMinimum in Large Cap: 25% of equity = ₹1,25,000\nMinimum in Mid Cap: 25% of equity = ₹1,25,000\nMinimum in Small Cap: 25% of equity = ₹1,25,000\nRemaining 25% (₹1,25,000) can be in any cap segment\n\nTotal minimum equity allocation: 75% of ₹5,00,000 = ₹3,75,000\nRemaining 25% (₹1,25,000) can be in debt, cash, or other instruments\n\nCompare this with Flexi Cap:\nIf Ravi invested ₹5,00,000 in a Flexi Cap Fund:\nMinimum equity: 65% = ₹3,25,000 (any cap mix)\nThe fund manager could put 90% in large caps if they believe mid/small are overvalued\nNo mandatory split — that is the key difference',
        faq: [
          {
            question: 'What is the difference between Flexi Cap and Multi Cap?',
            answer:
              'This is the most commonly confused topic. Flexi Cap requires minimum 65% in equity with NO mandatory split across market caps — the fund manager has complete freedom. Multi Cap requires minimum 75% in equity with a MANDATORY minimum of 25% each in large cap, mid cap, and small cap. Flexi Cap = freedom; Multi Cap = forced diversification. Remember this distinction — it appears in almost every NISM mock test.',
          },
          {
            question: 'Why was Multi Cap introduced separately when Flexi Cap already existed?',
            answer:
              'In September 2020, SEBI noticed that most Multi Cap funds were holding 70-80% in large caps and very little in small caps, defeating the purpose of diversification. SEBI then mandated the 25-25-25 rule for Multi Cap funds. AMCs that did not want to increase small cap exposure reclassified their schemes as Flexi Cap. This is why Flexi Cap became a separate category — it was born out of the Multi Cap controversy.',
          },
          {
            question: 'Which is more suitable for a new investor — Large Cap or Flexi Cap?',
            answer:
              'For a new investor with limited market experience, I recommend starting with a Large Cap fund because the portfolio is anchored in well-established companies with lower volatility. Once they are comfortable with market fluctuations (usually after experiencing one correction), you can introduce Flexi Cap for its dynamic allocation. A common mistake new distributors make is putting first-time investors directly into small cap funds — the first 20% drawdown panics them out of mutual funds entirely.',
          },
          {
            question: 'How often does the AMFI market cap list change?',
            answer:
              'AMFI updates the market cap classification list semi-annually based on average full market capitalization data. A stock that was Mid Cap in January could become Large Cap by July if its market cap grows significantly. Fund managers need to rebalance portfolios within the prescribed timeline if stocks move between categories. This rebalancing is a cost that affects fund returns.',
          },
        ],
        mcqs: [
          {
            question:
              'What is the minimum allocation to large cap stocks required for a SEBI-categorized Large Cap Fund?',
            options: ['65%', '70%', '75%', '80%'],
            correctAnswer: 3,
            explanation:
              'A Large Cap Fund must invest a minimum of 80% of its total assets in large cap stocks (top 100 companies by full market capitalization as per the AMFI list). The remaining 20% can be invested in other securities.',
          },
          {
            question:
              'A Multi Cap Fund must invest a minimum of ___% each in large cap, mid cap, and small cap stocks.',
            options: ['15%', '20%', '25%', '30%'],
            correctAnswer: 2,
            explanation:
              'Under SEBI\'s Multi Cap Fund guidelines, the fund must maintain a minimum 25% allocation each in large cap, mid cap, and small cap stocks, with total equity allocation at minimum 75%. This forced diversification is what distinguishes Multi Cap from Flexi Cap.',
          },
          {
            question: 'Mid Cap stocks are defined as companies ranked _____ by full market capitalization.',
            options: ['1st to 100th', '101st to 250th', '101st to 500th', '251st and above'],
            correctAnswer: 1,
            explanation:
              'Under SEBI/AMFI classification, Mid Cap stocks are those ranked from the 101st to the 250th company by full market capitalization. Top 100 are Large Cap, and 251st onwards are Small Cap. This classification is updated semi-annually by AMFI.',
          },
          {
            question:
              'Which of the following equity fund categories gives the fund manager maximum flexibility in market cap allocation?',
            options: ['Large Cap Fund', 'Multi Cap Fund', 'Flexi Cap Fund', 'Mid Cap Fund'],
            correctAnswer: 2,
            explanation:
              'Flexi Cap Fund gives the fund manager maximum flexibility — the only mandate is minimum 65% in equity, with no restriction on how much goes into large, mid, or small cap. Multi Cap has forced 25% minimums in each segment, and Large/Mid Cap funds have their own minimum allocation rules.',
          },
        ],
        summaryNotes: [
          'Large Cap (min 80% top 100), Mid Cap (min 65% 101-250), Small Cap (min 65% 251+) — these three are your core equity building blocks',
          'Flexi Cap = 65% equity with full freedom; Multi Cap = 75% equity with 25% each in large/mid/small — know the difference cold',
          'AMFI market cap list is updated semi-annually — it determines which stocks qualify for which category',
          'For NISM: Large Cap is lowest risk equity category; Small Cap is highest — but all carry market risk',
          'Multi Cap was born from the 2020 SEBI circular forcing diversification — Flexi Cap emerged as the flexibility alternative',
        ],
        relatedTopics: ['sebi-categorization', 'equity-value-contra-focused', 'equity-sectoral-elss'],
      },
    },

    // ─── Section 3: Equity — Value, Contra, Dividend Yield, Focused ─────
    {
      id: 'equity-value-contra-focused',
      title: 'Equity Funds — Value, Contra, Dividend Yield, Focused',
      slug: 'equity-value-contra-focused',
      content: {
        definition:
          'Under SEBI categorization, strategy-based equity funds include: Value Fund (follows a value investment strategy with minimum 65% in equity), Contra Fund (follows a contrarian investment strategy with minimum 65% in equity), Dividend Yield Fund (invests minimum 65% in dividend-yielding stocks), and Focused Fund (invests in a maximum of 30 stocks with minimum 65% in equity). Critically, an AMC can offer either a Value Fund OR a Contra Fund — not both — because SEBI considers these strategies closely related.',
        explanation:
          'In my 25 years, I have seen fund managers come and go, but the ones who consistently delivered were either deep value investors or sharp contrarians. Let me explain these strategy-based categories as a practitioner, not just for your exam. A Value Fund manager is like a patient bargain hunter at a wholesale market — they look for stocks trading below their intrinsic value. They use metrics like Price-to-Earnings (P/E), Price-to-Book (P/B), and dividend yield to find companies the market has undervalued. The key word is "patience" — value investing can underperform for years before the market recognizes the true worth. A Contra Fund manager goes one step further — they deliberately buy what everyone else is selling. When the entire market is dumping pharma stocks because of a US FDA issue, the contra manager is buying. The logic is simple: panic creates opportunity. SEBI recognized that value and contra strategies overlap significantly, which is why an AMC must choose one or the other. Here is what most training programs will not tell you: in practice, a good value fund and a good contra fund will hold many of the same stocks. The difference is more philosophical than practical. A Dividend Yield Fund focuses on companies that consistently pay high dividends — think of companies like Coal India, ITC, or Power Grid. These funds suit investors who want regular income potential along with equity participation. And then there is the Focused Fund — maximum 30 stocks, minimum 65% equity. This is a high-conviction play. The fund manager picks only their best 25-30 ideas. If they are right, the concentrated portfolio delivers outsized returns. If they are wrong, the losses are amplified. It is not for every client.',
        realLifeExample:
          'Kavitha, a retired teacher in Chennai, came to me with ₹20 lakh from her pension commutation. She wanted equity exposure but with lower volatility. Here is what I did:\n\nI allocated ₹8 lakh to a Dividend Yield Fund (ICICI Pru Dividend Yield Equity Fund). I explained: "Kavitha ma\'am, this fund invests in companies like Coal India (dividend yield 7%+), ITC (dividend yield 3%+), and Power Grid. These companies have strong cash flows and a history of paying dividends. Even in a market fall, the dividend income provides a cushion."\n\nI put ₹7 lakh in a Value Fund (ICICI Pru Value Discovery). I told her: "This fund manager buys companies that the market has temporarily ignored. It may underperform in a roaring bull market, but in my experience, value funds protect capital better in corrections."\n\nFor her son Karthik (age 28, aggressive investor), I recommended ₹5 lakh in a Focused Fund (HDFC Focused 30). I said: "Karthik, this fund holds only 25-30 stocks. If the fund manager\'s picks work out, you will beat most diversified funds. But you must be ready for higher swings — I have seen focused funds fall 15% more than diversified funds in sharp corrections."\n\nTwo years later, during the 2020 COVID crash, Kavitha\'s Dividend Yield Fund fell only 22% while the Nifty fell 35%. Karthik\'s Focused Fund fell 38%. Both recovered, but the experience taught them the importance of matching fund strategy to investor temperament.',
        keyPoints: [
          'Value Fund: follows value investment strategy, minimum 65% equity — looks for undervalued stocks using P/E, P/B metrics',
          'Contra Fund: follows contrarian strategy, minimum 65% equity — buys out-of-favor stocks that the market is selling',
          'An AMC can offer EITHER a Value Fund OR a Contra Fund, but NOT both — this is a SEBI restriction',
          'Dividend Yield Fund: minimum 65% in dividend-yielding stocks — suitable for investors seeking income + equity growth',
          'Focused Fund: maximum 30 stocks, minimum 65% equity — high conviction, concentrated portfolio',
          'Value and contra strategies can underperform for extended periods — suitable for investors with 5+ year horizons',
          'Focused funds carry concentration risk — fewer stocks means each stock has a larger impact on returns',
          'NISM exam frequently tests: "Can an AMC have both Value and Contra funds?" — Answer: No',
        ],
        faq: [
          {
            question: 'Why can an AMC not offer both Value and Contra funds?',
            answer:
              'SEBI considers value investing and contrarian investing to be closely overlapping strategies. A contrarian approach inherently involves buying undervalued or out-of-favor stocks, which is also what value investing does. Allowing both would result in two very similar funds from the same AMC, defeating the purpose of the categorization exercise. The AMC must choose one strategy and stick with it.',
          },
          {
            question: 'What kind of investor should choose a Focused Fund?',
            answer:
              'A Focused Fund (max 30 stocks) is suitable for investors who have a high risk appetite, a minimum 5-7 year investment horizon, and conviction in the fund manager\'s stock-picking ability. Because the portfolio is concentrated, individual stock performance has a magnified impact — both positive and negative. I would never recommend a Focused Fund as someone\'s only equity holding. It works best as a satellite allocation alongside a diversified core fund.',
          },
          {
            question: 'Are Dividend Yield Funds good for regular income?',
            answer:
              'Dividend Yield Funds invest in stocks with high dividend yields, but the dividends from the underlying companies flow into the NAV — they are not paid out directly to investors unless the fund declares a distribution. If an investor wants regular income, they should opt for the IDCW (Income Distribution cum Capital Withdrawal) option. However, remember that IDCW is not guaranteed and is taxable in the hands of the investor. For truly regular income, a SWP (Systematic Withdrawal Plan) from any fund is often a better solution.',
          },
          {
            question: 'How is a Focused Fund different from a Sectoral Fund?',
            answer:
              'A Focused Fund can invest across sectors — the restriction is on the number of stocks (maximum 30), not on sector concentration. A Sectoral Fund must invest minimum 80% in one specific sector (like banking or pharma). A Focused Fund with 30 stocks from 10 different sectors is far more diversified than a Sectoral Fund with 40 stocks from one sector. The risk profiles are completely different.',
          },
          {
            question: 'Does a Value Fund always underperform in a bull market?',
            answer:
              'Not always, but often. In a roaring bull market driven by momentum and growth stocks, value funds can lag behind. This is because value stocks are typically mature, stable companies that grow slowly but steadily. However, in market corrections and bear phases, value funds tend to hold up better because their stocks are already reasonably priced. Over a full market cycle (5-7 years), well-managed value funds have historically matched or beaten growth-oriented funds with lower drawdowns.',
          },
        ],
        mcqs: [
          {
            question: 'Under SEBI categorization, an AMC can offer:',
            options: [
              'Both a Value Fund and a Contra Fund',
              'Either a Value Fund or a Contra Fund, but not both',
              'Neither a Value Fund nor a Contra Fund',
              'A Value Fund and Contra Fund only if they have different benchmarks',
            ],
            correctAnswer: 1,
            explanation:
              'SEBI mandates that an AMC can offer either a Value Fund or a Contra Fund, but not both. This is because SEBI considers value investing and contrarian investing to be overlapping strategies, and allowing both would lead to similar schemes from the same AMC.',
          },
          {
            question: 'What is the maximum number of stocks a Focused Fund can hold?',
            options: ['20', '25', '30', '50'],
            correctAnswer: 2,
            explanation:
              'A SEBI-categorized Focused Fund can hold a maximum of 30 stocks with a minimum 65% allocation to equity. The concentrated portfolio is designed for high-conviction investing but carries higher concentration risk compared to diversified funds.',
          },
          {
            question: 'A Dividend Yield Fund must invest a minimum of ___% in dividend-yielding stocks.',
            options: ['50%', '65%', '75%', '80%'],
            correctAnswer: 1,
            explanation:
              'A Dividend Yield Fund must invest a minimum of 65% of its total assets in dividend-yielding equity stocks. The fund targets companies with a track record of paying regular and high dividends.',
          },
          {
            question:
              'Which of the following is TRUE about a Focused Fund?',
            options: [
              'It must invest in only one sector',
              'It has no restriction on the number of stocks',
              'It can hold a maximum of 30 stocks with minimum 65% in equity',
              'It must invest only in large cap stocks',
            ],
            correctAnswer: 2,
            explanation:
              'A Focused Fund has a maximum limit of 30 stocks and must invest at least 65% in equity. Unlike Sectoral Funds, it has no sector restriction and can invest across sectors. Unlike Large Cap Funds, it can invest across market cap segments.',
          },
        ],
        summaryNotes: [
          'Value Fund (undervalued stocks) and Contra Fund (out-of-favor stocks) — an AMC can offer only ONE of these two',
          'Focused Fund = maximum 30 stocks, minimum 65% equity — high conviction, higher concentration risk',
          'Dividend Yield Fund = minimum 65% in dividend-yielding stocks — not the same as guaranteed income',
          'For NISM: "Value OR Contra, not both" and "Focused Fund max 30 stocks" are two heavily tested facts',
          'Strategy-based funds (Value/Contra) may underperform for years — suitable for patient investors with 5+ year horizons',
        ],
        relatedTopics: ['equity-large-mid-small', 'equity-sectoral-elss', 'sebi-categorization'],
      },
    },

    // ─── Section 4: Equity — Sectoral, Thematic, ELSS ───────────────────
    {
      id: 'equity-sectoral-elss',
      title: 'Equity Funds — Sectoral & Thematic, ELSS',
      slug: 'equity-sectoral-elss',
      content: {
        definition:
          'Under SEBI categorization, Sectoral Funds invest a minimum of 80% in equity and equity-related instruments of a specific sector (e.g., banking, pharma, IT, infrastructure). Thematic Funds invest a minimum of 80% in a broader theme that may span multiple sectors (e.g., consumption, ESG, manufacturing, rural India). ELSS (Equity Linked Savings Scheme) invests a minimum of 80% in equity per the ELSS mandate and offers tax deduction under Section 80C of the Income Tax Act (up to ₹1.5 lakh per year) with a mandatory 3-year lock-in period — the shortest lock-in among all Section 80C investment options.',
        explanation:
          'Here is what most training programs will not tell you about sectoral and thematic funds — they are the most mis-sold category in the Indian mutual fund industry. I have seen distributors put retired schoolteachers into pharma sector funds because "pharma always does well." That is dangerous advice. Let me explain when these funds make sense and when they do not.\n\nSectoral funds concentrate 80%+ of their portfolio in a single sector. When that sector is in a boom cycle, these funds deliver spectacular returns — I have seen banking sector funds deliver 50%+ in a single year. But when the cycle turns, the same funds can crash 40-50%. In 2018, pharma sector funds fell 25% while the Nifty was flat. Sector funds are for experienced investors who understand business cycles and can time their entry and exit reasonably well.\n\nThematic funds are slightly broader — they invest across a theme that may include multiple sectors. An infrastructure theme could include cement, steel, capital goods, and construction companies. The diversification is better than sectoral, but the concentration risk remains significant.\n\nNow, ELSS is the most important equity fund category from a distributor\'s perspective because it sells itself. Every salaried person in India is looking for ways to save tax under Section 80C, and ELSS offers the best combination of tax saving + wealth creation. The 3-year lock-in is actually an advantage — it forces investors to stay invested through market cycles, which is exactly what equity investing requires. Here is the clincher for your client conversations: PPF has a 15-year lock-in, NSC has 5 years, tax-saving FD has 5 years — ELSS has just 3 years. And unlike the others, ELSS invests in equity with the potential for 12-15% long-term returns versus 7-8% from PPF.',
        realLifeExample:
          'Amit, a 30-year-old software engineer in Hyderabad earning ₹18 lakh per annum, came to me in January looking to save tax. His CA had told him to put ₹1.5 lakh in PPF. I showed him the math:\n\nOption 1 — PPF (₹1.5 lakh/year for 15 years at 7.1% interest):\nMaturity value: approximately ₹40.7 lakh\nLock-in: 15 years (partial withdrawal after 7 years)\n\nOption 2 — ELSS SIP (₹12,500/month for 15 years at 12% expected return):\nExpected corpus: approximately ₹63.3 lakh\nLock-in: Only 3 years per installment (each SIP has its own 3-year lock-in)\nTax benefit: Same Section 80C deduction up to ₹1.5 lakh\n\nAmit was stunned. "Same tax benefit, 3-year lock-in instead of 15, and potentially ₹22 lakh more?" He switched to ELSS immediately.\n\nI also had a client, Deepak, who wanted to invest in a Banking Sector Fund after seeing SBI and HDFC Bank rally 30% in 6 months. I told him frankly: "Deepak, banking stocks have already rallied. Sector funds are for people who can analyze business cycles. Instead, let your Flexi Cap fund manager decide how much to allocate to banking. That is what you are paying the expense ratio for." Deepak listened, and when banking stocks corrected 20% the next quarter, he thanked me for the advice.',
        keyPoints: [
          'Sectoral Fund: minimum 80% in one specific sector — highest concentration risk among equity categories',
          'Thematic Fund: minimum 80% in a theme that may span multiple sectors — broader than sectoral but still concentrated',
          'ELSS: minimum 80% in equity, mandatory 3-year lock-in, tax deduction under Section 80C up to ₹1.5 lakh/year',
          'ELSS has the shortest lock-in among all Section 80C investments (PPF: 15 years, NSC: 5 years, Tax FD: 5 years)',
          'Sectoral/Thematic funds are suitable only for experienced investors who understand sector cycles',
          'ELSS SIP: each installment has its own 3-year lock-in — an SIP started in April 2024 has the first installment unlocking in April 2027',
          'An AMC can have multiple Sectoral Funds (one per sector) and multiple Thematic Funds (one per theme)',
          'ELSS dividends (IDCW) are taxable in the hands of the investor — the old tax-free dividend regime ended in April 2020',
        ],
        faq: [
          {
            question: 'What is the difference between a Sectoral Fund and a Thematic Fund?',
            answer:
              'A Sectoral Fund invests 80%+ in a single sector (e.g., Banking Fund invests only in banks and financial services). A Thematic Fund invests 80%+ in a broader theme that may span multiple sectors (e.g., Infrastructure theme includes cement, steel, capital goods, construction, power). Thematic is slightly more diversified than Sectoral, but both carry significant concentration risk. Think of it this way: "Banking" is a sector; "Financial Services" (including banking, insurance, NBFCs, fintech) is a theme.',
          },
          {
            question: 'Is the ELSS 3-year lock-in per lump sum or per SIP installment?',
            answer:
              'Per SIP installment. This is a crucial point many investors miss. If you start a ₹10,000/month ELSS SIP in April 2024, the April 2024 installment unlocks in April 2027, the May 2024 installment unlocks in May 2027, and so on. Each installment is independently locked in for 3 years from its investment date. This means your ELSS investment is never fully unlocked until 3 years after your last SIP installment.',
          },
          {
            question: 'Can I invest more than ₹1.5 lakh in ELSS?',
            answer:
              'Yes, you can invest any amount in ELSS. However, the Section 80C tax deduction is limited to ₹1.5 lakh per financial year (across all 80C eligible investments combined, not just ELSS). Any amount above ₹1.5 lakh invested in ELSS is treated as a regular equity mutual fund investment — it still has the 3-year lock-in but does not provide additional tax benefit.',
          },
          {
            question: 'Are sectoral funds riskier than diversified equity funds?',
            answer:
              'Yes, significantly. A diversified equity fund (like Flexi Cap or Multi Cap) spreads risk across 50-70 stocks in 10-15 sectors. A sectoral fund concentrates 80%+ in one sector. If that sector faces regulatory headwinds, global disruption, or cyclical downturn, the entire portfolio suffers with no diversification cushion. I always tell my clients: if you cannot explain why a particular sector will outperform over the next 3 years, you should not be in a sectoral fund.',
          },
          {
            question: 'What makes ELSS better than PPF for tax saving?',
            answer:
              'ELSS has three advantages over PPF: (1) Shorter lock-in — 3 years vs 15 years, (2) Higher return potential — equity historically delivers 12-15% CAGR vs PPF at 7-8%, (3) Same tax benefit under Section 80C. The trade-off is that ELSS returns are market-linked and not guaranteed, while PPF offers guaranteed returns. For investors with a 5+ year horizon and moderate risk appetite, ELSS is generally the better option. But always assess your client\'s risk tolerance — PPF is better for someone who cannot handle market volatility at all.',
          },
        ],
        mcqs: [
          {
            question:
              'What is the lock-in period for an ELSS (Equity Linked Savings Scheme) investment?',
            options: ['1 year', '3 years', '5 years', '7 years'],
            correctAnswer: 1,
            explanation:
              'ELSS has a mandatory lock-in period of 3 years from the date of each investment. This is the shortest lock-in among all Section 80C eligible investments. PPF has 15 years, NSC has 5 years, and Tax-Saving FD has 5 years.',
          },
          {
            question:
              'A Sectoral Fund must invest a minimum of ___% in equity of its designated sector.',
            options: ['65%', '70%', '75%', '80%'],
            correctAnswer: 3,
            explanation:
              'Under SEBI categorization, a Sectoral Fund must invest a minimum of 80% of its total assets in equity and equity-related instruments of the designated sector. This high concentration mandate is what makes sectoral funds among the riskiest equity fund categories.',
          },
          {
            question:
              'The maximum tax deduction available under Section 80C for ELSS investments is:',
            options: ['₹1,00,000 per year', '₹1,50,000 per year', '₹2,00,000 per year', 'No limit'],
            correctAnswer: 1,
            explanation:
              'The Section 80C deduction limit is ₹1,50,000 per financial year across all eligible investments (ELSS, PPF, NSC, life insurance premium, etc. combined). ELSS is one of the most popular 80C instruments because of its short 3-year lock-in and equity return potential.',
          },
          {
            question: 'Which of the following is an example of a Thematic Fund?',
            options: [
              'A fund investing only in banking stocks',
              'A fund investing in infrastructure-related companies across multiple sectors',
              'A fund investing in top 100 large cap stocks',
              'A fund investing in maximum 30 stocks',
            ],
            correctAnswer: 1,
            explanation:
              'A Thematic Fund invests based on a theme that may span multiple sectors. An Infrastructure Theme fund would include companies from cement, steel, capital goods, construction, power, and engineering — cutting across sectors. A fund investing only in banking stocks would be a Sectoral Fund, not a Thematic Fund.',
          },
        ],
        summaryNotes: [
          'Sectoral = 80% in one sector (e.g., Banking); Thematic = 80% in one theme spanning multiple sectors (e.g., Infrastructure)',
          'ELSS: 80% equity, 3-year lock-in, Section 80C benefit up to ₹1.5 lakh — shortest lock-in among all 80C options',
          'Each ELSS SIP installment has its own independent 3-year lock-in period from its investment date',
          'Sectoral/Thematic funds are high risk — suitable only for experienced investors who understand sector and economic cycles',
          'For NISM: "ELSS 3-year lock-in" and "Sectoral/Thematic min 80% equity" are two frequently tested facts',
        ],
        relatedTopics: ['equity-value-contra-focused', 'equity-large-mid-small', 'sebi-categorization'],
      },
    },

    // ─── Section 5: Debt — Overnight, Liquid, Ultra-Short, Low, Short Duration ──
    {
      id: 'debt-short-duration',
      title: 'Debt Funds — Overnight, Liquid, Ultra-Short, Low Duration',
      slug: 'debt-short-duration',
      content: {
        definition:
          'Under SEBI categorization, short-duration debt fund categories include: Overnight Fund (invests in securities maturing in 1 day), Liquid Fund (invests in securities with maturity up to 91 days), Ultra Short Duration Fund (Macaulay duration of 3-6 months), Low Duration Fund (Macaulay duration of 6-12 months), Short Duration Fund (Macaulay duration of 1-3 years), and Money Market Fund (invests in money market instruments with maturity up to 1 year including T-bills, Commercial Papers, and Certificates of Deposit). These categories are arranged from lowest to highest interest rate risk.',
        explanation:
          'In my 25 years, I have seen more money lost by people who did not understand debt fund categories than by those who picked the wrong equity fund. Let me give you the framework I use to explain debt funds to every new sub-broker in my team.\n\nThink of debt funds like a ladder — each rung represents a different maturity bucket, and as you climb higher, you take on more interest rate risk but potentially earn more return.\n\nThe bottom rung is the Overnight Fund — it buys securities that mature the very next day. Treasury bills expiring tomorrow, overnight CBLO (Collateralized Borrowing and Lending Obligation), reverse repos. The credit risk is virtually zero and the interest rate risk is zero because the portfolio matures and is reinvested every single day. Returns are modest (3-4%) but the capital is as safe as it can get. Think of it as a savings account alternative.\n\nOne rung up is the Liquid Fund — the workhorse of corporate and distributor treasury management. It invests in securities with maximum 91-day maturity. No security in the portfolio can mature beyond 91 days. Since 2019, SEBI mandated that liquid funds must also mark-to-market a portion of their holdings, which slightly increased volatility but improved transparency. The killer feature is instant redemption — investors can redeem up to ₹50,000 instantly (credited within 30 minutes on business days). This is why liquid funds are the go-to recommendation for emergency funds and short-term parking.\n\nThen come Ultra Short Duration (Macaulay duration 3-6 months), Low Duration (6-12 months), and Short Duration (1-3 years). Here is what most training programs will not tell you: Macaulay duration is not the same as maturity. Duration measures interest rate sensitivity — how much the NAV will change for a 1% change in interest rates. A fund with 6-month duration will see its NAV drop approximately 0.5% if interest rates rise by 1%. A 3-year duration fund will drop approximately 3%. This is why matching your client\'s investment horizon to the fund\'s duration is critical.\n\nThe Money Market Fund invests exclusively in money market instruments — T-bills, Commercial Papers (CPs), Certificates of Deposit (CDs) — with maturity up to 1 year. It sits between Liquid and Ultra Short Duration in terms of risk-return.',
        realLifeExample:
          'Sunita, a small business owner in Ahmedabad, came to me with ₹25 lakh that she would need in different time frames:\n\n₹5 lakh needed next week (for a vendor payment): I put this in an Overnight Fund. She earns a tiny return for a few days, but the money is available the next business day with virtually zero risk.\n\n₹8 lakh needed in 45 days (for a raw material purchase): I recommended a Liquid Fund. With a 45-day horizon, liquid fund is perfect — max 91-day maturity securities, instant redemption available. Historically delivering 4-5% annualized, it beats a savings account comfortably.\n\n₹7 lakh needed in 6 months (for equipment down payment): I placed this in an Ultra Short Duration Fund. With Macaulay duration of 3-6 months, it aligns with her horizon. Expected return: 5-6% annualized.\n\n₹5 lakh needed in 1.5 years (for a shop renovation): I chose a Short Duration Fund (Macaulay duration 1-3 years). This gives the fund manager room to earn slightly higher yields from 1-3 year corporate bonds. Expected return: 6-7% annualized.\n\nSix months later, the RBI hiked rates by 0.50%. Here is what happened:\n- Overnight Fund: No impact (portfolio matures daily)\n- Liquid Fund: Minimal impact (max 91-day securities)\n- Ultra Short Duration: NAV dipped 0.2% temporarily, recovered in 2 weeks\n- Short Duration: NAV dipped 0.8%, recovered in 6 weeks\n\nSunita understood perfectly — the longer the duration, the more sensitive to interest rate changes. But since she matched each fund\'s duration to her investment timeline, she was never caught off guard.',
        keyPoints: [
          'Overnight Fund: invests in 1-day maturity securities — near-zero credit and interest rate risk, ideal for parking surplus cash',
          'Liquid Fund: maximum 91-day maturity securities, instant redemption up to ₹50,000, ideal for emergency funds and short-term parking',
          'Ultra Short Duration Fund: Macaulay duration of 3-6 months — a step above liquid for slightly longer horizons',
          'Low Duration Fund: Macaulay duration of 6-12 months — suitable for 6-month to 1-year investment horizons',
          'Short Duration Fund: Macaulay duration of 1-3 years — higher yield potential but more sensitive to interest rate changes',
          'Money Market Fund: invests in T-bills, CPs, CDs with max 1-year maturity — a pure money market play',
          'Macaulay Duration measures interest rate sensitivity — 1% rate increase causes approximately X% NAV drop (where X = duration in years)',
          'Always match your client\'s investment horizon to the fund\'s duration — this is the golden rule of debt fund investing',
        ],
        formula:
          'Approximate Price Change = -Duration x Change in Yield\n\nExample: If a fund has Macaulay duration of 2 years and interest rates rise by 1%:\nPrice change ≈ -2 x 1% = -2% (NAV drops by approximately 2%)\n\nIf rates fall by 0.5%:\nPrice change ≈ -2 x (-0.5%) = +1% (NAV rises by approximately 1%)\n\nNote: This is a simplified approximation. Actual impact depends on convexity, yield curve shape, and credit spread changes.',
        numericalExample:
          'Arun has ₹10,00,000 in a Short Duration Fund with Macaulay duration of 2.5 years.\n\nScenario 1 — RBI hikes repo rate by 0.50%:\nApproximate NAV impact = -2.5 x 0.50% = -1.25%\nTemporary paper loss = ₹10,00,000 x 1.25% = ₹12,500\nBut if Arun holds for 2+ years, the higher reinvestment yield will compensate\n\nScenario 2 — RBI cuts repo rate by 0.75%:\nApproximate NAV impact = -2.5 x (-0.75%) = +1.875%\nImmediate paper gain = ₹10,00,000 x 1.875% = ₹18,750\nPlus regular accrual income from coupon payments\n\nCompare with Overnight Fund (duration ≈ 0.003 years):\nSame rate hike of 0.50%: NAV impact = -0.003 x 0.50% ≈ -0.0015% (₹15 on ₹10 lakh)\nVirtually no impact — that is the beauty of overnight funds for ultra-short parking',
        faq: [
          {
            question: 'What is the difference between maturity and Macaulay duration?',
            answer:
              'Maturity is when a bond or security will be repaid. Duration is a measure of interest rate sensitivity — how much the bond\'s price changes when interest rates move. For a zero-coupon bond, maturity and duration are the same. For a coupon-paying bond, duration is always less than maturity because you receive cash flows (coupons) before the maturity date. SEBI uses Macaulay duration to define debt fund categories because it better reflects the actual interest rate risk in the portfolio.',
          },
          {
            question: 'Can a Liquid Fund give negative returns?',
            answer:
              'Technically yes, but it is extremely rare. After SEBI mandated mark-to-market valuation for liquid funds in 2019, there have been instances of minor negative daily returns during sharp credit events. However, if you hold a liquid fund for even 7-15 days, the accrual income typically overcomes any mark-to-market blips. In the 25 years I have been in this business, I have never seen a liquid fund give negative returns over a 1-month period from a reputable AMC. Still, always choose liquid funds from large AMCs with high credit quality portfolios.',
          },
          {
            question: 'What is the instant redemption facility in Liquid Funds?',
            answer:
              'SEBI allows investors to redeem up to ₹50,000 or 90% of their investment (whichever is lower) from liquid funds and receive the money in their bank account within 30 minutes on business days. This facility is available through select AMC apps and platforms. The NAV applied is the previous day\'s NAV. This makes liquid funds the most practical option for emergency funds — almost as liquid as a savings account but with better returns.',
          },
          {
            question: 'When should I recommend an Overnight Fund vs a Liquid Fund?',
            answer:
              'Overnight Fund for 1-7 day parking or when you want absolutely zero volatility (even mark-to-market). Liquid Fund for 7-90 day parking or for emergency fund allocation. The return difference is small (0.3-0.5% annualized), but liquid funds offer instant redemption up to ₹50,000 and slightly better returns for the marginal additional risk. For corporate treasuries doing daily cash management, Overnight is preferred. For individual investors building an emergency fund, Liquid is the better choice.',
          },
          {
            question: 'What instruments does a Money Market Fund invest in?',
            answer:
              'Money Market Funds invest in money market instruments with maturity up to 1 year. These include: Treasury Bills (T-bills) issued by the Government of India, Commercial Papers (CPs) issued by corporates for short-term borrowing, Certificates of Deposit (CDs) issued by banks, and Collateralized Borrowing and Lending Obligations (CBLO). The credit quality is generally high since T-bills carry sovereign guarantee and CDs are backed by scheduled banks.',
          },
        ],
        mcqs: [
          {
            question: 'An Overnight Fund invests in securities with a maturity of:',
            options: ['Up to 7 days', 'Up to 30 days', '1 day', 'Up to 91 days'],
            correctAnswer: 2,
            explanation:
              'An Overnight Fund invests in securities that mature in exactly 1 day (overnight). This gives it near-zero interest rate risk and near-zero credit risk, making it the safest category of debt mutual funds. The portfolio is essentially reinvested every single day.',
          },
          {
            question: 'The maximum maturity of securities that a Liquid Fund can invest in is:',
            options: ['30 days', '60 days', '91 days', '180 days'],
            correctAnswer: 2,
            explanation:
              'A Liquid Fund can invest only in debt and money market securities with maturity up to 91 days. No security in the portfolio can have a maturity beyond 91 days. This short maturity profile keeps interest rate risk very low and makes liquid funds one of the safest debt fund categories.',
          },
          {
            question:
              'A debt fund with Macaulay duration of 2 years will see its NAV drop by approximately ___% if interest rates rise by 1%.',
            options: ['0.5%', '1%', '2%', '3%'],
            correctAnswer: 2,
            explanation:
              'The approximate price change equals negative duration multiplied by the change in yield. For a 2-year Macaulay duration fund with a 1% rate increase: NAV impact ≈ -2 x 1% = -2%. This relationship between duration and interest rate sensitivity is fundamental to debt fund investing and frequently tested in NISM.',
          },
          {
            question:
              'Which of the following debt fund categories has the LOWEST interest rate risk?',
            options: ['Short Duration Fund', 'Ultra Short Duration Fund', 'Overnight Fund', 'Low Duration Fund'],
            correctAnswer: 2,
            explanation:
              'The Overnight Fund has the lowest interest rate risk because its securities mature in just 1 day. With an effective duration close to zero, changes in interest rates have virtually no impact on the NAV. The hierarchy from lowest to highest interest rate risk is: Overnight → Liquid → Ultra Short Duration → Low Duration → Short Duration.',
          },
        ],
        summaryNotes: [
          'Debt fund ladder (low to high interest rate risk): Overnight (1 day) → Liquid (91 days) → Ultra Short (3-6M) → Low Duration (6-12M) → Short Duration (1-3Y) → Money Market (up to 1Y)',
          'Macaulay duration = interest rate sensitivity — match client horizon to fund duration for optimal results',
          'Liquid funds offer instant redemption up to ₹50,000 — the best option for emergency fund parking',
          'Overnight funds are the safest debt fund category — use for 1-7 day parking of surplus cash',
          'For NISM: memorize the Macaulay duration ranges for each category — this is a heavily tested area',
        ],
        relatedTopics: ['debt-medium-long', 'sebi-categorization', 'risk-return-relationship'],
      },
    },

    // ─── Section 6: Debt — Medium, Long Duration, Dynamic Bond, Gilt ────
    {
      id: 'debt-medium-long',
      title: 'Debt Funds — Medium, Long Duration, Dynamic Bond, Gilt',
      slug: 'debt-medium-long',
      content: {
        definition:
          'Under SEBI categorization, medium-to-long duration debt fund categories include: Medium Duration Fund (Macaulay duration 3-4 years), Medium to Long Duration Fund (4-7 years), Long Duration Fund (7+ years), Dynamic Bond Fund (no duration restriction — fund manager actively manages duration), Corporate Bond Fund (minimum 80% in AA+ and above rated corporate bonds), Credit Risk Fund (minimum 65% in below AA-rated corporate bonds), Banking & PSU Fund (minimum 80% in debt instruments of banks, PSUs, and Public Financial Institutions), Gilt Fund (minimum 80% in government securities), Gilt Fund with 10-year Constant Duration (minimum 80% in G-Secs with portfolio Macaulay duration of 10 years), and Floater Fund (minimum 65% in floating rate instruments).',
        explanation:
          'In my 25 years in this industry, medium-to-long duration debt funds are where I have seen both the biggest gains and the most painful losses in fixed income. Let me walk you through each category with the practical wisdom that comes only from experience.\n\nMedium Duration (3-4 years) and Medium to Long Duration (4-7 years) funds are the workhorses for investors with 3-5 year horizons. They invest in a mix of corporate bonds and government securities. The return potential is higher than short-duration funds, but so is the sensitivity to RBI rate actions. When the RBI was cutting rates from 8% to 4% between 2019-2020, medium duration funds delivered 9-11% returns. When rates reversed upward in 2022, the same funds saw temporary NAV erosion.\n\nLong Duration Funds (7+ years) are the most sensitive to interest rate changes. These are essentially a pure play on the interest rate cycle. When rates fall, long duration funds deliver equity-like returns. When rates rise, they can give negative returns for extended periods. I recommend these only to sophisticated investors who have a view on the rate cycle.\n\nDynamic Bond Funds are interesting — the fund manager has complete freedom to shift between short and long duration based on their rate outlook. If they expect rate cuts, they extend duration to 7-8 years. If they expect rate hikes, they compress to 1-2 years. The success depends entirely on the fund manager\'s ability to read the interest rate cycle correctly.\n\nHere is what most training programs will not tell you about Credit Risk Funds: they were the source of the biggest debt fund crisis in India. Franklin Templeton\'s six debt fund schemes (including credit risk) were wound up in April 2020 because the underlying corporate bonds defaulted or became illiquid. Credit Risk Funds invest 65%+ in below AA-rated bonds — these are companies with weaker credit profiles that pay higher interest. The higher yield is compensation for the higher default risk. After the Franklin episode, most experienced distributors recommend Credit Risk Funds only for investors who truly understand and accept the possibility of permanent capital loss.\n\nCorporate Bond Funds (min 80% in AA+ and above) are the safer alternative — they stick to high-quality issuers. Banking & PSU Funds are even safer as they invest in bank and government-backed entity debt.\n\nGilt Funds are the purest expression of interest rate risk — they invest 80%+ in government securities with zero credit risk (sovereign guarantee). The Gilt Fund with 10-year Constant Duration is designed for investors who want consistent exposure to long-term government bonds. Floater Funds invest 65%+ in floating rate instruments — their coupons adjust with market rates, making them relatively immune to interest rate changes.',
        realLifeExample:
          'Mohan, a 55-year-old businessman in Pune, had ₹1 crore that he wanted to invest conservatively for 5 years. Here is how I structured his debt portfolio:\n\n₹30 lakh in Banking & PSU Fund: I chose IDFC Banking & PSU Debt Fund. "Mohan bhai, this fund invests 80%+ in bonds from SBI, HDFC Bank, PFC, REC — all government-backed or top-rated banks. The credit risk is minimal. You will earn 6.5-7.5% over 3-5 years."\n\n₹25 lakh in Corporate Bond Fund: I recommended HDFC Corporate Bond Fund. "This invests only in AA+ and above rated corporate bonds — Reliance Industries, HDFC Ltd, Bajaj Finance kind of companies. Slightly higher yield than Banking & PSU, still very high credit quality."\n\n₹20 lakh in Dynamic Bond Fund: I placed this in ICICI Pru All Seasons Bond Fund. "This fund manager has the flexibility to adjust duration based on rate outlook. In 2019 when rates were being cut, this fund delivered 12% by extending duration. When rates started rising in 2022, the manager shortened duration to protect capital."\n\n₹15 lakh in Gilt Fund: I allocated to SBI Magnum Gilt Fund. "Zero credit risk — 100% government securities. The returns will depend on the interest rate cycle, but you will never lose money due to a corporate default."\n\n₹10 lakh in Floater Fund: I chose HDFC Floating Rate Debt Fund. "This is your hedge against rising rates. When other debt funds suffer from rate hikes, floater funds actually benefit because their coupon rates adjust upward."\n\nI specifically avoided Credit Risk Funds for Mohan. When he asked why, I told him about the Franklin Templeton episode: "Mohan bhai, in April 2020, six Franklin debt schemes were shut overnight. Investors with ₹25,000 crore could not access their money for over two years. The extra 1-2% yield from lower-rated bonds is not worth the sleepless nights. Your corpus is for your retirement — we cannot gamble with it."',
        keyPoints: [
          'Medium Duration Fund: Macaulay duration 3-4 years — suitable for 3-4 year investment horizons',
          'Medium to Long Duration Fund: Macaulay duration 4-7 years — for investors comfortable with moderate interest rate risk',
          'Long Duration Fund: Macaulay duration 7+ years — most sensitive to interest rate changes, suitable for rate-cycle-aware investors',
          'Dynamic Bond Fund: no duration restriction — fund manager actively manages duration based on rate outlook',
          'Corporate Bond Fund: minimum 80% in AA+ and above corporate bonds — high credit quality with moderate duration risk',
          'Credit Risk Fund: minimum 65% in below AA corporate bonds — higher yield but significant default risk (remember Franklin Templeton)',
          'Banking & PSU Fund: minimum 80% in bank, PSU, and PFI debt instruments — very high credit quality',
          'Gilt Fund: minimum 80% in government securities — zero credit risk, pure interest rate play',
        ],
        formula:
          'Credit Risk Premium = Yield on Corporate Bond - Yield on Government Bond of similar maturity\n\nExample:\nAAA Corporate Bond yield: 7.5%\n10-year G-Sec yield: 7.0%\nCredit spread = 0.5% (50 basis points)\n\nA-rated Corporate Bond yield: 9.5%\n10-year G-Sec yield: 7.0%\nCredit spread = 2.5% (250 basis points)\n\nThe higher spread for A-rated bonds reflects the higher default risk. Credit Risk Funds earn this spread but also bear the risk of default.',
        numericalExample:
          'Seema invests ₹20,00,000 in different debt fund categories. Let us see the impact of a 1% interest rate hike:\n\nMedium Duration Fund (duration 3.5 years):\nNAV impact ≈ -3.5 x 1% = -3.5%\nTemporary loss = ₹20,00,000 x 3.5% = ₹70,000\n\nLong Duration Fund (duration 8 years):\nNAV impact ≈ -8 x 1% = -8%\nTemporary loss = ₹20,00,000 x 8% = ₹1,60,000\n\nGilt Fund 10-year Constant Duration (duration 10 years):\nNAV impact ≈ -10 x 1% = -10%\nTemporary loss = ₹20,00,000 x 10% = ₹2,00,000\n\nFloater Fund (duration ~0.3 years):\nNAV impact ≈ -0.3 x 1% = -0.3%\nTemporary loss = ₹20,00,000 x 0.3% = ₹6,000\nPlus, the coupon resets higher, benefiting the fund going forward\n\nThis is exactly why I tell my clients: "Rate hike coming? Reduce duration. Rate cut expected? Extend duration. Cannot predict? Use Dynamic Bond."',
        faq: [
          {
            question: 'What happened with Franklin Templeton and why does it matter?',
            answer:
              'In April 2020, Franklin Templeton India wound up (shut down) six of its debt fund schemes due to severe redemption pressure and illiquidity in the underlying bonds. These schemes held significant allocations to lower-rated corporate bonds that became difficult to sell during the COVID-19 market stress. Over ₹25,000 crore of investor money was locked up, and it took more than two years for most investors to get their money back through a Supreme Court-monitored process. This event fundamentally changed how distributors recommend credit risk funds — the extra yield is not worth the catastrophic risk of capital loss.',
          },
          {
            question: 'When should I recommend a Gilt Fund vs a Corporate Bond Fund?',
            answer:
              'Recommend Gilt Fund when your client wants zero credit risk and has a view that interest rates will fall (rate cuts boost Gilt NAVs significantly). Recommend Corporate Bond Fund when the client is comfortable with high-quality corporate credit risk (AA+ and above) and wants a slightly higher yield than Gilts. For most conservative investors, Banking & PSU Fund is the sweet spot — government-backed credit quality with slightly better yield than pure Gilts.',
          },
          {
            question: 'What is a Floater Fund and why is it useful when rates are rising?',
            answer:
              'A Floater Fund invests minimum 65% in floating rate instruments — bonds where the coupon rate adjusts periodically based on a benchmark rate (like the repo rate or T-bill rate). When interest rates rise, the coupons on these floating rate bonds also rise, which increases the income earned by the fund. This makes Floater Funds one of the few debt fund categories that actually benefit from rising interest rates. They are excellent hedges in a rising rate environment.',
          },
          {
            question: 'How does a Dynamic Bond Fund differ from other debt fund categories?',
            answer:
              'A Dynamic Bond Fund has no Macaulay duration restriction — the fund manager can hold duration at 1 year or 10 years depending on their interest rate view. In essence, you are trusting the fund manager to time the interest rate cycle. If they extend duration before rate cuts, you earn excellent returns. If they get it wrong, you suffer. Dynamic Bond is for investors who trust the fund manager\'s macro view and are comfortable with variable outcomes. It is not a "set and forget" category.',
          },
          {
            question: 'What is the difference between a Gilt Fund and a Gilt Fund with 10-year Constant Duration?',
            answer:
              'A regular Gilt Fund invests 80%+ in government securities but has no duration restriction — the fund manager can hold short-term or long-term G-Secs. A Gilt Fund with 10-year Constant Duration must maintain a portfolio Macaulay duration of 10 years by investing 80%+ in G-Secs. This means the 10-year variant has a fixed and very high interest rate sensitivity, making it the most volatile Gilt category. Use the 10-year variant only for tactical bets on long-term rate cuts.',
          },
        ],
        mcqs: [
          {
            question:
              'A Credit Risk Fund must invest a minimum of ___% in corporate bonds rated below AA.',
            options: ['50%', '60%', '65%', '80%'],
            correctAnswer: 2,
            explanation:
              'A Credit Risk Fund must invest a minimum of 65% of its total assets in corporate bonds rated below AA (i.e., A-rated and below). These lower-rated bonds offer higher yields to compensate for the higher default risk. After the Franklin Templeton episode, this category requires careful evaluation of the AMC\'s credit research capabilities.',
          },
          {
            question:
              'A Corporate Bond Fund must invest a minimum of 80% in corporate bonds rated:',
            options: ['AA and above', 'AA+ and above', 'AAA only', 'A and above'],
            correctAnswer: 1,
            explanation:
              'A Corporate Bond Fund must invest minimum 80% in corporate bonds rated AA+ and above. This ensures high credit quality in the portfolio. Compare this with Credit Risk Fund which invests in below AA-rated bonds — the credit quality difference is significant.',
          },
          {
            question: 'Which of the following debt fund categories has NO restriction on Macaulay duration?',
            options: ['Medium Duration Fund', 'Gilt Fund', 'Dynamic Bond Fund', 'Corporate Bond Fund'],
            correctAnswer: 2,
            explanation:
              'A Dynamic Bond Fund has no restriction on Macaulay duration — the fund manager has complete freedom to adjust portfolio duration based on their interest rate outlook. All other listed categories have specific duration or allocation mandates defined by SEBI.',
          },
          {
            question:
              'A Banking & PSU Fund must invest a minimum of ___% in debt instruments of banks, PSUs, and Public Financial Institutions.',
            options: ['65%', '70%', '75%', '80%'],
            correctAnswer: 3,
            explanation:
              'A Banking & PSU Fund must invest a minimum of 80% of its total assets in debt instruments of banks, PSUs (Public Sector Undertakings), and PFIs (Public Financial Institutions). This category is considered very safe due to the government backing of most issuers and is popular among conservative debt fund investors.',
          },
        ],
        summaryNotes: [
          'Medium (3-4Y) → Medium to Long (4-7Y) → Long (7Y+) → each step up means more interest rate sensitivity',
          'Dynamic Bond = no duration restriction — fund manager reads the rate cycle and adjusts; success depends on manager skill',
          'Corporate Bond (AA+ above) is the safe corporate play; Credit Risk (below AA) is high-yield-high-risk — remember Franklin Templeton',
          'Gilt Fund = zero credit risk (government guarantee) but full interest rate risk; 10-year constant duration variant is the most volatile',
          'Floater Fund benefits from rising rates — floating coupons reset higher when rates increase, making it a natural rate-hike hedge',
        ],
        relatedTopics: ['debt-short-duration', 'sebi-categorization', 'risk-return-relationship'],
      },
    },
    // ─── Part 2 Sections: Hybrid, Solution-Oriented, Passive, etc. ────
    ...schemeTypesPart2Sections,
  ],
};
