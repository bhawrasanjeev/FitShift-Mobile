import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { Logo } from './Logo';
import { Icon } from './Icon';

export interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBrand?: boolean;
  rightAction?: React.ReactNode;
  onPressBrand?: () => void;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBrand = true,
  rightAction,
  onPressBrand,
  onBack,
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
          {/* Official FitShift App Logo */}
          <View style={styles.logoWrap}>
            <Logo size={36} />
          </View>
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.brandTitle}>FitShift</Text>
            </View>
            <Text style={styles.brandSubtitle}>Routine-first • Indian nutrition</Text>
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.titleArea}>
          {onBack ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onBack}
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <Icon name="arrow-left" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          ) : null}
          <View style={styles.titleCol}>
            {title ? <Text style={styles.pageTitle}>{title}</Text> : null}
            {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
          </View>
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
  logoWrap: {
    marginRight: spacing.sm,
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
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  titleCol: {
    flex: 1,
  },
  rightAction: {
    marginLeft: spacing.md,
  },
});

export default Header;
