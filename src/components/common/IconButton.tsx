import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, View } from 'react-native';
import { colors } from '../../theme/colors';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'surface' | 'primary' | 'ghost' | 'outline';
  badge?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 'md',
  variant = 'surface',
  badge = false,
  disabled = false,
  style,
}) => {
  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'surface':
        return {
          backgroundColor: colors.surfaceSubtle,
          borderWidth: 1,
          borderColor: colors.border,
        };
      case 'primary':
        return {
          backgroundColor: colors.primary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: colors.borderStrong,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
        };
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        styles[`size_${size}`],
        getVariantStyle(),
        disabled && styles.disabled,
        style,
      ]}
    >
      {icon}
      {badge ? <View style={styles.badgeDot} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  size_sm: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  size_md: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  size_lg: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  disabled: {
    opacity: 0.4,
  },
  badgeDot: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
});

export default IconButton;
