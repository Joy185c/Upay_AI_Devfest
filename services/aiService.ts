// ImpactIQ AI Conversational & Insight Assistant Service

import { AIResponse } from '../types';

export class AIService {
  async ask(question: string): Promise<AIResponse> {
    const q = question.toLowerCase();

    if (q.includes('eid') || q.includes('work') || q.includes('কাজ করেছে')) {
      return {
        answerEn: 'Yes! The Eid Bill-Pay campaign generated ৳7.3M in true incremental revenue with an iROI of 192%. However, ৳720,000 was wasted paying "Sure Things" who would have transacted anyway.',
        answerBn: 'হ্যাঁ! ঈদ বিল পে ক্যাম্পেইনটি ১৯২% iROI সহ ৳৭.৩M প্রকৃত ইনক্রিমেন্টাল রাজস্ব এনেছে। তবে, ৳৭২০,০০০ অপচয় হয়েছে "Sure Things" গ্রাহকদের পেছনে যারা এমনিতেও বিল দিতেন।',
        citations: ['CMP-2026-EID-BILL', 'Uplift Segment: Sure Things', 'Holdout EXP-101'],
        suggestedActions: [
          { labelEn: 'Reallocate Budget to Persuadables', labelBn: 'Persuadables-এ বাজেট স্থানান্তর করুন', route: '/console/budget' },
          { labelEn: 'View Hero Impact Report', labelBn: 'ইমপ্যাক্ট রিপোর্ট দেখুন', route: '/console/campaigns/CMP-2026-EID-BILL' },
        ],
        miniChart: {
          type: 'bar',
          title: 'Gross vs True Incremental Revenue (BDT)',
          data: [
            { label: 'Gross Reported', value: 18.5 },
            { label: 'Organic Baseline', value: 11.2 },
            { label: 'True Incremental', value: 7.3 },
          ],
        },
      };
    } else if (q.includes('stop') || q.includes('segment') || q.includes('সেগমেন্ট')) {
      return {
        answerEn: 'You should immediately stop paying "Sure Things" (32% of users) and suppress "Sleeping Dogs" (8% of users). This will save ৳2.25M in subsidy waste and protect customer retention.',
        answerBn: 'আপনার অবিলম্বে "Sure Things" (৩২% গ্রাহক) কে ক্যাশব্যাক দেওয়া বন্ধ করা উচিত এবং "Sleeping Dogs" (৮% গ্রাহক) কে মেসেজ দেওয়া বন্ধ করা উচিত। এতে ৳২.২৫M অপচয় বাঁচবে।',
        citations: ['Uplift Explorer Quadrants', 'Abuse Guard CLUST-FARM-01'],
        suggestedActions: [
          { labelEn: 'Open Uplift Explorer', labelBn: 'আপলিফ্ট এক্সপ্লোরার খুলুন', route: '/console/uplift' },
        ],
      };
    } else if (q.includes('split') || q.includes('budget') || q.includes('বাজেট')) {
      return {
        answerEn: 'For a ৳5M total budget: Allocate ৳2.4M to Eid Bill-Pay (Persuadables), ৳1.6M to Add Money Bank Bonus, and ৳1.0M to Supermarket Pay weekend slots. Expected net incremental return: +৳18.8M (+236% iROI).',
        answerBn: '৳৫M মোট বাজেটের জন্য: ৳২.৪M ঈদ বিল-পে (Persuadables), ৳১.৬M অ্যাড মানি ব্যাংক বোনাস, এবং ৳১.০M সুপারমার্কেট পে উইকএন্ড স্লটে বরাদ্দ করুন। প্রত্যাশিত নিট ইনক্রিমেন্টাল রিটার্ন: +৳১৮.৮M (+২৩৬% iROI)।',
        citations: ['Budget Optimizer Algorithm v2', 'Diminishing Returns Curve'],
        suggestedActions: [
          { labelEn: 'Apply Budget Optimizer Settings', labelBn: 'বাজেট অপটিমাইজার সেটিংস প্রয়োগ করুন', route: '/console/budget' },
        ],
      };
    }

    // Default response
    return {
      answerEn: `ImpactIQ Causal Engine analyzed campaign metrics. True portfolio iROI across active campaigns stands at 164.5%. Recommending budget reallocation from organic buyers to persuadable segments.`,
      answerBn: `ইমপ্যাক্টআইকিউ কজ্যাল ইঞ্জিন ক্যাম্পেইন মেট্রিক্স বিশ্লেষণ করেছে। সক্রিয় ক্যাম্পেইনে পোর্টফোলিও iROI বর্তমানে ১৬৪.৫%। অর্গানিক ক্রেতাদের বাজেট Persuadable সেগমেন্টে স্থানান্তরের সুপারিশ করা হচ্ছে।`,
      citations: ['ImpactIQ Core Causal Model v4'],
      suggestedActions: [
        { labelEn: 'Explore What-If Simulator', labelBn: 'হোয়াট-ইফ সিমুলেটর ব্যবহার করুন', route: '/console/simulator' },
        { labelEn: 'Open Command Center', labelBn: 'কমান্ড সেন্টার খুলুন', route: '/console/command-center' },
      ],
    };
  }
}

export const aiService = new AIService();
