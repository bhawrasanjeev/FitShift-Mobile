import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { PlannedMeal, MealAlternative } from '../../types';
import { BottomSheet } from '../interactive/BottomSheet';
import { Button } from '../common/Button';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface MealAlternativesModalProps {
  meal: PlannedMeal | null;
  visible: boolean;
  onClose: () => void;
  onSelectAlternative: (mealId: string, alternative: MealAlternative) => void;
}

function getDefaultAlternatives(mealType: string, currentProtein: number, _currentCost: number): MealAlternative[] {
  const type = (mealType || '').toLowerCase();
  if (type.includes('breakfast')) {
    return [
      {
        id: 'alt-default-breakfast-1',
        name: 'Paneer Stuffed Besan Chilla with Dahi',
        description: 'Gram flour savory crepes stuffed with grated paneer and served with homemade probiotic curd.',
        approxProteinG: Math.max(20, currentProtein),
        estCalories: 360,
        approxCostRupees: 22,
        prepTimeMinutes: 15,
        cookingTip: 'Whisk batter with ajwain and cook on medium flame until edges crisp up before stuffing.',
        ingredients: ['Besan (60g)', 'Fresh Paneer (50g)', 'Fresh Curd (100g)'],
        items: [
          { name: 'Besan (Bengal Gram Flour)', quantityGrams: 60, proteinGrams: 13, estimatedCost: 8, category: 'Legumes' },
          { name: 'Fresh Paneer (Loose)', quantityGrams: 50, proteinGrams: 9, estimatedCost: 20, category: 'Dairy' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-default-breakfast-2',
        name: 'Sprouted Moong Poha with Peanuts',
        description: 'Flattened rice tempered with mustard seeds, crunchy peanuts, and protein-packed green moong sprouts.',
        approxProteinG: Math.max(18, currentProtein - 2),
        estCalories: 380,
        approxCostRupees: 18,
        prepTimeMinutes: 12,
        cookingTip: 'Rinse poha gently and steam sprouts for 3 minutes before tossing together.',
        ingredients: ['Poha (80g)', 'Moong Sprouts (60g)', 'Peanuts (20g)'],
        items: [
          { name: 'Poha (Flattened Rice)', quantityGrams: 80, proteinGrams: 6, estimatedCost: 6, category: 'Grains' },
          { name: 'Green Moong Sabut (Sprouts)', quantityGrams: 60, proteinGrams: 14, estimatedCost: 8, category: 'Legumes' },
          { name: 'Raw Peanuts', quantityGrams: 20, proteinGrams: 5, estimatedCost: 3, category: 'Nuts & Seeds' }
        ]
      },
      {
        id: 'alt-default-breakfast-3',
        name: 'Chana Sattu Buttermilk Cooler & Peanuts',
        description: 'Traditional roasted gram flour dissolved in cold spiced buttermilk with a handful of raw nuts.',
        approxProteinG: 22,
        estCalories: 310,
        approxCostRupees: 16,
        prepTimeMinutes: 5,
        cookingTip: 'Whisk chilled chaas with sattu, roasted cumin, and rock salt for rapid digestive absorption.',
        ingredients: ['Chana Sattu (50g)', 'Chaas (300ml)', 'Peanuts (15g)'],
        items: [
          { name: 'Chana Sattu', quantityGrams: 50, proteinGrams: 13, estimatedCost: 8, category: 'Legumes' },
          { name: 'Chaas (Buttermilk)', quantityGrams: 300, proteinGrams: 5, estimatedCost: 9, category: 'Dairy' },
          { name: 'Raw Peanuts', quantityGrams: 15, proteinGrams: 4, estimatedCost: 3, category: 'Nuts & Seeds' }
        ]
      }
    ];
  }

  if (type.includes('lunch')) {
    return [
      {
        id: 'alt-default-lunch-1',
        name: 'Kala Chana Curry with 3 Phulkas & Curd',
        description: 'Desi black chickpeas slow-simmered in aromatic onion-tomato gravy, served with hot phulkas and dahi.',
        approxProteinG: Math.max(25, currentProtein),
        estCalories: 510,
        approxCostRupees: 22,
        prepTimeMinutes: 20,
        cookingTip: 'Pressure cook black chana with a bay leaf and black cardamom for richer homestyle aroma.',
        ingredients: ['Kala Chana (60g)', 'Atta (90g)', 'Curd (100g)'],
        items: [
          { name: 'Kala Chana', quantityGrams: 60, proteinGrams: 12, estimatedCost: 6, category: 'Legumes' },
          { name: 'Whole Wheat Atta', quantityGrams: 90, proteinGrams: 9, estimatedCost: 4, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-default-lunch-2',
        name: 'Yellow Moong Dal Tadka with Steamed Rice & Dahi',
        description: 'Light and easily digestible yellow split lentils tempered with cumin and ghee, served with rice and cooling curd.',
        approxProteinG: Math.max(22, currentProtein - 2),
        estCalories: 480,
        approxCostRupees: 19,
        prepTimeMinutes: 18,
        cookingTip: 'Add pinch of hing in cumin tadka to aid digestion.',
        ingredients: ['Moong Dal (60g)', 'Rice (70g)', 'Curd (150g)'],
        items: [
          { name: 'Yellow Moong Dal (Raw)', quantityGrams: 60, proteinGrams: 14, estimatedCost: 8, category: 'Legumes' },
          { name: 'White Rice (Raw)', quantityGrams: 70, proteinGrams: 5, estimatedCost: 4, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 150, proteinGrams: 5, estimatedCost: 13, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-default-lunch-3',
        name: 'Rajma Masala with Jeera Rice & Green Salad',
        description: 'Authentic North Indian red kidney beans slow-cooked with spices, paired with fragrant jeera rice.',
        approxProteinG: 24,
        estCalories: 530,
        approxCostRupees: 22,
        prepTimeMinutes: 25,
        cookingTip: 'Mash a small portion of cooked rajma against the pot to naturally thicken gravy.',
        ingredients: ['Rajma (60g)', 'Rice (70g)', 'Curd (100g)'],
        items: [
          { name: 'Rajma', quantityGrams: 60, proteinGrams: 13, estimatedCost: 8, category: 'Legumes' },
          { name: 'White Rice (Raw)', quantityGrams: 70, proteinGrams: 5, estimatedCost: 4, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      }
    ];
  }

  if (type.includes('dinner')) {
    return [
      {
        id: 'alt-default-dinner-1',
        name: 'Homestyle Dal Tadka with 2 Phulkas & Curd',
        description: 'Protein-packed yellow or black dal tempered with cumin, garlic, and tomato, served with wheat phulkas and fresh curd.',
        approxProteinG: Math.max(22, currentProtein),
        estCalories: 420,
        approxCostRupees: 18,
        prepTimeMinutes: 20,
        cookingTip: 'Temper dal with a dash of hing and freshly pounded cumin for enhanced digestive assimilation.',
        ingredients: ['Yellow Moong Dal (70g)', 'Atta (60g)', 'Curd (100g)'],
        items: [
          { name: 'Yellow Moong Dal (Raw)', quantityGrams: 70, proteinGrams: 16, estimatedCost: 9, category: 'Legumes' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' },
          { name: 'Fresh Curd (Dahi)', quantityGrams: 100, proteinGrams: 4, estimatedCost: 9, category: 'Dairy' }
        ]
      },
      {
        id: 'alt-default-dinner-2',
        name: 'Fresh Paneer Matar Curry with 2 Rotis',
        description: 'Soft cottage cheese cubes and sweet green peas simmered in a light homestyle gravy.',
        approxProteinG: 22,
        estCalories: 450,
        approxCostRupees: 35,
        prepTimeMinutes: 20,
        cookingTip: 'Soak paneer in warm water before adding to keep it tender without frying.',
        ingredients: ['Fresh Paneer (80g)', 'Atta (60g)', 'Matar'],
        items: [
          { name: 'Fresh Paneer (Loose)', quantityGrams: 80, proteinGrams: 14, estimatedCost: 32, category: 'Dairy' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' }
        ]
      },
      {
        id: 'alt-default-dinner-3',
        name: 'Tofu & Mixed Vegetable Stir-Fry with Roti',
        description: 'Soy paneer cubes stir-fried with capsicum, carrots, and cumin, served with whole wheat rotis.',
        approxProteinG: 20,
        estCalories: 380,
        approxCostRupees: 32,
        prepTimeMinutes: 15,
        cookingTip: 'Press tofu with a kitchen towel for 5 minutes before cubing to give it a firmer texture.',
        ingredients: ['Tofu (120g)', 'Whole Wheat Atta (60g)', 'Veggies'],
        items: [
          { name: 'Tofu (Soy Paneer)', quantityGrams: 120, proteinGrams: 11, estimatedCost: 33, category: 'Plant Dairy' },
          { name: 'Whole Wheat Atta', quantityGrams: 60, proteinGrams: 6, estimatedCost: 3, category: 'Grains' }
        ]
      }
    ];
  }

  // Snack default
  return [
    {
      id: 'alt-default-snack-1',
      name: 'Spicy Roasted Kala Chana & Fresh Chaas',
      description: 'Crunchy dry-roasted Bengal gram with chaat masala paired with cooling probiotic salted buttermilk.',
      approxProteinG: 14,
      estCalories: 250,
      approxCostRupees: 14,
      prepTimeMinutes: 5,
      cookingTip: 'Store roasted chana in an airtight glass jar to maintain maximum crispiness.',
      ingredients: ['Roasted Chana (40g)', 'Chaas (300ml)'],
      items: [
        { name: 'Roasted Chana (Bhuna)', quantityGrams: 40, proteinGrams: 8, estimatedCost: 7, category: 'Legumes' },
        { name: 'Chaas (Buttermilk)', quantityGrams: 300, proteinGrams: 5, estimatedCost: 9, category: 'Dairy' }
      ]
    },
    {
      id: 'alt-default-snack-2',
      name: 'Peanut Sattu Energy Shake with Milk',
      description: 'High-protein portable shake blending sattu flour, toned milk, and a spoon of crushed peanuts.',
      approxProteinG: 21,
      estCalories: 330,
      approxCostRupees: 18,
      prepTimeMinutes: 5,
      cookingTip: 'Use a shaker bottle with a spring wire ball for a completely lump-free sattu drink.',
      ingredients: ['Chana Sattu (40g)', 'Toned Milk (200ml)', 'Peanuts (15g)'],
      items: [
        { name: 'Chana Sattu', quantityGrams: 40, proteinGrams: 10, estimatedCost: 6, category: 'Legumes' },
        { name: 'Raw Peanuts', quantityGrams: 15, proteinGrams: 4, estimatedCost: 3, category: 'Nuts & Seeds' },
        { name: 'Toned Milk', quantityGrams: 200, proteinGrams: 6, estimatedCost: 12, category: 'Dairy' }
      ]
    }
  ];
}

export const MealAlternativesModal: React.FC<MealAlternativesModalProps> = ({
  meal,
  visible,
  onClose,
  onSelectAlternative,
}) => {
  if (!meal) return null;

  const currentProtein = meal.totalProteinGrams;
  const currentCost = meal.estimatedCost;
  const currentCalories = meal.estCalories || Math.round(currentProtein * 16);
  const alternatives = (meal.alternatives && meal.alternatives.length > 0)
    ? meal.alternatives
    : getDefaultAlternatives(meal.mealType, currentProtein, currentCost);

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      title="Swap Indian Meal"
      subtitle={`Explore verified alternatives for ${meal.title}`}
      footer={
        <Button
          title="Keep Current Meal"
          variant="secondary"
          size="md"
          onPress={onClose}
          style={styles.cancelBtn}
        />
      }
    >
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Selection Card */}
        <View style={styles.currentCard}>
          <Text style={styles.currentTag}>CURRENT PLANNED MEAL</Text>
          <Text style={styles.currentTitle}>{meal.title}</Text>
          <View style={styles.currentMacrosRow}>
            <View style={styles.currentMacroItem}>
              <Icon name="activity" size={13} color={colors.primary} />
              <Text style={styles.currentMacroText}>{currentProtein}g pro</Text>
            </View>
            <Text style={styles.currentMacroDot}>•</Text>
            <View style={styles.currentMacroItem}>
              <Icon name="fire" size={13} color={colors.warning} />
              <Text style={styles.currentMacroText}>~{currentCalories} kcal</Text>
            </View>
            <Text style={styles.currentMacroDot}>•</Text>
            <Text style={styles.currentMacroText}>₹{currentCost}</Text>
          </View>
        </View>

        <Text style={styles.sectionHeading}>
          AVAILABLE INDIAN SWAPS ({alternatives.length})
        </Text>

        {alternatives.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>
              No direct alternatives available for this meal slot yet.
            </Text>
          </View>
        ) : (
          <View style={styles.altList}>
            {alternatives.map((alt) => {
              const proDiff = alt.approxProteinG - currentProtein;
              const costDiff = alt.approxCostRupees - currentCost;
              const calDiff = alt.estCalories - currentCalories;

              return (
                <View key={alt.id} style={styles.altCard}>
                  {/* Alternative Header */}
                  <View style={styles.altHeader}>
                    <View style={styles.altTitleWrapper}>
                      <Text style={styles.altTitle}>{alt.name}</Text>
                      <Text style={styles.altDesc}>{alt.description}</Text>
                    </View>
                  </View>

                  {/* Macro Comparison Badges */}
                  <View style={styles.comparisonRow}>
                    <View style={styles.metricBadge}>
                      <Text style={styles.metricValue}>{alt.approxProteinG}g Pro</Text>
                      {proDiff !== 0 && (
                        <Text
                          style={[
                            styles.diffText,
                            proDiff > 0 ? styles.diffPositive : styles.diffNeutral,
                          ]}
                        >
                          {proDiff > 0 ? `+${proDiff}g` : `${proDiff}g`}
                        </Text>
                      )}
                    </View>

                    <View style={styles.metricBadge}>
                      <Text style={styles.metricValue}>~{alt.estCalories} kcal</Text>
                      {calDiff !== 0 && (
                        <Text style={styles.diffText}>
                          {calDiff > 0 ? `+${calDiff}` : `${calDiff}`}
                        </Text>
                      )}
                    </View>

                    <View style={styles.metricBadge}>
                      <Text style={styles.metricValue}>₹{alt.approxCostRupees}</Text>
                      {costDiff !== 0 && (
                        <Text
                          style={[
                            styles.diffText,
                            costDiff < 0 ? styles.diffPositive : styles.diffNeutral,
                          ]}
                        >
                          {costDiff > 0 ? `+₹${costDiff}` : `-₹${Math.abs(costDiff)}`}
                        </Text>
                      )}
                    </View>

                    <View style={styles.metricBadge}>
                      <Text style={styles.metricValue}>{alt.prepTimeMinutes}m prep</Text>
                    </View>
                  </View>

                  {/* Ingredients Preview */}
                  {alt.ingredients && alt.ingredients.length > 0 ? (
                    <View style={styles.ingPillsWrap}>
                      {alt.ingredients.map((ing, iIdx) => (
                        <View key={iIdx} style={styles.ingPill}>
                          <Text style={styles.ingPillText}>{ing}</Text>
                        </View>
                      ))}
                    </View>
                  ) : null}

                  {/* Cooking Tip if present */}
                  {alt.cookingTip ? (
                    <View style={styles.altTipBox}>
                      <Icon name="sparkles" size={13} color="#B45309" />
                      <Text style={styles.altTipText}>{alt.cookingTip}</Text>
                    </View>
                  ) : null}

                  {/* Action Button */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      onSelectAlternative(meal.id, alt);
                      onClose();
                    }}
                    style={styles.replaceBtn}
                  >
                    <Icon name="check" size={14} color="#FFFFFF" />
                    <Text style={styles.replaceBtnText}>Replace With This Meal</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        )}
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
  currentCard: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: 4,
  },
  currentTag: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  currentTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  currentMacrosRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 2,
  },
  currentMacroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  currentMacroDot: {
    color: colors.textMuted,
    fontSize: 10,
  },
  currentMacroText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 12,
  },
  sectionHeading: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  emptyCard: {
    padding: spacing.lg,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  altList: {
    gap: spacing.md,
  },
  altCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  altHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  altTitleWrapper: {
    flex: 1,
    gap: 2,
  },
  altTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  altDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 11,
  },
  comparisonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  metricBadge: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricValue: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 11,
  },
  diffText: {
    ...typography.caption,
    fontWeight: '800',
    fontSize: 10,
    color: colors.textMuted,
  },
  diffPositive: {
    color: colors.primaryDark,
  },
  diffNeutral: {
    color: colors.textSecondary,
  },
  ingPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xxs,
  },
  ingPill: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  ingPillText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
  },
  altTipBox: {
    backgroundColor: '#FEF3C7',
    padding: spacing.sm,
    borderRadius: borderRadius.md,
  },
  altTipText: {
    ...typography.caption,
    fontSize: 10,
    color: '#78350F',
    lineHeight: 15,
  },
  replaceBtn: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.xxs,
  },
  replaceBtnText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.surface,
    fontSize: 12,
  },
  cancelBtn: {
    width: '100%',
  },
});

export default MealAlternativesModal;
