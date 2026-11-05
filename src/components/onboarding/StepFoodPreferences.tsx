import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  FoodPreferences,
  DietType,
  CookingSituation,
  IndianFoodStyle,
} from '../../types';
import { SelectCard } from '../selection/SelectCard';
import { Badge } from '../common/Badge';
import { Icon, IconName } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepFoodPreferencesProps {
  data: FoodPreferences;
  onChange: (updated: Partial<FoodPreferences>) => void;
}

export const StepFoodPreferences: React.FC<StepFoodPreferencesProps> = ({
  data,
  onChange,
}) => {
  const diets: { id: DietType; label: string; desc: string; badge: string; icon: IconName }[] = [
    {
      id: 'pure_veg',
      label: 'Pure Vegetarian',
      desc: 'Dairy, pulses, sattu, soya, paneer & whole grains. Zero eggs/meat.',
      badge: 'Zero Meat/Egg',
      icon: 'leaf',
    },
    {
      id: 'eggetarian',
      label: 'Eggetarian',
      desc: 'Vegetarian staples plus whole eggs and egg whites for budget protein.',
      badge: 'Eggs Included',
      icon: 'egg',
    },
    {
      id: 'non_veg',
      label: 'Non-Vegetarian',
      desc: 'Eggs, chicken, fish combined with traditional dal, roti and sabzi.',
      badge: 'Chicken & Eggs',
      icon: 'utensils',
    },
  ];

  const cookingSituations: { id: CookingSituation; title: string; desc: string; badge: string }[] = [
    {
      id: 'hostel_mess',
      title: 'Hostel / PG / Office Mess',
      desc: 'Limited kitchen access. Relies on mess foods, fruits & no-cook add-ons.',
      badge: 'No Cook',
    },
    {
      id: 'family_provided',
      title: 'Family / Tiffin-Provided',
      desc: 'Standard home-cooked meals with simple high-protein portions added.',
      badge: 'Home Cooked',
    },
    {
      id: 'self_cooking',
      title: 'Self-Cooking / Meal Prep',
      desc: 'Full kitchen access to prepare custom stir-fries, shakes, or batch prep.',
      badge: 'Full Kitchen',
    },
  ];

  const mealCounts = [3, 4, 5];

  const indianStyles: { id: IndianFoodStyle; title: string; desc: string }[] = [
    {
      id: 'simple_homestyle',
      title: 'Simple Ghar-ka-Khana',
      desc: 'Minimal oil, yellow dal, roti, seasonal sabzi, dahi',
    },
    {
      id: 'high_protein_everyday',
      title: 'High-Protein Focus',
      desc: 'Sattu, soya chunks, kala chana, eggs/paneer with every meal',
    },
    {
      id: 'north_indian',
      title: 'North Indian Regional',
      desc: 'Rajma, chole, paneer, paratha adjustments, curd chaas',
    },
    {
      id: 'south_indian',
      title: 'South Indian Regional',
      desc: 'Idli/dosa with sambar, curd rice, sundal, rasam, egg roasts',
    },
  ];

  const commonStaples = [
    'Roti (Phulka)',
    'Yellow Moong Dal',
    'Chana Sattu',
    'Kala Chana',
    'Fresh Dahi / Curd',
    'Soya Chunks',
    'Boiled Eggs',
    'Fresh Paneer',
  ];

  return (
    <View style={styles.container}>
      {/* Dietary Baseline */}
      <View style={styles.section}>
        <Text style={styles.label}>DIETARY BASELINE</Text>
        <Text style={styles.helperText}>
          Select your dietary discipline for protein sourcing.
        </Text>
        <View style={styles.dietList}>
          {diets.map((d) => (
            <SelectCard
              key={d.id}
              title={d.label}
              description={d.desc}
              badge={d.badge}
              icon={
                <Icon
                  name={d.icon}
                  size={20}
                  color={data.dietType === d.id ? colors.primaryDark : colors.textSecondary}
                />
              }
              selected={data.dietType === d.id}
              onSelect={() => onChange({ dietType: d.id })}
              style={styles.dietCard}
            />
          ))}
        </View>
      </View>

      {/* Cooking Setup */}
      <View style={styles.section}>
        <Text style={styles.label}>COOKING & KITCHEN ACCESS</Text>
        <View style={styles.cookingList}>
          {cookingSituations.map((sit) => (
            <SelectCard
              key={sit.id}
              title={sit.title}
              description={sit.desc}
              badge={sit.badge}
              selected={data.cookingSituation === sit.id}
              onSelect={() => onChange({ cookingSituation: sit.id })}
              style={styles.cookingCard}
            />
          ))}
        </View>
      </View>

      {/* Meals Per Day */}
      <View style={styles.section}>
        <Text style={styles.label}>PREFERRED MEALS PER DAY</Text>
        <View style={styles.mealCountRow}>
          {mealCounts.map((num) => {
            const isSelected = data.mealsPerDay === num;
            return (
              <TouchableOpacity
                key={num}
                activeOpacity={0.7}
                onPress={() => onChange({ mealsPerDay: num })}
                style={[
                  styles.mealCountButton,
                  isSelected ? styles.mealCountSelected : styles.mealCountUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.mealCountTitle,
                    isSelected && styles.mealCountTitleSelected,
                  ]}
                >
                  {num} Meals
                </Text>
                <Text style={styles.mealCountSub}>
                  {num === 3 ? 'Classic' : num === 4 ? '+ Workout snack' : 'Small & frequent'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Indian Food Style */}
      <View style={styles.section}>
        <Text style={styles.label}>PREFERRED INDIAN FOOD STYLE</Text>
        <Text style={styles.helperText}>
          Adapts recipe flavor profiles, spices and grocery planning.
        </Text>
        <View style={styles.styleList}>
          {indianStyles.map((st) => (
            <SelectCard
              key={st.id}
              title={st.title}
              description={st.desc}
              selected={data.indianFoodStyle === st.id}
              onSelect={() => onChange({ indianFoodStyle: st.id })}
              style={styles.styleCard}
            />
          ))}
        </View>
      </View>

      {/* Staples Preview Box */}
      <View style={styles.staplesBox}>
        <Text style={styles.staplesTitle}>STAPLES BUILT INTO YOUR PLAN</Text>
        <View style={styles.staplesRow}>
          {commonStaples.map((staple) => (
            <Badge key={staple} label={staple} variant="neutral" size="sm" />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.lg,
  },
  section: {
    gap: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  dietList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dietCard: {
    marginBottom: spacing.xs,
  },
  cookingList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  cookingCard: {
    marginBottom: spacing.xs,
  },
  mealCountRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  mealCountButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealCountSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  mealCountUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  mealCountTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  mealCountTitleSelected: {
    color: colors.primaryDark,
  },
  mealCountSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
    textAlign: 'center',
  },
  styleList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  styleCard: {
    marginBottom: spacing.xs,
  },
  staplesBox: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  staplesTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  staplesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
});
