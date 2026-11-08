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
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.toggleRow}
        activeOpacity={0.7}
        onPress={() => onToggle(!usePlanContext)}
      >
        <View style={styles.leftCol}>
          <Icon
            name="sparkles"
            size={14}
            color={usePlanContext ? colors.primary : colors.textMuted}
          />
          <Text style={styles.label}>
            {usePlanContext ? 'Plan context linked' : 'General fitness mode'}
          </Text>
          {usePlanContext && (
            <View style={styles.activePill}>
              <Text style={styles.activePillText}>ACTIVE</Text>
            </View>
          )}
        </View>

        <Switch
          value={usePlanContext}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: '#A7F3D0' }}
          thumbColor={usePlanContext ? colors.primary : '#D4D4D8'}
          style={styles.switch}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    flex: 1,
  },
  label: {
    ...typography.caption,
    fontWeight: '600',
    fontSize: 12,
    color: colors.textPrimary,
  },
  activePill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  activePillText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.4,
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});
