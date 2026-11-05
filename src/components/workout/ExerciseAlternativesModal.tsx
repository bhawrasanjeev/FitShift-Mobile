import React from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Exercise } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';

export interface ExerciseAlternativesModalProps {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onConfirmSwap: (exerciseId: string) => void;
}

export const ExerciseAlternativesModal: React.FC<ExerciseAlternativesModalProps> = ({
  visible,
  exercise,
  onClose,
  onConfirmSwap,
}) => {
  if (!exercise || !exercise.alternative) return null;

  const alt = exercise.alternative;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerSubtitle}>EXERCISE SUBSTITUTION</Text>
              <Text style={styles.headerTitle}>Swap Movement</Text>
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
            <Text style={styles.explanationText}>
              Select a biomechanically balanced alternative sharing target muscle recruitment and volume structure.
            </Text>

            {/* Current Exercise Preview */}
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Badge label="CURRENT MOVEMENT" variant="neutral" size="sm" />
                <Badge label={exercise.environment.toUpperCase()} variant="neutral" size="sm" />
              </View>

              <View style={styles.cardBody}>
                {exercise.thumbnailUrl ? (
                  <Image
                    source={{ uri: exercise.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailFallback}>
                    <Icon name="dumbbell" size={22} color={colors.textMuted} />
                  </View>
                )}

                <View style={styles.cardDetails}>
                  <Text style={styles.exerciseName} numberOfLines={2}>
                    {exercise.name}
                  </Text>
                  <Text style={styles.exerciseMuscle}>
                    Target: <Text style={styles.boldText}>{exercise.targetMuscle}</Text>
                  </Text>
                  <Text style={styles.exerciseMeta}>
                    Equipment: {exercise.equipment || 'Bodyweight'}
                  </Text>
                  <Text style={styles.exerciseSetsReps}>
                    {exercise.setsReps} • {exercise.restSeconds}s Rest
                  </Text>
                </View>
              </View>
            </View>

            {/* Swap Direction Indicator */}
            <View style={styles.swapIndicatorRow}>
              <View style={styles.swapLine} />
              <View style={styles.swapBadge}>
                <Icon name="refresh" size={12} color={colors.primaryDark} />
                <Text style={styles.swapBadgeText}>DIRECT REPLACEMENT</Text>
              </View>
              <View style={styles.swapLine} />
            </View>

            {/* Alternative Exercise Preview */}
            <View style={[styles.card, styles.altCard]}>
              <View style={styles.cardHeader}>
                <Badge label="PROPOSED ALTERNATIVE" variant="success" size="sm" />
                <Badge label={alt.environment.toUpperCase()} variant="neutral" size="sm" />
              </View>

              <View style={styles.cardBody}>
                {alt.thumbnailUrl ? (
                  <Image
                    source={{ uri: alt.thumbnailUrl }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.thumbnailFallback}>
                    <Icon name="sparkles" size={22} color={colors.primary} />
                  </View>
                )}

                <View style={styles.cardDetails}>
                  <Text style={styles.exerciseName} numberOfLines={2}>
                    {alt.name}
                  </Text>
                  <Text style={styles.exerciseMuscle}>
                    Target: <Text style={styles.boldText}>{alt.targetMuscle || exercise.targetMuscle}</Text>
                  </Text>
                  <Text style={styles.exerciseMeta}>
                    Equipment: {alt.equipment || 'Bodyweight'}
                  </Text>
                  <Text style={styles.exerciseNote}>{alt.note}</Text>
                </View>
              </View>
            </View>

            {/* Benefit callout */}
            <View style={styles.benefitBox}>
              <Icon name="sparkles" size={14} color={colors.primaryDark} />
              <Text style={styles.benefitText}>
                Swapping preserves your programmed sets, reps, and target load. Reversible at any time.
              </Text>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.cancelButton}
            >
              <Text style={styles.cancelButtonText}>Keep Current</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                onConfirmSwap(exercise.id);
                onClose();
              }}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmButtonText}>
                Confirm Swap to {alt.name.split(' ')[0]}
              </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleCol: {
    flex: 1,
    gap: 2,
  },
  headerSubtitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  headerTitle: {
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
    gap: spacing.md,
  },
  explanationText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    fontSize: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  altCard: {
    borderColor: colors.primary,
    backgroundColor: '#F0FDF4',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBody: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnail: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSubtle,
  },
  thumbnailFallback: {
    width: 72,
    height: 72,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDetails: {
    flex: 1,
    gap: 2,
  },
  exerciseName: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  exerciseMuscle: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  exerciseMeta: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    textTransform: 'capitalize',
  },
  exerciseSetsReps: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 11,
    marginTop: 2,
  },
  exerciseNote: {
    ...typography.caption,
    color: colors.primaryDark,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  swapIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  swapBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  swapBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  benefitBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  benefitIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  benefitText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 17,
    fontSize: 11,
  },
  footer: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  confirmButton: {
    flex: 2,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textInverse,
  },
});

export default ExerciseAlternativesModal;
