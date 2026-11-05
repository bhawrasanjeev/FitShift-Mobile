import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { PersonalBasics, FitnessGoal, Gender } from '../../types';
import { SelectCard } from '../selection/SelectCard';
import { NumberInput } from '../selection/NumberInput';
import { Icon, IconName } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepPersonalBasicsProps {
  data: PersonalBasics;
  onChange: (updated: Partial<PersonalBasics>) => void;
  error?: string | null;
}

export const StepPersonalBasics: React.FC<StepPersonalBasicsProps> = ({
  data,
  onChange,
  error,
}) => {
  const goals: { id: FitnessGoal; title: string; description: string; badge: string; iconName: IconName }[] = [
    {
      id: 'muscle_gain',
      title: 'Muscle Gain & Strength',
      description: 'Progressive overload routines with protein-dense Indian whole meals.',
      badge: 'High Protein',
      iconName: 'dumbbell',
    },
    {
      id: 'fat_loss',
      title: 'Fat Loss & Definition',
      description: 'Preserve lean muscle while maintaining a sustainable modest calorie deficit.',
      badge: 'Calorie Deficit',
      iconName: 'fire',
    },
    {
      id: 'weight_loss',
      title: 'Overall Weight Reduction',
      description: 'High-volume low-cost veggies, lentils, and structured consistent daily steps.',
      badge: 'High Volume',
      iconName: 'activity',
    },
    {
      id: 'maintenance',
      title: 'Energy & Health Maintenance',
      description: 'Balanced vitality, cardiovascular health, mobility, and sustainable daily rhythm.',
      badge: 'Balanced',
      iconName: 'leaf',
    },
  ];

  const genders: { id: Gender; label: string }[] = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' },
    { id: 'other', label: 'Other' },
  ];

  return (
    <View style={styles.container}>
      {/* Name and Gender Section */}
      <View style={styles.section}>
        <Text style={styles.label}>
          YOUR NAME <Text style={styles.optionalText}>(optional)</Text>
        </Text>
        <TextInput
          value={data.name}
          onChangeText={(text) => onChange({ name: text })}
          placeholder="e.g. Aarav, Priya"
          placeholderTextColor={colors.textMuted}
          style={styles.textInput}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>GENDER</Text>
        <View style={styles.genderRow}>
          {genders.map((g) => {
            const isSelected = data.gender === g.id;
            return (
              <TouchableOpacity
                key={g.id}
                activeOpacity={0.7}
                onPress={() => onChange({ gender: g.id })}
                style={[
                  styles.genderButton,
                  isSelected ? styles.genderButtonSelected : styles.genderButtonUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.genderButtonText,
                    isSelected && styles.genderButtonTextSelected,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Numerical Metrics Section */}
      <View style={styles.metricsContainer}>
        <NumberInput
          label="AGE (YEARS)"
          value={data.age}
          onChangeValue={(val) => onChange({ age: val })}
          min={14}
          max={100}
          step={1}
          unit="yrs"
          style={styles.metricInput}
        />

        <NumberInput
          label="HEIGHT (CM)"
          value={data.heightCm}
          onChangeValue={(val) => onChange({ heightCm: val })}
          min={100}
          max={250}
          step={1}
          unit="cm"
          style={styles.metricInput}
        />

        <NumberInput
          label="WEIGHT (KG)"
          value={data.weightKg}
          onChangeValue={(val) => onChange({ weightKg: val })}
          min={30}
          max={300}
          step={1}
          unit="kg"
          style={styles.metricInput}
        />
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Icon name="alert" size={14} color="#DC2626" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {/* Fitness Goals */}
      <View style={styles.section}>
        <Text style={styles.label}>PRIMARY FITNESS GOAL</Text>
        <Text style={styles.helperText}>
          Determines your Mifflin-St Jeor calorie delta and daily protein multiplier.
        </Text>
        <View style={styles.goalList}>
          {goals.map((g) => (
            <SelectCard
              key={g.id}
              title={g.title}
              description={g.description}
              badge={g.badge}
              icon={
                <Icon
                  name={g.iconName}
                  size={18}
                  color={data.goal === g.id ? colors.primaryDark : colors.textSecondary}
                />
              }
              selected={data.goal === g.id}
              onSelect={() => onChange({ goal: g.id })}
              style={styles.goalCard}
            />
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
  optionalText: {
    fontWeight: '400',
    color: colors.textMuted,
    textTransform: 'none',
  },
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  textInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
  },
  genderRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  genderButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  genderButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  genderButtonUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  genderButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  genderButtonTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  metricsContainer: {
    gap: spacing.md,
  },
  metricInput: {
    marginBottom: spacing.xs,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
  },
  goalList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  goalCard: {
    marginBottom: spacing.xs,
  },
});
