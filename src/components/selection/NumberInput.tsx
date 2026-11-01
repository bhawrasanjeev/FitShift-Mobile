import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';

export interface NumberInputProps {
  label?: string;
  value: number;
  onChangeValue: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  error?: string;
  style?: ViewStyle;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChangeValue,
  min = 0,
  max = 9999,
  step = 1,
  unit,
  error,
  style,
}) => {
  const handleDecrement = () => {
    const next = Math.max(min, (Number(value) || 0) - step);
    onChangeValue(next);
  };

  const handleIncrement = () => {
    const next = Math.min(max, (Number(value) || 0) + step);
    onChangeValue(next);
  };

  const handleTextChange = (text: string) => {
    const numeric = text.replace(/[^0-9.]/g, '');
    if (numeric === '') {
      onChangeValue(0);
      return;
    }
    const parsed = Number(numeric);
    if (!isNaN(parsed)) {
      onChangeValue(Math.min(max, Math.max(min, parsed)));
    }
  };

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputRow, error ? styles.inputRowError : null]}>
        {/* Decrement Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDecrement}
          disabled={value <= min}
          style={[styles.stepperButton, value <= min && styles.stepperDisabled]}
        >
          <Text style={[styles.stepperText, value <= min && styles.stepperTextDisabled]}>−</Text>
        </TouchableOpacity>

        {/* Center Input Display */}
        <View style={styles.centerBox}>
          <TextInput
            value={value === 0 ? '' : String(value)}
            onChangeText={handleTextChange}
            keyboardType="numeric"
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
          {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
        </View>

        {/* Increment Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleIncrement}
          disabled={value >= max}
          style={[styles.stepperButton, value >= max && styles.stepperDisabled]}
        >
          <Text style={[styles.stepperText, value >= max && styles.stepperTextDisabled]}>+</Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
  },
  inputRowError: {
    borderColor: colors.danger,
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperDisabled: {
    opacity: 0.4,
  },
  stepperText: {
    fontSize: 22,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    lineHeight: 26,
  },
  stepperTextDisabled: {
    color: colors.textMuted,
  },
  centerBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  textInput: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    minWidth: 50,
    paddingVertical: spacing.xs,
  },
  unitText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  errorText: {
    fontSize: typography.sizes.xs,
    color: colors.danger,
    marginTop: spacing.xs,
  },
});

export default NumberInput;
