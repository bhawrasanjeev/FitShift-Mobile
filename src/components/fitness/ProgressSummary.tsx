import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';

export interface ProgressSummaryProps {
  weeklyFrequencyDays: number;
  dailyBudgetRupees: number;
  environment: string;
  isFeasible?: boolean;
  style?: ViewStyle;
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({
  weeklyFrequencyDays,
  dailyBudgetRupees,
  environment,
  isFeasible = true,
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={styles.title}>Plan Specifications</Text>
        <Badge
          label={isFeasible ? 'Budget Feasible' : 'Budget Constrained'}
          variant={isFeasible ? 'success' : 'warning'}
          size="sm"
        />
      </View>

      <View style={styles.grid}>
        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>{weeklyFrequencyDays} Days</Text>
          <Text style={styles.gridLabel}>Weekly Training</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>₹{dailyBudgetRupees}/day</Text>
          <Text style={styles.gridLabel}>Diet Budget</Text>
        </View>

        <View style={styles.gridItem}>
          <Text style={styles.gridValue}>{environment.toUpperCase()}</Text>
          <Text style={styles.gridLabel}>Environment</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  gridItem: {
    alignItems: 'center',
    flex: 1,
  },
  gridValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  gridLabel: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
    textTransform: 'uppercase',
  },
});

export default ProgressSummary;
