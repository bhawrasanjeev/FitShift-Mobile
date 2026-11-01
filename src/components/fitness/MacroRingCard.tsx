import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';

export interface MacroRingCardProps {
  calorieTarget: number;
  calorieAchieved?: number;
  proteinTarget: number;
  proteinAchieved?: number;
  goal?: string;
  style?: ViewStyle;
}

export const MacroRingCard: React.FC<MacroRingCardProps> = ({
  calorieTarget,
  calorieAchieved,
  proteinTarget,
  proteinAchieved,
  goal = 'Muscle Gain',
  style,
}) => {
  const calAchieved = calorieAchieved ?? calorieTarget;
  const proAchieved = proteinAchieved ?? proteinTarget;

  const calProgress = Math.min(Math.round((calAchieved / (calorieTarget || 1)) * 100), 100);
  const proProgress = Math.min(Math.round((proAchieved / (proteinTarget || 1)) * 100), 100);

  return (
    <View style={[styles.card, style]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.cardTitle}>Daily Target Engine</Text>
          <Text style={styles.cardSubtitle}>Mifflin-St Jeor & Indian Staples</Text>
        </View>
        <Badge label={goal.replace('_', ' ')} variant="accent" size="sm" />
      </View>

      {/* Two Macro Focus Columns */}
      <View style={styles.ringRow}>
        {/* Calories Ring Metric */}
        <View style={styles.metricColumn}>
          <View style={styles.ringWrapper}>
            <View style={[styles.outerRing, { borderColor: colors.primaryLight }]}>
              <View style={[styles.innerRing, { borderColor: colors.primary }]}>
                <Text style={styles.ringPercent}>{calProgress}%</Text>
                <Text style={styles.ringPercentSub}>Met</Text>
              </View>
            </View>
          </View>
          <Text style={styles.metricValue}>{calAchieved}</Text>
          <Text style={styles.metricTarget}>of {calorieTarget} kcal</Text>
          <Text style={styles.metricLabel}>Daily Energy</Text>
        </View>

        {/* Vertical Divider */}
        <View style={styles.verticalDivider} />

        {/* Protein Ring Metric */}
        <View style={styles.metricColumn}>
          <View style={styles.ringWrapper}>
            <View style={[styles.outerRing, { borderColor: '#FEF3C7' }]}>
              <View style={[styles.innerRing, { borderColor: colors.warning }]}>
                <Text style={styles.ringPercent}>{proProgress}%</Text>
                <Text style={styles.ringPercentSub}>Met</Text>
              </View>
            </View>
          </View>
          <Text style={styles.metricValue}>{proAchieved}g</Text>
          <Text style={styles.metricTarget}>of {proteinTarget}g</Text>
          <Text style={styles.metricLabel}>Protein Target</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricColumn: {
    alignItems: 'center',
    flex: 1,
  },
  ringWrapper: {
    marginBottom: spacing.sm,
  },
  outerRing: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  ringPercent: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.extrabold,
    color: colors.textPrimary,
  },
  ringPercentSub: {
    fontSize: 8,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  metricValue: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  metricTarget: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  verticalDivider: {
    width: 1,
    height: 80,
    backgroundColor: colors.borderSubtle,
  },
});

export default MacroRingCard;
