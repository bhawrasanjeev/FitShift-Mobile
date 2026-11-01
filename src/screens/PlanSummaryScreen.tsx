import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { usePlan } from '../context/PlanContext';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Header } from '../components/common/Header';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { borderRadius } from '../theme/borderRadius';

export interface PlanSummaryScreenProps {
  onResetPlan: () => void;
  onOpenShowcase?: () => void;
  onOpenApiConsole?: () => void;
}

export const PlanSummaryScreen: React.FC<PlanSummaryScreenProps> = ({
  onResetPlan,
  onOpenShowcase,
  onOpenApiConsole,
}) => {
  const { plan, resetPlan } = usePlan();

  if (!plan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Active Plan Found</Text>
        <Text style={styles.emptySubtitle}>
          Complete the onboarding questionnaire to generate your tailored Indian fitness routine.
        </Text>
        <Button
          title="Create My Plan"
          variant="primary"
          size="md"
          onPress={onResetPlan}
          style={styles.emptyButton}
        />
      </View>
    );
  }

  const { userProfile, nutrition, diet, workout } = plan;

  const handleResetConfirm = () => {
    Alert.alert(
      'Reset Active Plan?',
      'This will delete your saved FitShift routine and return to the welcome screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset Plan',
          style: 'destructive',
          onPress: async () => {
            await resetPlan();
            onResetPlan();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.screen}>
      <Header
        showBrand={true}
        rightAction={
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleResetConfirm}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>🔄 Reset</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Plan Header Banner */}
        <View style={styles.bannerCard}>
          <View style={styles.bannerHeader}>
            <View>
              <Text style={styles.bannerGreeting}>
                Welcome back, {userProfile.personal.name || 'FitShift Member'}!
              </Text>
              <Text style={styles.bannerSubtitle}>
                Your custom routine is generated and active.
              </Text>
            </View>
            <Badge
              label={userProfile.personal.goal.replace('_', ' ').toUpperCase()}
              variant="accent"
              size="sm"
            />
          </View>

          <View style={styles.bannerTags}>
            <Badge
              label={userProfile.training.environment === 'home' ? '🏠 Home Workouts' : '🏋️ Commercial Gym'}
              variant="neutral"
              size="sm"
            />
            <Badge
              label={`💰 ₹${userProfile.budget.dailyBudgetRupees}/day budget`}
              variant="neutral"
              size="sm"
            />
            <Badge
              label={`🥗 ${userProfile.food.dietType.replace('_', ' ')}`}
              variant="neutral"
              size="sm"
            />
          </View>
        </View>

        {/* Nutrition Target Highlights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>DAILY NUTRITION TARGETS</Text>
          <View style={styles.macroGrid}>
            <View style={styles.macroCard}>
              <Text style={styles.macroLabel}>CALORIE TARGET</Text>
              <Text style={styles.macroValue}>{nutrition.calorieTarget}</Text>
              <Text style={styles.macroUnit}>kcal / day</Text>
            </View>

            <View style={[styles.macroCard, styles.macroCardProtein]}>
              <Text style={styles.macroLabelProtein}>DAILY PROTEIN</Text>
              <Text style={styles.macroValueProtein}>{nutrition.proteinTargetGrams}g</Text>
              <Text style={styles.macroUnitProtein}>minimum target</Text>
            </View>
          </View>

          <View style={styles.energyRow}>
            <View style={styles.energyItem}>
              <Text style={styles.energyLabel}>Basal Metabolic Rate (BMR)</Text>
              <Text style={styles.energyValue}>{nutrition.bmr} kcal</Text>
            </View>
            <View style={styles.energyDivider} />
            <View style={styles.energyItem}>
              <Text style={styles.energyLabel}>Total Daily Energy (TDEE)</Text>
              <Text style={styles.energyValue}>{nutrition.tdee} kcal</Text>
            </View>
          </View>
        </View>

        {/* Indian Grocery Optimization Card */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>INDIAN DIET OPTIMIZATION</Text>
          <View style={styles.dietCard}>
            <View style={styles.dietHeader}>
              <View>
                <Text style={styles.dietTitle}>Knapsack Budget Feasibility</Text>
                <Text style={styles.dietSubtitle}>
                  Daily spend: ₹{diet.budget?.estimatedCost ?? 65} / ₹{userProfile.budget.dailyBudgetRupees} limit
                </Text>
              </View>
              <Badge
                label={diet.feasible ? '✓ Budget Feasible' : 'Exceeds Target'}
                variant={diet.feasible ? 'accent' : 'warning'}
                size="sm"
              />
            </View>

            <View style={styles.soyaNotice}>
              <Text style={styles.soyaIcon}>🛡️</Text>
              <Text style={styles.soyaText}>
                50g daily soya chunks cap strictly respected for safe phytoestrogen and digestive balance.
              </Text>
            </View>

            <View style={styles.mealsCountRow}>
              <Text style={styles.mealsCountLabel}>Generated Indian Courses:</Text>
              <Text style={styles.mealsCountValue}>
                {diet.meals?.length || userProfile.food.mealsPerDay} meals planned
              </Text>
            </View>
          </View>
        </View>

        {/* 7-Day Workout Routine */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7-DAY WORKOUT SPLIT</Text>
          <View style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <View>
                <Text style={styles.workoutTitle}>
                  {workout.weeklyFrequencyDays}-Day {workout.environment === 'home' ? 'Home Calisthenics' : 'Gym'} Split
                </Text>
                <Text style={styles.workoutSubtitle}>
                  {userProfile.training.durationMinutes} mins • {userProfile.training.weeklyFrequencyDays} days / week
                </Text>
              </View>
              <Badge
                label={userProfile.training.experienceLevel.toUpperCase()}
                variant="accent"
                size="sm"
              />
            </View>

            <View style={styles.daysList}>
              {workout.days?.slice(0, 7).map((d) => (
                <View key={d.dayNumber} style={styles.dayItem}>
                  <View style={styles.dayBadge}>
                    <Text style={styles.dayBadgeText}>{d.dayName.slice(0, 3)}</Text>
                  </View>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayFocus}>{d.focus}</Text>
                    <Text style={styles.dayExercisesCount}>
                      {d.isRestDay ? 'Rest & Muscle Recovery' : `${d.exercises?.length || 0} exercises planned`}
                    </Text>
                  </View>
                  <Badge
                    label={d.isRestDay ? 'Rest' : 'Active'}
                    variant={d.isRestDay ? 'neutral' : 'accent'}
                    size="sm"
                  />
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Quick Developer Audit Shortcuts */}
        <View style={styles.devSection}>
          <Text style={styles.devHeader}>DEVELOPER AUDIT TOOLS</Text>
          <View style={styles.devButtonsRow}>
            {onOpenShowcase ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onOpenShowcase}
                style={styles.devButton}
              >
                <Text style={styles.devButtonText}>🎨 Design Showcase</Text>
              </TouchableOpacity>
            ) : null}

            {onOpenApiConsole ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onOpenApiConsole}
                style={styles.devButton}
              >
                <Text style={styles.devButtonText}>🔌 API Console</Text>
              </TouchableOpacity>
            ) : null}
          </View>
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
  emptyContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  emptySubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  emptyButton: {
    minWidth: 180,
  },
  resetButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
    borderWidth: 1,
  },
  resetButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 11,
  },
  bannerCard: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  bannerGreeting: {
    ...typography.body,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  bannerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  bannerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
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
  macroGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  macroCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    alignItems: 'center',
    gap: 2,
  },
  macroCardProtein: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
  },
  macroLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  macroLabelProtein: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  macroValue: {
    ...typography.h1,
    color: colors.textPrimary,
  },
  macroValueProtein: {
    ...typography.h1,
    color: colors.primaryDark,
  },
  macroUnit: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  macroUnitProtein: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 10,
  },
  energyRow: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  energyItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  energyDivider: {
    width: 1,
    backgroundColor: colors.borderSubtle,
  },
  energyLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  energyValue: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dietCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dietHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dietTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dietSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  soyaNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  soyaIcon: {
    fontSize: 14,
  },
  soyaText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  mealsCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
  },
  mealsCountLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  mealsCountValue: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  workoutCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  workoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  workoutTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  workoutSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  daysList: {
    gap: spacing.xs,
  },
  dayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  dayBadge: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayBadgeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  dayInfo: {
    flex: 1,
    gap: 2,
  },
  dayFocus: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dayExercisesCount: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  devSection: {
    gap: spacing.xs,
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
  },
  devHeader: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    fontSize: 10,
    textAlign: 'center',
  },
  devButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxs,
  },
  devButton: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  devButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 11,
  },
});
