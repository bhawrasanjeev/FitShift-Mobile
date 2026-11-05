import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';

export interface MultiSelectCardProps {
  title: string;
  description?: string;
  selected: boolean;
  onToggle: () => void;
  badge?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
}

export const MultiSelectCard: React.FC<MultiSelectCardProps> = ({
  title,
  description,
  selected,
  onToggle,
  badge,
  icon,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onToggle}
      disabled={disabled}
      style={[
        styles.card,
        selected ? styles.cardSelected : styles.cardUnselected,
        disabled && styles.cardDisabled,
        style,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Checkbox Square */}
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected ? <Icon name="check" size={12} color={colors.white} strokeWidth={2.5} /> : null}
        </View>

        {icon ? <View style={styles.iconContainer}>{icon}</View> : null}

        <View style={styles.textContainer}>
          <View style={styles.titleRow}>
            <Text style={[styles.title, selected && styles.titleSelected]}>
              {title}
            </Text>
            {badge ? (
              <Badge
                label={badge}
                variant={selected ? 'accent' : 'neutral'}
                size="sm"
                style={styles.badge}
              />
            ) : null}
          </View>
          {description ? (
            <Text style={[styles.description, selected && styles.descriptionSelected]}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1.5,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  cardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  cardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  cardDisabled: {
    opacity: 0.5,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.surface,
  },
  checkboxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkmark: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: typography.weights.bold,
    marginTop: -1,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  titleSelected: {
    color: colors.primaryDark,
  },
  badge: {
    marginLeft: spacing.sm,
  },
  description: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: typography.lineHeights.sm,
  },
  descriptionSelected: {
    color: colors.textPrimary,
  },
});

export default MultiSelectCard;
