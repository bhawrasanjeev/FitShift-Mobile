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

  const trustPoints = [
    { icon: '🛡️', title: 'No login required', desc: 'Planning, not tracking. Zero account wall.' },
    { icon: '🍛', title: 'Indian grocery economics', desc: 'Sattu, Kala Chana, Moong, Paneer, Curd.' },
    { icon: '🏠', title: 'Home & Gym ready', desc: 'Strict bodyweight to full commercial gym.' },
    { icon: '⏱️', title: 'Real-world schedules', desc: 'Syncs to office commute & shift timings.' },
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
          <Text style={styles.sparkleIcon}>✨</Text>
          <Text style={styles.taglineText}>ROUTINE-FIRST, BUDGET-REALISTIC FITNESS</Text>
        </View>

        {/* Brand Logo & Name */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>🏋️</Text>
          </View>
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
                <Text style={styles.activePlanIcon}>📋</Text>
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
              <Text style={styles.pillarIcon}>{point.icon}</Text>
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
            <View style={styles.browserDots}>
              <View style={[styles.dot, styles.dotRed]} />
              <View style={[styles.dot, styles.dotYellow]} />
              <View style={[styles.dot, styles.dotGreen]} />
              <Text style={styles.browserUrl}>fitshift.engine/live</Text>
            </View>
            <Badge label="Home • 45m • Pure Veg • ₹65/day" variant="accent" size="sm" />
          </View>

          {/* Workout Sample Row */}
          <View style={styles.previewItem}>
            <View style={styles.previewItemHeader}>
              <Text style={styles.previewItemCategory}>DAY 1 PUSH SESSION</Text>
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
              <Text style={styles.previewItemCategoryDiet}>BREAKFAST ARCHITECTURE</Text>
              <Text style={styles.previewItemCost}>₹18 • 21g Pro</Text>
            </View>
            <Text style={styles.previewItemName}>Chana Sattu Buttermilk & Moong Sprouts</Text>
            <Text style={styles.previewItemSub}>
              40g Sattu, 200ml Curd Chaas, 50g Sprouted Moong
            </Text>
          </View>
        </View>
      </View>

      {/* Developer Utilities & Showcase Shortcuts */}
      <View style={styles.devSection}>
        <Text style={styles.devHeader}>DEVELOPER TOOLS & AUDIT</Text>
        <View style={styles.devButtonsRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onViewActivePlan}
            style={styles.devButton}
          >
            <Text style={styles.devButtonText}>🏠 Main Dashboard</Text>
          </TouchableOpacity>

          {onOpenShowcase ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenShowcase}
              style={styles.devButton}
            >
              <Text style={styles.devButtonText}>🎨 Showcase</Text>
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
  sparkleIcon: {
    fontSize: 12,
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
  logoBadge: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 24,
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
  pillarIcon: {
    fontSize: 22,
    marginTop: 2,
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
  browserDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotRed: { backgroundColor: '#F87171' },
  dotYellow: { backgroundColor: '#FBBF24' },
  dotGreen: { backgroundColor: '#34D399' },
  browserUrl: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    marginLeft: spacing.xs,
    fontFamily: 'monospace',
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
  devSection: {
    gap: spacing.xs,
    marginTop: spacing.sm,
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
