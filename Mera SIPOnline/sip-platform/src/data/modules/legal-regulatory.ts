import { LearningModule } from '@/types/learning';

export const legalRegulatoryModule: LearningModule = {
  id: 'legal-regulatory',
  title: 'Legal & Regulatory Framework',
  slug: 'legal-regulatory',
  icon: 'Scale',
  description: 'Master the SEBI Mutual Fund Regulations, offer documents (SID, SAI, KIM), investor rights, and advertisement guidelines. Highest weightage topic in the NISM VA exam.',
  level: 'intermediate',
  color: 'from-red-500 to-rose-600',
  estimatedTime: '60 min',
  sections: [
    // ─── Section 1: SEBI (Mutual Funds) Regulations, 1996 — Overview ───
    {
      id: 'sebi-regulations-overview',
      title: 'SEBI (Mutual Funds) Regulations, 1996 — Overview',
      slug: 'sebi-regulations-overview',
      content: {
        definition: 'The SEBI (Mutual Funds) Regulations, 1996 is the principal legal framework governing the establishment, operation, and management of mutual funds in India. Issued under the Securities and Exchange Board of India Act, 1992, these regulations replaced the earlier 1993 guidelines and provide comprehensive rules covering registration of mutual funds, constitution of AMCs and trustees, launch and management of schemes, investment restrictions, accounting and valuation norms, and investor protection mechanisms. Every mutual fund in India — whether sponsored by a bank, financial institution, or private entity — must comply with these regulations in their entirety.',
        explanation: 'Let me tell you something from experience — when I started as a distributor in the late 1990s, the mutual fund industry was like the Wild West. UTI was the only real player, and there were barely any rules. Then SEBI stepped in with the 1996 Regulations, and everything changed for the better. These regulations are the constitution of the mutual fund industry. They cover everything from how a mutual fund is born (registration) to how it dies (winding up). Think of it as a rulebook with 12 chapters and over 70 regulations. The key chapters you must know for the NISM exam are: Chapter II (Registration), Chapter III (Constitution and Management), Chapter IV (Schemes), Chapter V (Investment Restrictions), Chapter VI (Fees, Accounting, and Valuation), and Chapter IX (Inspections and Penalties). Over the years, SEBI has issued hundreds of circulars amending and updating these regulations — TER limits, risk-o-meter, side-pocketing, categorization norms — all of these came as amendments to the original 1996 framework. As a distributor, you do not need to memorize every regulation number, but you absolutely must understand the spirit and structure of these rules because they directly affect how you sell, service, and advise your clients.',
        realLifeExample: 'Imagine Rajesh, a new mutual fund distributor in Chennai, wants to understand why he cannot simply start his own AMC. Here is the answer rooted in the regulations: To set up a mutual fund, you need a sponsor (like a bank or financial institution) with a minimum net worth of ₹5 crore, a 5-year track record in financial services, and positive net worth in at least 3 of the last 5 years. The sponsor must contribute at least 40% of the AMC\'s net worth. Then you need a board of trustees (at least 4 members, with two-thirds being independent), an AMC registered with SEBI (with a minimum net worth of ₹50 crore), and a custodian to hold the assets. Rajesh now understands why there are only about 44 AMCs in India — the entry barriers are deliberately high to protect investors. When his client Lakshmi asks, "Is my money safe?" Rajesh can confidently explain this multi-layered regulatory structure: sponsor → trustees → AMC → custodian, all under SEBI\'s watchful eye.',
        keyPoints: [
          'SEBI (Mutual Funds) Regulations, 1996 is the master legal framework — it replaced the earlier 1993 guidelines',
          'The regulations contain 12 chapters covering registration, constitution, scheme management, investments, accounting, and winding up',
          'A mutual fund in India has a three-tier structure mandated by these regulations: Sponsor → Trustee → AMC',
          'The sponsor must have a minimum net worth of ₹5 crore and contribute at least 40% of the AMC\'s net worth',
          'The AMC must maintain a minimum net worth of ₹50 crore at all times',
          'At least two-thirds of the trustees must be independent — they act as watchdogs protecting investor interests',
          'SEBI has the power to inspect, investigate, and penalize any mutual fund or AMC for non-compliance',
          'Amendments are issued through SEBI circulars — these are as binding as the original regulations',
        ],
        faq: [
          {
            question: 'Why were the 1993 guidelines replaced with the 1996 regulations?',
            answer: 'The 1993 guidelines were basic and did not provide adequate investor protection or operational standards. As the industry grew beyond UTI with private sector entry, SEBI needed a comprehensive, enforceable legal framework. The 1996 Regulations brought in mandatory registration, trustee oversight, investment restrictions, and detailed disclosure requirements that transformed the industry into a well-regulated ecosystem.',
          },
          {
            question: 'What is the difference between a regulation and a SEBI circular?',
            answer: 'Regulations are the primary law — think of them as the constitution. SEBI circulars are like amendments or executive orders that interpret, clarify, or modify specific aspects of the regulations. Both are legally binding. For example, the 1996 Regulations set the framework for expense ratios, but SEBI Circular of 2018 specified the exact TER slabs based on AUM. In the NISM exam, you may be tested on both.',
          },
          {
            question: 'Can a mutual fund operate without SEBI registration?',
            answer: 'Absolutely not. Regulation 3 explicitly states that no person shall set up or operate a mutual fund without obtaining a certificate of registration from SEBI. Operating without registration is a criminal offence under the SEBI Act, punishable with imprisonment and fines. This is a straightforward exam question — the answer is always NO.',
          },
          {
            question: 'How do these regulations protect a small investor like my client?',
            answer: 'Multiple layers: (1) Mandatory registration ensures only qualified entities operate mutual funds, (2) Independent trustees oversee AMC activities, (3) Investment restrictions prevent reckless risk-taking, (4) Daily NAV disclosure ensures transparency, (5) The custodian holds assets separately from the AMC, (6) Detailed offer documents provide complete information, and (7) SEBI can inspect and penalize any non-compliance. Your client\'s money is protected by law at every stage.',
          },
          {
            question: 'What happens if an AMC violates SEBI regulations?',
            answer: 'SEBI has extensive powers under the regulations: it can issue warning letters, impose monetary penalties (up to ₹25 crore for certain violations), suspend or cancel registration, bar individuals from the securities market, and even initiate criminal prosecution. In practice, SEBI regularly issues show-cause notices and penalty orders against AMCs and individuals for violations.',
          },
        ],
        mcqs: [
          {
            question: 'The SEBI (Mutual Funds) Regulations, 1996 replaced which earlier set of guidelines?',
            options: [
              'SEBI (Mutual Funds) Regulations, 1991',
              'SEBI (Mutual Funds) Guidelines, 1993',
              'RBI Mutual Fund Guidelines, 1994',
              'AMFI Code of Conduct, 1995',
            ],
            correctAnswer: 1,
            explanation: 'The SEBI (Mutual Funds) Regulations, 1996 replaced the earlier SEBI (Mutual Funds) Guidelines of 1993. The 1993 guidelines were the first attempt at regulating mutual funds after SEBI was established, but the 1996 Regulations provided a far more comprehensive and enforceable framework.',
          },
          {
            question: 'What is the minimum net worth requirement for an Asset Management Company (AMC) as per SEBI Regulations?',
            options: [
              '₹10 crore',
              '₹25 crore',
              '₹50 crore',
              '₹100 crore',
            ],
            correctAnswer: 2,
            explanation: 'As per SEBI (Mutual Funds) Regulations, the AMC must maintain a minimum net worth of ₹50 crore at all times. This is a frequently tested fact in the NISM VA exam. Do not confuse this with the sponsor\'s minimum net worth requirement of ₹5 crore.',
          },
          {
            question: 'What proportion of trustees of a mutual fund must be independent of the sponsor?',
            options: [
              'At least one-half',
              'At least two-thirds',
              'At least three-fourths',
              'All trustees must be independent',
            ],
            correctAnswer: 1,
            explanation: 'At least two-thirds of the trustees must be independent of the sponsor or the AMC. This ensures that the majority of the trustee board acts as an independent watchdog protecting investor interests, without being influenced by the sponsor or AMC management.',
          },
          {
            question: 'The sponsor of a mutual fund is required to contribute at least _____ of the net worth of the AMC.',
            options: [
              '25%',
              '40%',
              '51%',
              '75%',
            ],
            correctAnswer: 1,
            explanation: 'The sponsor must contribute at least 40% of the net worth of the AMC. This ensures the sponsor has significant financial stake and commitment to the mutual fund business. This is a classic NISM exam question — remember the number 40%.',
          },
        ],
        summaryNotes: [
          'SEBI (Mutual Funds) Regulations, 1996 is the foundational law — know its structure: 12 chapters, 70+ regulations, amended through circulars',
          'Three-tier structure: Sponsor (sets up) → Trustees (oversee) → AMC (manages) — each layer has specific SEBI-mandated requirements',
          'Key numbers to memorize: AMC net worth ₹50 crore, Sponsor net worth ₹5 crore, Sponsor contribution 40%, Independent trustees two-thirds',
          'SEBI has teeth: it can inspect, penalize, suspend registration, and even initiate criminal proceedings for violations',
          'Every amendment through SEBI circulars is as binding as the original regulation — treat circulars seriously in exam preparation',
        ],
        relatedTopics: ['sponsor-trustee-amc', 'offer-document-sid-sai', 'investor-rights'],
      },
    },

    // ─── Section 2: Offer Document — SID, SAI & KIM Explained ──────────
    {
      id: 'offer-document-sid-sai',
      title: 'Offer Document — SID, SAI & KIM Explained',
      slug: 'offer-document-sid-sai',
      content: {
        definition: 'The Offer Document of a mutual fund scheme is the comprehensive legal document that provides all material information a prospective investor needs to make an informed investment decision. It consists of two parts: the Scheme Information Document (SID), which contains scheme-specific details like investment objective, asset allocation, risk factors, and fee structure; and the Statement of Additional Information (SAI), which contains AMC-level information like financial statements, key personnel details, and legal disclosures. Together, SID and SAI form the complete Offer Document. A shorter version called the Key Information Memorandum (KIM) is also prepared for quick reference.',
        explanation: 'Think of the Offer Document like a car\'s complete manual. The SID is the driving handbook — it tells you everything about that specific scheme: what it invests in, how risky it is, what fees you will pay, when you can exit, and what benchmark it competes against. The SAI is the technical manual — it covers the manufacturer (AMC), the factory (sponsor), the quality inspectors (trustees), and the service history (financial statements). Together, they give you the complete picture. Now here is the practical reality: in my 25 years, I have met maybe five clients who have actually read the entire Offer Document. But as a distributor, you must read it. Why? Because SEBI and AMFI hold you responsible for understanding the product you sell. If a client complains that they were not informed about exit loads or risks, and the information was clearly mentioned in the SID, the burden falls on you as the distributor. The Offer Document must be filed with SEBI at least 21 days before the NFO (New Fund Offer) opens — this gives SEBI time to review and raise objections. After launch, the SID and SAI must be updated at least once a year.',
        realLifeExample: 'Priya is a new MFD in Hyderabad. She is about to recommend ICICI Prudential Bluechip Fund to her client Venkat. Before doing so, she downloads the SID from the ICICI Prudential website. Here is what she finds: Investment Objective — to generate long-term capital appreciation by investing in large-cap stocks. Asset Allocation — 80-100% in equity of large-cap companies, 0-20% in debt and money market instruments. Benchmark — Nifty 100 TRI. Exit Load — 1% if redeemed within 1 year. Expense Ratio (TER) — 1.62% for Regular Plan, 0.82% for Direct Plan. Risk-o-meter — Very High. She then checks the SAI and notes that the AMC is ICICI Prudential AMC Ltd with a net worth of over ₹900 crore, the sponsor is ICICI Bank and Prudential Corporation, and the fund manager has 18 years of experience. Armed with this information, Priya explains to Venkat: "This fund invests primarily in large-cap stocks, carries very high risk, has a 1-year lock-in via exit load, and charges 1.62% annually." This is exactly how a professional distributor should use offer documents.',
        keyPoints: [
          'Offer Document = SID + SAI — these two documents together form the complete legal disclosure for any mutual fund scheme',
          'SID (Scheme Information Document) covers scheme-specific details: investment objective, asset allocation, risk factors, loads, TER, benchmark',
          'SAI (Statement of Additional Information) covers AMC-level details: sponsor info, trustee details, AMC financials, key personnel, legal structure',
          'The Offer Document must be filed with SEBI at least 21 days before the New Fund Offer (NFO) opens',
          'Both SID and SAI must be updated at least once a year — updated versions are available on the AMC website',
          'KIM (Key Information Memorandum) is the abridged version of SID and must accompany every application form',
          'As a distributor, you are legally expected to read and understand the Offer Document before recommending any scheme',
          'Any change in fundamental attributes mentioned in the SID requires unitholder approval and provides exit option',
        ],
        faq: [
          {
            question: 'What is the difference between SID and SAI?',
            answer: 'SID is scheme-specific — it tells you about one particular scheme (its objective, risks, fees, benchmark). SAI is AMC-specific — it tells you about the AMC managing that scheme (sponsor details, trustee board, AMC financials, legal information). One AMC has one SAI but multiple SIDs — one for each scheme it manages. Together they form the Offer Document.',
          },
          {
            question: 'Why must the Offer Document be filed 21 days before the NFO?',
            answer: 'The 21-day advance filing gives SEBI time to review the document and raise any objections or require modifications. If SEBI does not communicate any observations within 21 working days, the AMC can proceed with the NFO. This pre-launch review is a crucial investor protection mechanism — it ensures no misleading or non-compliant scheme reaches investors.',
          },
          {
            question: 'Can an AMC launch a scheme without filing an Offer Document?',
            answer: 'Absolutely not. Filing the Offer Document (SID + SAI) with SEBI is mandatory before launching any scheme, whether it is an NFO or a change in an existing scheme\'s fundamental attributes. Launching without proper documentation is a serious regulatory violation that can result in penalties and cancellation of AMC registration.',
          },
          {
            question: 'How often must the Offer Document be updated?',
            answer: 'The SID and SAI must be updated at least once every year. Additionally, any material change — like a change in fund manager, expense ratio, exit load, or benchmark — must be communicated to unitholders and updated in the documents promptly. The latest versions are always available on the AMC website and AMFI portal.',
          },
          {
            question: 'As a distributor, am I legally required to read the Offer Document?',
            answer: 'Yes. AMFI code of conduct and SEBI regulations require distributors to understand the products they recommend. If a client later complains that they were not informed about risks, exit loads, or other material facts that were clearly stated in the SID, the regulatory and legal consequences fall on both the AMC and the distributor. Reading the SID before recommending any scheme is not optional — it is your professional duty.',
          },
        ],
        mcqs: [
          {
            question: 'The Offer Document of a mutual fund scheme consists of:',
            options: [
              'SID and KIM',
              'SID and SAI',
              'SAI and KIM',
              'SID, SAI, and KIM',
            ],
            correctAnswer: 1,
            explanation: 'The Offer Document consists of the Scheme Information Document (SID) and the Statement of Additional Information (SAI). KIM is a separate abridged document derived from the SID — it is not part of the Offer Document itself. This is a classic trick question in the NISM exam.',
          },
          {
            question: 'How many days before the NFO must the Offer Document be filed with SEBI?',
            options: [
              '15 days',
              '21 days',
              '30 days',
              '45 days',
            ],
            correctAnswer: 1,
            explanation: 'The Offer Document must be filed with SEBI at least 21 days (working days) before the launch of the New Fund Offer. This gives SEBI adequate time to review the document and raise objections if necessary. Remember: 21 days for Offer Document filing.',
          },
          {
            question: 'Which document contains information about the AMC\'s financial statements and sponsor details?',
            options: [
              'Scheme Information Document (SID)',
              'Key Information Memorandum (KIM)',
              'Statement of Additional Information (SAI)',
              'Annual Report of the scheme',
            ],
            correctAnswer: 2,
            explanation: 'The SAI (Statement of Additional Information) contains AMC-level information including sponsor details, trustee information, AMC financial statements, key personnel, and legal disclosures. The SID focuses on scheme-specific details. Do not confuse SAI with SID — the exam loves this distinction.',
          },
          {
            question: 'How frequently must the SID and SAI be updated?',
            options: [
              'Every quarter',
              'Every 6 months',
              'At least once a year',
              'Only when there is a material change',
            ],
            correctAnswer: 2,
            explanation: 'SEBI mandates that both SID and SAI must be updated at least once a year. However, material changes (like change in fund manager or exit load) must be updated promptly and communicated to investors. The annual update is the minimum requirement, not the only requirement.',
          },
        ],
        summaryNotes: [
          'Offer Document = SID + SAI — never include KIM as part of the Offer Document in the exam; KIM is a separate abridged document',
          'SID = scheme-specific (what the scheme does); SAI = AMC-specific (who manages it) — one SAI per AMC, one SID per scheme',
          'Filing with SEBI: 21 days before NFO — this number appears frequently in the exam',
          'Annual update is mandatory for both SID and SAI — material changes require immediate disclosure',
          'As a distributor, reading the SID is your professional duty — ignorance of scheme details is not a valid defence',
        ],
        relatedTopics: ['kim-explained', 'sid-deep-dive', 'sebi-regulations-overview'],
      },
    },

    // ─── Section 3: Key Information Memorandum — What to Check ──────────
    {
      id: 'kim-explained',
      title: 'Key Information Memorandum — What to Check',
      slug: 'kim-explained',
      content: {
        definition: 'The Key Information Memorandum (KIM) is a concise, abridged version of the Scheme Information Document (SID) that provides the most essential information about a mutual fund scheme in a quick-reference format. SEBI mandates that a KIM must accompany every application form — whether physical or digital. It serves as the investor\'s first point of reference, containing the investment objective, risk factors, asset allocation pattern, benchmark, minimum investment amount, fund manager details, load structure, and performance data. The KIM is not a substitute for the SID but rather a convenient summary designed to help investors make quick comparisons between schemes.',
        explanation: 'Here is the practical truth about KIM in the real world: it is the document your client will actually read. While the SID can run into 80-100 pages, the KIM is typically 2-4 pages — crisp, to the point, and designed for easy comparison. When I train new distributors, I tell them: "Master the KIM. Know every section by heart. Because when a client asks you to explain a scheme, you should be able to walk them through the KIM like reading a recipe." The KIM must contain the scheme\'s investment objective in plain language, the asset allocation table showing where the money will go, the risk-o-meter classification, benchmark index, minimum application amounts for lump sum and SIP, current NAV, fund manager name and experience, loads (entry and exit), expense ratio, and the scheme\'s past performance versus benchmark. As a distributor, when you hand a client an application form, the KIM is right there with it. SEBI made this mandatory precisely so that no investor can say they were not informed about the basics. Your job is to highlight the critical parts — especially the risk level, exit load, and expense ratio — before the client signs.',
        realLifeExample: 'Meena, an MFD in Jaipur, is meeting her client Arun, a 45-year-old government school teacher who wants to invest ₹3,00,000 lumpsum from his GPF partial withdrawal. Meena pulls out the KIM of SBI Magnum Midcap Fund and walks Arun through it: "Arun ji, let me show you the key details. Investment Objective: to provide long-term capital appreciation by investing in midcap companies. Asset Allocation: 65-100% in midcap equity, 0-35% in other equities and debt. Risk-o-meter: Very High. That means this fund can see sharp declines of 20-30% in a bad year. Benchmark: S&P BSE Midcap 150 TRI. Exit Load: 1% if you redeem within 1 year. TER: 1.78% for regular plan. Minimum Investment: ₹5,000 lumpsum. Fund Manager: Mr. R. Srinivasan with 24 years of experience. Past 5-year return: 18.2% CAGR vs benchmark 16.5% CAGR." Arun now has a clear picture in under 5 minutes. He decides to invest ₹3,00,000 with a commitment to stay for at least 5 years. This is exactly how the KIM should be used — as a guided conversation tool.',
        keyPoints: [
          'KIM is the abridged version of SID — it is a concise 2-4 page summary of the most critical scheme information',
          'SEBI mandates that a KIM must accompany every mutual fund application form — physical or digital',
          'Key contents of KIM: investment objective, asset allocation, risk-o-meter level, benchmark, loads, TER, minimum investment, fund manager details',
          'KIM must include past performance data of the scheme versus its benchmark over standard periods (1, 3, 5 years and since inception)',
          'The KIM is NOT a substitute for the SID — it is a quick-reference document that supplements the full Offer Document',
          'As a distributor, use the KIM as your primary presentation tool when explaining a scheme to clients',
          'KIM must be updated whenever there is a material change in scheme details like exit load, TER, or fund manager',
          'Every KIM must carry the standard disclaimer: "Mutual Fund investments are subject to market risks, read all scheme related documents carefully"',
        ],
        faq: [
          {
            question: 'Is the KIM part of the Offer Document?',
            answer: 'No. The Offer Document consists of SID + SAI only. The KIM is a separate abridged document derived from the SID. This is a very important distinction for the NISM exam — many candidates confuse this. Think of KIM as the "cheat sheet" version of the SID, not a component of the Offer Document.',
          },
          {
            question: 'Can an investor invest without receiving the KIM?',
            answer: 'Technically, every application form must be accompanied by the KIM. In digital/online transactions, the KIM is made available on the platform. However, an investor can sign a declaration stating they have read and understood the SID/KIM and proceed with the investment even if they have not physically received a printed copy. The key is that the AMC/distributor must ensure the KIM was made available.',
          },
          {
            question: 'What should a distributor highlight from the KIM when presenting to a client?',
            answer: 'Focus on five critical items: (1) Risk-o-meter level — is the client comfortable with this level of risk? (2) Exit load — does the client understand the lock-in implications? (3) Expense ratio (TER) — how much is being charged annually? (4) Investment objective and asset allocation — does it match the client\'s goal? (5) Past performance vs benchmark — is the fund delivering on its mandate? Walking the client through these five items takes under 5 minutes and fulfils your disclosure obligations.',
          },
          {
            question: 'How is KIM different from a factsheet?',
            answer: 'The KIM is a regulatory document mandated by SEBI with specific required contents. A factsheet is a marketing document published monthly by the AMC with more detailed portfolio information, sector allocation, top holdings, and market commentary. The KIM is static between updates, while the factsheet changes monthly. Both are useful for distributors, but only the KIM is legally mandated to accompany application forms.',
          },
        ],
        mcqs: [
          {
            question: 'Which of the following is TRUE about the Key Information Memorandum (KIM)?',
            options: [
              'KIM is a part of the Offer Document along with SID and SAI',
              'KIM is an abridged version of the SAI',
              'KIM must accompany every mutual fund application form',
              'KIM is optional for direct plan investors',
            ],
            correctAnswer: 2,
            explanation: 'KIM must accompany every mutual fund application form as mandated by SEBI. Option A is wrong because the Offer Document consists only of SID + SAI (KIM is separate). Option B is wrong because KIM is an abridged version of SID, not SAI. Option D is wrong because KIM is mandatory for all investors regardless of plan type.',
          },
          {
            question: 'The KIM of a mutual fund scheme does NOT typically include:',
            options: [
              'Investment objective and asset allocation pattern',
              'Detailed financial statements of the AMC',
              'Exit load and expense ratio information',
              'Fund manager name and past performance data',
            ],
            correctAnswer: 1,
            explanation: 'Detailed financial statements of the AMC are part of the SAI (Statement of Additional Information), not the KIM. The KIM focuses on scheme-specific essentials like investment objective, asset allocation, risk level, loads, TER, and fund manager details. This is a distinction the NISM exam frequently tests.',
          },
          {
            question: 'The standard disclaimer "Mutual Fund investments are subject to market risks..." must appear on:',
            options: [
              'Only the SID and SAI',
              'Only television advertisements',
              'All scheme-related documents including KIM, advertisements, and application forms',
              'Only the KIM and application form',
            ],
            correctAnswer: 2,
            explanation: 'This standard risk disclaimer is mandatory on ALL scheme-related documents, advertisements (print, TV, digital), KIM, application forms, and any sales literature. SEBI requires this universal disclosure to ensure no investor can claim they were not warned about market risks.',
          },
        ],
        summaryNotes: [
          'KIM = abridged SID, NOT part of the Offer Document — this distinction alone can earn or lose you exam marks',
          'Must accompany every application form (physical or digital) — this is a SEBI mandate, not an optional practice',
          'Five things to always highlight from KIM: risk-o-meter, exit load, TER, asset allocation, and past performance vs benchmark',
          'KIM is your best sales tool as a distributor — learn to walk clients through it in under 5 minutes',
          'Updated whenever material changes occur — do not use outdated KIMs with clients',
        ],
        relatedTopics: ['offer-document-sid-sai', 'sid-deep-dive', 'advertisement-guidelines'],
      },
    },

    // ─── Section 4: Scheme Information Document — Deep Dive ─────────────
    {
      id: 'sid-deep-dive',
      title: 'Scheme Information Document — Deep Dive',
      slug: 'sid-deep-dive',
      content: {
        definition: 'The Scheme Information Document (SID) is the primary and most detailed disclosure document for a mutual fund scheme. It contains exhaustive information about the scheme\'s investment objective, asset allocation pattern, investment strategy, risk factors (both standard and scheme-specific), fees and expenses (including Total Expense Ratio), load structure, benchmark index, fund manager details, tax implications, and the fundamental attributes of the scheme. The SID is legally binding — the AMC must operate the scheme within the parameters disclosed in the SID. Any deviation from the stated fundamental attributes requires prior approval from unitholders and SEBI, making the SID the investor\'s primary legal safeguard.',
        explanation: 'Let me give you a real talk about the SID that most training programs skip. The SID is not just a compliance document — it is a legal contract between the AMC and the investor. When the SID says the fund will invest 65-100% in equity, the fund manager cannot wake up one morning and put 80% in bonds. When the SID says the exit load is 1% for 1 year, the AMC cannot suddenly make it 2% for 2 years without going through a formal process. This is what makes the SID so powerful for investor protection. The concept you must absolutely nail for the NISM exam is "fundamental attributes." These are the core characteristics of a scheme that define its identity — the investment objective (growth vs income), asset allocation type (equity vs debt), investment pattern (large-cap vs mid-cap), and fee structure. If the AMC wants to change any of these fundamental attributes, they must: (1) send a written notice to all unitholders, (2) publish the notice in newspapers, (3) give unitholders at least 30 days to exit at prevailing NAV without any exit load, and (4) get approval from SEBI. This 30-day no-load exit window is one of the most important investor rights, and the NISM exam tests it regularly.',
        realLifeExample: 'Let me share a real industry example. In 2018, when SEBI mandated mutual fund scheme recategorization, many AMCs had to change the fundamental attributes of their schemes. Take the case of a fund that was called "XYZ Opportunities Fund" — a multi-cap fund that invested freely across market caps. Under the new SEBI categorization, the AMC decided to convert it into a "Large Cap Fund" with a mandate to invest at least 80% in large-cap stocks. This was a change in fundamental attributes — the investment pattern was fundamentally altered. So the AMC sent letters to all 4.5 lakh unitholders of the scheme explaining: "We are changing the investment mandate. Your fund will now invest primarily in large-cap stocks instead of across all market caps. If you disagree, you have 30 days to exit at current NAV without paying any exit load." Distributor Sunil in Mumbai had 200 clients in this scheme. He personally called each one, explained the change, and helped 35 clients who wanted mid-cap exposure switch to a proper multi-cap fund during the exit window. This is exactly how fundamental attribute changes work in practice — and this is the level of understanding the NISM exam expects.',
        keyPoints: [
          'SID is the most comprehensive disclosure document for a mutual fund scheme — typically 60-100 pages',
          'It is legally binding: the AMC must operate the scheme strictly within the parameters stated in the SID',
          'Key sections of SID: Investment Objective, Asset Allocation, Risk Factors, Fees/Expenses, Load Structure, Tax Treatment, Fundamental Attributes',
          'Fundamental attributes include: investment objective, asset allocation pattern, investment type (equity/debt/hybrid), and terms of issue (fees, loads)',
          'Change in fundamental attributes requires: written notice to unitholders + newspaper publication + 30-day no-load exit window + SEBI approval',
          'Risk factors in the SID are of two types: Standard Risk Factors (common to all MFs) and Scheme-Specific Risk Factors (unique to that scheme)',
          'The SID must disclose the Total Expense Ratio (TER) — the annual fee the AMC charges, which is deducted from NAV',
          'Distributors must read and understand the SID before recommending any scheme — professional negligence is no excuse',
        ],
        faq: [
          {
            question: 'What exactly are "fundamental attributes" of a mutual fund scheme?',
            answer: 'Fundamental attributes are the core defining characteristics of a scheme as stated in the SID. They include: (1) the investment objective (e.g., capital appreciation vs regular income), (2) the asset allocation pattern (e.g., 80-100% equity), (3) the type/category of the scheme (e.g., large-cap equity), and (4) the terms of issue including fee structure and load pattern. These attributes collectively define "what the scheme is" — changing any of them fundamentally alters the scheme\'s identity.',
          },
          {
            question: 'What happens if a fund manager deviates from the SID without approval?',
            answer: 'If a fund manager invests outside the parameters stated in the SID — for example, investing in small-caps when the SID says large-cap only — it is a regulatory violation. The trustees are supposed to catch such deviations through regular monitoring. If caught, SEBI can impose penalties on the AMC, the fund manager, and even the trustees for failure to supervise. The investors can also seek legal remedy for any losses caused by such unauthorized deviations.',
          },
          {
            question: 'How is the 30-day exit window calculated for fundamental attribute changes?',
            answer: 'When the AMC announces a change in fundamental attributes, it must give unitholders at least 30 days from the date of the notice to exit at the prevailing NAV without any exit load. This means even if the scheme normally has a 1% exit load for redemptions within 1 year, during this 30-day window, all unitholders can redeem without any exit load. The 30-day period starts from the date the written communication is dispatched to unitholders.',
          },
          {
            question: 'Does the SID cover tax implications for investors?',
            answer: 'Yes, the SID includes a section on tax implications covering capital gains tax (short-term and long-term), dividend distribution tax (now abolished — dividends are taxed in the hands of investors), TDS provisions, and stamp duty. However, the SID typically includes a disclaimer that tax laws are subject to change and investors should consult their tax advisors for personalized advice.',
          },
          {
            question: 'Can an AMC change the fund manager without changing fundamental attributes?',
            answer: 'Yes. A change in fund manager is not considered a change in fundamental attributes. However, SEBI requires the AMC to inform unitholders about the change. While this may not trigger the 30-day exit window, it is material information — if a star fund manager leaves, many investors may want to reconsider their investment. As a distributor, proactively informing your clients about fund manager changes builds trust.',
          },
        ],
        mcqs: [
          {
            question: 'When a mutual fund AMC changes the fundamental attributes of a scheme, unitholders must be given at least _____ days to exit without exit load.',
            options: [
              '15 days',
              '21 days',
              '30 days',
              '45 days',
            ],
            correctAnswer: 2,
            explanation: 'Unitholders must be given at least 30 days to exit at the prevailing NAV without any exit load when the fundamental attributes of a scheme are changed. This is one of the most frequently tested facts in the NISM VA exam. Remember: 21 days for filing Offer Document with SEBI, 30 days for unitholder exit window.',
          },
          {
            question: 'Which of the following is NOT a fundamental attribute of a mutual fund scheme?',
            options: [
              'Investment objective',
              'Asset allocation pattern',
              'Name of the fund manager',
              'Type/category of the scheme',
            ],
            correctAnswer: 2,
            explanation: 'The name of the fund manager is NOT a fundamental attribute. Fundamental attributes include the investment objective, asset allocation pattern, type/category of scheme, and terms of issue (fee and load structure). A fund manager change does not trigger the formal fundamental attribute change process, though it must be disclosed to unitholders.',
          },
          {
            question: 'Risk factors disclosed in the SID are of:',
            options: [
              'One type only — market risk',
              'Two types — Standard Risk Factors and Scheme-Specific Risk Factors',
              'Three types — market, credit, and liquidity risk only',
              'No specific categorization is required by SEBI',
            ],
            correctAnswer: 1,
            explanation: 'The SID must disclose two categories of risk factors: Standard Risk Factors (common to all mutual fund schemes, like market risk and NAV fluctuation) and Scheme-Specific Risk Factors (unique to the particular scheme based on its investment strategy, like concentration risk for a sectoral fund or credit risk for a debt fund).',
          },
          {
            question: 'A change in which of the following would trigger the process for change in fundamental attributes?',
            options: [
              'Replacement of the fund manager',
              'Change in the registrar and transfer agent',
              'Modification of the scheme\'s investment objective from growth to income',
              'Change in the custodian of the fund',
            ],
            correctAnswer: 2,
            explanation: 'Modification of the investment objective (e.g., from growth/capital appreciation to income/dividend focus) is a change in fundamental attributes. This triggers the full process: unitholder notice, newspaper publication, 30-day no-load exit window, and SEBI approval. Changes in fund manager, RTA, or custodian are operational changes, not fundamental attribute changes.',
          },
        ],
        summaryNotes: [
          'SID is a legal contract between AMC and investor — the AMC must operate within SID parameters or face regulatory action',
          'Fundamental attributes = investment objective + asset allocation + scheme type + terms of issue (fee/load) — memorize these four',
          'Change in fundamental attributes triggers: notice to unitholders + newspaper publication + 30-day no-load exit + SEBI approval',
          'Two types of risk factors: Standard (common to all MFs) and Scheme-Specific (unique to that scheme) — exam loves this distinction',
          'Fund manager change is NOT a fundamental attribute change — but it is material information that must be disclosed',
        ],
        relatedTopics: ['offer-document-sid-sai', 'kim-explained', 'investor-rights'],
      },
    },

    // ─── Section 5: Investor Rights & Obligations ──────────────────────
    {
      id: 'investor-rights',
      title: 'Investor Rights & Obligations',
      slug: 'investor-rights',
      content: {
        definition: 'Investor rights in the context of mutual funds are the legally enforceable entitlements that SEBI (Mutual Funds) Regulations, 1996 guarantee to every unitholder of a mutual fund scheme. These include the right to receive complete scheme information (via SID, SAI, KIM), the right to receive dividend or income distribution as declared, the right to redeem units at NAV-based prices, the right to vote on fundamental changes to the scheme, the right to receive a no-load exit window when fundamental attributes are altered, and the right to approach SEBI or the courts for grievance redressal. Correspondingly, investors have obligations including providing accurate personal and financial information, complying with KYC requirements, and fulfilling tax obligations on their mutual fund gains.',
        explanation: 'In my career, I have handled countless client grievances — and I can tell you that most problems arise from investors not knowing their rights, and distributors not informing them. Let me walk you through the rights that matter most in practice. First, the right to information: every investor has the right to receive the SID, SAI, KIM, annual report, half-yearly unaudited financial results, and portfolio disclosure. AMCs publish full portfolios every month now — this transparency is remarkable compared to when I started. Second, the right to redemption: this is sacred. No AMC can refuse to redeem your units (except in specific cases like segregated portfolios during credit events). Redemption must be processed at the applicable NAV and proceeds credited within the prescribed timeline — T+3 for equity, T+2 for debt, T+1 for liquid funds. Third, the voting right: when fundamental attributes change, unitholders can vote. Each unit equals one vote. If a majority disagrees with the change, it cannot proceed. Fourth, the exit right during fundamental changes: this 30-day no-load exit window is the investor\'s safety valve. But remember, rights come with responsibilities. Investors must complete KYC, provide accurate information (including tax residency and FATCA declarations), and cannot blame the AMC or distributor for market losses that are clearly disclosed as risks in the SID.',
        realLifeExample: 'Here is a real situation I dealt with. My client Gopal, a retired bank officer in Nagpur, invested ₹15,00,000 in a debt fund. The fund held bonds of a company that defaulted on its payments. The AMC decided to create a "side pocket" — segregating the defaulted bonds into a separate portfolio. Gopal was worried: "Has my money vanished?" I explained his rights: (1) He would receive units in both the main portfolio (liquid, tradeable) and the segregated portfolio (frozen until recovery). (2) The AMC was legally required to inform him in writing about the side-pocketing. (3) He could redeem from the main portfolio at any time at the revised NAV. (4) If and when the defaulted company repays, the recovery amount would be distributed to holders of the segregated units. (5) If he felt the AMC was negligent, he could file a complaint with SEBI\'s SCORES portal. Gopal exercised his right to redeem ₹12,00,000 from the main portfolio (the portion not affected by the default) and chose to wait for recovery on the segregated portion. Two years later, the company partially repaid, and Gopal received ₹1,80,000 from the segregated units. His rights were fully protected at every step.',
        keyPoints: [
          'Right to Information: investors can demand SID, SAI, KIM, annual reports, portfolio disclosures, and account statements at any time',
          'Right to Redemption: units must be redeemed at NAV-based prices within prescribed timelines (T+3 equity, T+2 debt, T+1 liquid)',
          'Right to Income Distribution: when the AMC declares a dividend/IDCW, every unitholder on the record date receives their proportionate share',
          'Right to Vote: unitholders can vote on changes to fundamental attributes — one unit equals one vote',
          'Right to Exit Without Load: when fundamental attributes change, unitholders get 30 days to exit at NAV without exit load',
          'Right to Grievance Redressal: investors can file complaints on SEBI SCORES portal, approach the ombudsman, or take legal action',
          'Investor Obligation: must complete KYC before investing and provide accurate personal, financial, and tax residency information',
          'Investor Obligation: must comply with tax laws — capital gains tax, TDS, and FATCA/CRS declarations are the investor\'s responsibility',
        ],
        faq: [
          {
            question: 'Can an AMC refuse to redeem my mutual fund units?',
            answer: 'Under normal circumstances, no. The right to redeem is fundamental. However, there are rare exceptions: (1) During a temporary suspension of redemption ordered by SEBI in extreme market conditions, (2) In a segregated portfolio (side pocket) — the segregated units are frozen until recovery, (3) In close-ended schemes during the lock-in period. But even in these cases, the AMC must follow proper regulatory procedures and inform investors. Arbitrary refusal to redeem is illegal.',
          },
          {
            question: 'What is SEBI SCORES and how can investors use it?',
            answer: 'SCORES (SEBI Complaints Redress System) is an online portal where investors can lodge complaints against mutual funds, AMCs, distributors, or other market intermediaries. The complaint is forwarded to the concerned entity, which must respond within 30 days. If unresolved, SEBI takes further action. As a distributor, you should know this portal exists and guide your clients to use it if they have legitimate grievances that you cannot resolve.',
          },
          {
            question: 'What are the tax obligations of a mutual fund investor?',
            answer: 'Investors must pay capital gains tax on profits from mutual fund redemptions — short-term or long-term depending on the holding period. For equity funds: STCG (under 1 year) at 20%, LTCG (over 1 year) at 12.5% above ₹1.25 lakh. For debt funds: all gains taxed at slab rate regardless of holding period (post-2023 rules). Investors must also comply with TDS provisions, file FATCA/CRS self-declarations (for foreign tax residency), and include mutual fund gains in their income tax returns.',
          },
          {
            question: 'Can an investor hold the distributor responsible for losses?',
            answer: 'An investor cannot hold a distributor responsible for market losses that are inherent to the scheme\'s risk profile and clearly disclosed in the SID. However, if the distributor misled the investor — for example, guaranteeing returns, hiding risk information, recommending unsuitable products, or churning the portfolio for commissions — the investor can file a complaint with AMFI, SEBI, or take legal action. This is why proper documentation and suitability assessment are critical for every distributor.',
          },
          {
            question: 'What is the significance of the "record date" for dividends?',
            answer: 'The record date is the cut-off date set by the AMC to determine which unitholders are eligible for the declared dividend/IDCW. Only investors who hold units in the scheme on or before the record date receive the dividend. If you redeem before the record date, you do not get the dividend. If you invest after the record date, you do not get the dividend. This is a frequently tested concept — remember: ownership on record date determines dividend eligibility.',
          },
        ],
        mcqs: [
          {
            question: 'Which of the following is an investor\'s RIGHT under SEBI Mutual Fund Regulations?',
            options: [
              'Right to guaranteed returns from the AMC',
              'Right to appoint the fund manager of their choice',
              'Right to vote on changes in fundamental attributes of the scheme',
              'Right to choose which securities the fund manager buys',
            ],
            correctAnswer: 2,
            explanation: 'Investors have the right to vote on changes in fundamental attributes. They do NOT have the right to guaranteed returns (no mutual fund can guarantee returns), appoint fund managers (that is the AMC\'s prerogative), or direct security selection (that is the fund manager\'s job). Voting rights on fundamental changes is one of the most important investor protections in the regulations.',
          },
          {
            question: 'Within how many business days must redemption proceeds of an equity mutual fund be credited to the investor?',
            options: [
              'T+1 business days',
              'T+2 business days',
              'T+3 business days',
              'T+5 business days',
            ],
            correctAnswer: 2,
            explanation: 'Redemption proceeds for equity mutual funds must be credited within T+3 business days (where T is the date of redemption request acceptance). For debt funds it is T+2 and for liquid/overnight funds it is T+1. These timelines are SEBI-mandated and frequently tested. AMCs that delay beyond these timelines must pay penal interest at 15% per annum to the investor.',
          },
          {
            question: 'An investor\'s obligation under mutual fund regulations includes:',
            options: [
              'Monitoring the fund manager\'s daily trading activity',
              'Completing KYC requirements and providing accurate information',
              'Attending all AMC board meetings',
              'Approving every investment decision made by the fund manager',
            ],
            correctAnswer: 1,
            explanation: 'Investors are obligated to complete KYC (Know Your Customer) requirements and provide accurate personal, financial, and tax-related information. They are NOT required to monitor daily trading, attend board meetings, or approve investment decisions — those responsibilities lie with the trustees, AMC management, and fund manager respectively.',
          },
          {
            question: 'If an AMC delays redemption proceeds beyond the prescribed timeline, the investor is entitled to:',
            options: [
              'Full refund of all investments with guaranteed 12% returns',
              'Penal interest at 15% per annum for the period of delay',
              'Free switching to any other scheme without load',
              'Automatic cancellation of the AMC\'s SEBI registration',
            ],
            correctAnswer: 1,
            explanation: 'If an AMC delays crediting redemption proceeds beyond the prescribed timeline, it must pay the investor penal interest at 15% per annum for the period of delay. This provision ensures AMCs process redemptions on time. Note: the investor does not get guaranteed returns or free switching — the remedy is specifically penal interest for the delay period.',
          },
        ],
        summaryNotes: [
          'Key investor rights: information, redemption at NAV, dividend on record date, vote on fundamental changes, 30-day no-load exit, grievance redressal via SCORES',
          'Redemption timelines to memorize: T+3 (equity), T+2 (debt), T+1 (liquid/overnight) — delay attracts 15% per annum penal interest',
          'One unit = one vote on fundamental attribute changes — majority decides whether the change proceeds',
          'Investor obligations: complete KYC, provide accurate information, comply with tax laws, file FATCA/CRS declarations',
          'Distributors cannot be held liable for market losses but CAN be held liable for mis-selling, guaranteeing returns, or hiding risk information',
        ],
        relatedTopics: ['sid-deep-dive', 'sebi-regulations-overview', 'distributor-dos-donts'],
      },
    },

    // ─── Section 6: Advertisement & Sales Literature Guidelines ────────
    {
      id: 'advertisement-guidelines',
      title: 'Advertisement & Sales Literature Guidelines',
      slug: 'advertisement-guidelines',
      content: {
        definition: 'The SEBI Advertisements Code for Mutual Funds lays down comprehensive rules governing how mutual fund schemes can be promoted through any medium — print, television, radio, digital platforms, social media, or in-person sales presentations. The core principle is that no advertisement shall be misleading, contain false or exaggerated statements, or create unrealistic expectations about returns. Every advertisement must prominently display standard risk disclaimers, carry the SEBI registration number, and present past performance data only in the prescribed format with mandatory disclaimer that past performance does not guarantee future returns. The code applies equally to the AMC, its authorized distributors, and any third party acting on behalf of the mutual fund.',
        explanation: 'This section is critical because violations of advertisement guidelines are the fastest way for a distributor to lose their ARN and face SEBI penalties. I have seen distributors create WhatsApp messages saying "Double your money in 2 years — invest in XYZ Fund!" — that is a regulatory violation waiting to happen. Here is what you need to know. First, no advertisement can guarantee or assure returns — not even by implication. Saying "XYZ Fund has given 18% returns in the last 5 years" is fine (it is factual past performance). Saying "Invest in XYZ Fund and earn 18% returns" is illegal (it implies future performance). Second, every advertisement must carry the standard disclaimer: "Mutual Fund investments are subject to market risks, read all scheme related documents carefully." For audio-visual media, this must be spoken clearly and not rushed. Third, past performance data must be shown for standard periods — 1 year, 3 years, 5 years, and since inception — as CAGR (Compounded Annual Growth Rate), and must include benchmark comparison. Fourth, star ratings and rankings from external agencies can be mentioned but must include the name of the rating agency, the period, and a disclaimer that ratings are not a guarantee. Fifth, and this is increasingly important, social media posts by distributors are treated as advertisements and must comply with all the same rules. That WhatsApp forward claiming "best fund guaranteed 20% return" is as much a regulatory violation as a newspaper ad saying the same thing.',
        realLifeExample: 'Distributor Karthik in Bengaluru runs a popular Instagram page about mutual funds with 15,000 followers. He posts a reel showing: "Top 5 Mutual Funds That Gave 25%+ Returns in 2024!" — with dramatic music and flashing green numbers. His AMFI mentor reviews the post and points out five regulatory violations: (1) No disclaimer about past performance not guaranteeing future returns. (2) No mention of the period for which returns are calculated. (3) Returns shown as absolute, not CAGR for periods over 1 year. (4) No benchmark comparison alongside the returns. (5) No standard risk disclaimer at the end. Karthik\'s mentor helps him redo the post correctly: "These 5 large-cap funds delivered above-benchmark CAGR returns over 3 years ending December 2024 (Source: AMFI website). Past performance may or may not be sustained. Returns are CAGR. Benchmark: Nifty 100 TRI. Mutual Fund investments are subject to market risks, read all scheme related documents carefully." The corrected version is compliant — and still informative. This is the balance every distributor must strike.',
        keyPoints: [
          'No advertisement shall be misleading, contain false statements, or guarantee/assure returns — not even by implication',
          'Standard disclaimer mandatory on ALL advertisements: "Mutual Fund investments are subject to market risks, read all scheme related documents carefully"',
          'Past performance must be shown as CAGR for periods over 1 year, with benchmark comparison and the disclaimer that past performance does not guarantee future returns',
          'Performance data must be shown for standard periods: 1 year, 3 years, 5 years, and since inception',
          'Star ratings and rankings can be used but must include the rating agency name, period, and disclaimer that ratings are not a guarantee',
          'Social media posts (WhatsApp, Instagram, Facebook, YouTube, Twitter) by distributors are treated as advertisements and must comply with all SEBI rules',
          'Audio-visual advertisements must have the disclaimer spoken clearly — not mumbled or flashed for a split second',
          'The SEBI registration number of the mutual fund must appear on every advertisement',
        ],
        faq: [
          {
            question: 'Can I share past performance of a fund on WhatsApp with my clients?',
            answer: 'Yes, but you must comply with advertisement guidelines. Show returns as CAGR for periods over 1 year, include benchmark comparison, mention the source and time period, and add the standard risk disclaimer. A casual WhatsApp message saying "this fund gave 25% last year, invest now!" without proper disclaimers is technically a regulatory violation. Format it properly and you are compliant.',
          },
          {
            question: 'Can I use the word "guaranteed" or "assured" in any communication about mutual funds?',
            answer: 'Never. The words "guaranteed," "assured," "certain," or any similar term implying certainty of returns are strictly prohibited in mutual fund advertisements and communications. Even phrases like "sure to give good returns" or "will not lose money" are violations. The only exception is fixed maturity plans (FMPs) and capital protection-oriented schemes that can describe their structure, but even they cannot guarantee returns.',
          },
          {
            question: 'What is the correct format for showing past performance in an advertisement?',
            answer: 'For periods over 1 year, returns must be shown as CAGR (Compounded Annual Growth Rate). For periods of 1 year or less, returns are shown as absolute returns. Performance must be shown for standard periods: 1 year, 3 years, 5 years, and since inception. Benchmark returns for the same periods must be shown alongside. The date as of which performance is calculated must be mentioned. And the disclaimer "Past performance may or may not be sustained in future" must be included.',
          },
          {
            question: 'Can a distributor endorse or recommend specific schemes on social media?',
            answer: 'A distributor can share factual information about schemes on social media but must comply with all advertisement guidelines — including disclaimers, proper performance format, and no guarantees. Personal recommendations must be based on suitability assessment of the individual investor, not broadcast to a general audience. Broadcasting "Buy XYZ Fund now!" to all followers is problematic because it does not consider individual risk profiles and goals.',
          },
          {
            question: 'What are the rules for using star ratings in advertisements?',
            answer: 'Star ratings and rankings from recognized agencies (like CRISIL, Value Research, Morningstar) can be used in advertisements but must include: (1) the name of the rating/ranking agency, (2) the period for which the rating applies, (3) the methodology reference, and (4) a disclaimer that ratings are not a guarantee of future performance. You cannot use self-assigned ratings or cherry-pick a rating from a favourable period while ignoring current ratings.',
          },
        ],
        mcqs: [
          {
            question: 'Which of the following statements in a mutual fund advertisement would be a regulatory violation?',
            options: [
              '"This scheme has delivered 14.5% CAGR over the last 5 years as of March 2024"',
              '"Invest in this scheme for guaranteed high returns and zero risk"',
              '"Past performance may or may not be sustained in future. Read scheme documents carefully"',
              '"The scheme benchmark is Nifty 50 TRI and it has outperformed the benchmark over 3 and 5 year periods"',
            ],
            correctAnswer: 1,
            explanation: 'Saying "guaranteed high returns and zero risk" is a clear violation of SEBI Advertisement Code. No mutual fund advertisement can guarantee returns or claim zero risk. Options A, C, and D are compliant — they show factual past performance with proper context and disclaimers.',
          },
          {
            question: 'For periods exceeding one year, mutual fund returns in advertisements must be shown as:',
            options: [
              'Absolute returns',
              'Simple annualized returns',
              'Compounded Annual Growth Rate (CAGR)',
              'Point-to-point returns only',
            ],
            correctAnswer: 2,
            explanation: 'SEBI mandates that for periods exceeding one year, mutual fund returns must be shown as CAGR (Compounded Annual Growth Rate). For periods of one year or less, absolute returns are used. This prevents misleading representation — for example, a 50% absolute return over 5 years looks impressive but translates to only about 8.4% CAGR.',
          },
          {
            question: 'Social media posts about mutual fund schemes by a distributor are:',
            options: [
              'Exempt from advertisement guidelines since they are personal posts',
              'Subject to all SEBI advertisement guidelines just like print or TV ads',
              'Only regulated if they are paid promotions',
              'Not regulated by SEBI as social media falls outside securities laws',
            ],
            correctAnswer: 1,
            explanation: 'Social media posts by distributors about mutual fund schemes are treated as advertisements and must comply with ALL SEBI advertisement guidelines — including disclaimers, proper return format, no guarantees, and benchmark comparison. Personal social media accounts do not provide exemption. This is an increasingly important area that the NISM exam now tests.',
          },
          {
            question: 'Which of the following is mandatory in every mutual fund advertisement?',
            options: [
              'NAV of the scheme on the date of advertisement',
              'Name and photograph of the fund manager',
              'Standard risk disclaimer and SEBI registration number',
              'Comparison with Fixed Deposit rates',
            ],
            correctAnswer: 2,
            explanation: 'Every mutual fund advertisement must carry the standard risk disclaimer ("Mutual Fund investments are subject to market risks...") and the SEBI registration number of the mutual fund. NAV disclosure, fund manager photos, and FD comparisons are not mandatory in advertisements (though some of these may appear voluntarily).',
          },
        ],
        summaryNotes: [
          'Golden rule: no guarantees, no assured returns, no misleading claims — ever, in any medium, including WhatsApp and Instagram',
          'Past performance format: CAGR for periods over 1 year, absolute for 1 year or less, always with benchmark comparison',
          'Every advertisement needs: standard risk disclaimer + SEBI registration number + proper return format with source and period',
          'Social media = advertisements in SEBI\'s eyes — your Instagram reel must comply with the same rules as a newspaper ad',
          'Star ratings are allowed but must include: agency name, period, methodology reference, and "not a guarantee" disclaimer',
        ],
        relatedTopics: ['distributor-dos-donts', 'kim-explained', 'sebi-regulations-overview'],
      },
    },

    // ─── Section 7: Dos and Don'ts for Mutual Fund Distributors ────────
    {
      id: 'distributor-dos-donts',
      title: 'Dos and Don\'ts for Mutual Fund Distributors',
      slug: 'distributor-dos-donts',
      content: {
        definition: 'The Dos and Don\'ts for Mutual Fund Distributors is a comprehensive code of conduct established by AMFI (Association of Mutual Funds in India) under SEBI\'s direction, governing the professional behaviour and ethical standards of every AMFI-registered distributor (ARN holder). This code covers commission disclosure, prohibition of return guarantees, ban on commission rebating, mandatory KYC compliance, suitability assessment requirements, documentation standards, and anti-mis-selling provisions. Violation of these rules can result in suspension or cancellation of the distributor\'s ARN registration, monetary penalties, and legal action. Every NISM VA candidate must know these rules thoroughly because they form the backbone of professional conduct in the mutual fund distribution industry.',
        explanation: 'Let me be direct with you — these Dos and Don\'ts are not theoretical. They are the rules that protect your livelihood and your clients\' wealth. In my 25 years, I have seen dozens of distributors lose their ARN because they broke these simple rules. Here are the critical ones. DO: always complete KYC before processing any transaction — no exceptions, not even for your own family members. DO: disclose your commission structure to clients if they ask — transparency builds trust. DO: maintain written records of the advice you give — if a client later claims you recommended an unsuitable product, your written records are your only defence. DO: recommend products based on the client\'s risk profile, goals, and time horizon — not based on which scheme pays you the highest commission. Now the DON\'Ts. DON\'T ever guarantee or promise returns — even verbally, even casually, even to your best friend who is also a client. If someone complains that you said "guaranteed 15%," and SEBI investigates, you will lose your ARN. DON\'T rebate your commission back to investors — this means you cannot give cashbacks, gifts, discounts, or any incentive funded from your commission. SEBI banned this to ensure distributors recommend products based on suitability, not price competition. DON\'T churn portfolios — repeatedly switching clients between schemes to earn fresh commissions is a serious violation. DON\'T make false or exaggerated claims about any scheme. And DON\'T execute transactions without proper authorization from the client.',
        realLifeExample: 'Let me share two contrasting stories. First, Deepak in Ahmedabad — a distributor who did everything right. He had a client, Shreya, a 28-year-old IT professional wanting to invest ₹50,000/month. Deepak completed her KYC, assessed her risk profile (aggressive — she had a 25-year horizon), documented his recommendation in writing: "Recommended 60% in flexi-cap equity, 25% in mid-cap, 15% in international equity fund based on long-term wealth creation goal and high risk tolerance." Shreya signed the recommendation letter. When markets fell 15% in 2020, Shreya panicked and complained that Deepak had not warned her about risks. Deepak produced the signed recommendation letter showing he had clearly stated "Very High Risk" and explained potential drawdowns. The complaint was dismissed. Now, Amit in Delhi — who did everything wrong. He told his client Prakash, a 60-year-old retiree, "Invest your ₹40 lakh retirement corpus in this small-cap fund — it will give you 20% returns easily." No KYC, no risk assessment, no written documentation. He also rebated ₹20,000 from his commission as a "joining bonus." When the small-cap fund fell 30%, Prakash lost ₹12 lakhs and filed a complaint with AMFI. Investigation revealed: no documentation, verbal return guarantee, commission rebating, and unsuitable product recommendation. Result? Amit\'s ARN was suspended for 2 years, and he had to pay compensation to Prakash.',
        keyPoints: [
          'DO: Complete KYC for every investor before processing any transaction — this is non-negotiable and applies to all categories of investors',
          'DO: Disclose all commissions and trail fees to clients when asked — SEBI mandates full transparency in distributor remuneration',
          'DO: Maintain written records of all investment advice and recommendations — signed by the client where possible',
          'DO: Recommend products based on suitability assessment — consider the client\'s risk profile, financial goals, time horizon, and existing portfolio',
          'DON\'T: Guarantee or promise returns in any form — verbal, written, or implied — this is the most commonly violated rule',
          'DON\'T: Rebate commission back to investors directly or indirectly — no cashbacks, gifts, discounts, or incentives from commission',
          'DON\'T: Churn portfolios — switching clients between schemes frequently to earn fresh upfront commissions is a serious violation',
          'DON\'T: Make false, misleading, or exaggerated statements about any scheme, AMC, or investment product',
        ],
        faq: [
          {
            question: 'Can I give a gift to my client as a festival gesture?',
            answer: 'This is a grey area. Small festive gifts (sweets, calendars) funded from your own pocket — not from commissions — are generally acceptable as a business courtesy. However, expensive gifts, cashbacks, gold coins, or any incentive that is effectively a return of commission to the investor is prohibited. The test is: would this gift influence the client\'s investment decision? If yes, it is likely a violation. When in doubt, keep it modest and clearly separate from commissions.',
          },
          {
            question: 'What happens if I am caught rebating commissions?',
            answer: 'Commission rebating is a serious violation. AMFI can suspend or cancel your ARN registration. SEBI can impose monetary penalties and bar you from the securities market. The AMC can terminate your empanelment. In practice, SEBI and AMFI have been cracking down on this — especially digital cashback schemes and discount brokers masquerading as distributors. If a client reports that you offered to return part of your commission, an investigation will follow.',
          },
          {
            question: 'How should I document my investment recommendations?',
            answer: 'Best practice: create a simple one-page document for each client interaction that includes: (1) Client name and folio number, (2) Date of conversation, (3) Client\'s stated goals and risk tolerance, (4) Your specific recommendation with rationale, (5) Risk factors highlighted, (6) Client\'s signature or email acknowledgement. Keep this document for at least 5 years. Many distributors use CRM software that logs interactions automatically. In case of a complaint, this documentation is your strongest defence.',
          },
          {
            question: 'Can I recommend a scheme that pays me higher commission if it also suits the client?',
            answer: 'If the scheme genuinely suits the client\'s risk profile, goals, and time horizon, the commission differential is not inherently wrong. However, if you are consistently recommending higher-commission products over equally suitable lower-cost alternatives, it raises suitability concerns. The AMFI code expects you to prioritize the client\'s interest. A good practice is to present 2-3 suitable options and let the client choose. If asked about commission differences, disclose them honestly.',
          },
          {
            question: 'What is "churning" and how is it identified?',
            answer: 'Churning is the practice of frequently switching a client\'s investments between schemes primarily to earn fresh upfront commissions, without any genuine benefit to the client. AMFI and AMCs monitor for churning by tracking switch frequency, holding periods, and commission patterns. Red flags include: switches within 3-6 months, switches between similar scheme categories, and a pattern of always moving to schemes with higher upfront commissions. If identified, it can lead to ARN suspension and clawback of commissions.',
          },
        ],
        mcqs: [
          {
            question: 'A mutual fund distributor is prohibited from doing which of the following?',
            options: [
              'Disclosing commission earned to the investor upon request',
              'Recommending a scheme based on the client\'s risk profile and financial goals',
              'Rebating part of the commission back to the investor as a cashback or discount',
              'Maintaining written records of investment advice given to clients',
            ],
            correctAnswer: 2,
            explanation: 'Rebating commission back to investors — directly or indirectly through cashbacks, discounts, gifts, or any other incentive — is strictly prohibited under AMFI/SEBI guidelines. Options A, B, and D are all things distributors SHOULD do (disclosure, suitability-based recommendation, documentation). The commission rebating rule is one of the most frequently tested items in the NISM VA exam.',
          },
          {
            question: 'Before processing any mutual fund transaction, a distributor must ensure:',
            options: [
              'The client has a demat account',
              'The client\'s KYC (Know Your Customer) is completed',
              'The client has invested at least ₹5,000 previously',
              'The client has a relationship of at least 6 months with the distributor',
            ],
            correctAnswer: 1,
            explanation: 'KYC completion is mandatory before processing ANY mutual fund transaction. A demat account is NOT required for mutual fund investments (it is needed only for ETF trading). There is no minimum previous investment or relationship duration requirement. KYC — including PAN verification, address proof, and in-person verification or video KYC — must be completed first.',
          },
          {
            question: 'Which of the following actions by a distributor would constitute "churning"?',
            options: [
              'Recommending a SIP in a fund the client holds for 10 years',
              'Frequently switching a client between similar schemes to earn upfront commissions',
              'Suggesting a portfolio rebalance once a year based on market conditions',
              'Helping a client switch from a regular plan to a direct plan',
            ],
            correctAnswer: 1,
            explanation: 'Churning involves frequently switching a client between schemes — especially similar ones — primarily to earn fresh upfront commissions without genuine benefit to the client. A long-term SIP, annual rebalancing, and moving to a direct plan all have legitimate client benefits. Churning is identified by short holding periods, frequent switches, and a pattern of moving to higher-commission products.',
          },
          {
            question: 'A distributor tells a prospective client: "I personally guarantee that this fund will give you at least 12% annual returns." This statement is:',
            options: [
              'Acceptable if the fund has historically given 12% returns',
              'Acceptable if the distributor puts it in writing',
              'A violation of AMFI/SEBI code — distributors cannot guarantee returns',
              'Acceptable if the client signs a waiver acknowledging the guarantee',
            ],
            correctAnswer: 2,
            explanation: 'Guaranteeing or promising returns — in any form, verbal or written, regardless of past performance — is a strict violation of AMFI/SEBI code of conduct. No waiver or acknowledgement can make a return guarantee compliant. Even casual statements like "you will definitely get 12%" are violations. The exam tests this concept in various formats — the answer is always: return guarantees are prohibited.',
          },
        ],
        summaryNotes: [
          'Top 3 DON\'Ts: no return guarantees, no commission rebating, no portfolio churning — violation of any of these can cost you your ARN',
          'Top 3 DOs: complete KYC before every transaction, document all recommendations in writing, disclose commissions when asked',
          'Suitability is king: recommend based on client\'s risk profile, goals, and time horizon — not commission structures',
          'Written documentation is your armour: in any complaint, the distributor with records wins; the distributor without records loses',
          'Social media, WhatsApp, verbal conversations — ALL are subject to SEBI/AMFI code; there is no "off the record" in distribution',
        ],
        relatedTopics: ['advertisement-guidelines', 'investor-rights', 'sebi-regulations-overview'],
      },
    },

    // ─── Section 8: SEBI Circulars — Recent Important Changes ──────────
    {
      id: 'sebi-circulars-recent',
      title: 'SEBI Circulars — Recent Important Changes',
      slug: 'sebi-circulars-recent',
      content: {
        definition: 'SEBI circulars are regulatory directives issued by the Securities and Exchange Board of India that amend, clarify, or supplement the SEBI (Mutual Funds) Regulations, 1996. These circulars carry the same legal force as the parent regulations and must be complied with by all mutual funds, AMCs, trustees, and distributors. In recent years, SEBI has issued several landmark circulars that have fundamentally transformed the mutual fund industry — including TER (Total Expense Ratio) rationalization, risk-o-meter implementation, side-pocketing framework, mandatory nomination, pool account prohibition, and digital transaction facilitation. Understanding these recent circulars is critical for the NISM VA exam because questions frequently test knowledge of current regulatory changes.',
        explanation: 'Here is what I tell every new distributor: the 1996 Regulations are the constitution, but SEBI circulars are the living, breathing amendments that keep the industry current. In the last 5-7 years, the industry has undergone more regulatory changes than in the previous 20 years combined. Let me walk you through the most important ones. TER Rationalization (October 2018): SEBI slashed expense ratios based on AUM slabs — larger funds must charge lower TER. This was a game-changer for investors and a revenue hit for AMCs. For equity schemes, the maximum TER for the first ₹500 crore AUM is 2.25%, reducing to 1.05% for AUM above ₹50,000 crore. For debt schemes, corresponding limits are lower. Risk-o-meter (2021): Every scheme must display a risk-o-meter showing risk level from "Low" to "Very High" based on actual portfolio holdings — not just the scheme category. This is evaluated monthly. Side-pocketing: When a debt instrument in a fund\'s portfolio faces a credit event (default or downgrade below investment grade), the AMC can segregate it into a separate portfolio, protecting the remaining investors from the impact. Nomination became mandatory for all new individual folios from October 2023 — the investor must either nominate or explicitly opt out. Pool accounts were prohibited for distributors — client money must go directly from the investor\'s bank account to the AMC, with no intermediary pooling. And digital signatures, e-KYC, and online transactions have been officially recognized and encouraged by SEBI, making the industry more accessible.',
        realLifeExample: 'Let me show you how these circulars affect your daily work as a distributor. Anita, an MFD in Kolkata, has a client Rajiv who invested ₹20,00,000 in a credit risk fund in 2019. In 2020, one of the bonds in the fund — issued by a real estate company — defaulted. The AMC invoked side-pocketing. Here is what happened: Rajiv\'s holdings were split into two — the main portfolio (all healthy securities, worth about ₹17,50,000 at the time) and the segregated portfolio (the defaulted bond, book value ₹2,50,000 but market value near zero). Rajiv could freely redeem from the main portfolio but the segregated units were frozen. Anita explained: "Rajiv, think of it like a quarantine. The sick bond is isolated so it does not infect the rest of your portfolio. You can continue to use the main portfolio normally. If and when the real estate company repays even partially, you will receive your proportionate share from the segregated portfolio." Two years later, through NCLT proceedings, the company repaid 40 cents on the dollar. Rajiv received approximately ₹1,00,000 from the segregated portfolio — not a full recovery, but better than zero. Meanwhile, his main portfolio had grown to ₹21,00,000. Without side-pocketing, the entire fund NAV would have crashed by 12-15%, triggering panic redemptions and hurting ALL investors. The circular protected investors like Rajiv by containing the damage.',
        keyPoints: [
          'TER Rationalization (2018): expense ratios are now linked to AUM slabs — larger funds must charge lower TER; max 2.25% for equity (first ₹500 crore), reducing progressively',
          'Risk-o-meter (2021): schemes must display risk level (Low, Low to Moderate, Moderate, Moderately High, High, Very High) based on actual portfolio holdings, evaluated monthly',
          'Side-pocketing: allows AMCs to segregate defaulted/downgraded securities into a separate portfolio, protecting remaining investors from the credit event impact',
          'Mandatory Nomination (2023): all new individual mutual fund folios must have a nominee or a signed opt-out declaration',
          'Pool Account Prohibition: distributors cannot collect investor money in their own bank accounts — funds must flow directly from investor to AMC',
          'Digital Transactions: SEBI has officially recognized e-KYC, digital signatures, and online transactions, making the industry more accessible and efficient',
          'Exit Load Changes: SEBI has standardized exit load structures and mandated that exit load proceeds go to the scheme (benefiting remaining investors), not the AMC',
          'SEBI circulars are legally binding — non-compliance carries the same penalties as violating the parent regulations',
        ],
        faq: [
          {
            question: 'How does TER rationalization affect my commission as a distributor?',
            answer: 'TER rationalization means AMCs have less room to pay distributor commissions, especially for large-sized funds. The total expense ratio includes distributor commissions, so when TER is capped at lower levels, the commission pool shrinks. However, this has been partially offset by growth in AUM. As a distributor, focus on building a large book of business through SIPs and long-term client relationships rather than depending on high per-transaction commissions. Trail commissions on a growing AUM base remain the sustainable model.',
          },
          {
            question: 'What exactly does the risk-o-meter show and how often is it updated?',
            answer: 'The risk-o-meter displays the scheme\'s risk level on a scale of six categories: Low, Low to Moderate, Moderate, Moderately High, High, and Very High. Unlike the earlier static classification based on scheme category, the new risk-o-meter is based on the actual portfolio holdings and is evaluated monthly. If the risk level changes (e.g., from "High" to "Very High"), the AMC must inform all unitholders. This monthly evaluation was a 2021 SEBI circular mandate. It gives investors a realistic, current view of how risky their investment actually is.',
          },
          {
            question: 'When can an AMC invoke side-pocketing?',
            answer: 'Side-pocketing can be invoked when a debt or money market instrument in the scheme\'s portfolio faces a "credit event" — defined as a default on principal or interest payment, or a downgrade to below investment grade by a recognized rating agency. The AMC must get trustee approval and inform SEBI and all unitholders. Side-pocketing cannot be used for market losses or NAV declines — it is strictly for credit events. This was introduced to prevent a repeat of the 2018-19 credit crisis situations.',
          },
          {
            question: 'Why were pool accounts banned for mutual fund distributors?',
            answer: 'Pool accounts allowed distributors to collect money from multiple investors in their own bank account and then invest on their behalf. This created serious risks: (1) misuse of client funds, (2) delayed investments, (3) lack of audit trail, and (4) potential for fraud. SEBI banned pool accounts to ensure that money flows directly from the investor\'s bank account to the AMC — creating a clean, auditable trail. Now, all payments must be made through recognized payment modes (NACH, UPI, net banking, cheque) directly from the investor\'s registered bank account.',
          },
          {
            question: 'Is nomination really mandatory now? What if a client refuses?',
            answer: 'Since October 2023, every new individual mutual fund folio must have either a nominee or a signed declaration explicitly opting out of nomination. The investor must make an active choice — they cannot simply leave it blank. If a client refuses to nominate AND refuses to sign the opt-out declaration, the folio cannot be opened. As a distributor, you should explain to clients that nomination simplifies the claim process for legal heirs and strongly encourage them to nominate rather than opt out.',
          },
        ],
        mcqs: [
          {
            question: 'Under SEBI\'s TER rationalization, the Total Expense Ratio for equity schemes is linked to:',
            options: [
              'The number of unitholders in the scheme',
              'The age of the scheme since launch',
              'The AUM (Assets Under Management) of the scheme — with slabs',
              'The benchmark return of the scheme',
            ],
            correctAnswer: 2,
            explanation: 'SEBI\'s TER rationalization links the maximum allowable expense ratio to the AUM of the scheme through a slab structure. Larger funds must charge lower TER. For equity schemes, the maximum TER is 2.25% for the first ₹500 crore, reducing progressively to 1.05% for AUM above ₹50,000 crore. This ensures economies of scale benefit investors.',
          },
          {
            question: 'The risk-o-meter for mutual fund schemes is evaluated based on:',
            options: [
              'The scheme category alone (e.g., large-cap, mid-cap)',
              'The actual portfolio holdings, evaluated on a monthly basis',
              'The past 3-year return of the scheme',
              'The fund manager\'s subjective assessment of risk',
            ],
            correctAnswer: 1,
            explanation: 'The risk-o-meter is based on the actual portfolio holdings and is evaluated monthly — not based on scheme category alone or subjective assessment. If the underlying holdings change in a way that alters the risk profile (e.g., a balanced fund increases its equity allocation), the risk-o-meter must be updated and investors informed. This 2021 circular made risk disclosure dynamic and real.',
          },
          {
            question: 'Side-pocketing in a mutual fund scheme can be invoked when:',
            options: [
              'The NAV falls by more than 10% in a single day',
              'A debt instrument in the portfolio defaults or is downgraded below investment grade',
              'The stock market experiences a circuit breaker',
              'The fund manager wants to protect high-performing securities',
            ],
            correctAnswer: 1,
            explanation: 'Side-pocketing can only be invoked when there is a "credit event" — a default on payment (principal or interest) by a debt issuer or a downgrade of a debt instrument to below investment grade by a recognized rating agency. It cannot be used for general market declines, NAV drops, or to protect performing securities. The purpose is specifically to isolate credit-impaired instruments.',
          },
          {
            question: 'The prohibition of pool accounts for mutual fund distributors means:',
            options: [
              'Distributors cannot open bank accounts for their business',
              'Client investment money must flow directly from the investor\'s bank account to the AMC, not through the distributor\'s account',
              'Distributors cannot receive commissions in their bank accounts',
              'AMCs cannot maintain separate accounts for different schemes',
            ],
            correctAnswer: 1,
            explanation: 'Pool account prohibition means that investment money must flow directly from the investor\'s registered bank account to the AMC — the distributor cannot collect money in their own bank account and then forward it to the AMC. This prevents potential misuse, delays, and fraud. Distributors CAN still receive commissions in their bank accounts — the prohibition applies only to client investment money.',
          },
        ],
        summaryNotes: [
          'TER rationalization: AUM-linked slabs — larger funds charge less; max 2.25% (equity, first ₹500 crore), decreasing progressively',
          'Risk-o-meter: 6 levels (Low to Very High), based on actual portfolio holdings, evaluated monthly — dynamic, not static',
          'Side-pocketing: only for credit events (default/downgrade below investment grade), not for market losses — requires trustee approval',
          'Mandatory nomination since October 2023 — nominate or sign an explicit opt-out; cannot leave it blank',
          'Pool accounts banned: investor money must flow directly to AMC; distributor cannot act as intermediary for funds',
        ],
        relatedTopics: ['sebi-regulations-overview', 'investor-rights', 'nav-calculation'],
      },
    },
  ],
};
