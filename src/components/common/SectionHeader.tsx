import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actionText?: string;
  onActionPress?: () => void;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  actionText,
  onActionPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>

      {actionText && onActionPress ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onActionPress}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  titleWrapper: {
    flex: 1,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  actionText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
});

export default SectionHeader;
