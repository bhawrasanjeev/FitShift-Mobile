import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { ChatMessage } from '../../types';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface MessageBubbleProps {
  message: ChatMessage;
  onRetry?: (query: string) => void;
  onSelectPrompt?: (prompt: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onRetry,
  onSelectPrompt,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const isUser = message.role === 'user';

  const handleShareOrCopy = async () => {
    try {
      await Share.share({
        message: message.content,
        title: 'FitShift Coach Guidance',
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // User dismissed share sheet
    }
  };

  const renderInlineFormatted = (text: string, baseStyle: object, boldStyle: object) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={idx} style={[baseStyle, boldStyle]}>
            {part.slice(2, -2)}
          </Text>
        );
      }
      return (
        <Text key={idx} style={baseStyle}>
          {part}
        </Text>
      );
    });
  };

  const renderContentLines = (rawContent: string) => {
    const lines = rawContent.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <View key={idx} style={styles.paragraphSpacer} />;
      }

      // Headings
      if (trimmed.startsWith('### ') || trimmed.startsWith('## ') || trimmed.startsWith('# ')) {
        const headingText = trimmed.replace(/^#+\s*/, '');
        return (
          <Text key={idx} style={styles.headingText}>
            {headingText}
          </Text>
        );
      }

      // Bullet lists
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ') || trimmed.startsWith('• ')) {
        const bulletText = trimmed.replace(/^[*•-]\s*/, '');
        return (
          <View key={idx} style={styles.bulletRow}>
            <View style={styles.bulletDot} />
            <Text style={styles.bulletContent}>
              {renderInlineFormatted(bulletText, styles.bodyText, styles.boldText)}
            </Text>
          </View>
        );
      }

      // Numbered lists (e.g. 1. 2.)
      const numberMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
      if (numberMatch) {
        const num = numberMatch[1];
        const numText = numberMatch[2];
        return (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.numberPrefix}>{num}.</Text>
            <Text style={styles.bulletContent}>
              {renderInlineFormatted(numText, styles.bodyText, styles.boldText)}
            </Text>
          </View>
        );
      }

      // Standard text line
      return (
        <Text key={idx} style={styles.bodyText}>
          {renderInlineFormatted(trimmed, styles.bodyText, styles.boldText)}
        </Text>
      );
    });
  };

  if (isUser) {
    return (
      <View style={styles.userWrapper}>
        <View style={styles.userBubble}>
          <View style={styles.userHeader}>
            <Text style={styles.userHeaderLabel}>You</Text>
            <Text style={styles.userTimestamp}>{message.timestamp}</Text>
          </View>
          <Text style={styles.userMessageText}>{message.content}</Text>
        </View>
      </View>
    );
  }

  // Assistant / Coach Message
  return (
    <View style={styles.coachWrapper}>
      <View style={styles.coachAvatar}>
        <Icon name="bot" size={14} color={colors.primaryDark} />
      </View>

      <View style={[styles.coachBubble, message.error && styles.coachBubbleError]}>
        {/* Header bar */}
        <View style={styles.coachHeader}>
          <View style={styles.coachTitleGroup}>
            <Text style={styles.coachTitle}>FitShift Coach</Text>
            {message.contextUsed && (
              <Badge label="Context Applied" variant="accent" size="sm" />
            )}
          </View>

          <View style={styles.coachActions}>
            <Text style={styles.coachTimestamp}>{message.timestamp}</Text>
            {!message.error && (
              <TouchableOpacity
                onPress={handleShareOrCopy}
                style={styles.copyBtn}
                activeOpacity={0.7}
                accessibilityLabel="Copy or share response"
              >
                <Icon
                  name={copied ? 'check' : 'copy'}
                  size={11}
                  color={copied ? colors.primary : colors.textSecondary}
                />
                <Text style={styles.copyBtnText}>
                  {copied ? 'Copied' : 'Copy'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Message body */}
        <View style={styles.contentContainer}>
          {renderContentLines(message.content)}
        </View>

        {/* Retry button for failed messages */}
        {message.error && message.failedQuery && onRetry && (
          <View style={styles.retryBox}>
            <TouchableOpacity
              style={styles.retryBtn}
              onPress={() => onRetry(message.failedQuery!)}
              activeOpacity={0.7}
            >
              <Icon name="refresh" size={13} color="#DC2626" />
              <Text style={styles.retryBtnText}>Retry Request</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Follow-up suggestion chips */}
        {message.followUps && message.followUps.length > 0 && onSelectPrompt && (
          <View style={styles.followUpsContainer}>
            <Text style={styles.followUpsTitle}>RELATED QUESTIONS</Text>
            <View style={styles.followUpsRow}>
              {message.followUps.map((prompt, pIdx) => (
                <TouchableOpacity
                  key={pIdx}
                  style={styles.followUpChip}
                  onPress={() => onSelectPrompt(prompt)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.followUpChipText}>{prompt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  userBubble: {
    maxWidth: '85%',
    backgroundColor: '#18181B', // Dark zinc
    borderRadius: borderRadius.lg,
    borderTopRightRadius: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  userHeaderLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    textTransform: 'uppercase',
  },
  userTimestamp: {
    ...typography.caption,
    fontSize: 10,
    color: '#71717A',
  },
  userMessageText: {
    ...typography.body,
    fontSize: 14,
    color: '#FAFAFA',
    lineHeight: 20,
  },
  coachWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  coachAvatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.md,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.xs + 2,
    marginTop: 2,
  },
  coachBubble: {
    flex: 1,
    maxWidth: '90%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  coachBubbleError: {
    borderColor: '#FECDD3',
    backgroundColor: '#FFF1F2',
  },
  coachHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.xs,
    marginBottom: spacing.xs + 2,
  },
  coachTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  coachTitle: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 12,
    color: colors.textPrimary,
  },
  coachActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  coachTimestamp: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: borderRadius.xs,
    backgroundColor: colors.surfaceSubtle,
  },
  copyBtnText: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: colors.primary,
  },
  contentContainer: {
    marginTop: 2,
  },
  paragraphSpacer: {
    height: spacing.xs,
  },
  headingText: {
    ...typography.h3,
    fontSize: 14,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    marginBottom: 4,
  },
  bodyText: {
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
    marginVertical: 1,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 2,
    paddingLeft: spacing.xs,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    marginTop: 7,
    marginRight: spacing.xs,
  },
  numberPrefix: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
    fontSize: 12,
    marginRight: spacing.xs,
    marginTop: 1,
  },
  bulletContent: {
    flex: 1,
    ...typography.body,
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  retryBox: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#FECDD3',
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#F43F5E',
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  retryBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: '#E11D48',
    fontSize: 11,
  },
  followUpsContainer: {
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  followUpsTitle: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  followUpsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  followUpChip: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingVertical: 4,
    paddingHorizontal: spacing.xs + 2,
  },
  followUpChipText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
});
