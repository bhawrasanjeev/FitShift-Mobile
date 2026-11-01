import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  TrainingSetup,
  WorkoutDuration,
  PreferredWorkoutTime,
  ExperienceLevel,
} from '../../types';
import { SelectCard } from '../selection/SelectCard';
import { MultiSelectCard } from '../selection/MultiSelectCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepTrainingSetupProps {
  data: TrainingSetup;
  onChange: (updated: Partial<TrainingSetup>) => void;
}

export const StepTrainingSetup: React.FC<StepTrainingSetupProps> = ({
  data,
  onChange,
}) => {
  const durations: WorkoutDuration[] = [20, 30, 45, 60];
  const frequencies = [3, 4, 5, 6];

  const times: { id: PreferredWorkoutTime; label: string; period: string }[] = [
    { id: 'morning', label: 'Morning', period: '6 AM – 9 AM' },
    { id: 'afternoon', label: 'Afternoon', period: '12 PM – 3 PM' },
    { id: 'evening', label: 'Evening', period: '5 PM – 8 PM' },
    { id: 'night', label: 'Late Night', period: '8 PM – 11 PM' },
    { id: 'flexible', label: 'Flexible', period: 'Any slot' },
  ];

  const experiences: { id: ExperienceLevel; title: string; desc: string; badge: string }[] = [
    {
      id: 'beginner',
      title: 'Beginner',
      desc: 'New to progressive training, focusing on fundamental movement patterns.',
      badge: 'Form First',
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      desc: '6+ months of consistent training, ready for structured progressive volume.',
      badge: 'Progressive Overload',
    },
    {
      id: 'advanced',
      title: 'Advanced',
      desc: '2+ years of lifting, tuned to targeted tempo, compound lifts and intensity.',
      badge: 'High Intensity',
    },
  ];

  const homeEquipmentList = [
    { id: 'none', label: 'No Equipment (Strict Bodyweight)' },
    { id: 'dumbbells', label: 'Pair of Dumbbells' },
    { id: 'resistance_bands', label: 'Resistance Bands / Loop Bands' },
    { id: 'pull_up_bar', label: 'Doorway Pull-up Bar' },
    { id: 'yoga_mat', label: 'Yoga Mat' },
    { id: 'other', label: 'Other / Backpack with Books' },
  ];

  const handleToggleHomeEquipment = (eqId: string) => {
    if (eqId === 'none') {
      onChange({ homeEquipment: ['none'] });
      return;
    }
    const current = data.homeEquipment.filter((item) => item !== 'none');
    if (current.includes(eqId)) {
      const filtered = current.filter((item) => item !== eqId);
      onChange({ homeEquipment: filtered.length === 0 ? ['none'] : filtered });
    } else {
      onChange({ homeEquipment: [...current, eqId] });
    }
  };

  return (
    <View style={styles.container}>
      {/* Environment Choice */}
      <View style={styles.section}>
        <Text style={styles.label}>TRAINING ENVIRONMENT</Text>
        <Text style={styles.helperText}>
          Where you plan to work out most of the week.
        </Text>
        <View style={styles.environmentRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChange({ environment: 'home' })}
            style={[
              styles.envButton,
              data.environment === 'home' ? styles.envButtonSelected : styles.envButtonUnselected,
            ]}
          >
            <Text style={styles.envIcon}>🏠</Text>
            <View style={styles.envTextContainer}>
              <Text
                style={[
                  styles.envTitle,
                  data.environment === 'home' && styles.envTitleSelected,
                ]}
              >
                Home Workouts
              </Text>
              <Text style={styles.envDesc}>
                Zero commute. Scaled calisthenics, bands or dumbbells in your living space.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onChange({ environment: 'gym' })}
            style={[
              styles.envButton,
              data.environment === 'gym' ? styles.envButtonSelected : styles.envButtonUnselected,
            ]}
          >
            <Text style={styles.envIcon}>🏋️</Text>
            <View style={styles.envTextContainer}>
              <Text
                style={[
                  styles.envTitle,
                  data.environment === 'gym' && styles.envTitleSelected,
                ]}
              >
                Commercial / Society Gym
              </Text>
              <Text style={styles.envDesc}>
                Access to barbells, cable stations, adjustable dumbbells & machines.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Equipment Configuration */}
      {data.environment === 'home' ? (
        <View style={styles.section}>
          <Text style={styles.label}>AVAILABLE HOME EQUIPMENT</Text>
          <Text style={styles.helperText}>Select all items available to you at home.</Text>
          <View style={styles.equipmentGrid}>
            {homeEquipmentList.map((eq) => {
              const isSelected = data.homeEquipment.includes(eq.id);
              return (
                <MultiSelectCard
                  key={eq.id}
                  title={eq.label}
                  selected={isSelected}
                  onToggle={() => handleToggleHomeEquipment(eq.id)}
                  style={styles.equipmentCard}
                />
              );
            })}
          </View>
        </View>
      ) : (
        <View style={styles.section}>
          <Text style={styles.label}>GYM EQUIPMENT LEVEL</Text>
          <View style={styles.gymRow}>
            <SelectCard
              title="Full Commercial Gym"
              description="Barbells, squat racks, cables, and leg presses"
              badge="Full Gear"
              selected={data.gymEquipmentLevel === 'full_gym'}
              onSelect={() => onChange({ gymEquipmentLevel: 'full_gym' })}
              style={styles.gymCard}
            />
            <SelectCard
              title="Society / Basic Gym"
              description="Dumbbells up to 15kg, basic bench, treadmill"
              badge="Compact"
              selected={data.gymEquipmentLevel === 'limited_gym'}
              onSelect={() => onChange({ gymEquipmentLevel: 'limited_gym' })}
              style={styles.gymCard}
            />
          </View>
        </View>
      )}

      {/* Session Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>TIME PER WORKOUT SESSION</Text>
        <View style={styles.durationRow}>
          {durations.map((d) => {
            const isSelected = data.durationMinutes === d;
            return (
              <TouchableOpacity
                key={d}
                activeOpacity={0.7}
                onPress={() => onChange({ durationMinutes: d })}
                style={[
                  styles.optionBox,
                  isSelected ? styles.optionBoxSelected : styles.optionBoxUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.optionBoxTitle,
                    isSelected && styles.optionBoxTitleSelected,
                  ]}
                >
                  {d}m
                </Text>
                <Text style={styles.optionBoxSub}>total</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Weekly Frequency */}
      <View style={styles.section}>
        <Text style={styles.label}>TARGET WORKOUT DAYS / WEEK</Text>
        <View style={styles.durationRow}>
          {frequencies.map((f) => {
            const isSelected = data.weeklyFrequencyDays === f;
            return (
              <TouchableOpacity
                key={f}
                activeOpacity={0.7}
                onPress={() => onChange({ weeklyFrequencyDays: f })}
                style={[
                  styles.optionBox,
                  isSelected ? styles.optionBoxSelected : styles.optionBoxUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.optionBoxTitle,
                    isSelected && styles.optionBoxTitleSelected,
                  ]}
                >
                  {f} Days
                </Text>
                <Text style={styles.optionBoxSub}>{7 - f} rest</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Preferred Workout Time Slot */}
      <View style={styles.section}>
        <Text style={styles.label}>PREFERRED TRAINING TIME</Text>
        <View style={styles.timeSlotGrid}>
          {times.map((t) => {
            const isSelected = data.preferredTime === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                activeOpacity={0.7}
                onPress={() => onChange({ preferredTime: t.id })}
                style={[
                  styles.timeSlotCard,
                  isSelected ? styles.timeSlotCardSelected : styles.timeSlotCardUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.timeSlotTitle,
                    isSelected && styles.timeSlotTitleSelected,
                  ]}
                >
                  {t.label}
                </Text>
                <Text style={styles.timeSlotPeriod}>{t.period}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Experience Level */}
      <View style={styles.section}>
        <Text style={styles.label}>CURRENT TRAINING EXPERIENCE</Text>
        <View style={styles.experienceList}>
          {experiences.map((exp) => (
            <SelectCard
              key={exp.id}
              title={exp.title}
              description={exp.desc}
              badge={exp.badge}
              selected={data.experienceLevel === exp.id}
              onSelect={() => onChange({ experienceLevel: exp.id })}
              style={styles.experienceCard}
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
  helperText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  environmentRow: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  envButton: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  envButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  envButtonUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  envIcon: {
    fontSize: 24,
    marginTop: 2,
  },
  envTextContainer: {
    flex: 1,
    gap: 2,
  },
  envTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  envTitleSelected: {
    color: colors.primaryDark,
  },
  envDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  equipmentGrid: {
    gap: spacing.xs,
  },
  equipmentCard: {
    marginBottom: spacing.xs,
  },
  gymRow: {
    gap: spacing.sm,
  },
  gymCard: {
    marginBottom: spacing.xs,
  },
  durationRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  optionBox: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionBoxSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  optionBoxUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  optionBoxTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optionBoxTitleSelected: {
    color: colors.primaryDark,
  },
  optionBoxSub: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  timeSlotCard: {
    width: '48%',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeSlotCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  timeSlotCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  timeSlotTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeSlotTitleSelected: {
    color: colors.primaryDark,
  },
  timeSlotPeriod: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  experienceList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  experienceCard: {
    marginBottom: spacing.xs,
  },
});
