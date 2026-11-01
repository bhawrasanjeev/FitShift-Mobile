import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Modal } from './Modal';
import { Button } from '../common/Button';
import { OnboardingData, DietType, BudgetTier } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface EditPlanModalProps {
  visible: boolean;
  onClose: () => void;
  currentData: OnboardingData;
  onSave: (updated: OnboardingData) => Promise<boolean>;
}

export const EditPlanModal: React.FC<EditPlanModalProps> = ({
  visible,
  onClose,
  currentData,
  onSave,
}) => {
  const [data, setData] = useState<OnboardingData>(currentData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever modal opens
  useEffect(() => {
    if (visible) {
      setData(currentData);
      setErrorMessage(null);
      setIsSaving(false);
    }
  }, [visible, currentData]);

  const durations = [20, 30, 45, 60] as const;
  const frequencies = [3, 4, 5, 6];

  const handleApply = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    const success = await onSave(data);
    setIsSaving(false);

    if (success) {
      onClose();
    } else {
      setErrorMessage('Failed to regenerate plan with updated parameters. Please check your backend connection.');
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Edit FitShift Parameters"
      subtitle="Adjust your schedule, budget, or training setup. The engine updates your plan immediately."
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Cancel"
            variant="ghost"
            size="sm"
            onPress={onClose}
            disabled={isSaving}
            style={styles.cancelBtn}
          />
          <Button
            title={isSaving ? 'Regenerating...' : 'Apply & Regenerate'}
            variant="primary"
            size="sm"
            onPress={handleApply}
            loading={isSaving}
            style={styles.applyBtn}
          />
        </View>
      }
    >
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
            </View>
          ) : null}

          {/* Training Environment */}
          <View style={styles.section}>
            <Text style={styles.label}>WORKOUT ENVIRONMENT</Text>
            <View style={styles.envRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setData((prev) => ({
                    ...prev,
                    training: { ...prev.training, environment: 'home' },
                  }))
                }
                style={[
                  styles.envButton,
                  data.training.environment === 'home'
                    ? styles.envButtonSelected
                    : styles.envButtonUnselected,
                ]}
              >
                <Text style={styles.envIcon}>🏠</Text>
                <Text
                  style={[
                    styles.envText,
                    data.training.environment === 'home' && styles.envTextSelected,
                  ]}
                >
                  Home Calisthenics
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  setData((prev) => ({
                    ...prev,
                    training: { ...prev.training, environment: 'gym' },
                  }))
                }
                style={[
                  styles.envButton,
                  data.training.environment === 'gym'
                    ? styles.envButtonSelected
                    : styles.envButtonUnselected,
                ]}
              >
                <Text style={styles.envIcon}>🏋️</Text>
                <Text
                  style={[
                    styles.envText,
                    data.training.environment === 'gym' && styles.envTextSelected,
                  ]}
                >
                  Commercial Gym
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Session Duration & Weekly Frequency */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <Text style={styles.label}>DURATION PER SESSION</Text>
              <View style={styles.chipsRow}>
                {durations.map((d) => {
                  const isSelected = data.training.durationMinutes === d;
                  return (
                    <TouchableOpacity
                      key={d}
                      activeOpacity={0.7}
                      onPress={() =>
                        setData((prev) => ({
                          ...prev,
                          training: { ...prev.training, durationMinutes: d },
                        }))
                      }
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {d}m
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.gridCol}>
              <Text style={styles.label}>WEEKLY DAYS</Text>
              <View style={styles.chipsRow}>
                {frequencies.map((f) => {
                  const isSelected = data.training.weeklyFrequencyDays === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      activeOpacity={0.7}
                      onPress={() =>
                        setData((prev) => ({
                          ...prev,
                          training: { ...prev.training, weeklyFrequencyDays: f },
                        }))
                      }
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          isSelected && styles.chipTextSelected,
                        ]}
                      >
                        {f}d
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Diet Preference */}
          <View style={styles.section}>
            <Text style={styles.label}>DIET PREFERENCE</Text>
            <View style={styles.dietRow}>
              {(['pure_veg', 'eggetarian', 'non_veg'] as DietType[]).map((d) => {
                const isSelected = data.food.dietType === d;
                const labels: Record<DietType, string> = {
                  pure_veg: 'Pure Veg',
                  eggetarian: 'Eggetarian',
                  non_veg: 'Non-Veg',
                };
                return (
                  <TouchableOpacity
                    key={d}
                    activeOpacity={0.7}
                    onPress={() =>
                      setData((prev) => ({
                        ...prev,
                        food: { ...prev.food, dietType: d },
                      }))
                    }
                    style={[
                      styles.dietButton,
                      isSelected ? styles.dietButtonSelected : styles.dietButtonUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dietButtonText,
                        isSelected && styles.dietButtonTextSelected,
                      ]}
                    >
                      {labels[d]}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Food Budget Tier */}
          <View style={styles.section}>
            <Text style={styles.label}>FOOD BUDGET TIER</Text>
            <View style={styles.budgetCol}>
              {(['ultra_budget', 'budget', 'moderate'] as BudgetTier[]).map((b) => {
                const costs: Record<string, number> = {
                  ultra_budget: 40,
                  budget: 65,
                  moderate: 110,
                };
                const titles: Record<string, string> = {
                  ultra_budget: 'Ultra-Budget (~₹40/day)',
                  budget: 'Budget (~₹65/day)',
                  moderate: 'Moderate (~₹110/day)',
                };
                const isSelected = data.budget.tier === b;

                return (
                  <TouchableOpacity
                    key={b}
                    activeOpacity={0.7}
                    onPress={() =>
                      setData((prev) => ({
                        ...prev,
                        budget: {
                          ...prev.budget,
                          tier: b,
                          dailyBudgetRupees: costs[b],
                        },
                      }))
                    }
                    style={[
                      styles.budgetButton,
                      isSelected ? styles.budgetButtonSelected : styles.budgetButtonUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.budgetButtonText,
                        isSelected && styles.budgetButtonTextSelected,
                      ]}
                    >
                      {titles[b]}
                    </Text>
                    {isSelected ? <Text style={styles.checkIcon}>✓</Text> : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 460,
  },
  container: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderColor: colors.danger,
    borderWidth: 1,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '600',
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
  envRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  envButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
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
    fontSize: 16,
  },
  envText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  envTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  gridRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  gridCol: {
    flex: 1,
    gap: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.xxs,
  },
  chip: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  chipTextSelected: {
    color: colors.surface,
  },
  dietRow: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  dietButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
  },
  dietButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  dietButtonUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  dietButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dietButtonTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  budgetCol: {
    gap: spacing.xs,
  },
  budgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  budgetButtonSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  budgetButtonUnselected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  budgetButtonText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  budgetButtonTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  checkIcon: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    width: '100%',
  },
  cancelBtn: {
    minWidth: 90,
  },
  applyBtn: {
    minWidth: 160,
  },
});
