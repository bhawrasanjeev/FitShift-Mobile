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
import { shadows } from '../theme/shadows';
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

  const highlights: { icon: IconName; label: string }[] = [
    { icon: 'shield', label: 'No Login Wall' },
    { icon: 'utensils', label: 'Desi Staples' },
    { icon: 'clock', label: 'Schedule Synced' },
  ];

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.contentContainer,
        {
          paddingTop: Math.max(insets.top + spacing.lg, spacing['3xl']),
          paddingBottom: Math.max(insets.bottom + spacing.xl, spacing['3xl']),
        },
      ]}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      {/* Brand Identity Hero */}
      <View style={styles.brandHero}>
        <View style={styles.logoContainer}>
          <Logo size={56} />
        </View>

        <Text style={styles.brandTitle}>FitShift</Text>
        <Text style={styles.brandTagline}>Routine-First Fitness • Indian Nutrition</Text>
      </View>

      {/* Main Value Proposition Card */}
      <View style={styles.heroCard}>
        <View style={styles.headlineWrapper}>
          <Text style={styles.headline}>
            Fitness that <Text style={styles.headlineAccent}>fits your life</Text>.
          </Text>
          <Text style={styles.subheadline}>
            Personalized workouts and budget-realistic Indian meal plans, tailored precisely to your schedule, kitchen resources, and goals.
          </Text>
        </View>

        {/* Minimalist Feature Chips */}
        <View style={styles.highlightsRow}>
          {highlights.map((item, idx) => (
            <View key={idx} style={styles.highlightChip}>
              <Icon name={item.icon} size={13} color={colors.primaryDark} />
              <Text style={styles.highlightText}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Conditional Plan Section */}
        {hasPlan && plan ? (
          <View style={styles.activePlanCard}>
            <View style={styles.activePlanHeader}>
              <View style={styles.activePlanTitleRow}>
                <Icon name="check-circle" size={16} color={colors.primaryDark} />
                <Text style={styles.activePlanTitle}>Active Routine Available</Text>
              </View>
              <Badge
                label={`₹${plan.userProfile?.budget?.dailyBudgetRupees || 65}/day`}
                variant="accent"
                size="sm"
              />
            </View>

            <Text style={styles.activePlanSummary}>
              {(plan.userProfile?.personal?.goal || 'FITNESS').replace('_', ' ').toUpperCase()} •{' '}
              {plan.userProfile?.training?.environment === 'home' ? 'Home Workouts' : 'Gym'} •{' '}
              {plan.nutrition?.calorieTarget} kcal • {plan.nutrition?.proteinTargetGrams}g Protein
            </Text>

            <View style={styles.actionButtons}>
              <Button
                title="View My Active Plan"
                variant="primary"
                size="lg"
                onPress={onViewActivePlan}
                style={styles.primaryBtn}
              />
              <Button
                title="Create New Plan"
                variant="outline"
                size="md"
                onPress={onStartOnboarding}
                style={styles.secondaryBtn}
              />
            </View>
          </View>
        ) : (
          <View style={styles.ctaWrapper}>
            <Button
              title="Create My Plan"
              variant="primary"
              size="lg"
              onPress={onStartOnboarding}
              style={styles.primaryBtn}
            />
            <Text style={styles.ctaNote}>
              Takes under 2 minutes • No account or registration needed
            </Text>
          </View>
        )}
      </View>

      {/* Developer / Dev Navigation (if props provided) */}
      {(onOpenShowcase || onOpenApiConsole) && (
        <View style={styles.devToolsRow}>
          {onOpenShowcase && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenShowcase}
              style={styles.devLink}
            >
              <Text style={styles.devLinkText}>Design System</Text>
            </TouchableOpacity>
          )}
          {onOpenShowcase && onOpenApiConsole && (
            <Text style={styles.devDot}>•</Text>
          )}
          {onOpenApiConsole && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenApiConsole}
              style={styles.devLink}
            >
              <Text style={styles.devLinkText}>API Console</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.xxl,
  },
  brandHero: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  logoContainer: {
    marginBottom: spacing.xs,
    ...shadows.sm,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
  },
  brandTagline: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.xl,
    gap: spacing.xl,
    ...shadows.sm,
  },
  headlineWrapper: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  headline: {
    ...typography.h1,
    fontSize: 26,
    lineHeight: 32,
    color: colors.textPrimary,
    textAlign: 'center',
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headlineAccent: {
    color: colors.primaryDark,
  },
  subheadline: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.xs,
  },
  highlightsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  highlightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.full,
    paddingVertical: 5,
    paddingHorizontal: spacing.sm,
  },
  highlightText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  ctaWrapper: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.sm,
    paddingTop: spacing.xs,
  },
  primaryBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
  },
  ctaNote: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
  activePlanCard: {
    width: '100%',
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
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
  activePlanTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  activePlanSummary: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 11,
  },
  actionButtons: {
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  devToolsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  devLink: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  devLinkText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  devDot: {
    color: colors.border,
    fontSize: 11,
  },
});
