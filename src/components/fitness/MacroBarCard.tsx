import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { ProgressBar } from '../common/ProgressBar';

export interface MacroBarItem {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
}

export interface MacroBarCardProps {
  items: MacroBarItem[];
  title?: string;
  style?: ViewStyle;
}

export const MacroBarCard: React.FC<MacroBarCardProps> = ({
  items,
  title = 'Nutritional Allocation',
  style,
}) => {
  return (
    <View style={[styles.card, style]}>
      {title ? <Text style={styles.title}>{title}</Text> : null}

      <View style={styles.list}>
        {items.map((item, idx) => {
          const progress = Math.min((item.current || 0) / (item.target || 1), 1);
          return (
            <View key={item.label || idx} style={styles.barItem}>
              <View style={styles.rowBetween}>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemValues}>
                  <Text style={[styles.currentValue, { color: item.color }]}>
                    {item.current}
                  </Text>
                  {' / '}
                  {item.target} {item.unit}
                </Text>
              </View>
              <ProgressBar
                progress={progress}
                color={item.color}
                height={7}
                style={styles.progressBar}
              />
            </View>
          );
        })}
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
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  list: {
    gap: spacing.md,
  },
  barItem: {
    gap: spacing.xs,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  itemValues: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  currentValue: {
    fontWeight: typography.weights.bold,
  },
  progressBar: {
    marginTop: 2,
  },
});

export default MacroBarCard;
