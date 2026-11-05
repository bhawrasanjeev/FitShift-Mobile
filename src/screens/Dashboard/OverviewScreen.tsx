import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { usePlan, MainNavTab } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';
import { Avatar } from '../../components/common/Avatar';
import { StatCard } from '../../components/fitness/StatCard';
import { LateTiredModal } from '../../components/interactive/LateTiredModal';
import { EditPlanModal } from '../../components/interactive/EditPlanModal';
import { generateUserSchedule } from '../../utils/schedule';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface OverviewScreenProps {
  onNavigateTab: (tab: MainNavTab) => void;
  onResetPlan?: () => void;
  onOpenProfile?: () => void;
}

export const OverviewScreen: React.FC<OverviewScreenProps> = ({
  onNavigateTab,
  onResetPlan,
  onOpenProfile,
}) => {
  const {
    plan,
    userProfile,
    isLateTiredActive,
    setIsLateTiredActive,
    regeneratePlan,
  } = usePlan();

  const [isLateTiredModalOpen, setIsLateTiredModalOpen] = useState<boolean>(false);
  const [isEditPlanModalOpen, setIsEditPlanModalOpen] = useState<boolean>(false);

  if (!plan) {
    return (
      <View style={styles.screen}>
        <Header showBrand={true} />
        <View style={styles.emptyContainer}>
          <Icon name="dumbbell" size={48} color={colors.primary} />
          <Text style={styles.greetingTitle}>No Plan Generated Yet</Text>
          <Text style={styles.greetingSub}>
            Complete the 7-step questionnaire to generate your tailored Indian routine and budget-realistic nutrition plan.
          </Text>
          {onResetPlan ? (
            <Button
              title="Create My Plan"
              variant="primary"
              size="md"
              onPress={onResetPlan}
              style={styles.emptyBtn}
            />
          ) : null}
        </View>
      </View>
    );
  }

  const { nutrition, diet, workout } = plan;
  const userName = userProfile.personal.name || 'Member';
  const firstWorkoutDay = workout?.days?.find((d) => !d.isRestDay) || workout?.days?.[0];
  const scheduleEvents = generateUserSchedule(userProfile);

  const goalTitles: Record<string, string> = {
    muscle_gain: 'Muscle Gain & Strength',
    fat_loss: 'Fat Loss & Lean Definition',
    weight_loss: 'Overall Weight Reduction',
    maintenance: 'Vitality & Maintenance',
  };

  const handleSavePlan = async (updatedData: typeof userProfile): Promise<boolean> => {
    return await regeneratePlan(updatedData);
  };

  return (
    <View style={styles.screen}>
      <Header
        showBrand={true}
        onPressBrand={onOpenProfile}
        rightAction={
          <View style={styles.headerRight}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => setIsLateTiredModalOpen(true)}
              style={[
                styles.lateTiredPill,
                isLateTiredActive && styles.lateTiredPillActive,
              ]}
            >
              <Icon
                name="moon"
                size={13}
                color={isLateTiredActive ? '#B45309' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.lateTiredText,
                  isLateTiredActive && styles.lateTiredTextActive,
                ]}
              >
                {isLateTiredActive ? 'Late Mode' : 'Late / Tired?'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsEditPlanModalOpen(true)}
              style={styles.editPlanBtn}
            >
              <Icon name="edit" size={15} color={colors.textSecondary} />
            </TouchableOpacity>

            {onResetPlan ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onResetPlan}
                style={styles.editPlanBtn}
              >
                <Icon name="refresh" size={15} color={colors.textSecondary} />
              </TouchableOpacity>
            ) : null}

            {onOpenProfile ? (
              <TouchableOpacity
                activeOpacity={0.75}
                onPress={onOpenProfile}
                style={styles.profileAvatarBtn}
                accessibilityLabel="Open Profile & Settings"
              >
                <Avatar name={userName} size="sm" variant="emerald" />
              </TouchableOpacity>
            ) : null}
          </View>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome & Parameters Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeader}>
            <View style={styles.heroGreetingCol}>
              <View style={styles.statusBadgeRow}>
                <Badge
                  label={goalTitles[userProfile.personal.goal] || 'Custom Routine'}
                  variant="accent"
                  size="sm"
                />
                {isLateTiredActive ? (
                  <Badge
                    label="Adaptive Downshift"
                    variant="warning"
                    size="sm"
                  />
                ) : null}
              </View>
              <Text style={styles.greetingTitle}>Namaste, {userName}.</Text>
              <Text style={styles.greetingSub}>
                Your routine-first, budget-realistic blueprint constructed from authentic Indian staples.
              </Text>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.quickMetricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricItemLabel}>PRIMARY GOAL</Text>
              <Text style={styles.metricItemValue} numberOfLines={1}>
                {goalTitles[userProfile.personal.goal] || userProfile.personal.goal}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricItemLabel}>ENVIRONMENT</Text>
              <Text style={styles.metricItemValue}>
                {userProfile.training.environment === 'home' ? 'Home Workouts' : 'Commercial Gym'}
              </Text>
            </View>

            <View style={styles.metricDivider} />

            <View style={styles.metricItem}>
              <Text style={styles.metricItemLabel}>DAILY BUDGET</Text>
              <Text style={styles.metricItemValueEmerald}>
                ₹{diet.budget?.estimatedCost || userProfile.budget.dailyBudgetRupees} / ₹{userProfile.budget.dailyBudgetRupees}
              </Text>
            </View>
          </View>

          {/* Profile & Settings Shortcut */}
          {onOpenProfile && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenProfile}
              style={styles.profileBannerLink}
            >
              <View style={styles.profileBannerLeft}>
                <Icon name="user" size={13} color={colors.primaryDark} />
                <Text style={styles.profileBannerText}>View Full Profile & App Settings</Text>
              </View>
              <Icon name="chevron-right" size={13} color={colors.primaryDark} />
            </TouchableOpacity>
          )}
        </View>

        {/* Nutrition Target Highlights (Planned, Not Tracked) */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>DAILY NUTRITION TARGETS</Text>
            <Badge label="Planning, Not Tracking" variant="neutral" size="sm" />
          </View>

          <View style={styles.statsGrid}>
            <StatCard
              title="Calorie Target"
              value={nutrition.calorieTarget}
              unit="kcal / day"
              icon={<Icon name="fire" size={18} color="#EA580C" />}
              style={styles.statCard}
            />
            <StatCard
              title="Daily Protein"
              value={nutrition.proteinTargetGrams}
              unit="g minimum"
              icon={<Icon name="activity" size={18} color={colors.primary} />}
              style={styles.statCard}
            />
          </View>

          <View style={styles.energyDetailCard}>
            <View style={styles.energyCol}>
              <Text style={styles.energyLabel}>Basal Metabolic Rate (BMR)</Text>
              <Text style={styles.energyVal}>{nutrition.bmr} kcal</Text>
              <Text style={styles.energySub}>At complete rest</Text>
            </View>
            <View style={styles.energyVDivider} />
            <View style={styles.energyCol}>
              <Text style={styles.energyLabel}>Total Daily Energy (TDEE)</Text>
              <Text style={styles.energyVal}>{nutrition.tdee} kcal</Text>
              <Text style={styles.energySub}>Activity adjusted</Text>
            </View>
          </View>
        </View>

        {/* Today's Workout Preview */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>TODAY&apos;S WORKOUT</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigateTab('workout')}
            >
              <Text style={styles.viewAllText}>View Full Split →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            {firstWorkoutDay && !firstWorkoutDay.isRestDay ? (
              <>
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleCol}>
                    <Text style={styles.workoutDayName}>{firstWorkoutDay.dayName}</Text>
                    <Text style={styles.workoutFocusTitle}>{firstWorkoutDay.focus}</Text>
                  </View>
                  <Badge
                    label={`${userProfile.training.durationMinutes}m • ${firstWorkoutDay.exercises?.length || 0} moves`}
                    variant="accent"
                    size="sm"
                  />
                </View>

                {/* Exercises preview snippet */}
                <View style={styles.exerciseSnippetsList}>
                  {firstWorkoutDay.exercises?.slice(0, 3).map((ex, idx) => (
                    <View key={`${ex.id}-${idx}`} style={styles.snippetRow}>
                      <View style={styles.snippetInfo}>
                        <Text style={styles.snippetMuscle}>{ex.targetMuscle.toUpperCase()}</Text>
                        <Text style={styles.snippetName} numberOfLines={1}>
                          {ex.name}
                        </Text>
                      </View>
                      <View style={styles.snippetRight}>
                        <Text style={styles.snippetSetsReps}>{ex.setsReps}</Text>
                        <Text style={styles.snippetRest}>{ex.restSeconds || 60}s rest</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <Button
                  title="Start Today's Workout"
                  variant="primary"
                  size="md"
                  onPress={() => onNavigateTab('workout')}
                  style={styles.actionButton}
                />
              </>
            ) : (
              <View style={styles.restDayBox}>
                <Icon name="moon" size={32} color={colors.primary} />
                <Text style={styles.restDayTitle}>Scheduled Active Recovery Day</Text>
                <Text style={styles.restDayDesc}>
                  Your muscles adapt and grow during rest. Focus on walking, mobility, hydration, and restful sleep tonight.
                </Text>
                <Button
                  title="Explore Rest & Mobility Routine"
                  variant="outline"
                  size="sm"
                  onPress={() => setIsLateTiredModalOpen(true)}
                  style={styles.restDayBtn}
                />
              </View>
            )}
          </View>
        </View>

        {/* Today's Indian Meals Preview */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>TODAY&apos;S INDIAN MEALS</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigateTab('diet')}
            >
              <Text style={styles.viewAllText}>Full Diet Plan →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.dietHeaderRow}>
              <View>
                <Text style={styles.dietAllocatedTitle}>
                  {diet.foods?.length || 0} Allocated Indian Staples
                </Text>
                <Text style={styles.dietAllocatedSub}>
                  ₹{diet.budget?.estimatedCost || userProfile.budget.dailyBudgetRupees} daily spend
                </Text>
              </View>
              <Badge
                label={diet.feasible ? 'Budget Feasible' : 'Exceeds Target'}
                variant={diet.feasible ? 'accent' : 'warning'}
                size="sm"
              />
            </View>

            {/* Food items preview snippet */}
            <View style={styles.foodSnippetsList}>
              {diet.foods?.slice(0, 3).map((food, idx) => (
                <View key={`${food.name}-${idx}`} style={styles.foodSnippetRow}>
                  <View style={styles.foodSnippetInfo}>
                    <Text style={styles.foodSnippetTag}>
                      {food.isSupplement ? 'SUPPLEMENT' : 'WHOLE FOOD'}
                    </Text>
                    <Text style={styles.foodSnippetName} numberOfLines={1}>
                      {food.name} ({food.quantityGrams}g)
                    </Text>
                  </View>
                  <View style={styles.foodSnippetRight}>
                    <Text style={styles.foodSnippetProtein}>{food.proteinGrams}g Pro</Text>
                    <Text style={styles.foodSnippetCost}>~₹{food.estimatedCost}</Text>
                  </View>
                </View>
              ))}
            </View>

            <Button
              title="View Full Diet & Macro Breakdown"
              variant="outline"
              size="md"
              onPress={() => onNavigateTab('diet')}
              style={styles.actionButton}
            />
          </View>
        </View>

        {/* Daily Schedule Anchors Preview */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>DAILY SCHEDULE TIMELINE</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onNavigateTab('schedule')}
            >
              <Text style={styles.viewAllText}>24h Schedule →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.card}>
            <View style={styles.scheduleList}>
              {scheduleEvents.slice(0, 3).map((evt) => (
                <View key={evt.id} style={styles.scheduleRow}>
                  <View style={styles.scheduleTimeBox}>
                    <Text style={styles.scheduleTimeText}>{evt.time}</Text>
                  </View>
                  <View style={styles.scheduleEventCol}>
                    <Text style={styles.scheduleEventTitle}>{evt.title}</Text>
                    <Text style={styles.scheduleEventDesc} numberOfLines={1}>
                      {evt.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <Button
              title="View Complete 24h Rhythm"
              variant="ghost"
              size="sm"
              onPress={() => onNavigateTab('schedule')}
              style={styles.scheduleButton}
            />
          </View>
        </View>

        {/* Quick Action Matrix */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onNavigateTab('workout')}
              style={styles.actionTile}
            >
              <Icon name="dumbbell" size={22} color={colors.primary} />
              <Text style={styles.actionTileText}>Workout</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onNavigateTab('diet')}
              style={styles.actionTile}
            >
              <Icon name="utensils" size={22} color={colors.primary} />
              <Text style={styles.actionTileText}>Diet</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onNavigateTab('schedule')}
              style={styles.actionTile}
            >
              <Icon name="clock" size={22} color={colors.primary} />
              <Text style={styles.actionTileText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => onNavigateTab('ai')}
              style={styles.actionTile}
            >
              <Icon name="bot" size={22} color={colors.primary} />
              <Text style={styles.actionTileText}>AI Coach</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <LateTiredModal
        visible={isLateTiredModalOpen}
        onClose={() => setIsLateTiredModalOpen(false)}
        isActive={isLateTiredActive}
        onToggleActive={setIsLateTiredActive}
      />

      <EditPlanModal
        visible={isEditPlanModalOpen}
        onClose={() => setIsEditPlanModalOpen(false)}
        currentData={userProfile}
        onSave={handleSavePlan}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  lateTiredPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  lateTiredPillActive: {
    backgroundColor: colors.warningLight,
    borderColor: '#F59E0B',
  },
  lateTiredText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 11,
  },
  lateTiredTextActive: {
    color: '#B45309',
  },
  editPlanBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarBtn: {
    marginLeft: 2,
  },
  profileBannerLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  profileBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  profileBannerText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  heroBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroHeader: {
    gap: spacing.xs,
  },
  heroGreetingCol: {
    gap: spacing.xxs,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  greetingTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  greetingSub: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  quickMetricsRow: {
    flexDirection: 'row',
    paddingTop: spacing.md,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
  },
  metricItem: {
    flex: 1,
    gap: 2,
  },
  metricDivider: {
    width: 1,
    backgroundColor: colors.borderSubtle,
    marginHorizontal: spacing.xs,
  },
  metricItemLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  metricItemValue: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 11,
  },
  metricItemValueEmerald: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xxs,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  viewAllText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
  },
  energyDetailCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  energyCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  energyVDivider: {
    width: 1,
    backgroundColor: colors.borderSubtle,
  },
  energyLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  energyVal: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  energySub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  cardTitleCol: {
    gap: 2,
    flex: 1,
  },
  workoutDayName: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  workoutFocusTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  exerciseSnippetsList: {
    gap: spacing.xs,
  },
  snippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  snippetInfo: {
    flex: 1,
    gap: 2,
  },
  snippetMuscle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 9,
  },
  snippetName: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  snippetRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  snippetSetsReps: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 11,
  },
  snippetRest: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  actionButton: {
    marginTop: spacing.xxs,
  },
  restDayBox: {
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.xs,
  },
  restDayIcon: {
    fontSize: 28,
  },
  restDayTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  restDayDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  restDayBtn: {
    marginTop: spacing.xs,
  },
  dietHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  dietAllocatedTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dietAllocatedSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 2,
  },
  foodSnippetsList: {
    gap: spacing.xs,
  },
  foodSnippetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  foodSnippetInfo: {
    flex: 1,
    gap: 2,
  },
  foodSnippetTag: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 9,
  },
  foodSnippetName: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  foodSnippetRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  foodSnippetProtein: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  foodSnippetCost: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  scheduleList: {
    gap: spacing.sm,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  scheduleTimeBox: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.md,
    marginTop: 2,
  },
  scheduleTimeText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  scheduleEventCol: {
    flex: 1,
    gap: 2,
  },
  scheduleEventTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  scheduleEventDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  scheduleButton: {
    marginTop: spacing.xxs,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  actionTile: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionTileText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 11,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.sm,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  emptyBtn: {
    marginTop: spacing.md,
    minWidth: 200,
  },
});
