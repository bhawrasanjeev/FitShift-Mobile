import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Generating your FitShift plan...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.spinnerBox}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.subtext}>Optimizing Indian whole foods & daily routine</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  spinnerBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  message: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtext: {
    fontSize: typography.sizes.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
});

export default LoadingState;
