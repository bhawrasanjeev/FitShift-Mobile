import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  leftIcon,
  rightIcon,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      ...styles.container,
      ...styles[`size_${size}`],
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: disabled ? colors.borderStrong : colors.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: colors.primaryLight,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: disabled ? colors.border : colors.primary,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: colors.danger,
        };
    }
  };

  const getTextColor = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'danger':
        return { color: colors.textInverse };
      case 'secondary':
      case 'outline':
        return { color: disabled ? colors.textMuted : colors.primary };
      case 'ghost':
        return { color: disabled ? colors.textMuted : colors.textPrimary };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? colors.textInverse : colors.primary}
        />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              styles[`textSize_${size}`],
              getTextColor(),
              leftIcon ? { marginLeft: spacing.sm } : undefined,
              rightIcon ? { marginRight: spacing.sm } : undefined,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  size_sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 36,
  },
  size_md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    minHeight: 46,
  },
  size_lg: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
  },
  text: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
  },
  textSize_sm: {
    fontSize: typography.sizes.sm,
  },
  textSize_md: {
    fontSize: typography.sizes.base,
  },
  textSize_lg: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
});

export default Button;
