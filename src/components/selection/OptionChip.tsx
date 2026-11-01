import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, View } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';

export interface OptionChipProps {
  label: string;
  selected: boolean;
  onToggle?: () => void;
  onPress?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const OptionChip: React.FC<OptionChipProps> = ({
  label,
  selected,
  onToggle,
  onPress,
  icon,
  disabled = false,
  size = 'md',
  style,
}) => {
  const handlePress = onToggle || onPress;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      disabled={disabled}
      style={[
        styles.chip,
        styles[`size_${size}`],
        selected ? styles.chipSelected : styles.chipUnselected,
        disabled && styles.chipDisabled,
        style,
      ]}
    >
      {icon ? <View style={styles.iconBox}>{icon}</View> : null}
      <Text
        style={[
          styles.label,
          styles[`label_${size}`],
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {selected ? <Text style={styles.checkIcon}>✓</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  size_sm: {
    paddingVertical: spacing.xxs + 2,
    paddingHorizontal: spacing.md,
  },
  size_md: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipDisabled: {
    opacity: 0.5,
  },
  iconBox: {
    marginRight: spacing.xs,
  },
  label: {
    fontWeight: typography.weights.medium,
  },
  label_sm: {
    fontSize: typography.sizes.xs,
  },
  label_md: {
    fontSize: typography.sizes.sm,
  },
  labelUnselected: {
    color: colors.textPrimary,
  },
  labelSelected: {
    color: colors.primaryDark,
    fontWeight: typography.weights.bold,
  },
  checkIcon: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: typography.weights.bold,
    marginLeft: spacing.xs,
  },
});

export default OptionChip;
