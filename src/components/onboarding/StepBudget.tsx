import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Budget, BudgetTier } from '../../types';
import { Badge } from '../common/Badge';
import { NumberInput } from '../selection/NumberInput';
import { OptionChip } from '../selection/OptionChip';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepBudgetProps {
  data: Budget;
  onChange: (updated: Partial<Budget>) => void;
}

export const StepBudget: React.FC<StepBudgetProps> = ({
  data,
  onChange,
}) => {
  const tiers: {
    id: BudgetTier;
    title: string;
    range: string;
    avgDaily: number;
    description: string;
    samplePantry: string;
    tag?: string;
  }[] = [
    {
      id: 'ultra_budget',
      title: 'Ultra-Budget',
      range: 'Under ₹45 / day',
      avgDaily: 40,
      description:
        'Built primarily around high-protein whole foods: Chana Sattu, Soya Chunks (52% protein), Yellow Moong, and seasonal sabzi.',
      samplePantry: 'Sattu buttermilk, boiled kala chana, soya chunks pulao, phulkas.',
      tag: 'Maximum Value',
    },
    {
      id: 'budget',
      title: 'Budget',
      range: '₹45 – ₹80 / day',
      avgDaily: 65,
      description:
        'Adds fresh daily curd (dahi), eggs (if eggetarian), roasted peanuts, bananas, and occasional fresh paneer portions.',
      samplePantry: 'Sprouted moong chaat, eggs/paneer bhurji, curd rice, dal tadka.',
      tag: 'Most Popular',
    },
    {
      id: 'moderate',
      title: 'Moderate',
      range: '₹80 – ₹150 / day',
      avgDaily: 110,
      description:
        'Enables generous daily paneer (100–150g), whole milk, chicken breast portions (non-veg), almonds, and diverse fresh greens.',
      samplePantry: 'Palak paneer, chicken curry, double egg toast, dry fruit oats.',
      tag: 'Flexible Variety',
    },
    {
      id: 'custom',
      title: 'Custom Budget',
      range: 'Set your own daily limit',
      avgDaily: data.customAmountRupees || 100,
      description:
        'Specify an exact daily allowance tailored to your city, grocery delivery subscriptions, or dining preferences.',
      samplePantry: 'Scaled automatically based on your custom target.',
    },
  ];

  const customPresets = [50, 75, 100, 120, 150, 200];

  const handleSelectTier = (t: typeof tiers[0]) => {
    const dailyBudget = t.id === 'custom' ? (data.customAmountRupees || 100) : t.avgDaily;
    onChange({
      tier: t.id,
      dailyBudgetRupees: dailyBudget,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>SELECT YOUR DAILY FOOD BUDGET TIER</Text>
        <Text style={styles.helperText}>
          Real nutrition should never strain your personal finances.
        </Text>
        <View style={styles.tierList}>
          {tiers.map((t) => {
            const isSelected = data.tier === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.75}
                onPress={() => handleSelectTier(t)}
                style={[
                  styles.tierCard,
                  isSelected ? styles.tierCardSelected : styles.tierCardUnselected,
                ]}
              >
                <View style={styles.tierHeader}>
                  <View style={styles.tierTitleCol}>
                    <View style={styles.titleRow}>
                      <Text style={[styles.tierTitle, isSelected && styles.tierTitleSelected]}>
                        {t.title}
                      </Text>
                      {t.tag ? (
                        <Badge
                          label={t.tag}
                          variant={isSelected ? 'accent' : 'neutral'}
                          size="sm"
                        />
                      ) : null}
                    </View>
                    <Text style={styles.tierRange}>₹ {t.range}</Text>
                  </View>

                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleSelected,
                    ]}
                  >
                    {isSelected ? <View style={styles.radioDot} /> : null}
                  </View>
                </View>

                <Text style={styles.tierDesc}>{t.description}</Text>

                <View style={styles.samplePantryBox}>
                  <Text style={styles.samplePantryText}>
                    <Text style={styles.pantryLabel}>Includes: </Text>
                    {t.samplePantry}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Custom Budget Controls */}
      {data.tier === 'custom' ? (
        <View style={styles.customBox}>
          <Text style={styles.label}>SPECIFY YOUR TARGET DAILY FOOD SPEND</Text>
          <NumberInput
            label="DAILY BUDGET (₹)"
            value={data.customAmountRupees || data.dailyBudgetRupees}
            onChangeValue={(val) => {
              onChange({
                customAmountRupees: val,
                dailyBudgetRupees: val,
              });
            }}
            min={30}
            max={500}
            step={5}
            unit="₹/day"
          />
          <View style={styles.presetsRow}>
            {customPresets.map((amount) => (
              <OptionChip
                key={amount}
                label={`₹${amount}`}
                selected={data.dailyBudgetRupees === amount}
                onPress={() => {
                  onChange({
                    customAmountRupees: amount,
                    dailyBudgetRupees: amount,
                  });
                }}
                size="sm"
              />
            ))}
          </View>
          <Text style={styles.customCalcText}>
            ≈ ₹{data.dailyBudgetRupees * 7} per week for groceries & meal staples.
          </Text>
        </View>
      ) : null}
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
  tierList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  tierCard: {
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    gap: spacing.xs,
  },
  tierCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  tierCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  tierHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tierTitleCol: {
    gap: 2,
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  tierTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  tierTitleSelected: {
    color: colors.primaryDark,
  },
  tierRange: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  tierDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: spacing.xxs,
  },
  samplePantryBox: {
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
  },
  samplePantryText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
  },
  pantryLabel: {
    fontWeight: '700',
    color: colors.textSecondary,
  },
  customBox: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  customCalcText: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
