import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface ChatInputProps {
  onSendMessage: (message: string) => Promise<boolean | void>;
  isLoading: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  disabled = false,
  placeholder = 'Ask anything about workouts, diet, or budget...',
}) => {
  const [text, setText] = useState<string>('');

  const canSend = text.trim().length > 0 && !isLoading && !disabled;

  const handleSend = async () => {
    if (!canSend) return;
    const msgToSend = text.trim();
    // Clear input optimistically, but if error occurs caller can restore or user can retry from bubble
    setText('');
    const success = await onSendMessage(msgToSend);
    // If explicit false returned, restore unsent message
    if (success === false) {
      setText(msgToSend);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputCard}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder={disabled ? 'AI Coach is currently offline' : placeholder}
          placeholderTextColor={colors.textMuted}
          multiline
          maxLength={1000}
          editable={!disabled && !isLoading}
          returnKeyType="default"
          textAlignVertical="center"
        />

        <View style={styles.actionRow}>
          {text.trim().length > 200 && (
            <Text style={styles.charCount}>
              {text.trim().length}/1000
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.sendButton,
              canSend ? styles.sendButtonActive : styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!canSend}
            activeOpacity={0.7}
            accessibilityLabel="Send message to AI Coach"
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.sendIcon}>↑</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    minHeight: 46,
  },
  textInput: {
    flex: 1,
    ...typography.body,
    fontSize: 14,
    color: colors.textPrimary,
    maxHeight: 110,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: spacing.xs,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingBottom: 2,
    paddingLeft: spacing.xs,
  },
  charCount: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  sendButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
  sendButtonDisabled: {
    backgroundColor: colors.borderStrong,
  },
  sendIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: -2,
  },
});
