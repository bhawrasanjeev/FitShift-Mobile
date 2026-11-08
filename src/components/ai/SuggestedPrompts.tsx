import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SuggestedPromptCategory } from '../../types';
import { Icon, IconName } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export const SUGGESTED_PROMPT_CATEGORIES: SuggestedPromptCategory[] = [
  {
    id: 'nutrition',
    categoryName: 'Nutrition',
    icon: 'utensils',
    prompts: [
      'Affordable vegetarian protein sources under ₹70/day',
      'How to increase protein without whey powder',
      'Suggest a budget-friendly high-protein breakfast',
    ],
  },
  {
    id: 'workout',
    categoryName: 'Workouts',
    icon: 'dumbbell',
    prompts: [
      'How to progressively overload home exercises',
      'Best alternatives for bench press at home',
      'How long should I rest between sets?',
    ],
  },
  {
    id: 'lifestyle',
    categoryName: 'Schedule',
    icon: 'clock',
    prompts: [
      'How to fit workouts around office transit hours',
      'What should I do if I feel exhausted today?',
      'Simple habits to improve sleep quality',
    ],
  },
  {
    id: 'supplements',
    categoryName: 'Supplements',
    icon: 'pill',
    prompts: [
      'Do I actually need protein powder?',
      'Whole-food alternatives to fitness supplements',
      'What to know before taking creatine',
    ],
  },
];

export interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('nutrition');

  const currentCategory =
    SUGGESTED_PROMPT_CATEGORIES.find((c) => c.id === selectedCategory) ||
    SUGGESTED_PROMPT_CATEGORIES[0];

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Suggested Topics</Text>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
      >
        {SUGGESTED_PROMPT_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                isSelected && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.7}
              disabled={disabled}
            >
              <Icon
                name={cat.icon as IconName}
                size={13}
                color={isSelected ? colors.primaryDark : colors.textMuted}
              />
              <Text
                style={[
                  styles.categoryLabel,
                  isSelected && styles.categoryLabelActive,
                ]}
              >
                {cat.categoryName}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Prompts Cards for Active Category */}
      <View style={styles.promptsList}>
        {currentCategory.prompts.map((prompt, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.promptCard}
            onPress={() => onSelectPrompt(prompt)}
            activeOpacity={0.7}
            disabled={disabled}
          >
            <Text style={styles.promptText}>{prompt}</Text>
            <Icon name="arrow-right" size={13} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  headerRow: {
    paddingHorizontal: spacing.md,
    marginBottom: 4,
  },
  headerTitle: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
  },
  categoryScroll: {
    paddingHorizontal: spacing.md,
    gap: 6,
    paddingBottom: 4,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 5,
  },
  categoryChipActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  categoryLabel: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  promptsList: {
    paddingHorizontal: spacing.md,
    gap: 6,
    marginTop: 4,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    gap: spacing.sm,
  },
  promptText: {
    flex: 1,
    ...typography.bodySmall,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
