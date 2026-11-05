import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Icon } from '../common/Icon';
import { AIStatusResponse } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface ChatEmptyStateProps {
  status: AIStatusResponse | null;
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const ChatEmptyState: React.FC<ChatEmptyStateProps> = ({
  status,
  onSelectPrompt,
  disabled = false,
}) => {
  const isConfigured = Boolean(status?.configured);
  const providerLabel =
    status?.provider === 'gemini'
      ? 'Google Gemini'
      : status?.provider === 'openai'
      ? 'OpenAI'
      : 'FitShift AI';

  return (
    <View style={styles.container}>
      <View style={styles.heroBox}>
        <View style={styles.avatarGlow}>
          <Icon name="bot" size={24} color={colors.primaryDark} />
        </View>

        <Text style={styles.heroTitle}>Ask anything about your routine</Text>
        <Text style={styles.heroSubtitle}>
          {isConfigured
            ? `Powered by live ${providerLabel} intelligence. Ask about Indian whole-food nutrition, progressive overload, or daily budget hacks.`
            : 'Interactive chat connects to live AI models (Gemini / OpenAI). Configure your server/.env key to enable.'}
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
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  avatarGlow: {
    width: 52,
    height: 52,
    borderRadius: borderRadius.lg,
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  heroTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  heroSubtitle: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 17,
  },
});
