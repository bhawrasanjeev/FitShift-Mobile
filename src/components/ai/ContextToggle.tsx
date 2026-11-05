import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { OnboardingData } from '../../types';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface ContextToggleProps {
  usePlanContext: boolean;
  onToggle: (enabled: boolean) => void;
  userProfile?: OnboardingData;
}

export const ContextToggle: React.FC<ContextToggleProps> = ({
  usePlanContext,
  onToggle,
  userProfile,
}) => {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.headerRow}
        activeOpacity={0.8}
        onPress={() => onToggle(!usePlanContext)}
      >
        <View style={styles.iconBox}>
          <Icon
            name={usePlanContext ? 'sparkles' : 'shield'}
            size={16}
            color={usePlanContext ? colors.primaryDark : colors.textMuted}
          />
        </View>

        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>Use my FitShift plan as context</Text>
            {usePlanContext && (
              <View style={styles.activeTag}>
                <Text style={styles.activeTagText}>ACTIVE</Text>
              </View>
            )}
          </View>
          <Text style={styles.description}>
            {usePlanContext
              ? 'Coach tailors answers to your goal, diet, Indian food budget & environment.'
              : 'Answers will be general fitness advice without referencing your saved plan.'}
          </Text>
        </View>

        <Switch
          value={usePlanContext}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: '#A7F3D0' }}
          thumbColor={usePlanContext ? colors.primary : '#D4D4D8'}
        />
      </TouchableOpacity>

      {/* Snapshot of Active Plan Context Chips */}
      {usePlanContext && userProfile && (
        <View style={styles.contextSnapshot}>
          <Text style={styles.snapshotLabel}>ACTIVE CONTEXT INJECTED:</Text>
          <View style={styles.chipWrap}>
            <View style={styles.chip}>
              <Icon name="target" size={10} color={colors.primaryDark} />
              <Text style={styles.chipText}>
                {userProfile.personal.goal.replace(/_/g, ' ')}
              </Text>
            </View>
            <View style={styles.chip}>
              <Icon
                name={userProfile.training.environment === 'home' ? 'home' : 'building'}
                size={10}
                color={colors.primaryDark}
              />
              <Text style={styles.chipText}>
                {userProfile.training.environment === 'home' ? 'Home' : 'Gym'}
              </Text>
            </View>
            <View style={styles.chip}>
              <Icon name="clock" size={10} color={colors.primaryDark} />
              <Text style={styles.chipText}>
                {userProfile.training.durationMinutes}m
              </Text>
            </View>
            <View style={styles.chip}>
              <Icon name="utensils" size={10} color={colors.primaryDark} />
              <Text style={styles.chipText}>
                {userProfile.food.dietType.replace(/_/g, ' ')}
              </Text>
            </View>
            <View style={[styles.chip, styles.chipBudget]}>
              <Icon name="indian-rupee" size={10} color="#047857" />
              <Text style={styles.chipTextBudget}>
                ₹{userProfile.budget.dailyBudgetRupees}/day
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm + 2,
    marginHorizontal: spacing.md,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 12,
    color: colors.textPrimary,
  },
  activeTag: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: borderRadius.xs,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  activeTagText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: colors.primary,
  },
  description: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
    marginTop: 2,
  },
  contextSnapshot: {
    marginTop: spacing.xs + 2,
    paddingTop: spacing.xs + 2,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  snapshotLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  chipBudget: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  chipText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  chipTextBudget: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
  },
});
