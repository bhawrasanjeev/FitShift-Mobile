import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Icon } from '../common/Icon';
import { AIStatusResponse } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface ChatHeaderProps {
  status: AIStatusResponse | null;
  isLoadingStatus: boolean;
  hasMessages: boolean;
  onClearChat?: () => void;
  onRefreshStatus?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  status,
  isLoadingStatus,
  hasMessages,
  onClearChat,
}) => {
  const insets = useSafeAreaInsets();
  const topInset = Math.max(insets.top, (StatusBar.currentHeight || 0), 44);
  const isOnline = Boolean(status?.configured);

  return (
    <View style={[styles.container, { paddingTop: topInset + spacing.sm }]}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>AI</Text>
          </View>
          <View style={styles.titleTextCol}>
            <View style={styles.nameRow}>
              <Text style={styles.title}>AI Coach</Text>
              <View style={styles.statusDot}>
                <View
                  style={[
                    styles.indicatorDot,
                    isOnline ? styles.indicatorOnline : styles.indicatorOffline,
                  ]}
                />
              </View>
            </View>
            <Text style={styles.subtitle}>Fitness & Nutrition Assistant</Text>
          </View>
        </View>

        <View style={styles.actionsGroup}>
          {isLoadingStatus ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : null}

          {hasMessages && onClearChat && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={onClearChat}
              activeOpacity={0.7}
              accessibilityLabel="Clear conversation"
            >
              <Icon name="trash" size={13} color={colors.textSecondary} />
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  titleTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  statusDot: {
    padding: 2,
  },
  indicatorDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  indicatorOnline: {
    backgroundColor: colors.primary,
  },
  indicatorOffline: {
    backgroundColor: '#F59E0B',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    marginTop: 1,
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearBtnText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
