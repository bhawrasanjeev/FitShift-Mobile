import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Supplements, SupplementPreference } from '../../types';
import { SelectCard } from '../selection/SelectCard';
import { NumberInput } from '../selection/NumberInput';
import { OptionChip } from '../selection/OptionChip';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepSupplementsProps {
  data: Supplements;
  onChange: (updated: Partial<Supplements>) => void;
}

export const StepSupplements: React.FC<StepSupplementsProps> = ({
  data,
  onChange,
}) => {
  const options: {
    id: SupplementPreference;
    title: string;
    description: string;
    badge?: string;
    icon: string;
  }[] = [
    {
      id: 'no_supplements',
      title: 'No supplements — build with regular food',
      description:
        'Prioritize 100% kitchen staples: Sattu, Moong Dal, Kala Chana, Curd, Paneer, and Eggs. Zero powders.',
      badge: 'Recommended',
      icon: '🍎',
    },
    {
      id: 'open_to_supplements',
      title: "Yes, I'm open to evidence-backed supplements",
      description:
        'Consider practical additions like pure Creatine Monohydrate or convenient unflavoured Whey Protein.',
      icon: '💊',
    },
    {
      id: 'not_sure',
      title: 'Not sure — help me understand my options',
      description:
        'FitShift will provide an educational breakdown showing food alternatives alongside supplement costs.',
      icon: '❓',
    },
  ];

  const budgetPresets = [400, 1000, 1500, 2500, 4000];

  return (
    <View style={styles.container}>
      {/* Supplement Philosophy */}
      <View style={styles.section}>
        <Text style={styles.label}>SUPPLEMENT PHILOSOPHY</Text>
        <Text style={styles.helperText}>
          Whole foods are always sufficient. Powders remain strictly optional.
        </Text>
        <View style={styles.optionsList}>
          {options.map((opt) => (
            <SelectCard
              key={opt.id}
              title={opt.title}
              description={opt.description}
              badge={opt.badge}
              icon={<Text style={styles.optionIcon}>{opt.icon}</Text>}
              selected={data.preference === opt.id}
              onSelect={() => onChange({ preference: opt.id })}
              style={styles.optionCard}
            />
          ))}
        </View>
      </View>

      {/* Conditional Monthly Supplement Budget */}
      {data.preference === 'open_to_supplements' ? (
        <View style={styles.budgetBox}>
          <Text style={styles.label}>OPTIONAL MONTHLY SUPPLEMENT BUDGET CAP</Text>
          <NumberInput
            label="MONTHLY BUDGET (₹)"
            value={data.monthlyBudgetRupees || 1200}
            onChangeValue={(val) => onChange({ monthlyBudgetRupees: val })}
            min={400}
            max={4000}
            step={100}
            unit="₹/mo"
          />
          <View style={styles.presetsRow}>
            {budgetPresets.map((amt) => (
              <OptionChip
                key={amt}
                label={`₹${amt}`}
                selected={(data.monthlyBudgetRupees || 1200) === amt}
                onPress={() => onChange({ monthlyBudgetRupees: amt })}
                size="sm"
              />
            ))}
          </View>
          <Text style={styles.budgetDesc}>
            ₹400 (Creatine only) • ₹1,500 (Creatine + Basic Whey) • ₹4,000 (Isolate)
          </Text>
        </View>
      ) : null}

      {/* Food-First Integrity Callout */}
      <View style={styles.noticeBox}>
        <Text style={styles.noticeIcon}>🛡️</Text>
        <View style={styles.noticeTextContainer}>
          <Text style={styles.noticeTitle}>Food-First Integrity</Text>
          <Text style={styles.noticeText}>
            No supplement is mandatory for fitness, muscle hypertrophy, or weight loss. We never recommend commercial powders simply because a budget exists.
          </Text>
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
  optionsList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  optionCard: {
    marginBottom: spacing.xs,
  },
  optionIcon: {
    fontSize: 20,
  },
  budgetBox: {
    backgroundColor: colors.backgroundSecondary,
    borderColor: colors.border,
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
  budgetDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
  },
  noticeIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  noticeTextContainer: {
    flex: 1,
    gap: spacing.xxs,
  },
  noticeTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  noticeText: {
    ...typography.caption,
    color: colors.primaryDark,
    lineHeight: 18,
  },
});
