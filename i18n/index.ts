// i18n Localization Engine for ImpactIQ - UPAY (Bangla & English)

export type Language = 'bn' | 'en';

export const bengaliDigits: { [key: string]: string } = {
  '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
  '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
};

export function toBanglaDigits(num: number | string): string {
  const str = num.toString();
  return str.replace(/[0-9]/g, (digit) => bengaliDigits[digit] || digit);
}

export function formatCurrency(amount: number, lang: Language = 'bn'): string {
  const formattedNum = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(amount);

  if (lang === 'bn') {
    return `৳${toBanglaDigits(formattedNum)}`;
  }
  return `৳${formattedNum}`;
}

export const translations = {
  bn: {
    // Brand & Legal
    appName: 'ইমপ্যাক্টআইকিউ - উপায়',
    tagline: 'ইমপ্যাক্টের জন্য অর্থ প্রদান করুন, শোরগোলের জন্য নয়',
    disclaimer: 'ইমপ্যাক্টআইকিউ - উপায় | এআই হ্যাকাথন প্রোটোটাইপ | কোনো অফিশিয়াল উপায় প্রোডাক্ট নয়',

    // Nav & Common
    home: 'হোম',
    account: 'অ্যাকাউন্ট',
    history: 'হিস্টরি',
    more: 'আরো',
    qrScan: 'কিউআর স্ক্যান',
    balance: 'ব্যালেন্স',
    tapForBalance: 'ব্যালেন্স দেখতে ট্যাপ করুন',
    back: 'ফিরে যান',
    confirm: 'নিশ্চিত করুন',
    cancel: 'বাতিল',
    enterPinPrompt: 'আপনার ৪ ডিজিটের পিন প্রদান করুন',
    biometricLogin: 'ফিঙ্গারপ্রিন্ট/ফেস আইডি',
    forgotPin: 'পিন ভুলে গিয়েছেন?',
    whyThisOffer: 'কেন এই অফার?',

    // Services Grid
    sendMoney: 'সেন্ড মানি',
    mobileRecharge: 'মোবাইল রিচার্জ',
    cashOut: 'ক্যাশ আউট',
    makePayment: 'মেক পেমেন্ট',
    payBill: 'পে বিল',
    addMoney: 'অ্যাড মানি',
    savings: 'সঞ্চয়',
    fundTransfer: 'ফান্ড ট্রান্সফার',
    requestMoney: 'রিকোয়েস্ট মানি',
    referEarn: 'রেফার & আর্ন',
    npsb: 'এনপিএসবি',
    upayPayments: 'উপায় পেমেন্ট',
    upayCard: 'উপায় কার্ড',
    upayOffer: 'উপায় অফার',
    upayWheel: 'উপায় চাকা',
    serviceLocator: 'সার্ভিস লোকেটর',

    // Wallet Titles
    primaryWallet: 'প্রাইমারি',
    disbursementWallet: 'ডিসবার্সমেন্ট',
    secondaryWallet: 'সেকেন্ডারি',
    remittanceWallet: 'রেমিট্যান্স',
    cashReward: 'ক্যাশ রিওয়ার্ড',
    cashRewardDesc: 'এই ব্যালেন্স মোবাইল রিচার্জ, মেক পেমেন্ট ও পে বিলে ব্যবহার করা যাবে।',

    // History
    statementTab: 'লেনদেন বিবরণী',
    summaryTab: 'লেনদেন সারসংক্ষেপ',
    all: 'সব',
    charge: 'চার্জ',

    // Settings
    settings: 'সেটিংস',
    changePin: 'পিন পরিবর্তন',
    changeLanguage: 'ভাষা পরিবর্তন',
    changePermissions: 'পারমিশন পরিবর্তন',
    support: 'উপায় সাপোর্ট',
    support24x7: '২৪x৭ সেবা',
    faq: 'বহুল জিজ্ঞাসিত প্রশ্ন',
    accountServices: 'অ্যাকাউন্ট সার্ভিস',
    mnpUpdate: 'এমএনপি তথ্য আপডেট',
    biometricsToggle: 'ফিঙ্গারপ্রিন্ট/ফেস আইডি বন্ধ করুন',
    privacySection: 'ইমপ্যাক্টআইকিউ অফার ও গোপনীয়তা',
    privacyToggle: 'ব্যক্তিগত অফার কাস্টমাইজেশন অনুমতি',

    // Console
    consoleTitle: 'ইমপ্যাক্টআইকিউ কমান্ড সেন্টার',
    campaigns: 'ক্যাম্পেইনসমূহ',
    experiments: 'এক্সপেরিমেন্ট',
    upliftExplorer: 'আপলিফ্ট মডেল এক্সপ্লোরার',
    simulator: 'হোয়াট-ইফ সিমুলেটর',
    budgetOptimizer: 'বাজেট অপটিমাইজার',
    abuseGuard: 'প্রোমো অ্যাবিউজ গার্ড',
    aiAssistant: 'ইমপ্যাক্টআইকিউ এআই',
    merchantPortal: 'মার্চেন্ট পোর্টাল',
    adminView: 'এডমিন ভিউ',
  },
  en: {
    // Brand & Legal
    appName: 'ImpactIQ - UPAY',
    tagline: 'Pay for impact, not for noise.',
    disclaimer: 'ImpactIQ - UPAY | AI Hackathon Prototype | Not an official upay product',

    // Nav & Common
    home: 'Home',
    account: 'Account',
    history: 'History',
    more: 'More',
    qrScan: 'QR Scan',
    balance: 'Balance',
    tapForBalance: 'Tap to reveal balance',
    back: 'Back',
    confirm: 'Confirm',
    cancel: 'Cancel',
    enterPinPrompt: 'Enter your 4-digit PIN',
    biometricLogin: 'Fingerprint / Face ID',
    forgotPin: 'Forgot PIN?',
    whyThisOffer: 'Why this offer?',

    // Services Grid
    sendMoney: 'Send Money',
    mobileRecharge: 'Mobile Recharge',
    cashOut: 'Cash Out',
    makePayment: 'Make Payment',
    payBill: 'Pay Bill',
    addMoney: 'Add Money',
    savings: 'Savings',
    fundTransfer: 'Fund Transfer',
    requestMoney: 'Request Money',
    referEarn: 'Refer & Earn',
    npsb: 'NPSB',
    upayPayments: 'upay Payments',
    upayCard: 'upay Card',
    upayOffer: 'upay Offer',
    upayWheel: 'upay Wheel',
    serviceLocator: 'Service Locator',

    // Wallet Titles
    primaryWallet: 'Primary',
    disbursementWallet: 'Disbursement',
    secondaryWallet: 'Secondary',
    remittanceWallet: 'Remittance',
    cashReward: 'Cash Reward',
    cashRewardDesc: 'This balance can be used for Mobile Recharge, Make Payment, and Pay Bill.',

    // History
    statementTab: 'Transaction Statement',
    summaryTab: 'Transaction Summary',
    all: 'All',
    charge: 'Charge',

    // Settings
    settings: 'Settings',
    changePin: 'Change PIN',
    changeLanguage: 'Change Language',
    changePermissions: 'Change Permission',
    support: 'upay Support',
    support24x7: '24x7 Support',
    faq: 'FAQ',
    accountServices: 'Account Services',
    mnpUpdate: 'MNP Info Update',
    biometricsToggle: 'Turn off Biometrics',
    privacySection: 'ImpactIQ Offer & Privacy',
    privacyToggle: 'Personalized Offer Consent',

    // Console
    consoleTitle: 'ImpactIQ Command Center',
    campaigns: 'Campaigns',
    experiments: 'Experiments',
    upliftExplorer: 'Uplift Explorer',
    simulator: 'What-If Simulator',
    budgetOptimizer: 'Budget Optimizer',
    abuseGuard: 'Abuse Guard',
    aiAssistant: 'ImpactIQ AI',
    merchantPortal: 'Merchant Portal',
    adminView: 'Admin View',
  },
};
