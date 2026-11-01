import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { OnboardingData } from '../../types';
import { Button } from '../common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepReviewProps {
  data: OnboardingData;
  onEditStep: (stepNumber: number) => void;
  onGeneratePlan: () => void;
  isGenerating?: boolean;
}

export const StepReview: React.FC<StepReviewProps> = ({
  data,
  onEditStep,
  onGeneratePlan,
  isGenerating = false,
}) => {
  const goalNames: Record<string, string> = {
    muscle_gain: 'Muscle Gain & Strength',
    fat_loss: 'Fat Loss & Lean Definition',
    weight_loss: 'Weight Reduction',
    maintenance: 'Vitality & Maintenance',
  };

  const dietNames: Record<string, string> = {
    pure_veg: 'Pure Vegetarian',
    eggetarian: 'Eggetarian',
    non_veg: 'Non-Vegetarian',
  };

  const occNames: Record<string, string> = {
    student: 'Student',
    working_professional: 'Working Professional',
    homemaker: 'Homemaker',
    business_owner: 'Business Owner',
    freelancer: 'Freelancer',
    other: 'General Schedule',
  };

  const cards = [
    {
      step: 1,
      title: 'Personal Basics & Goal',
      icon: '👤',
      items: [
        { label: 'Name', value: data.personal.name || 'FitShift Member' },
        {
          label: 'Metrics',
          value: `${data.personal.age} yrs • ${data.personal.heightCm} cm • ${data.personal.weightKg} kg`,
        },
        {
          label: 'Primary Goal',
          value: goalNames[data.personal.goal] || data.personal.goal,
        },
      ],
    },
    {
      step: 2,
      title: 'Daily Rhythm & Schedule',
      icon: '⏱️',
      items: [
        { label: 'Routine', value: occNames[data.rhythm.occupation] || data.rhythm.occupation },
        {
          label: 'Transit Hours',
          value: `${data.rhythm.departureTime} (Out) → ${data.rhythm.returnTime} (Home)`,
        },
        {
          label: 'Sleep Rhythm',
          value: `${data.rhythm.sleepHours} hrs (Wake up: ${data.rhythm.wakeUpTime})`,
        },
      ],
    },
    {
      step: 3,
      title: 'Training Setup',
      icon: '🏋️',
      items: [
        {
          label: 'Environment',
          value: data.training.environment === 'home' ? 'Home Workouts' : 'Commercial / Society Gym',
        },
        {
          label: 'Session & Days',
          value: `${data.training.durationMinutes} mins • ${data.training.weeklyFrequencyDays} days / week`,
        },
        {
          label: 'Level & Time',
          value: `${data.training.experienceLevel.toUpperCase()} • ${data.training.preferredTime} slots`,
        },
      ],
    },
    {
      step: 4,
      title: 'Nutrition & Kitchen Setup',
      icon: '🥗',
      items: [
        { label: 'Diet Type', value: dietNames[data.food.dietType] },
        {
          label: 'Kitchen Access',
          value: data.food.cookingSituation.replace('_', ' ').toUpperCase(),
        },
        {
          label: 'Meals & Style',
          value: `${data.food.mealsPerDay} meals • ${data.food.indianFoodStyle.replace(/_/g, ' ')}`,
        },
      ],
    },
    {
      step: 5,
      title: 'Daily Food Budget',
      icon: '💰',
      items: [
        { label: 'Tier', value: data.budget.tier.replace('_', ' ').toUpperCase() },
        {
          label: 'Daily Target',
          value: `₹${data.budget.dailyBudgetRupees} / day (~₹${data.budget.dailyBudgetRupees * 7} / week)`,
        },
      ],
    },
    {
      step: 6,
      title: 'Supplement Preference',
      icon: '💊',
      items: [
        {
          label: 'Preference',
          value:
            data.supplements.preference === 'no_supplements'
              ? 'Food-Only Nutrition (No Powders)'
              : data.supplements.preference === 'open_to_supplements'
              ? `Open to Supplements (Max ₹${data.supplements.monthlyBudgetRupees || 1200}/mo)`
              : 'Educational Guide Requested',
        },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Intro Notice */}
      <View style={styles.introBox}>
        <Text style={styles.introIcon}>✨</Text>
        <View style={styles.introTextCol}>
          <Text style={styles.introTitle}>Ready to construct your plan</Text>
          <Text style={styles.introSub}>
            Verify your lifestyle parameters below. Tap &ldquo;Edit&rdquo; on any section to make adjustments, then generate your plan.
          </Text>
        </View>
      </View>

      {/* Review Cards */}
      <View style={styles.cardsList}>
        {cards.map((card) => (
          <View key={card.step} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardIcon}>{card.icon}</Text>
                <Text style={styles.cardTitle}>{card.title}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onEditStep(card.step)}
                style={styles.editButton}
              >
                <Text style={styles.editText}>✏️ Edit</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.itemsList}>
              {card.items.map((item, idx) => (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemLabel}>{item.label}</Text>
                  <Text style={styles.itemValue} numberOfLines={1}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Action Button Section */}
      <View style={styles.actionSection}>
        <Button
          title="Generate My FitShift Plan"
          variant="primary"
          size="lg"
          onPress={onGeneratePlan}
          loading={isGenerating}
          style={styles.generateButton}
        />
        <Text style={styles.guaranteeText}>
          🔒 Zero login barrier • Instant offline storage • Built for Indian routines
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  introBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  introIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  introTextCol: {
    flex: 1,
    gap: spacing.xxs,
  },
  introTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  introSub: {
    ...typography.caption,
    color: colors.primaryDark,
    lineHeight: 18,
  },
  cardsList: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardIcon: {
    fontSize: 16,
  },
  cardTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  editButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
  },
  editText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  itemsList: {
    gap: spacing.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  itemValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  actionSection: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  generateButton: {
    width: '100%',
  },
  guaranteeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
