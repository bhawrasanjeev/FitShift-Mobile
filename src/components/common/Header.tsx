import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { Badge } from './Badge';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBrand?: boolean;
  rightAction?: React.ReactNode;
  onPressBrand?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBrand = true,
  rightAction,
  onPressBrand,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, spacing.md) }]}>
      {showBrand ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressBrand}
          disabled={!onPressBrand}
          style={styles.brandRow}
        >
          {/* FitShift Emerald Dumbbell Logo Pill */}
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🏋️</Text>
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>FitShift</Text>
              <Badge label="Engine" variant="accent" size="sm" />
            </View>
            <Text style={styles.brandSubtitle}>Routine-first, budget-realistic</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View>
          {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
          {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
        </View>
      )}

      {rightAction ? <View style={styles.rightAction}>{rightAction}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  logoIcon: {
    fontSize: 18,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontSize: 10,
    color: colors.textMuted,
  },
  pageTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  pageSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  rightAction: {
    marginLeft: spacing.md,
  },
});

export default Header;
