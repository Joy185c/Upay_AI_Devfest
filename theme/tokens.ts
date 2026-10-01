// ImpactIQ - UPAY Brand Design Tokens
// Sampled from upay reference designs with brand swap support.

export const themeTokens = {
  brand: {
    primary: '#0B4DA2', // upay Deep Blue
    primaryDark: '#07326B',
    primaryLight: '#3B79D1',
    yellow: '#FFD500', // upay Yellow
    yellowHover: '#E6C000',
    yellowLight: '#FFF9CC',
    accent: '#00A859',
  },
  colors: {
    surface: '#FFFFFF',
    surfaceAlt: '#F7FAFC',
    creamBg: '#FFFDF0', // upay signature warm cream background
    greyBg: '#F2F4F7',
    border: '#E2E8F0',
    borderDark: '#CBD5E0',
    
    textPrimary: '#111827',
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textLight: '#F9FAFB',
    textBlue: '#0B4DA2',

    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    danger: '#EF4444',
    dangerLight: '#FEE2E2',
    info: '#3B82F6',
    infoLight: '#DBEAFE',

    // Console theme specific
    consoleBg: '#0F172A',
    consoleCard: '#1E293B',
    consoleBorder: '#334155',
  },
  wallets: {
    primary: '#EBF4FF',      // Light blue
    disbursement: '#FFF0EB', // Light peach
    secondary: '#F5EEFC',    // Light lavender
    remittance: '#EAF8F2',   // Light green
    cashReward: '#FFF8CE',   // Soft yellow-cream
  },
  radius: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#0B4DA2',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
  }
};

export type ThemeTokens = typeof themeTokens;
