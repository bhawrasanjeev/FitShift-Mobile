import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { DailyRhythm, Occupation, ActivityLevel } from '../../types';
import { SelectCard } from '../selection/SelectCard';
import { NumberInput } from '../selection/NumberInput';
import { OptionChip } from '../selection/OptionChip';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface StepDailyRhythmProps {
  data: DailyRhythm;
  onChange: (updated: Partial<DailyRhythm>) => void;
}

export const StepDailyRhythm: React.FC<StepDailyRhythmProps> = ({
  data,
  onChange,
}) => {
  const occupations: { id: Occupation; label: string; icon: string }[] = [
    { id: 'student', label: 'Student', icon: '🎓' },
    { id: 'working_professional', label: 'Working Professional', icon: '💼' },
    { id: 'homemaker', label: 'Homemaker', icon: '🏡' },
    { id: 'business_owner', label: 'Business Owner', icon: '🏢' },
    { id: 'freelancer', label: 'Freelancer', icon: '💻' },
    { id: 'other', label: 'Other Rhythm', icon: '🧭' },
  ];

  const activityLevels: { id: ActivityLevel; title: string; desc: string; badge: string }[] = [
    {
      id: 'sedentary',
      title: 'Sedentary',
      desc: 'Mostly sitting (desk job, study hours, screen work)',
      badge: '1.2x TDEE',
    },
    {
      id: 'lightly_active',
      title: 'Lightly Active',
      desc: 'Regular short walks, campus transit, stairs daily',
      badge: '1.375x TDEE',
    },
    {
      id: 'moderately_active',
      title: 'Moderately Active',
      desc: 'On feet frequently, active commuting, housework',
      badge: '1.55x TDEE',
    },
    {
      id: 'very_active',
      title: 'Very Active',
      desc: 'Heavy physical labor, sustained outdoor movements',
      badge: '1.725x TDEE',
    },
  ];

  const departurePresets = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00'];
  const returnPresets = ['16:00', '17:00', '18:00', '18:30', '19:30', '20:30'];
  const wakePresets = ['05:30', '06:00', '06:30', '07:00', '07:30', '08:00'];

  return (
    <View style={styles.container}>
      {/* Primary Routine / Occupation */}
      <View style={styles.section}>
        <Text style={styles.label}>PRIMARY ROUTINE OR OCCUPATION</Text>
        <Text style={styles.helperText}>
          Workouts will be scheduled around your natural work and commute blocks.
        </Text>
        <View style={styles.occupationGrid}>
          {occupations.map((item) => {
            const isSelected = data.occupation === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.7}
                onPress={() => onChange({ occupation: item.id })}
                style={[
                  styles.occupationCard,
                  isSelected ? styles.occupationCardSelected : styles.occupationCardUnselected,
                ]}
              >
                <Text style={styles.occupationIcon}>{item.icon}</Text>
                <Text
                  style={[
                    styles.occupationText,
                    isSelected && styles.occupationTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Daily Transit & Work Timings */}
      <View style={styles.section}>
        <Text style={styles.label}>SHIFT / COLLEGE DEPARTURE TIME</Text>
        <Text style={styles.helperText}>When you leave home or start your primary work block</Text>
        <TextInput
          value={data.departureTime}
          onChangeText={(val) => onChange({ departureTime: val })}
          placeholder="e.g. 08:30"
          placeholderTextColor={colors.textMuted}
          style={styles.timeInput}
        />
        <View style={styles.presetsRow}>
          {departurePresets.map((t) => (
            <OptionChip
              key={t}
              label={t}
              selected={data.departureTime === t}
              onPress={() => onChange({ departureTime: t })}
              size="sm"
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>EXPECTED RETURN / SHIFT END TIME</Text>
        <Text style={styles.helperText}>When your schedule frees up for exercise, cooking & rest</Text>
        <TextInput
          value={data.returnTime}
          onChangeText={(val) => onChange({ returnTime: val })}
          placeholder="e.g. 18:30"
          placeholderTextColor={colors.textMuted}
          style={styles.timeInput}
        />
        <View style={styles.presetsRow}>
          {returnPresets.map((t) => (
            <OptionChip
              key={t}
              label={t}
              selected={data.returnTime === t}
              onPress={() => onChange({ returnTime: t })}
              size="sm"
            />
          ))}
        </View>
      </View>

      {/* Sleep Rhythm */}
      <View style={styles.section}>
        <Text style={styles.label}>TYPICAL WAKE-UP TIME</Text>
        <TextInput
          value={data.wakeUpTime}
          onChangeText={(val) => onChange({ wakeUpTime: val })}
          placeholder="e.g. 06:30"
          placeholderTextColor={colors.textMuted}
          style={styles.timeInput}
        />
        <View style={styles.presetsRow}>
          {wakePresets.map((t) => (
            <OptionChip
              key={t}
              label={t}
              selected={data.wakeUpTime === t}
              onPress={() => onChange({ wakeUpTime: t })}
              size="sm"
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <NumberInput
          label="AVERAGE NIGHTLY SLEEP (HOURS)"
          value={data.sleepHours}
          onChangeValue={(val) => onChange({ sleepHours: val })}
          min={5}
          max={10}
          step={0.5}
          unit="hrs"
        />
        <Text style={styles.helperText}>
          Recovery directly dictates maximum weekly training volume.
        </Text>
      </View>

      {/* Non-Exercise Activity Level */}
      <View style={styles.section}>
        <Text style={styles.label}>NON-EXERCISE ACTIVITY LEVEL</Text>
        <Text style={styles.helperText}>
          Reflects daily physical expenditure outside dedicated gym or workout sessions.
        </Text>
        <View style={styles.activityList}>
          {activityLevels.map((lvl) => (
            <SelectCard
              key={lvl.id}
              title={lvl.title}
              description={lvl.desc}
              badge={lvl.badge}
              selected={data.activityLevel === lvl.id}
              onSelect={() => onChange({ activityLevel: lvl.id })}
              style={styles.activityCard}
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
  occupationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  occupationCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  occupationCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  occupationCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  occupationIcon: {
    fontSize: 18,
  },
  occupationText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  occupationTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  timeInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    color: colors.textPrimary,
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  activityList: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  activityCard: {
    marginBottom: spacing.xs,
  },
});
