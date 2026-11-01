import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';

export type BadgeVariant = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: BadgeSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'accent',
  size = 'md',
  style,
  textStyle,
  icon,
}) => {
  const getBadgeColors = (): { bg: string; text: string; border?: string } => {
    switch (variant) {
      case 'accent':
        return {
          bg: colors.primaryLight,
          text: colors.primaryDark,
          border: colors.accentBorder,
        };
      case 'neutral':
        return {
          bg: colors.surfaceSubtle,
          text: colors.textSecondary,
          border: colors.border,
        };
      case 'success':
        return {
          bg: colors.successLight,
          text: colors.success,
          border: '#A7F3D0',
        };
      case 'warning':
        return {
          bg: colors.warningLight,
          text: colors.warning,
          border: '#FDE68A',
        };
      case 'danger':
        return {
          bg: colors.dangerLight,
          text: colors.danger,
          border: '#FECACA',
        };
    }
  };

  const badgeColors = getBadgeColors();

  return (
    <View
      style={[
        styles.container,
        styles[`size_${size}`],
        {
          backgroundColor: badgeColors.bg,
          borderColor: badgeColors.border || 'transparent',
          borderWidth: badgeColors.border ? 1 : 0,
        },
        style,
      ]}
    >
      {icon ? <View style={{ marginRight: 4 }}>{icon}</View> : null}
      <Text
        style={[
          styles.text,
          styles[`textSize_${size}`],
          { color: badgeColors.text },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  size_sm: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
  },
  size_md: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  text: {
    fontWeight: typography.weights.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textSize_sm: {
    fontSize: 10,
  },
  textSize_md: {
    fontSize: typography.sizes.xs,
  },
});

export default Badge;
