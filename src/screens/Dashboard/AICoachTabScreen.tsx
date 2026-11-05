import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { aiService, AIChatContext } from '../../services/api/aiService';
import { planStorage } from '../../services/storage/planStorage';
import { ChatMessage, AIStatusResponse } from '../../types';
import {
  ChatHeader,
  MessageBubble,
  ChatInput,
  TypingIndicator,
  ContextToggle,
  ChatEmptyState,
} from '../../components/ai';
import { Icon } from '../../components/common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

export const AICoachTabScreen: React.FC = () => {
  const { userProfile } = usePlan();

  const [aiStatus, setAiStatus] = useState<AIStatusResponse | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [usePlanContext, setUsePlanContext] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const flatListRef = useRef<FlatList<ChatMessage>>(null);

  // Check AI Service status
  const checkStatus = useCallback(async () => {
    setIsLoadingStatus(true);
    setErrorMessage(null);
    try {
      const res = await aiService.getStatus();
      setAiStatus(res);
    } catch {
      setAiStatus({ configured: false, provider: null });
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  // Load chat history and check status on mount
  useEffect(() => {
    checkStatus();
    planStorage.loadChatHistory().then((history) => {
      if (history && history.length > 0) {
        setMessages(history);
      }
    });
  }, [checkStatus]);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      planStorage.saveChatHistory(messages);
    }
  }, [messages]);

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleSendMessage = async (text: string): Promise<boolean> => {
    if (!text.trim() || isGenerating) return false;

    setErrorMessage(null);
    const query = text.trim();
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsGenerating(true);
    scrollToBottom();

    // Prepare context if toggle is active
    let contextPayload: AIChatContext | undefined;
    if (usePlanContext && userProfile) {
      contextPayload = {
        goal: userProfile.personal.goal,
        environment: userProfile.training.environment,
        diet: userProfile.food.dietType,
        dailyBudget: userProfile.budget.dailyBudgetRupees,
        durationMinutes: userProfile.training.durationMinutes,
      };
    }

    try {
      const response = await aiService.sendChat(query, contextPayload);
      const replyContent = response.reply || response.response;

      const assistantMessage: ChatMessage = {
        id: `coach-${Date.now()}`,
        role: 'assistant',
        content: replyContent,
        timestamp: timeStr,
        contextUsed: contextPayload
          ? {
              goal: contextPayload.goal || '',
              environment: contextPayload.environment || '',
              diet: contextPayload.diet || '',
              dailyBudget: contextPayload.dailyBudget || 0,
              durationMinutes: contextPayload.durationMinutes || 0,
            }
          : undefined,
        followUps: generateFollowUps(query),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      scrollToBottom();
      return true;
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : 'FitShift AI Coach is temporarily unreachable. Please ensure the Express server is running.';

      setErrorMessage(errMsg);

      const errorBubble: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `**Unable to complete request**\n\n${errMsg}`,
        timestamp: timeStr,
        error: true,
        failedQuery: query,
      };

      setMessages((prev) => [...prev, errorBubble]);
      scrollToBottom();
      return false;
    } finally {
      setIsGenerating(false);
    }
  };

  const generateFollowUps = (query: string): string[] => {
    const q = query.toLowerCase();
    if (q.includes('protein') || q.includes('soya') || q.includes('paneer') || q.includes('sattu')) {
      return [
        'How can I hit my protein on pure veg diet?',
        'What are the best timings for protein meals?',
      ];
    }
    if (q.includes('workout') || q.includes('exercise') || q.includes('calisthenics') || q.includes('gym')) {
      return [
        'How can I modify this if I only have 20 minutes?',
        'How many rest days should I take?',
      ];
    }
    if (q.includes('budget') || q.includes('rupees') || q.includes('cost')) {
      return [
        'Which Indian staple gives highest protein per rupee?',
        'Suggest an affordable weekly grocery list.',
      ];
    }
    return [
      'Explain my planned nutrition targets.',
      'What should I do on rest days?',
    ];
  };

  const handleClearChat = () => {
    Alert.alert(
      'Clear Conversation',
      'Are you sure you want to clear your chat history with FitShift Coach?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setMessages([]);
            setErrorMessage(null);
            await planStorage.clearChatHistory();
          },
        },
      ]
    );
  };

  const handleRetry = (failedQuery: string) => {
    handleSendMessage(failedQuery);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* AI Coach Header */}
      <ChatHeader
        status={aiStatus}
        isLoadingStatus={isLoadingStatus}
        hasMessages={messages.length > 0}
        onClearChat={handleClearChat}
        onRefreshStatus={checkStatus}
      />

      {/* Plan Context Toggle Bar */}
      <ContextToggle
        usePlanContext={usePlanContext}
        onToggle={setUsePlanContext}
        userProfile={userProfile}
      />

      {/* Main Chat Scroll Area */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={[
          styles.messagesContent,
          messages.length === 0 && styles.messagesContentEmpty,
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ChatEmptyState
            status={aiStatus}
            onSelectPrompt={handleSendMessage}
            disabled={isGenerating}
          />
        }
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            onRetry={handleRetry}
            onSelectPrompt={handleSendMessage}
          />
        )}
        ListFooterComponent={isGenerating ? <TypingIndicator /> : undefined}
      />

      {/* Inline Chat Error Banner */}
      {errorMessage && (
        <View style={styles.errorBanner}>
          <Icon name="alert" size={15} color="#DC2626" />
          <Text style={styles.errorText} numberOfLines={2}>
            {errorMessage}
          </Text>
          <TouchableOpacity onPress={() => setErrorMessage(null)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="x" size={13} color="#DC2626" />
          </TouchableOpacity>
        </View>
      )}

      {/* Interactive Bottom Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        isLoading={isGenerating}
        disabled={false}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingVertical: spacing.sm,
  },
  messagesContentEmpty: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1F2',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#FECDD3',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    gap: spacing.xs,
  },
  errorIcon: {
    fontSize: 14,
  },
  errorText: {
    flex: 1,
    ...typography.caption,
    fontSize: 11,
    color: '#9F1239',
    fontWeight: '500',
  },
  errorDismiss: {
    ...typography.caption,
    fontSize: 12,
    color: '#9F1239',
    fontWeight: '700',
    paddingHorizontal: 4,
  },
});
