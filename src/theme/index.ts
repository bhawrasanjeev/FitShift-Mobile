export * from './colors';
export * from './spacing';
export * from './typography';
export * from './borderRadius';
export * from './shadows';

import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';

export const theme = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
} as const;

export type Theme = typeof theme;
