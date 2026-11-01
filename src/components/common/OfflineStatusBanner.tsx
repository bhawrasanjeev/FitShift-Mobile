import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';

export interface OfflineStatusBannerProps {
  isOffline: boolean;
  onRetry?: () => void;
  style?: ViewStyle;
}

export const OfflineStatusBanner: React.FC<OfflineStatusBannerProps> = ({
  isOffline,
  onRetry,
  style,
}) => {
  if (!isOffline) return null;

  return (
    <View style={[styles.banner, style]}>
      <View style={styles.left}>
        <View style={styles.dot} />
        <Text style={styles.text}>Offline Mode — Using Cached Plan</Text>
      </View>

      {onRetry ? (
        <TouchableOpacity activeOpacity={0.7} onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.warning,
    marginRight: spacing.sm,
  },
  text: {
    fontSize: 11,
    fontWeight: typography.weights.medium,
    color: '#92400E',
  },
  retryBtn: {
    paddingVertical: 2,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: '#FDE68A',
  },
  retryText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: '#92400E',
  },
});

export default OfflineStatusBanner;
