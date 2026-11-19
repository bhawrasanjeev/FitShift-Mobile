import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Logo } from '../common/Logo';
import { AIStatusResponse } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export interface ChatEmptyStateProps {
  status: AIStatusResponse | null;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  onSelectPrompt,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.heroBox}>
        <View style={styles.heroLogoBox}>
          <Logo size={52} rounded />
        </View>

        <Text style={styles.heroTitle}>Ask anything about your routine</Text>
        <Text style={styles.heroSubtitle}>
          Get quick guidance on workouts, Indian whole foods, or daily routine adjustments.
        </Text>
      </View>

      {/* Suggested Questions */}
      <SuggestedPrompts
        onSelectPrompt={onSelectPrompt}
        disabled={disabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  heroBox: {
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.md,
  },
  heroLogoBox: {
    marginBottom: spacing.sm + 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroTitle: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});
