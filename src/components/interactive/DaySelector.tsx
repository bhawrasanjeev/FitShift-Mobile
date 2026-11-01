import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export interface DayOption {
  dayNumber: number;
  dayName: string;
  focus?: string;
  isRestDay?: boolean;
}

export interface DaySelectorProps {
  days: DayOption[];
  selectedDay: number;
  onSelectDay: (dayNumber: number) => void;
  style?: ViewStyle;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  days,
  selectedDay,
  onSelectDay,
  style,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {days.map((day) => {
        const isSelected = day.dayNumber === selectedDay;
        const shortName = day.dayName.slice(0, 3).toUpperCase();

        return (
          <TouchableOpacity
            key={day.dayNumber}
            activeOpacity={0.8}
            onPress={() => onSelectDay(day.dayNumber)}
            style={[
              styles.dayCard,
              isSelected ? styles.dayCardSelected : styles.dayCardUnselected,
            ]}
          >
            <Text
              style={[
                styles.dayName,
                isSelected ? styles.dayNameSelected : styles.dayNameUnselected,
              ]}
            >
              {shortName}
            </Text>

            <View
              style={[
                styles.numberCircle,
                isSelected ? styles.numberCircleSelected : styles.numberCircleUnselected,
              ]}
            >
              <Text
                style={[
                  styles.dayNumber,
                  isSelected ? styles.dayNumberSelected : styles.dayNumberUnselected,
                ]}
              >
                {day.dayNumber}
              </Text>
            </View>

            <Text
              style={[
                styles.restIndicator,
                day.isRestDay ? styles.restDayText : styles.workoutDayText,
                isSelected && styles.selectedStatusText,
              ]}
              numberOfLines={1}
            >
              {day.isRestDay ? 'Rest' : 'Workout'}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    gap: spacing.sm,
  },
  dayCard: {
    width: 68,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1.5,
    ...shadows.sm,
  },
  dayCardUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  dayCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dayName: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  dayNameUnselected: {
    color: colors.textMuted,
  },
  dayNameSelected: {
    color: colors.primaryDark,
  },
  numberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  numberCircleUnselected: {
    backgroundColor: colors.surfaceSubtle,
  },
  numberCircleSelected: {
    backgroundColor: colors.primary,
  },
  dayNumber: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  dayNumberUnselected: {
    color: colors.textPrimary,
  },
  dayNumberSelected: {
    color: colors.textInverse,
  },
  restIndicator: {
    fontSize: 9,
    fontWeight: typography.weights.semibold,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  restDayText: {
    color: colors.textMuted,
  },
  workoutDayText: {
    color: colors.primary,
  },
  selectedStatusText: {
    color: colors.primaryDark,
    fontWeight: typography.weights.bold,
  },
});

export default DaySelector;
