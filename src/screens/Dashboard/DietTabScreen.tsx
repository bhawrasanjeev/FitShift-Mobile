import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { MealCard } from '../../components/fitness/MealCard';
import { StatCard } from '../../components/fitness/StatCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export const DietTabScreen: React.FC = () => {
  const { plan, userProfile } = usePlan();

  if (!plan) {
    return (
      <View style={styles.screen}>
        <Header title="Indian Diet Blueprint" showBrand={false} />
        <View style={[styles.budgetBanner, { margin: spacing.lg }]}>
          <Text style={styles.budgetAmount}>No Diet Plan Active</Text>
          <Text style={styles.budgetLimit}>
            Complete onboarding to calculate your calorie target and optimize Indian staples.
          </Text>
        </View>
      </View>
    );
  }
  const { nutrition, diet } = plan;

  return (
    <View style={styles.screen}>
      <Header
        title="Indian Diet Blueprint"
        subtitle={`${userProfile.food.dietType.replace('_', ' ').toUpperCase()} • ₹${userProfile.budget.dailyBudgetRupees}/day limit`}
        showBrand={false}
        rightAction={
          <Badge
            label={diet.feasible ? '✓ Feasible' : 'Exceeds'}
            variant={diet.feasible ? 'accent' : 'warning'}
            size="sm"
          />
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Nutrition Target Highlights */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Daily Target"
            value={nutrition.calorieTarget}
            unit="kcal / day"
            icon={<Text style={{ fontSize: 18 }}>🔥</Text>}
            style={styles.statCard}
          />
          <StatCard
            title="Daily Protein"
            value={nutrition.proteinTargetGrams}
            unit="g target"
            icon={<Text style={{ fontSize: 18 }}>💪</Text>}
            style={styles.statCard}
          />
        </View>

        {/* Budget Economics Banner */}
        <View style={styles.budgetBanner}>
          <View style={styles.budgetHeader}>
            <View>
              <Text style={styles.budgetTag}>0/1 KNAPSACK OPTIMIZATION</Text>
              <Text style={styles.budgetAmount}>
                ₹{diet.budget?.estimatedCost || userProfile.budget.dailyBudgetRupees}
                <Text style={styles.budgetLimit}> / ₹{userProfile.budget.dailyBudgetRupees} daily budget</Text>
              </Text>
            </View>
            <Badge
              label={`~₹${(diet.budget?.estimatedCost || userProfile.budget.dailyBudgetRupees) * 7}/wk`}
              variant="neutral"
              size="sm"
            />
          </View>

          <View style={styles.soyaNoticeRow}>
            <Text style={styles.soyaNoticeIcon}>🛡️</Text>
            <Text style={styles.soyaNoticeText}>
              50g daily soya chunks cap strictly respected for safe phytoestrogen and digestive balance.
            </Text>
          </View>
        </View>

        {/* Allocated Indian Whole Foods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ALLOCATED STAPLES ({diet.foods?.length || 0})</Text>
          <View style={styles.staplesList}>
            {diet.foods?.map((food, idx) => (
              <View key={`${food.name}-${idx}`} style={styles.stapleItem}>
                <View style={styles.stapleInfo}>
                  <Text style={styles.stapleType}>
                    {food.isSupplement ? 'SUPPLEMENT' : 'WHOLE FOOD'}
                  </Text>
                  <Text style={styles.stapleName}>{food.name}</Text>
                  <Text style={styles.stapleQty}>{food.quantityGrams}g allocated</Text>
                </View>
                <View style={styles.stapleMetrics}>
                  <Text style={styles.stapleProtein}>{food.proteinGrams}g Pro</Text>
                  <Text style={styles.stapleCost}>~₹{food.estimatedCost}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Planned Meal Courses */}
        {diet.meals && diet.meals.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PLANNED MEAL COURSES ({diet.meals.length})</Text>
            <View style={styles.mealsList}>
              {diet.meals.map((meal) => (
                <MealCard key={meal.id} meal={meal} style={styles.mealCard} />
              ))}
            </View>
          </View>
        ) : null}

        {/* Phase 7 Milestone Callout */}
        <View style={styles.phaseNoticeBox}>
          <Text style={styles.phaseNoticeIcon}>ℹ️</Text>
          <Text style={styles.phaseNoticeText}>
            <Text style={{ fontWeight: '700' }}>Phase 7 Diet & Grocery Module: </Text>
            Interactive meal alternative swapping, 7-day meal plan variations, consolidated grocery shopping list, and supplement economics table will activate in Phase 7.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  budgetBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  budgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  budgetTag: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  budgetAmount: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  budgetLimit: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
  },
  soyaNoticeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  soyaNoticeIcon: {
    fontSize: 14,
  },
  soyaNoticeText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  staplesList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.xs,
  },
  stapleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  stapleInfo: {
    flex: 1,
    gap: 2,
  },
  stapleType: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  stapleName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stapleQty: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  stapleMetrics: {
    alignItems: 'flex-end',
    gap: 2,
  },
  stapleProtein: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 12,
  },
  stapleCost: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  mealsList: {
    gap: spacing.md,
  },
  mealCard: {
    marginBottom: spacing.xs,
  },
  phaseNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  phaseNoticeIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  phaseNoticeText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
    fontSize: 11,
  },
});
