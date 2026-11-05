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
    id: 'workout',
    categoryName: 'Workout Help',
    icon: 'dumbbell',
    prompts: [
      'How can I progressively overload home calisthenics without weights?',
      'What can I do instead of bench press at home?',
      'How should a beginner structure recovery between sets?',
    ],
  },
  {
    id: 'nutrition',
    categoryName: 'Indian Nutrition',
    icon: 'utensils',
    prompts: [
      'What are affordable vegetarian protein sources under ₹70/day?',
      'How can I increase my protein intake without whey powder?',
      'Suggest a budget-friendly high-protein Indian breakfast.',
    ],
  },
  {
    id: 'supplements',
    categoryName: 'Supplements',
    icon: 'pill',
    prompts: [
      'Do I actually need protein powder for muscle growth?',
      'What are whole-food alternatives to protein supplements?',
      'What should I consider before taking creatine monohydrate?',
    ],
  },
  {
    id: 'lifestyle',
    categoryName: 'Lifestyle & Recovery',
    icon: 'moon',
    prompts: [
      'How can I organize my workout and meals around college or office hours?',
      'What should I do if I feel exhausted and late today?',
      'How can I improve sleep quality and circadian rhythm?',
    ],
  },
  {
    id: 'plan',
    categoryName: 'Understanding My Plan',
    icon: 'sparkles',
    prompts: [
      'Explain my planned calorie and protein targets.',
      'Why is there a 50g daily limit on dry soya chunks?',
      'How does the Knapsack diet optimizer prioritize whole staples?',
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
        <Text style={styles.headerTitle}>SUGGESTED QUESTIONS</Text>
        <Text style={styles.headerSubtitle}>Tap to ask instantly</Text>
      </View>

      {/* Category Pills (Horizontal Scroll) */}
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
                color={isSelected ? colors.surface : colors.primaryDark}
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
            <View style={styles.promptContent}>
              <Text style={styles.promptText}>&ldquo;{prompt}&rdquo;</Text>
              <Icon name="arrow-right" size={12} color={colors.primary} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  headerTitle: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  categoryScroll: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    paddingBottom: spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
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
    color: colors.primary,
    fontWeight: '700',
  },
  promptsList: {
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
    marginTop: 4,
  },
  promptCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 1,
    elevation: 1,
  },
  promptContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  promptText: {
    flex: 1,
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
