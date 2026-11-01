import React, { ReactNode } from 'react';
import { View, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/borderRadius';
import { shadows } from '../../theme/shadows';
import { spacing } from '../../theme/spacing';

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  selected?: boolean;
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  selected = false,
  elevation = 'sm',
  padding = 'md',
}) => {
  const containerStyle: ViewStyle = {
    ...styles.card,
    ...shadows[elevation],
    ...styles[`padding_${padding}`],
    borderColor: selected ? colors.primary : colors.border,
    backgroundColor: selected ? colors.primaryLight : colors.surface,
  };

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[containerStyle, style]}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={[containerStyle, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: spacing.sm,
  },
  padding_md: {
    padding: spacing.lg,
  },
  padding_lg: {
    padding: spacing.xl,
  },
});

export default Card;
