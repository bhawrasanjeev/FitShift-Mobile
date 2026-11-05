import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { PlannedMeal } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';
import { Icon, IconName } from '../common/Icon';

export interface MealCardProps {
  meal: PlannedMeal;
  onSwap?: (mealId: string) => void;
  style?: ViewStyle;
}

export const MealCard: React.FC<MealCardProps> = ({ meal, onSwap, style }) => {
  const getMealTypeBadge = (type: string): { label: string; icon: IconName } => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return { label: 'Breakfast', icon: 'sun' };
      case 'lunch':
        return { label: 'Lunch', icon: 'utensils' };
      case 'evening_snack':
      case 'snack':
        return { label: 'Snack', icon: 'leaf' };
      case 'dinner':
        return { label: 'Dinner', icon: 'moon' };
      default:
        return { label: type.replace('_', ' '), icon: 'utensils' };
    }
  };

  const badgeInfo = getMealTypeBadge(meal.mealType);

  return (
    <View style={[styles.card, style]}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.badgeWrapper}>
          <Icon name={badgeInfo.icon} size={15} color={colors.primaryDark} />
          <Badge label={badgeInfo.label} variant="neutral" size="sm" />
        </View>

        {meal.prepTimeMinutes ? (
          <View style={styles.prepTimeRow}>
            <Icon name="clock" size={13} color={colors.textMuted} />
            <Text style={styles.prepTime}>{meal.prepTimeMinutes} mins</Text>
          </View>
        ) : null}
      </View>

      {/* Meal Title */}
      <Text style={styles.title}>{meal.title}</Text>

      {/* Ingredients / Food Items */}
      {meal.items && meal.items.length > 0 ? (
        <View style={styles.itemsList}>
          {meal.items.map((item, idx) => (
            <View key={item.name || idx} style={styles.itemRow}>
              <Text style={styles.itemDot}>•</Text>
              <Text style={styles.itemName}>
                {item.name} ({item.quantityGrams}g)
              </Text>
              <Text style={styles.itemProtein}>{item.proteinGrams}g pro</Text>
            </View>
          ))}
        </View>
      ) : null}

      {/* Cooking Tip if present */}
      {meal.cookingTip ? (
        <View style={styles.tipBox}>
          <Icon name="sparkles" size={13} color={colors.primaryDark} />
          <Text style={styles.tipText}>{meal.cookingTip}</Text>
        </View>
      ) : null}

      {/* Bottom Macro & Action Summary */}
      <View style={styles.footerRow}>
        <View style={styles.macros}>
          <View style={styles.macroPill}>
            <Text style={styles.macroValue}>{meal.totalProteinGrams}g</Text>
            <Text style={styles.macroLabel}>Protein</Text>
          </View>
          <View style={styles.macroPill}>
            <Text style={styles.macroValue}>₹{meal.estimatedCost}</Text>
            <Text style={styles.macroLabel}>Est. Cost</Text>
          </View>
        </View>

        {onSwap ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onSwap(meal.id)}
            style={styles.swapButton}
          >
            <Icon name="refresh" size={12} color={colors.primaryDark} />
            <Text style={styles.swapText}>Swap</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  prepTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prepTime: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  title: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginVertical: spacing.xs,
  },
  itemsList: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    gap: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemDot: {
    color: colors.primary,
    fontSize: 14,
    marginRight: 6,
  },
  itemName: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
    flex: 1,
  },
  itemProtein: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primaryDark,
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    marginTop: spacing.xs,
  },
  tipText: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 15,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  macros: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  macroPill: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  macroValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  macroLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  swapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
  },
  swapText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.primaryDark,
  },
});

export default MealCard;
