import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export interface AvatarProps {
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'emerald' | 'subtle';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'FS',
  size = 'md',
  variant = 'emerald',
  style,
}) => {
  const getInitials = (str: string) => {
    const trimmed = str.trim();
    if (!trimmed) return 'FS';
    const parts = trimmed.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return trimmed.slice(0, 2).toUpperCase();
  };

  const isEmerald = variant === 'emerald';

  return (
    <View
      style={[
        styles.circle,
        styles[`size_${size}`],
        {
          backgroundColor: isEmerald ? colors.primaryLight : colors.surfaceSubtle,
          borderColor: isEmerald ? colors.accentBorder : colors.border,
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.text,
          styles[`text_${size}`],
          { color: isEmerald ? colors.primaryDark : colors.textPrimary },
        ]}
      >
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  size_sm: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  size_md: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  size_lg: {
    width: 58,
    height: 58,
    borderRadius: 29,
  },
  text: {
    fontWeight: typography.weights.bold,
  },
  text_sm: {
    fontSize: typography.sizes.xs,
  },
  text_md: {
    fontSize: typography.sizes.sm,
  },
  text_lg: {
    fontSize: typography.sizes.lg,
  },
});

export default Avatar;
