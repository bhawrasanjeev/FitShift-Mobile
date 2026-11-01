import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface DividerProps {
  label?: string;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({ label, style }) => {
  if (label) {
    return (
      <View style={[styles.labeledContainer, style]}>
        <View style={styles.line} />
        <Text style={styles.labelText}>{label}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return <View style={[styles.line, styles.simpleLine, style]} />;
};

const styles = StyleSheet.create({
  simpleLine: {
    marginVertical: spacing.md,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  labeledContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  labelText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textMuted,
    paddingHorizontal: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default Divider;
