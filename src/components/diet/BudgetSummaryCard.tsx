import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Badge } from '../common/Badge';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface BudgetSummaryCardProps {
  dailySpend: number;
  dailyLimit: number;
  weeklySpend: number;
  feasible?: boolean;
  totalItemsCount?: number;
  style?: ViewStyle;
}

export const BudgetSummaryCard: React.FC<BudgetSummaryCardProps> = ({
  dailySpend,
  dailyLimit,
  weeklySpend,
  feasible = true,
  totalItemsCount,
  style,
}) => {
  const remaining = Math.max(0, dailyLimit - dailySpend);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={styles.cardTag}>GROCERY & BUDGET ECONOMICS</Text>
        <Badge
          label={feasible ? 'Budget Feasible' : 'Exceeds'}
          variant={feasible ? 'accent' : 'warning'}
          size="sm"
        />
      </View>

      <View style={styles.spendGrid}>
        <View style={styles.spendCol}>
          <Text style={styles.spendLabel}>EST. WEEKLY SPEND</Text>
          <Text style={styles.weeklyValue}>₹{weeklySpend}</Text>
          <Text style={styles.spendSub}>For 7 full days</Text>
        </View>

        <View style={styles.vDivider} />

        <View style={styles.spendCol}>
          <Text style={styles.spendLabel}>DAILY FOOD BUDGET</Text>
          <Text style={styles.dailyValue}>
            ₹{dailySpend} <Text style={styles.dailyLimit}>/ ₹{dailyLimit}</Text>
          </Text>
          <Text style={styles.spendSub}>
            {remaining > 0 ? `₹${remaining} margin left` : 'Budget optimized'}
          </Text>
        </View>
      </View>

      {totalItemsCount !== undefined ? (
        <View style={styles.bottomRow}>
          <Text style={styles.itemsCountText}>
            Consolidating {totalItemsCount} whole-food ingredients directly from your plan.
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTag: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  spendGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  spendCol: {
    flex: 1,
    gap: 2,
  },
  spendLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  weeklyValue: {
    ...typography.h3,
    color: colors.primaryDark,
  },
  dailyValue: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  dailyLimit: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
  },
  spendSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  vDivider: {
    width: 1,
    height: 36,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.sm,
  },
  bottomRow: {
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  itemsCountText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});

export default BudgetSummaryCard;
