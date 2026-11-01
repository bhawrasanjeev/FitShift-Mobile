import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export interface SegmentOption<T extends string> {
  label: string;
  value: T;
  icon?: React.ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  style?: ViewStyle;
}

export function SegmentedControl<T extends string>({
  options,
  selectedValue,
  onChange,
  style,
}: SegmentedControlProps<T>) {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.8}
            onPress={() => onChange(option.value)}
            style={[
              styles.tab,
              isSelected && styles.tabSelected,
            ]}
          >
            {option.icon ? <View style={{ marginRight: 6 }}>{option.icon}</View> : null}
            <Text
              style={[
                styles.label,
                isSelected ? styles.labelSelected : styles.labelUnselected,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  tabSelected: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
  },
  labelSelected: {
    color: colors.primary,
  },
  labelUnselected: {
    color: colors.textSecondary,
  },
});

export default SegmentedControl;
