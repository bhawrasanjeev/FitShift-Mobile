import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps {
  message: string;
  type?: ToastType;
  visible: boolean;
  onDismiss: () => void;
  durationMs?: number;
  style?: ViewStyle;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  visible,
  onDismiss,
  durationMs = 3500,
  style,
}) => {
  useEffect(() => {
    if (visible && durationMs > 0) {
      const timer = setTimeout(() => {
        onDismiss();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [visible, durationMs, onDismiss]);

  if (!visible) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: colors.successLight,
          border: '#A7F3D0',
          text: colors.primaryDark,
          icon: '✓',
        };
      case 'warning':
        return {
          bg: colors.warningLight,
          border: '#FDE68A',
          text: '#92400E',
          icon: '⚠',
        };
      case 'error':
        return {
          bg: colors.dangerLight,
          border: '#FECACA',
          text: colors.danger,
          icon: '!',
        };
      case 'info':
        return {
          bg: colors.infoLight,
          border: '#BFDBFE',
          text: colors.info,
          icon: 'ℹ',
        };
    }
  };

  const currentType = getTypeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: currentType.bg,
          borderColor: currentType.border,
        },
        style,
      ]}
    >
      <View style={styles.iconCircle}>
        <Text style={[styles.iconText, { color: currentType.text }]}>
          {currentType.icon}
        </Text>
      </View>
      <Text style={[styles.message, { color: currentType.text }]} numberOfLines={2}>
        {message}
      </Text>
      <TouchableOpacity activeOpacity={0.7} onPress={onDismiss} style={styles.closeButton}>
        <Text style={[styles.closeText, { color: currentType.text }]}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1.5,
    marginHorizontal: spacing.md,
    marginVertical: spacing.xs,
    ...shadows.md,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  iconText: {
    fontSize: 13,
    fontWeight: typography.weights.bold,
  },
  message: {
    flex: 1,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  closeButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  closeText: {
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
});

export default Toast;
