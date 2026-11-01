// FitShift Mobile Typography System
import { TextStyle } from 'react-native';

const sizes = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 28,
  '4xl': 34,
} as const;

const lineHeights = {
  xs: 15,
  sm: 18,
  base: 22,
  md: 24,
  lg: 26,
  xl: 28,
  '2xl': 32,
  '3xl': 36,
  '4xl': 42,
} as const;

const weights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

export const typography = {
  // Raw Tokens
  sizes,
  lineHeights,
  weights,

  // Semantic Presets
  h1: {
    fontSize: sizes['3xl'],
    lineHeight: lineHeights['3xl'],
    fontWeight: weights.extrabold,
  } as TextStyle,

  h2: {
    fontSize: sizes['2xl'],
    lineHeight: lineHeights['2xl'],
    fontWeight: weights.bold,
  } as TextStyle,

  h3: {
    fontSize: sizes.lg,
    lineHeight: lineHeights.lg,
    fontWeight: weights.bold,
  } as TextStyle,

  body: {
    fontSize: sizes.base,
    lineHeight: lineHeights.base,
    fontWeight: weights.regular,
  } as TextStyle,

  bodySmall: {
    fontSize: sizes.sm,
    lineHeight: lineHeights.sm,
    fontWeight: weights.medium,
  } as TextStyle,

  caption: {
    fontSize: sizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: weights.regular,
  } as TextStyle,

  label: {
    fontSize: sizes.xs,
    lineHeight: lineHeights.xs,
    fontWeight: weights.bold,
    letterSpacing: 0.5,
  } as TextStyle,
} as const;
