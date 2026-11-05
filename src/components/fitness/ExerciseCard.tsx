import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Exercise } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';

export interface ExerciseCardProps {
  exercise: Exercise;
  onViewDetails?: (exercise: Exercise) => void;
  onSwapAlternative?: (exerciseId: string) => void;
  onStartTimer?: (seconds: number, exerciseName: string) => void;
  style?: ViewStyle;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onViewDetails,
  onSwapAlternative,
  onStartTimer,
  style,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const hasValidImage = Boolean(exercise.thumbnailUrl) && !imageError;

  return (
    <View style={[styles.card, style]}>
      <View style={styles.mainRow}>
        {/* Exercise Thumbnail Box */}
        <View style={styles.thumbnailContainer}>
          {hasValidImage ? (
            <>
              <Image
                source={{ uri: exercise.thumbnailUrl }}
                style={styles.thumbnail}
                resizeMode="cover"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  setImageError(true);
                }}
              />
              {imageLoading ? (
                <View style={styles.loaderOverlay}>
                  <ActivityIndicator size="small" color={colors.primary} />
                </View>
              ) : null}
            </>
          ) : (
            <View style={styles.fallbackBox}>
              <Icon name="dumbbell" size={24} color={colors.primary} />
              <Text style={styles.fallbackText}>Exercise</Text>
            </View>
          )}

          {/* Environment Pill Overlay (HOME vs GYM) */}
          <View style={styles.environmentPill}>
            <Text style={styles.environmentText}>
              {exercise.environment === 'home' ? 'HOME' : exercise.environment === 'gym' ? 'GYM' : 'ANY'}
            </Text>
          </View>
        </View>

        {/* Exercise Info */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.exerciseName} numberOfLines={1}>
              {exercise.name}
            </Text>
          </View>

          <View style={styles.badgeRow}>
            <Badge label={exercise.targetMuscle} variant="accent" size="sm" />
            <Text style={styles.equipmentText} numberOfLines={1}>
              {exercise.equipment || 'Bodyweight'}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.setsReps}>{exercise.setsReps}</Text>
            {onStartTimer ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onStartTimer(exercise.restSeconds, exercise.name)}
                style={styles.restTimerBadge}
              >
                <Icon name="timer" size={11} color={colors.primaryDark} />
                <Text style={styles.restTimerText}>{exercise.restSeconds}s Rest</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.restText}>Rest: {exercise.restSeconds}s</Text>
            )}
          </View>
        </View>
      </View>

      {/* Action Footer */}
      {(onViewDetails || onSwapAlternative || onStartTimer) ? (
        <View style={styles.footerRow}>
          {onStartTimer ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onStartTimer(exercise.restSeconds, exercise.name)}
              style={[styles.actionButton, styles.timerButton]}
            >
              <Icon name="timer" size={12} color={colors.primaryDark} />
              <Text style={[styles.actionButtonText, styles.timerButtonText]}>Timer</Text>
            </TouchableOpacity>
          ) : null}

          {onViewDetails ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onViewDetails(exercise)}
              style={styles.actionButton}
            >
              <Text style={styles.actionButtonText}>View Details</Text>
            </TouchableOpacity>
          ) : null}

          {onSwapAlternative ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onSwapAlternative(exercise.id)}
              style={[styles.actionButton, styles.swapButton]}
            >
              <Icon name="refresh" size={12} color={colors.primaryDark} />
              <Text style={[styles.actionButtonText, styles.swapButtonText]}>Swap</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xs,
    ...shadows.sm,
  },
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnailContainer: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    position: 'relative',
    marginRight: spacing.md,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(244, 244, 246, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceSubtle,
    gap: 2,
  },
  fallbackText: {
    fontSize: 9,
    fontWeight: typography.weights.medium,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  environmentPill: {
    position: 'absolute',
    bottom: 3,
    right: 3,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: borderRadius.xs,
  },
  environmentText: {
    color: colors.textInverse,
    fontSize: 8,
    fontWeight: typography.weights.bold,
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  exerciseName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: 6,
  },
  equipmentText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    textTransform: 'capitalize',
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  setsReps: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.primary,
  },
  restText: {
    fontSize: typography.sizes.xs,
    color: colors.textMuted,
  },
  restTimerBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  restTimerText: {
    fontSize: typography.sizes.xs,
    color: colors.primaryDark,
    fontWeight: typography.weights.semibold,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  actionButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
  },
  actionButtonText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  timerButton: {
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  timerButtonText: {
    color: colors.textPrimary,
  },
  swapButton: {
    backgroundColor: colors.primaryLight,
  },
  swapButtonText: {
    color: colors.primaryDark,
  },
});

export default ExerciseCard;
