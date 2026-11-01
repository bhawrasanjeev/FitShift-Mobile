import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { aiService } from '../../services/api/aiService';
import { AIStatusResponse } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export const AICoachTabScreen: React.FC = () => {
  const { userProfile } = usePlan();
  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [sampleReply, setSampleReply] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState<boolean>(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await aiService.getStatus();
        setAiStatus(res);
      } catch {
        setAiStatus({ configured: false, provider: null });
      } finally {
        setIsLoadingStatus(false);
      }
    }
    checkStatus();
  }, []);

  const samplePrompts = [
    'How do I reach 120g protein under ₹75 daily budget?',
    'What can I replace eggs with for breakfast?',
    'Desk stretches for neck and shoulders after 8h work?',
    'How to progressively overload standard push-ups at home?',
  ];

  const handleAskPrompt = async (prompt: string) => {
    setSelectedPrompt(prompt);
    setIsAsking(true);
    setSampleReply(null);

    try {
      const res = await aiService.sendChat(prompt, {
        goal: userProfile.personal.goal,
        environment: userProfile.training.environment,
        diet: userProfile.food.dietType,
        dailyBudget: userProfile.budget.dailyBudgetRupees,
        durationMinutes: userProfile.training.durationMinutes,
      });
      setSampleReply(res.reply || res.response);
    } catch {
      setSampleReply('Unable to connect to AI Coach backend. Please ensure your Express server on port 5001 is running.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Header
        title="FitShift AI Coach"
        subtitle="Context-aware assistant for your specific plan"
        showBrand={false}
        rightAction={
          isLoadingStatus ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Badge
              label={aiStatus?.configured ? `✓ ${aiStatus.provider?.toUpperCase()}` : 'AI Ready'}
              variant={aiStatus?.configured ? 'accent' : 'neutral'}
              size="sm"
            />
          )
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* AI Hero Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroHeader}>
            <View style={styles.aiBadge}>
              <Text style={styles.aiEmoji}>🤖</Text>
            </View>
            <View style={styles.aiHeaderTextCol}>
              <Text style={styles.aiTitle}>Intelligent FitShift Coach</Text>
              <Text style={styles.aiSubtitle}>
                Trained on Indian nutrition economics, whole-food staples & calisthenics progression.
              </Text>
            </View>
          </View>

          {/* Active Context Indicators */}
          <View style={styles.contextBox}>
            <Text style={styles.contextLabel}>ACTIVE CONTEXT INJECTED INTO AI:</Text>
            <View style={styles.contextTagsRow}>
              <Badge label={`🎯 ${userProfile.personal.goal.replace(/_/g, ' ')}`} variant="neutral" size="sm" />
              <Badge label={`💰 ₹${userProfile.budget.dailyBudgetRupees}/day budget`} variant="neutral" size="sm" />
              <Badge label={`🏠 ${userProfile.training.environment === 'home' ? 'Home' : 'Gym'}`} variant="neutral" size="sm" />
              <Badge label={`🥗 ${userProfile.food.dietType.replace(/_/g, ' ')}`} variant="neutral" size="sm" />
            </View>
          </View>
        </View>

        {/* Suggested Prompts Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SUGGESTED QUESTIONS</Text>
          <View style={styles.promptsList}>
            {samplePrompts.map((prompt, idx) => (
              <TouchableOpacity
                key={idx}
                activeOpacity={0.7}
                onPress={() => handleAskPrompt(prompt)}
                disabled={isAsking}
                style={[
                  styles.promptCard,
                  selectedPrompt === prompt && styles.promptCardSelected,
                ]}
              >
                <Text style={styles.promptIcon}>💡</Text>
                <Text style={styles.promptText}>{prompt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Live Response Container */}
        {isAsking || sampleReply ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>COACH RESPONSE</Text>
            <View style={styles.replyCard}>
              <View style={styles.replyHeader}>
                <Text style={styles.replyHeaderTitle}>FitShift Coach</Text>
                <Badge label="Context Verified" variant="accent" size="sm" />
              </View>

              {isAsking ? (
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="small" color={colors.primary} />
                  <Text style={styles.loadingText}>Generating personalized guidance...</Text>
                </View>
              ) : (
                <Text style={styles.replyContent}>{sampleReply}</Text>
              )}
            </View>
          </View>
        ) : null}

        {/* Phase 8 Milestone Callout */}
        <View style={styles.phaseNoticeBox}>
          <Text style={styles.phaseNoticeIcon}>ℹ️</Text>
          <Text style={styles.phaseNoticeText}>
            <Text style={{ fontWeight: '700' }}>Phase 8 AI Assistant: </Text>
            Full interactive multi-turn chat bubbles, follow-up suggestion chips, markdown rendering, and typing indicators will activate in Phase 8.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  heroBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.md,
  },
  heroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aiBadge: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiEmoji: {
    fontSize: 22,
  },
  aiHeaderTextCol: {
    flex: 1,
    gap: 2,
  },
  aiTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  aiSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  contextBox: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.xs,
  },
  contextLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  contextTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  promptsList: {
    gap: spacing.xs,
  },
  promptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  promptCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  promptIcon: {
    fontSize: 16,
  },
  promptText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
    fontSize: 12,
  },
  replyCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  replyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  replyHeaderTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  loadingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  loadingText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  replyContent: {
    ...typography.bodySmall,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  phaseNoticeBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  phaseNoticeIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  phaseNoticeText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
    fontSize: 11,
  },
});
