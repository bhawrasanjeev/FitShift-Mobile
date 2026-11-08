import React, { useState, useEffect } from 'react';
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
  const allowsDecimal = step < 1 || unit === 'kg';

  // Initialize local text state with current value
  const [localText, setLocalText] = useState<string>(() => {
    if (value === undefined || value === null || isNaN(value) || value === 0) {
      return '';
    }
    return String(value);
  });
  const [isFocused, setIsFocused] = useState<boolean>(false);

  // Sync external value updates when the user is not actively typing
  useEffect(() => {
    if (!isFocused) {
      if (value === undefined || value === null || isNaN(value) || value === 0) {
        setLocalText('');
      } else {
        setLocalText(String(value));
      }
    }
  }, [value, isFocused]);

  const handleDecrement = () => {
    const current = parseFloat(localText) || value || 0;
    const next = Math.max(min, Math.round((current - step) * 10) / 10);
    const formatted = String(next);
    setLocalText(formatted);
    onChangeValue(next);
  };

  const handleIncrement = () => {
    const current = parseFloat(localText) || value || 0;
    const next = Math.min(max, Math.round((current + step) * 10) / 10);
    const formatted = String(next);
    setLocalText(formatted);
    onChangeValue(next);
  };

  const handleTextChange = (text: string) => {
    // Sanitize input: allow only digits and at most one decimal point (if decimal allowed)
    let cleaned = allowsDecimal ? text.replace(/[^0-9.]/g, '') : text.replace(/[^0-9]/g, '');

    if (allowsDecimal) {
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }
    }

    // Strip leading zeroes unless it's "0" or "0."
    if (cleaned.length > 1 && cleaned.startsWith('0') && !cleaned.startsWith('0.')) {
      cleaned = cleaned.replace(/^0+/, '') || '0';
    }

    setLocalText(cleaned);

    if (cleaned === '' || cleaned === '.') {
      onChangeValue(0);
      return;
    }

    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) {
      // NOTE: Do NOT clamp to `min` while typing! Clamping while typing blocks users from
      // entering multi-digit numbers (e.g. typing '2' for '25' when min is 14 would clamp to 14).
      // We pass the parsed number directly so the user has complete typing freedom.
      onChangeValue(parsed);
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (localText.trim() === '' || isNaN(parseFloat(localText))) {
      // On blur, if empty, revert to min or 0
      const fallback = min > 0 ? min : 0;
      setLocalText(fallback === 0 ? '' : String(fallback));
      onChangeValue(fallback);
      return;
    }

    const parsed = parseFloat(localText);
    const clamped = Math.min(max, Math.max(min, parsed));
    const formatted = allowsDecimal
      ? String(Math.round(clamped * 10) / 10)
      : String(Math.round(clamped));

    setLocalText(formatted);
    onChangeValue(Number(formatted));
  };

  const currentNumeric = parseFloat(localText) || value || 0;
  const isMinDisabled = currentNumeric <= min;
  const isMaxDisabled = currentNumeric >= max;

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputRow,
          isFocused ? styles.inputRowFocused : null,
          error ? styles.inputRowError : null,
        ]}
      >
        {/* Decrement Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleDecrement}
          disabled={isMinDisabled}
          style={[styles.stepperButton, isMinDisabled && styles.stepperDisabled]}
        >
          <Text style={[styles.stepperText, isMinDisabled && styles.stepperTextDisabled]}>−</Text>
        </TouchableOpacity>

        {/* Center Input Display */}
        <View style={styles.centerBox}>
          <TextInput
            value={localText}
            onChangeText={handleTextChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            keyboardType={allowsDecimal ? 'decimal-pad' : 'numeric'}
            placeholder="0"
            placeholderTextColor={colors.textMuted}
            selectTextOnFocus={true}
            returnKeyType="done"
            style={styles.textInput}
          />
          {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
        </View>

        {/* Increment Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleIncrement}
          disabled={isMaxDisabled}
          style={[styles.stepperButton, isMaxDisabled && styles.stepperDisabled]}
        >
          <Text style={[styles.stepperText, isMaxDisabled && styles.stepperTextDisabled]}>+</Text>
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
  inputRowFocused: {
    borderColor: colors.primary,
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
