import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Badge } from '../common/Badge';
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
  onRefreshStatus,
}) => {
  const isConfigured = Boolean(status?.configured);
  const providerName = status?.provider ? status.provider.toUpperCase() : 'AI READY';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <View style={styles.avatarBox}>
            <Icon name="bot" size={20} color={colors.primaryDark} />
          </View>
          <View style={styles.titleTextCol}>
            <View style={styles.nameRow}>
              <Text style={styles.title}>FitShift Coach</Text>
              <View style={styles.statusDot}>
                <View
                  style={[
                    styles.indicatorDot,
                    isConfigured ? styles.indicatorOnline : styles.indicatorOffline,
                  ]}
                />
              </View>
            </View>
            <Text style={styles.subtitle}>
              Routine-first & budget-realistic companion
            </Text>
          </View>
        </View>

        <View style={styles.actionsGroup}>
          {isLoadingStatus ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onRefreshStatus}
              accessibilityLabel="Refresh AI status"
            >
              <Badge
                label={isConfigured ? providerName : 'OFFLINE'}
                variant={isConfigured ? 'accent' : 'warning'}
                size="sm"
              />
            </TouchableOpacity>
          )}

          {hasMessages && onClearChat && (
            <TouchableOpacity
              style={styles.clearBtn}
              onPress={onClearChat}
              activeOpacity={0.7}
              accessibilityLabel="Clear conversation"
            >
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
    paddingTop: spacing.sm,
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
    marginRight: spacing.sm,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  titleTextCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  statusDot: {
    padding: 2,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
  },
  actionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  clearBtn: {
    paddingVertical: 4,
    paddingHorizontal: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  clearBtnText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
