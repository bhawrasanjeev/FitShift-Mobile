import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { NutritionPlanData, DietPlanData } from '../../types';
import { Badge } from '../common/Badge';
import { StatCard } from '../fitness/StatCard';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface MealNutritionCardProps {
  nutrition: NutritionPlanData;
  diet: DietPlanData;
  dietType: string;
  dailyBudgetLimit: number;
  style?: ViewStyle;
}

export const MealNutritionCard: React.FC<MealNutritionCardProps> = ({
  nutrition,
  diet,
  dietType,
  dailyBudgetLimit,
  style,
}) => {
  const dailySpend = diet.budget?.estimatedCost || dailyBudgetLimit;
  const remainingBudget = Math.max(0, dailyBudgetLimit - dailySpend);
  const normalizedDietType = dietType.replace(/_/g, ' ').toUpperCase();

  return (
    <View style={[styles.container, style]}>
      {/* Target Macros Grid */}
      <View style={styles.statsRow}>
        <StatCard
          title="Planned Calorie Target"
          value={nutrition.calorieTarget}
          unit="kcal / day"
          icon={<Icon name="fire" size={18} color={colors.primary} />}
          style={styles.statCard}
        />
        <StatCard
          title="Daily Protein Minimum"
          value={diet.protein.achievedGrams}
          unit={`/ ${diet.protein.targetGrams}g target`}
          icon={<Icon name="activity" size={18} color={colors.primary} />}
          style={styles.statCard}
        />
      </View>

      {/* Planning Philosophy Banner */}
      <View style={styles.philosophyBanner}>
        <View style={styles.philosophyHeader}>
          <Text style={styles.philosophyTag}>FOOD-FIRST INDIAN NUTRITION</Text>
          <Badge
            label={diet.feasible ? 'Budget Feasible' : 'Exceeds Limit'}
            variant={diet.feasible ? 'accent' : 'warning'}
            size="sm"
          />
        </View>

        <View style={styles.budgetRow}>
          <View>
            <Text style={styles.budgetAmount}>
              ₹{dailySpend}
              <Text style={styles.budgetLimit}> / ₹{dailyBudgetLimit} daily budget</Text>
            </Text>
            <Text style={styles.budgetSub}>
              ₹{remainingBudget} remaining • ~₹{dailySpend * 7} projected / week
            </Text>
          </View>

          <View style={styles.dietTypeBadge}>
            <Text style={styles.dietTypeText}>{normalizedDietType}</Text>
          </View>
        </View>

        {/* Honest Planning Notice */}
        {!diet.feasible && (
          <View style={styles.warningBanner}>
            <Icon name="alert" size={16} color={colors.warning} />
            <Text style={styles.warningText}>
              {diet.reason ||
                `Daily protein target (${diet.protein.targetGrams}g) requires ₹${dailySpend}/day with current whole-food staples. Consider a slightly higher budget tier.`}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  statIcon: {
    fontSize: 18,
  },
  philosophyBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  philosophyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  philosophyTag: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.6,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  budgetAmount: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  budgetLimit: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '500',
  },
  budgetSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  dietTypeBadge: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  dietTypeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 10,
  },
  guardrailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  guardrailIcon: {
    fontSize: 13,
    marginTop: 1,
  },
  guardrailText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  boldText: {
    fontWeight: '700',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
    borderWidth: 1,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  warningIcon: {
    fontSize: 13,
    marginTop: 1,
  },
  warningText: {
    ...typography.caption,
    color: '#92400E',
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
});

export default MealNutritionCard;
