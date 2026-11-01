import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { TrainingEnvironment } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { shadows } from '../../theme/shadows';

export interface EnvironmentToggleProps {
  environment: TrainingEnvironment;
  onEnvironmentChange: (env: TrainingEnvironment) => void;
  isLoading?: boolean;
  style?: ViewStyle;
}

export const EnvironmentToggle: React.FC<EnvironmentToggleProps> = ({
  environment,
  onEnvironmentChange,
  isLoading = false,
  style,
}) => {
  const isHome = environment === 'home';

  return (
    <View style={[styles.container, style]}>
      {/* Segment Switcher */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={() => onEnvironmentChange('home')}
          style={[styles.segment, isHome && styles.segmentActive]}
        >
          <Text style={styles.segmentIcon}>🏠</Text>
          <Text style={[styles.segmentLabel, isHome && styles.segmentLabelActive]}>
            Home Setup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={() => onEnvironmentChange('gym')}
          style={[styles.segment, !isHome && styles.segmentActive]}
        >
          <Text style={styles.segmentIcon}>🏢</Text>
          <Text style={[styles.segmentLabel, !isHome && styles.segmentLabelActive]}>
            Commercial Gym
          </Text>
        </TouchableOpacity>
      </View>

      {/* Equipment Context Banner */}
      <View style={styles.contextBanner}>
        {isLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.loadingText}>
              Regenerating {isHome ? 'home calisthenics' : 'gym routine'} with local exercises...
            </Text>
          </View>
        ) : (
          <View style={styles.infoRow}>
            <Text style={styles.infoBadge}>
              {isHome ? 'BODYWEIGHT & BANDS' : 'FREE WEIGHTS & MACHINES'}
            </Text>
            <Text style={styles.infoText}>
              {isHome
                ? 'Floor mat, progressive leverage, optional bands & door pull-up bar.'
                : 'Olympic barbells, dumbbells, cable pulleys, and leg press.'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    gap: spacing.xs,
  },
  segmentActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  segmentIcon: {
    fontSize: 16,
  },
  segmentLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  segmentLabelActive: {
    color: colors.primaryDark,
    fontWeight: typography.weights.bold,
  },
  contextBanner: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  infoRow: {
    gap: 3,
  },
  infoBadge: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  infoText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: 2,
  },
  loadingText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.primaryDark,
    fontWeight: typography.weights.medium,
  },
});

export default EnvironmentToggle;
