import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { DailyMealTiming } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface MealTimingCardProps {
  timing: DailyMealTiming;
  stepNumber: number;
  totalSteps?: number;
  style?: ViewStyle;
}

export const MealTimingCard: React.FC<MealTimingCardProps> = ({
  timing,
  stepNumber,
  totalSteps,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.timeBadge}>
          <Text style={styles.timeText}>{timing.time}</Text>
        </View>
        <Text style={styles.stepText}>
          STOP {stepNumber} {totalSteps ? `OF ${totalSteps}` : ''}
        </Text>
      </View>

      <Text style={styles.mealTitle}>{timing.meal}</Text>
      {timing.description ? (
        <Text style={styles.mealDesc}>{timing.description}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  timeBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.md,
  },
  timeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 11,
  },
  stepText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  mealTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mealDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 11,
  },
});

export default MealTimingCard;
