import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { PlannedMeal } from '../../types';
import { Badge } from '../common/Badge';
import { Icon, IconName } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export interface MealCardProps {
  meal: PlannedMeal;
  timingLabel?: string;
  onPressDetails?: (meal: PlannedMeal) => void;
  onOpenSwap?: (meal: PlannedMeal) => void;
  style?: ViewStyle;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  timingLabel,
  onPressDetails,
  onOpenSwap,
  style,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  const getMealTypeConfig = (type: string): { label: string; iconName: IconName; color: string } => {
    switch (type.toLowerCase()) {
      case 'breakfast':
        return { label: 'Breakfast', iconName: 'sun', color: colors.primary };
      case 'lunch':
        return { label: 'Lunch', iconName: 'sun', color: '#D97706' };
      case 'snack':
      case 'snack_morning':
      case 'snack_evening':
        return { label: 'Fuel Stop', iconName: 'leaf', color: '#2563EB' };
      case 'dinner':
        return { label: 'Dinner', iconName: 'moon', color: '#7C3AED' };
      default:
        return { label: type.replace('_', ' '), iconName: 'utensils', color: colors.primary };
    }
  };

  const typeConfig = getMealTypeConfig(meal.mealType);
  const estCalories = meal.estCalories || Math.round(meal.totalProteinGrams * 16);
  const prepTime = meal.prepTimeMinutes || 15;
  const alternativesCount = meal.alternatives?.length || 3;

  return (
    <View style={[styles.card, style]}>
      {/* Top Header Row */}
      <View style={styles.topRow}>
        <View style={styles.badgeWrapper}>
          <Icon name={typeConfig.iconName} size={15} color={typeConfig.color} />
          <Badge label={typeConfig.label} variant="neutral" size="sm" />
          {timingLabel ? (
            <Text style={styles.timingText}>{timingLabel}</Text>
          ) : null}
        </View>

        <View style={styles.prepTimeRow}>
          <Icon name="clock" size={11} color={colors.textMuted} />
          <Text style={styles.prepTime}>{prepTime}m prep</Text>
        </View>
      </View>

      {/* Meal Title and Tap Action */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressDetails?.(meal)}
      >
        <Text style={styles.title}>{meal.title}</Text>
      </TouchableOpacity>

      {/* Macro Badges Strip */}
      <View style={styles.macroStrip}>
        <View style={styles.macroPill}>
          <Text style={styles.macroVal}>{meal.totalProteinGrams}g</Text>
          <Text style={styles.macroLbl}>Protein</Text>
        </View>
        <View style={styles.macroPill}>
          <Text style={styles.macroVal}>~{estCalories}</Text>
          <Text style={styles.macroLbl}>kcal</Text>
        </View>
        <View style={styles.macroPill}>
          <Text style={styles.macroVal}>₹{meal.estimatedCost}</Text>
          <Text style={styles.macroLbl}>Cost</Text>
        </View>
      </View>

      {/* Food Items Pill List */}
      {meal.items && meal.items.length > 0 ? (
        <View style={styles.itemsWrap}>
          {meal.items.slice(0, expanded ? undefined : 3).map((item, idx) => (
            <View key={`${item.name}-${idx}`} style={styles.itemPill}>
              <Text style={styles.itemPillText}>
                {item.name} ({item.quantityGrams}g)
              </Text>
            </View>
          ))}

          {meal.items.length > 3 && !expanded ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setExpanded(true)}
              style={styles.morePill}
            >
              <Text style={styles.morePillText}>+{meal.items.length - 3} more</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}

      {/* Cooking Tip Preview if present */}
      {meal.cookingTip && expanded ? (
        <View style={styles.tipBox}>
          <Icon name="sparkles" size={13} color="#B45309" />
          <Text style={styles.tipText}>{meal.cookingTip}</Text>
        </View>
      ) : null}

      {/* Footer Actions */}
      <View style={styles.footerRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => onPressDetails?.(meal)}
          style={styles.detailsBtn}
        >
          <Icon name="info" size={13} color={colors.textSecondary} />
          <Text style={styles.detailsBtnText}>Details & Recipe</Text>
        </TouchableOpacity>

        {onOpenSwap ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onOpenSwap(meal)}
            style={styles.swapBtn}
          >
            <Icon name="refresh" size={13} color={colors.primaryDark} />
            <Text style={styles.swapBtnText}>
              Swap {alternativesCount > 0 ? `(${alternativesCount})` : ''}
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  timingText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '800',
    color: colors.primaryDark,
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  prepTime: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  macroStrip: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  macroPill: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  macroVal: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
    fontSize: 11,
  },
  macroLbl: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  itemsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
  },
  itemPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  itemPillText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    fontWeight: '500',
  },
  morePill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  morePillText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  tipText: {
    ...typography.caption,
    color: '#78350F',
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
  },
  detailsBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 12,
  },
  swapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
  },
  swapBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 11,
  },
});

export default MealCard;
