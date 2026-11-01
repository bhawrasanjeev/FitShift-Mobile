// FitShift Mobile Design System - Color Palette
// Derived from the verified FitShift Web Client design tokens

export const colors = {
  // Brand Green (Emerald)
  primary: '#15803D',
  primaryDark: '#166534',
  primaryLight: '#ECFDF5',
  primaryMuted: '#059669',
  accent: '#15803D',
  accentBorder: '#A7F3D0',
  accentDark: '#047857',

  // Surfaces & Backgrounds
  background: '#FAFAFA',
  backgroundSecondary: '#F4F4F6',
  surface: '#FFFFFF',
  surfaceSubtle: '#F4F4F6',
  surfaceCard: '#FFFFFF',

  // Dividers & Borders
  border: '#E5E7EB',
  borderSubtle: '#F3F4F6',
  borderStrong: '#D1D5DB',

  // Typography
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textInverse: '#FFFFFF',
  textAccent: '#15803D',

  // Functional / Status
  success: '#10B981',
  successLight: '#ECFDF5',
  warning: '#F59E0B',
  warningLight: '#FFFBEB',
  danger: '#EF4444',
  dangerLight: '#FEF2F2',
  info: '#3B82F6',
  infoLight: '#EFF6FF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.45)',
  backdropBlur: 'rgba(250, 250, 250, 0.85)',
} as const;

export type ColorToken = keyof typeof colors;
