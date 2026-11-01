import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { WorkoutDay } from '../../types';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';

export interface DaySplitSelectorProps {
  days: WorkoutDay[];
  selectedDayNumber: number;
  onSelectDay: (dayNumber: number) => void;
  style?: ViewStyle;
}

export const DaySplitSelector: React.FC<DaySplitSelectorProps> = ({
  days,
  selectedDayNumber,
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
        const isSelected = day.dayNumber === selectedDayNumber;
        const shortName = day.dayName.slice(0, 3).toUpperCase();
        const exerciseCount = day.exercises?.length || 0;

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
            {/* Day Short Name */}
            <Text
              style={[
                styles.dayName,
                isSelected ? styles.dayNameSelected : styles.dayNameUnselected,
              ]}
            >
              {shortName}
            </Text>

            {/* Day Number Circle */}
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

            {/* Exercise Count or Rest Pill */}
            <View
              style={[
                styles.statusPill,
                day.isRestDay ? styles.statusPillRest : styles.statusPillWorkout,
                isSelected && styles.statusPillSelected,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  day.isRestDay ? styles.statusTextRest : styles.statusTextWorkout,
                  isSelected && styles.statusTextSelected,
                ]}
                numberOfLines={1}
              >
                {day.isRestDay ? 'Rest' : `${exerciseCount} Ex`}
              </Text>
            </View>
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
    width: 66,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: 4,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1.5,
  },
  dayCardSelected: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    ...shadows.sm,
  },
  dayCardUnselected: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
  },
  dayName: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dayNameSelected: {
    color: colors.primaryDark,
  },
  dayNameUnselected: {
    color: colors.textMuted,
  },
  numberCircle: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberCircleSelected: {
    backgroundColor: colors.primary,
  },
  numberCircleUnselected: {
    backgroundColor: colors.borderSubtle,
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayNumberSelected: {
    color: colors.textInverse,
  },
  dayNumberUnselected: {
    color: colors.textSecondary,
  },
  statusPill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  statusPillWorkout: {
    backgroundColor: colors.surfaceSubtle,
  },
  statusPillRest: {
    backgroundColor: '#FEF3C7',
  },
  statusPillSelected: {
    backgroundColor: colors.primaryLight,
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
  },
  statusTextWorkout: {
    color: colors.textSecondary,
  },
  statusTextRest: {
    color: '#92400E',
  },
  statusTextSelected: {
    color: colors.primaryDark,
  },
});

export default DaySplitSelector;
