import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Exercise } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';

export interface ExerciseDetailModalProps {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSwapAlternative?: (exerciseId: string) => void;
  onStartTimer?: (seconds: number, exerciseName: string) => void;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  visible,
  exercise,
  onClose,
  onSwapAlternative,
  onStartTimer,
}) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  if (!exercise) return null;

  const hasValidImage = Boolean(exercise.thumbnailUrl) && !imageError;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleCol}>
              <View style={styles.tagRow}>
                <Badge
                  label={exercise.environment === 'home' ? 'HOME' : 'GYM'}
                  variant="neutral"
                  size="sm"
                />
                <Badge
                  label={exercise.targetMuscle.toUpperCase()}
                  variant="accent"
                  size="sm"
                />
              </View>
              <Text style={styles.title} numberOfLines={2}>
                {exercise.name}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Icon name="x" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.scrollBody}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Visual Exercise Demonstration Preview */}
            <View style={styles.imageContainer}>
              {hasValidImage ? (
                <>
                  <Image
                    source={{ uri: exercise.thumbnailUrl }}
                    style={styles.exerciseImage}
                    resizeMode="cover"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                    onError={() => {
                      setImageLoading(false);
                      setImageError(true);
                    }}
                  />
                  {imageLoading ? (
                    <View style={styles.imageLoader}>
                      <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                  ) : null}
                </>
              ) : (
                <View style={styles.fallbackBox}>
                  <Icon name="dumbbell" size={32} color={colors.primary} />
                  <Text style={styles.fallbackTitle}>Visual Exercise Form Guide</Text>
                  <Text style={styles.fallbackSub}>
                    Maintain a neutral spine and controlled tempo through full range of motion.
                  </Text>
                </View>
              )}

              {/* Overlay pill for sets & rest */}
              <View style={styles.imageFooterOverlay}>
                <View style={styles.imageOverlayItem}>
                  <Icon name="activity" size={14} color={colors.textInverse} />
                  <Text style={styles.overlayText}>{exercise.setsReps}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onStartTimer) {
                      onStartTimer(exercise.restSeconds, exercise.name);
                    }
                  }}
                  style={styles.overlayTimerButton}
                >
                  <Icon name="timer" size={13} color={colors.primaryDark} />
                  <Text style={styles.overlayTimerText}>
                    {exercise.restSeconds}s Rest Timer
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Target Breakdown & Equipment */}
            <View style={styles.metaCard}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>PRIMARY MUSCLE</Text>
                <Text style={styles.metaValue}>{exercise.targetMuscle}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>EQUIPMENT</Text>
                <Text style={styles.metaValue}>{exercise.equipment || 'Bodyweight'}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>CADENCE</Text>
                <Text style={styles.metaValue}>2s-1s-2s</Text>
              </View>
            </View>

            {/* Step-by-Step Execution Instructions */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>EXECUTION TECHNIQUE</Text>
              {exercise.instructions && exercise.instructions.length > 0 ? (
                <View style={styles.instructionsList}>
                  {exercise.instructions.map((step, idx) => (
                    <View key={idx} style={styles.stepRow}>
                      <View style={styles.stepBadge}>
                        <Text style={styles.stepNumber}>{idx + 1}</Text>
                      </View>
                      <Text style={styles.stepText}>{step}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.fallbackText}>
                  Perform with controlled cadence, initiating from the target muscle group. Exhale on exertion and inhale during eccentric return.
                </Text>
              )}
            </View>

            {/* Common Mistakes Warning */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 ? (
              <View style={styles.cautionCard}>
                <View style={styles.cautionHeader}>
                  <Icon name="alert" size={16} color={colors.warning} />
                  <Text style={styles.cautionTitle}>COMMON FORM MISTAKES</Text>
                </View>
                {exercise.commonMistakes.map((mistake, idx) => (
                  <View key={idx} style={styles.cautionBulletRow}>
                    <Text style={styles.cautionBullet}>•</Text>
                    <Text style={styles.cautionText}>{mistake}</Text>
                  </View>
                ))}
              </View>
            ) : null}

            {/* Direct Paired Alternative Card */}
            {exercise.alternative ? (
              <View style={styles.alternativeCard}>
                <View style={styles.altHeader}>
                  <View style={styles.altBadgeRow}>
                    <Icon name="refresh" size={14} color={colors.primaryDark} />
                    <Text style={styles.altBadgeTitle}>DIRECT PAIRED ALTERNATIVE</Text>
                  </View>
                  <Badge
                    label={exercise.alternative.environment.toUpperCase()}
                    variant="neutral"
                    size="sm"
                  />
                </View>

                <Text style={styles.altName}>{exercise.alternative.name}</Text>
                <Text style={styles.altNote}>
                  {exercise.alternative.note ||
                    `Target: ${exercise.alternative.targetMuscle || exercise.targetMuscle} • Equipment: ${exercise.alternative.equipment}`}
                </Text>

                {onSwapAlternative ? (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      onSwapAlternative(exercise.id);
                      onClose();
                    }}
                    style={styles.swapActionBtn}
                  >
                    <Icon name="refresh" size={14} color={colors.primaryDark} />
                    <Text style={styles.swapActionText}>
                      Switch to {exercise.alternative.name}
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onClose}
              style={styles.closeFooterBtn}
            >
              <Text style={styles.closeFooterText}>Got It</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius['2xl'],
    borderTopRightRadius: borderRadius['2xl'],
    maxHeight: '90%',
    minHeight: '60%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleCol: {
    flex: 1,
    paddingRight: spacing.md,
    gap: spacing.xs,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.full,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '700',
  },
  scrollBody: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  exerciseImage: {
    width: '100%',
    height: '100%',
  },
  imageLoader: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(244, 244, 246, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    backgroundColor: colors.surfaceSubtle,
  },
  fallbackEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  fallbackTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  fallbackSub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 240,
  },
  imageFooterOverlay: {
    position: 'absolute',
    bottom: spacing.xs,
    left: spacing.xs,
    right: spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  imageOverlayItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  overlayIcon: {
    fontSize: 12,
  },
  overlayText: {
    ...typography.caption,
    color: colors.textInverse,
    fontWeight: '600',
    fontSize: 11,
  },
  overlayTimerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(21, 128, 61, 0.65)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  overlayTimerText: {
    ...typography.caption,
    color: '#86EFAC',
    fontWeight: '700',
    fontSize: 11,
  },
  metaCard: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  metaLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.5,
  },
  metaValue: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  metaDivider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeader: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  instructionsList: {
    gap: spacing.sm,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  stepBadge: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stepNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  stepText: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
    lineHeight: 18,
    fontSize: 13,
  },
  fallbackText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  cautionCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: spacing.xs,
  },
  cautionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cautionIcon: {
    fontSize: 14,
  },
  cautionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: '#92400E',
    letterSpacing: 0.5,
    fontSize: 11,
  },
  cautionBulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  cautionBullet: {
    color: '#B45309',
    fontWeight: '700',
    fontSize: 12,
  },
  cautionText: {
    ...typography.caption,
    color: '#78350F',
    flex: 1,
    lineHeight: 17,
    fontSize: 12,
  },
  alternativeCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  altHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  altBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  altBadgeIcon: {
    fontSize: 13,
  },
  altBadgeTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  altName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  altNote: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 12,
  },
  swapActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.primaryLight,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  swapActionIcon: {
    fontSize: 14,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  swapActionText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.primaryDark,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  closeFooterBtn: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  closeFooterText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textInverse,
  },
});

export default ExerciseDetailModal;
