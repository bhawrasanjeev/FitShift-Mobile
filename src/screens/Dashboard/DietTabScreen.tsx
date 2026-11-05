import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { PlannedMeal, MealAlternative } from '../../types';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Icon } from '../../components/common/Icon';
import { MealCard } from '../../components/diet/MealCard';
import { MealDetailsModal } from '../../components/diet/MealDetailsModal';
import { MealAlternativesModal } from '../../components/diet/MealAlternativesModal';
import { MealNutritionCard } from '../../components/diet/MealNutritionCard';
import { FoodItemRow } from '../../components/diet/FoodItemRow';
import { GroceryScreen } from './GroceryScreen';
import { SupplementsScreen } from './SupplementsScreen';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export type DietSubView = 'meals' | 'grocery' | 'supplements';

export const DietTabScreen: React.FC = () => {
  const { plan, userProfile, swapMeal } = usePlan();
  const [activeSubView, setActiveSubView] = useState<DietSubView>('meals');
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [detailMeal, setDetailMeal] = useState<PlannedMeal | null>(null);
  const [swapTargetMeal, setSwapTargetMeal] = useState<PlannedMeal | null>(null);

  if (!plan) {
    return (
      <View style={styles.screen}>
        <Header title="Indian Diet Blueprint" showBrand={false} />
        <View style={styles.emptyContainer}>
          <Icon name="utensils" size={40} color={colors.primary} />
          <Text style={styles.emptyTitle}>No Diet Plan Active</Text>
          <Text style={styles.emptySub}>
            Complete onboarding to calculate your calorie target and optimize Indian staples.
          </Text>
        </View>
      </View>
    );
  }

  const { nutrition, diet } = plan;
  const meals = diet.meals || [];
  const sevenDayPlan = diet.sevenDayMealPlan || [];
  const currentDay = sevenDayPlan.find((d) => d.dayNumber === selectedDayNumber) || sevenDayPlan[0];
  const budgetGuidelines = diet.budgetManagement?.guidelines || [];

  const handleSwapAlternative = async (mealId: string, alt: MealAlternative) => {
    await swapMeal(mealId, alt);
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Indian Diet Blueprint"
        subtitle={`${userProfile.food.dietType.replace(/_/g, ' ').toUpperCase()} • ₹${userProfile.budget.dailyBudgetRupees}/day budget`}
        showBrand={false}
        rightAction={
          <Badge
            label={diet.feasible ? 'Feasible' : 'Exceeds'}
            variant={diet.feasible ? 'accent' : 'warning'}
            size="sm"
          />
        }
      />

      {/* Top Segmented Navigation (Meals / Grocery / Supplements) */}
      <View style={styles.subViewTabBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveSubView('meals')}
          style={[
            styles.subViewTab,
            activeSubView === 'meals' && styles.subViewTabActive,
          ]}
        >
          <Icon
            name="utensils"
            size={14}
            color={activeSubView === 'meals' ? colors.primaryDark : colors.textMuted}
          />
          <Text
            style={[
              styles.subViewTabText,
              activeSubView === 'meals' && styles.subViewTabTextActive,
            ]}
          >
            Meal Plan
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveSubView('grocery')}
          style={[
            styles.subViewTab,
            activeSubView === 'grocery' && styles.subViewTabActive,
          ]}
        >
          <Icon
            name="shopping-bag"
            size={14}
            color={activeSubView === 'grocery' ? colors.primaryDark : colors.textMuted}
          />
          <Text
            style={[
              styles.subViewTabText,
              activeSubView === 'grocery' && styles.subViewTabTextActive,
            ]}
          >
            Grocery List ({diet.groceryList?.length || 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveSubView('supplements')}
          style={[
            styles.subViewTab,
            activeSubView === 'supplements' && styles.subViewTabActive,
          ]}
        >
          <Icon
            name="pill"
            size={14}
            color={activeSubView === 'supplements' ? colors.primaryDark : colors.textMuted}
          />
          <Text
            style={[
              styles.subViewTabText,
              activeSubView === 'supplements' && styles.subViewTabTextActive,
            ]}
          >
            Supplements
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Rendering based on SubView */}
      {activeSubView === 'grocery' ? (
        <GroceryScreen
          showHeader={false}
          onBackToDiet={() => setActiveSubView('meals')}
        />
      ) : activeSubView === 'supplements' ? (
        <SupplementsScreen
          showHeader={false}
          onBackToDiet={() => setActiveSubView('meals')}
        />
      ) : (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Nutrition Summary and Budget Economics */}
          <MealNutritionCard
            nutrition={nutrition}
            diet={diet}
            dietType={userProfile.food.dietType}
            dailyBudgetLimit={userProfile.budget.dailyBudgetRupees}
          />

          {/* 7-Day Meal Schedule Rotation Selector */}
          {sevenDayPlan.length > 0 && (
            <View style={styles.sevenDaySection}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>7-DAY MEAL ROTATION</Text>
                  <Text style={styles.sectionSub}>
                    Daily whole-food variety anchored around your routine
                  </Text>
                </View>
                <Badge label="7 Days" variant="neutral" size="sm" />
              </View>

              {/* Horizontally Scrollable 7-Day Selector */}
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.daySelectorScroll}
              >
                {sevenDayPlan.map((d) => {
                  const isSelected = d.dayNumber === selectedDayNumber;
                  const dayAbbr = d.dayName.slice(0, 3).toUpperCase();

                  return (
                    <TouchableOpacity
                      key={d.dayNumber}
                      activeOpacity={0.7}
                      onPress={() => setSelectedDayNumber(d.dayNumber)}
                      style={[
                        styles.dayChip,
                        isSelected && styles.dayChipSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayChipNum,
                          isSelected && styles.dayChipNumSelected,
                        ]}
                      >
                        DAY {d.dayNumber}
                      </Text>
                      <Text
                        style={[
                          styles.dayChipName,
                          isSelected && styles.dayChipNameSelected,
                        ]}
                      >
                        {dayAbbr}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* Active Day Detail Banner */}
              {currentDay && (
                <View style={styles.dayBanner}>
                  <View style={styles.dayBannerHeader}>
                    <View style={styles.dayBannerTitleCol}>
                      <Text style={styles.dayBannerDay}>
                        {currentDay.dayName} • Day {currentDay.dayNumber}
                      </Text>
                      <Text style={styles.dayBannerFocus}>
                        {currentDay.focusTitle}
                      </Text>
                    </View>
                    <Badge
                      label={`${currentDay.estimatedCalories} • ${currentDay.estimatedProtein}`}
                      variant="accent"
                      size="sm"
                    />
                  </View>

                  {/* Scheduled Meals for this Selected Day */}
                  <View style={styles.dayMealsList}>
                    {currentDay.meals.map((m, mIdx) => (
                      <View key={mIdx} style={styles.dayMealRow}>
                        <View style={styles.dayMealTimeBadge}>
                          <Text style={styles.dayMealTimeText}>{m.time}</Text>
                        </View>
                        <View style={styles.dayMealInfo}>
                          <View style={styles.dayMealTop}>
                            <Text style={styles.dayMealCategory}>{m.mealName}</Text>
                            {m.categoryTag ? (
                              <Text style={styles.dayMealTag}>{m.categoryTag}</Text>
                            ) : null}
                          </View>
                          <Text style={styles.dayMealFood}>{m.foodAndQuantity}</Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Planned Course Meals with Swap & Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <View>
                <Text style={styles.sectionTitle}>
                  OPTIMIZED DAILY MEAL COURSES ({meals.length})
                </Text>
                <Text style={styles.sectionSub}>
                  Tap any meal for preparation instructions or to swap alternatives
                </Text>
              </View>
              <Badge label="Interactive" variant="accent" size="sm" />
            </View>

            <View style={styles.mealsList}>
              {meals.map((meal) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onPressDetails={(m) => setDetailMeal(m)}
                  onOpenSwap={(m) => setSwapTargetMeal(m)}
                />
              ))}
            </View>
          </View>

          {/* Allocated Indian Whole Food Staples */}
          {diet.foods && diet.foods.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>
                    ALLOCATED INDIAN STAPLES ({diet.foods.length})
                  </Text>
                  <Text style={styles.sectionSub}>
                    Ranked by cost per 10g bioavailable protein
                  </Text>
                </View>
                <Badge label="clean_staples.csv" variant="neutral" size="sm" />
              </View>

              <View style={styles.staplesBox}>
                {diet.foods.map((food, idx) => (
                  <FoodItemRow key={`${food.name}-${idx}`} food={food} />
                ))}
              </View>
            </View>
          )}

          {/* Budget Management Guidelines */}
          {budgetGuidelines.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <View>
                  <Text style={styles.sectionTitle}>
                    HOW TO MANAGE YOUR DAILY BUDGET
                  </Text>
                  <Text style={styles.sectionSub}>
                    Affordable high-protein Indian staple portions
                  </Text>
                </View>
              </View>

              <View style={styles.guidelinesBox}>
                {budgetGuidelines.map((item, idx) => (
                  <View key={idx} style={styles.guidelineRow}>
                    <View style={styles.guidelineFoodCol}>
                      <Text style={styles.guidelineFood}>{item.food}</Text>
                      <Text style={styles.guidelinePortion}>{item.portion}</Text>
                    </View>
                    <Text style={styles.guidelineNotes}>
                      {item.notes || 'Household portion per plan'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </ScrollView>
      )}

      {/* Meal Details Bottom Sheet */}
      <MealDetailsModal
        meal={detailMeal}
        visible={Boolean(detailMeal)}
        onClose={() => setDetailMeal(null)}
        onOpenSwap={(m) => setSwapTargetMeal(m)}
      />

      {/* Meal Alternatives Bottom Sheet */}
      <MealAlternativesModal
        meal={swapTargetMeal}
        visible={Boolean(swapTargetMeal)}
        onClose={() => setSwapTargetMeal(null)}
        onSelectAlternative={handleSwapAlternative}
      />
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
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  emptySub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  subViewTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  subViewTab: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  subViewTabActive: {
    backgroundColor: colors.primaryLight,
  },
  subViewTabText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    fontSize: 11,
  },
  subViewTabTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  sevenDaySection: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  daySelectorScroll: {
    gap: spacing.xs,
    paddingVertical: 2,
  },
  dayChip: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    minWidth: 64,
  },
  dayChipSelected: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  dayChipNum: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
  },
  dayChipNumSelected: {
    color: '#A7F3D0',
  },
  dayChipName: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dayChipNameSelected: {
    color: colors.surface,
  },
  dayBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  dayBannerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  dayBannerTitleCol: {
    flex: 1,
    gap: 1,
  },
  dayBannerDay: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  dayBannerFocus: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  dayMealsList: {
    gap: spacing.xs,
  },
  dayMealRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  dayMealTimeBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    minWidth: 58,
    alignItems: 'center',
  },
  dayMealTimeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
    fontSize: 10,
  },
  dayMealInfo: {
    flex: 1,
    gap: 1,
  },
  dayMealTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  dayMealCategory: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
    fontSize: 11,
  },
  dayMealTag: {
    ...typography.caption,
    fontSize: 9,
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 4,
    borderRadius: 2,
  },
  dayMealFood: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  section: {
    gap: spacing.sm,
  },
  mealsList: {
    gap: spacing.md,
  },
  staplesBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  guidelinesBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.xs,
  },
  guidelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  guidelineFoodCol: {
    flex: 1,
    gap: 1,
  },
  guidelineFood: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  guidelinePortion: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  guidelineNotes: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    maxWidth: 160,
    textAlign: 'right',
  },
});

export default DietTabScreen;
