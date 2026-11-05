import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Logo } from '../components/common/Logo';
import { Icon, IconName } from '../components/common/Icon';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { borderRadius } from '../theme/borderRadius';
import { usePlan } from '../context/PlanContext';

export interface WelcomeScreenProps {
  onStartOnboarding: () => void;
  onViewActivePlan: () => void;
  onOpenShowcase?: () => void;
  onOpenApiConsole?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartOnboarding,
  onViewActivePlan,
  onOpenShowcase,
  onOpenApiConsole,
}) => {
  const { hasPlan, plan } = usePlan();
  const insets = useSafeAreaInsets();

  const trustPoints: { iconName: IconName; title: string; desc: string }[] = [
    { iconName: 'shield', title: 'No login required', desc: 'Planning, not tracking. Zero account wall.' },
    { iconName: 'leaf', title: 'Indian grocery economics', desc: 'Sattu, Kala Chana, Moong, Paneer, Curd.' },
    { iconName: 'dumbbell', title: 'Home & Gym ready', desc: 'Strict bodyweight to full commercial gym.' },
    { iconName: 'clock', title: 'Real-world schedules', desc: 'Syncs to office commute & shift timings.' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        { paddingTop: Math.max(insets.top, spacing.xl) },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Brand Hero Header */}
      <View style={styles.heroSection}>
        {/* Tagline Badge */}
        <View style={styles.taglineBadge}>
          <Icon name="sparkles" size={13} color={colors.primaryDark} />
          <Text style={styles.taglineText}>ROUTINE-FIRST, BUDGET-REALISTIC FITNESS</Text>
        </View>

        {/* Brand Logo & Name */}
        <View style={styles.brandRow}>
          <Logo size={46} />
          <View>
            <View style={styles.titleWithBadge}>
              <Text style={styles.brandTitle}>FitShift</Text>
              <Badge label="Engine" variant="accent" size="sm" />
            </View>
            <Text style={styles.brandSubtitle}>Android Edition</Text>
          </View>
        </View>

        {/* Main Headline */}
        <Text style={styles.headline}>
          Fitness that <Text style={styles.headlineEmerald}>fits your life</Text>.
        </Text>

        {/* Supporting Copy */}
        <Text style={styles.subheadline}>
          Personalized workouts, Indian-food-based nutrition and realistic daily routines, built around your schedule, resources and budget.
        </Text>

        {/* Active Plan Shortcut Banner (if plan is cached) */}
        {hasPlan && plan ? (
          <View style={styles.activePlanBanner}>
            <View style={styles.activePlanHeader}>
              <View style={styles.activePlanTitleRow}>
                <Icon name="check-circle" size={18} color={colors.primary} />
                <Text style={styles.activePlanTitle}>Active Plan Ready</Text>
              </View>
              <Badge
                label={`₹${plan.userProfile.budget.dailyBudgetRupees}/day`}
                variant="accent"
                size="sm"
              />
            </View>

            <Text style={styles.activePlanSummary}>
              {plan.userProfile.personal.goal.replace('_', ' ').toUpperCase()} •{' '}
              {plan.userProfile.training.environment === 'home' ? 'Home Workouts' : 'Gym'} •{' '}
              {plan.nutrition.calorieTarget} kcal • {plan.nutrition.proteinTargetGrams}g Protein
            </Text>

            <View style={styles.activePlanButtons}>
              <Button
                title="View My Active Plan"
                variant="primary"
                size="md"
                onPress={onViewActivePlan}
                style={styles.viewPlanButton}
              />
              <Button
                title="Create New Plan"
                variant="outline"
                size="md"
                onPress={onStartOnboarding}
                style={styles.newPlanButton}
              />
            </View>
          </View>
        ) : (
          /* Primary CTA Action */
          <View style={styles.ctaSection}>
            <Button
              title="Create My Plan"
              variant="primary"
              size="lg"
              onPress={onStartOnboarding}
              style={styles.primaryCta}
            />
            <Text style={styles.ctaNote}>
              Takes under 2 minutes • No account or credit card needed
            </Text>
          </View>
        )}
      </View>

      {/* Trust & Philosophy Pillars */}
      <View style={styles.pillarsSection}>
        <Text style={styles.sectionHeaderTitle}>DESIGNED FOR REAL ROUTINES</Text>
        <View style={styles.pillarsGrid}>
          {trustPoints.map((point, index) => (
            <View key={index} style={styles.pillarCard}>
              <View style={styles.pillarIconContainer}>
                <Icon name={point.iconName} size={20} color={colors.primary} />
              </View>
              <View style={styles.pillarTextCol}>
                <Text style={styles.pillarTitle}>{point.title}</Text>
                <Text style={styles.pillarDesc}>{point.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Live Algorithm Preview Card */}
      <View style={styles.previewSection}>
        <View style={styles.previewCard}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewHeaderTitle}>SAMPLE GENERATED BLUEPRINT</Text>
            <Badge label="Home • 45m • Pure Veg • ₹65/day" variant="accent" size="sm" />
          </View>

          {/* Workout Sample Row */}
          <View style={styles.previewItem}>
            <View style={styles.previewItemHeader}>
              <Text style={styles.previewItemCategory}>PUSH ROUTINE</Text>
              <Text style={styles.previewItemRest}>60s rest</Text>
            </View>
            <Text style={styles.previewItemName}>Controlled Tempo Push-Ups</Text>
            <Text style={styles.previewItemSub}>
              3 sets × 12–15 reps • Living room floor & mat
            </Text>
          </View>

          {/* Diet Sample Row */}
          <View style={styles.previewItem}>
            <View style={styles.previewItemHeader}>
              <Text style={styles.previewItemCategoryDiet}>HIGH-PROTEIN BREAKFAST</Text>
              <Text style={styles.previewItemCost}>₹18 • 21g Pro</Text>
            </View>
            <Text style={styles.previewItemName}>Chana Sattu Buttermilk & Moong Sprouts</Text>
            <Text style={styles.previewItemSub}>
              40g Sattu, 200ml Curd Chaas, 50g Sprouted Moong
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing['5xl'],
    gap: spacing.xl,
  },
  heroSection: {
    alignItems: 'center',
    textAlign: 'center',
    gap: spacing.md,
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  taglineText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.6,
    fontSize: 10,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  titleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontWeight: '800',
  },
  brandSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  headline: {
    ...typography.h1,
    fontSize: 32,
    lineHeight: 38,
    color: colors.textPrimary,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  headlineEmerald: {
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  subheadline: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.sm,
  },
  ctaSection: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  primaryCta: {
    width: '100%',
  },
  ctaNote: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  activePlanBanner: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1.5,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  activePlanHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activePlanTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activePlanIcon: {
    fontSize: 16,
  },
  activePlanTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  activePlanSummary: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  activePlanButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  viewPlanButton: {
    flex: 2,
  },
  newPlanButton: {
    flex: 1,
  },
  pillarsSection: {
    gap: spacing.md,
  },
  sectionHeaderTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pillarsGrid: {
    gap: spacing.sm,
  },
  pillarCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  pillarIconContainer: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillarTextCol: {
    flex: 1,
    gap: 2,
  },
  pillarTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pillarDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  previewSection: {
    gap: spacing.sm,
  },
  previewCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.sm,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  previewHeaderTitle: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  previewItem: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
    gap: 2,
  },
  previewItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewItemCategory: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
  },
  previewItemCategoryDiet: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.warning,
    fontSize: 10,
  },
  previewItemRest: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryDark,
    fontSize: 10,
  },
  previewItemCost: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
  },
  previewItemName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  previewItemSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});
