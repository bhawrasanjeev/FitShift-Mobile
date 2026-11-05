import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Supplements, SupplementPreference } from '../../types';
import { SelectCard } from '../selection/SelectCard';
import { NumberInput } from '../selection/NumberInput';
import { OptionChip } from '../selection/OptionChip';
import { Icon, IconName } from '../common/Icon';
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
    icon: IconName;
  }[] = [
    {
      id: 'no_supplements',
      title: 'No supplements — build with regular food',
      description:
        'Prioritize 100% kitchen staples: Sattu, Moong Dal, Kala Chana, Curd, Paneer, and Eggs. Zero powders.',
      badge: 'Recommended',
      icon: 'leaf',
    },
    {
      id: 'open_to_supplements',
      title: "Yes, I'm open to evidence-backed supplements",
      description:
        'Consider practical additions like pure Creatine Monohydrate or convenient unflavoured Whey Protein.',
      icon: 'pill',
    },
    {
      id: 'not_sure',
      title: 'Not sure — help me understand my options',
      description:
        'FitShift will provide an educational breakdown showing food alternatives alongside supplement costs.',
      icon: 'info',
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
              icon={
                <Icon
                  name={opt.icon}
                  size={20}
                  color={data.preference === opt.id ? colors.primaryDark : colors.textSecondary}
                />
              }
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

      {/* Food-First Note */}
      <View style={styles.noticeBox}>
        <Icon name="shield" size={16} color={colors.primary} />
        <Text style={styles.noticeText}>
          Whole foods are prioritized. Supplements remain strictly optional.
        </Text>
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
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  noticeText: {
    ...typography.caption,
    color: colors.primaryDark,
    flex: 1,
    fontWeight: '500',
  },
});
