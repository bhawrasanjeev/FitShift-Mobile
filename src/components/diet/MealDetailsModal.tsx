import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { PlannedMeal } from '../../types';
import { BottomSheet } from '../interactive/BottomSheet';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface MealDetailsModalProps {
  meal: PlannedMeal | null;
  visible: boolean;
  onClose: () => void;
  onOpenSwap?: (meal: PlannedMeal) => void;
}

export const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  meal,
  visible,
  onClose,
  onOpenSwap,
}) => {
  if (!meal) return null;

  const mealTypeLabels: Record<string, string> = {
    breakfast: 'Morning Breakfast',
    lunch: 'Balanced Lunch',
    snack: 'Afternoon Fuel Stop',
    snack_morning: 'Mid-Morning Fuel',
    snack_evening: 'Pre/Post-Workout Snack',
    dinner: 'Restorative Dinner',
  };

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title={meal.title}
      subtitle={mealTypeLabels[meal.mealType] || meal.mealType.toUpperCase()}
      footer={
        <View style={styles.footerRow}>
          {onOpenSwap ? (
            <Button
              title="Swap Alternative"
              variant="outline"
              size="md"
              onPress={() => {
                onClose();
                onOpenSwap(meal);
              }}
              style={styles.swapBtn}
            />
          ) : null}
          <Button
            title="Done"
            variant="primary"
            size="md"
            onPress={onClose}
            style={styles.doneBtn}
          />
        </View>
      }
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Macros Strip */}
        <View style={styles.macroStrip}>
          <View style={styles.macroCol}>
            <Text style={styles.macroVal}>{meal.totalProteinGrams}g</Text>
            <Text style={styles.macroLbl}>Protein</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.macroCol}>
            <Text style={styles.macroVal}>~{meal.estCalories || Math.round(meal.totalProteinGrams * 16)}</Text>
            <Text style={styles.macroLbl}>Calories</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.macroCol}>
            <Text style={styles.macroVal}>₹{meal.estimatedCost}</Text>
            <Text style={styles.macroLbl}>Est. Cost</Text>
          </View>
          <View style={styles.vDivider} />
          <View style={styles.macroCol}>
            <Text style={styles.macroVal}>{meal.prepTimeMinutes || 15}m</Text>
            <Text style={styles.macroLbl}>Prep Time</Text>
          </View>
        </View>

        {/* Complete Ingredient Quantities */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>INGREDIENTS & PORTIONS</Text>
            <Badge label={`${meal.items.length} items`} variant="neutral" size="sm" />
          </View>

          <View style={styles.ingredientsBox}>
            {meal.items.map((item, idx) => (
              <View key={`${item.name}-${idx}`} style={styles.ingredientRow}>
                <View style={styles.ingLeft}>
                  <Text style={styles.bulletDot}>•</Text>
                  <View>
                    <Text style={styles.ingName}>{item.name}</Text>
                    <Text style={styles.ingCategory}>{item.category || 'Pantry Staple'}</Text>
                  </View>
                </View>
                <View style={styles.ingRight}>
                  <Text style={styles.ingQty}>{item.quantityGrams}g</Text>
                  <Text style={styles.ingPro}>{item.proteinGrams}g pro • ₹{item.estimatedCost}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Cooking Tip & Culinary Technique */}
        {meal.cookingTip ? (
          <View style={styles.tipBox}>
            <Icon name="sparkles" size={15} color="#B45309" />
            <View style={styles.tipContent}>
              <Text style={styles.tipHeading}>Indian Kitchen Preparation Tip</Text>
              <Text style={styles.tipBody}>{meal.cookingTip}</Text>
            </View>
          </View>
        ) : null}

        {/* Practical Weighing Notice */}
        <View style={styles.noticeBox}>
          <Icon name="shield" size={14} color={colors.primaryDark} />
          <Text style={styles.noticeText}>
            Portions reflect unsoaked dry weight for dals, rajma, chana, oats, and atta before cooking. Standard household spices, salt, and 1 tsp cooking oil are factored in.
          </Text>
        </View>
      </ScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 460,
  },
  scrollContent: {
    paddingVertical: spacing.sm,
    gap: spacing.md,
  },
  macroStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
  },
  macroCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  macroVal: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  macroLbl: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  vDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderSubtle,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  ingredientsBox: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.xs,
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  ingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  bulletDot: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  ingName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ingCategory: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
  },
  ingRight: {
    alignItems: 'flex-end',
    gap: 2,
  },
  ingQty: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  ingPro: {
    ...typography.caption,
    fontSize: 10,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  tipBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  tipIcon: {
    fontSize: 18,
    marginTop: 1,
  },
  tipContent: {
    flex: 1,
    gap: 2,
  },
  tipHeading: {
    ...typography.caption,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.3,
  },
  tipBody: {
    ...typography.caption,
    color: '#78350F',
    lineHeight: 17,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  noticeIcon: {
    fontSize: 13,
    marginTop: 1,
  },
  noticeText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    flex: 1,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  swapBtn: {
    flex: 1,
  },
  doneBtn: {
    flex: 1,
  },
});

export default MealDetailsModal;
