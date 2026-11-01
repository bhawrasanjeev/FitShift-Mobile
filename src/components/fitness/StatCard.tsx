import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  badge,
  icon,
  onPress,
  style,
}) => {
  const content = (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          {icon ? <View style={styles.iconBox}>{icon}</View> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        {badge ? <Badge label={badge} variant="neutral" size="sm" /> : null}
      </View>

      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconBox: {
    marginRight: 2,
  },
  title: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: 2,
  },
  value: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  unit: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 2,
  },
});

export default StatCard;
