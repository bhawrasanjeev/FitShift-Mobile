import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Vibration,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface RestTimerModalProps {
  visible: boolean;
  initialSeconds: number;
  exerciseName?: string;
  onClose: () => void;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  visible,
  initialSeconds = 60,
  exerciseName,
  onClose,
}) => {
  const [totalSeconds, setTotalSeconds] = useState<number>(initialSeconds || 60);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds || 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Sync when visible or initialSeconds changes
  useEffect(() => {
    if (visible) {
      const sec = initialSeconds > 0 ? initialSeconds : 60;
      setTotalSeconds(sec);
      setSecondsRemaining(sec);
      setIsRunning(true);
      setIsCompleted(false);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [visible, initialSeconds]);

  // Interval ticker
  useEffect(() => {
    if (visible && isRunning && secondsRemaining > 0) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            try {
              Vibration.vibrate(500);
            } catch {
              // Ignore vibration failure
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [visible, isRunning, secondsRemaining]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleToggleRunning = () => {
    if (isCompleted) {
      setSecondsRemaining(totalSeconds);
      setIsCompleted(false);
      setIsRunning(true);
    } else {
      setIsRunning((prev) => !prev);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsCompleted(false);
    setSecondsRemaining(totalSeconds);
  };

  const handleAdjustTime = (delta: number) => {
    setSecondsRemaining((prev) => {
      const next = Math.max(5, prev + delta);
      if (next > totalSeconds) {
        setTotalSeconds(next);
      }
      return next;
    });
    if (isCompleted) setIsCompleted(false);
  };

  const handleSelectPreset = (seconds: number) => {
    setTotalSeconds(seconds);
    setSecondsRemaining(seconds);
    setIsRunning(true);
    setIsCompleted(false);
  };

  const progressPercent = totalSeconds > 0 ? (secondsRemaining / totalSeconds) * 100 : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleCol}>
              <Text style={styles.headerSubtitle}>INTER-SET RECOVERY</Text>
              <Text style={styles.headerTitle}>
                {exerciseName ? exerciseName : 'Rest Period'}
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={styles.closeButton}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Countdown Display Card */}
          <View style={[styles.timerCard, isCompleted && styles.timerCardCompleted]}>
            {/* Progress Bar */}
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${Math.min(100, Math.max(0, progressPercent))}%` },
                  isCompleted && styles.progressBarFillCompleted,
                ]}
              />
            </View>

            {/* Time String */}
            <Text style={[styles.timerDigits, isCompleted && styles.timerDigitsCompleted]}>
              {formatTime(secondsRemaining)}
            </Text>

            {/* Status Text */}
            <Text style={[styles.timerStatus, isCompleted && styles.timerStatusCompleted]}>
              {isCompleted
                ? '🎉 Rest Finished! Ready for next set'
                : isRunning
                ? 'Heart rate & nervous system restoring'
                : 'Timer Paused'}
            </Text>
          </View>

          {/* Quick Adjustment Controls */}
          <View style={styles.adjustRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAdjustTime(-15)}
              style={styles.adjustButton}
            >
              <Text style={styles.adjustButtonText}>-15s</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleToggleRunning}
              style={[
                styles.mainActionButton,
                isCompleted ? styles.mainActionButtonSuccess : isRunning ? styles.mainActionButtonPause : styles.mainActionButtonPlay,
              ]}
            >
              <Text style={styles.mainActionIcon}>
                {isCompleted ? '🔄' : isRunning ? '⏸' : '▶'}
              </Text>
              <Text style={styles.mainActionText}>
                {isCompleted ? 'Repeat Rest' : isRunning ? 'Pause' : 'Resume'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleAdjustTime(15)}
              style={styles.adjustButton}
            >
              <Text style={styles.adjustButtonText}>+15s</Text>
            </TouchableOpacity>
          </View>

          {/* Reset Button */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReset}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset to {totalSeconds}s</Text>
          </TouchableOpacity>

          {/* Preset Buttons */}
          <View style={styles.presetsSection}>
            <Text style={styles.presetsTitle}>QUICK PRESETS</Text>
            <View style={styles.presetsRow}>
              {[30, 45, 60, 90, 120].map((preset) => {
                const isSelected = totalSeconds === preset && !isCompleted;
                return (
                  <TouchableOpacity
                    key={preset}
                    activeOpacity={0.7}
                    onPress={() => handleSelectPreset(preset)}
                    style={[
                      styles.presetChip,
                      isSelected && styles.presetChipSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.presetChipText,
                        isSelected && styles.presetChipTextSelected,
                      ]}
                    >
                      {preset}s
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Dismiss Action */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onClose}
            style={styles.dismissButton}
          >
            <Text style={styles.dismissButtonText}>
              {isCompleted ? 'Start Next Set' : 'Minimize Timer'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
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
  timerCard: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  timerCardCompleted: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.border,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  progressBarFillCompleted: {
    backgroundColor: '#059669',
  },
  timerDigits: {
    fontSize: 52,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 2,
    fontVariant: ['tabular-nums'],
  },
  timerDigitsCompleted: {
    color: '#047857',
  },
  timerStatus: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  timerStatusCompleted: {
    color: '#065F46',
    fontWeight: '700',
  },
  adjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  adjustButton: {
    width: 54,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButtonText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 13,
  },
  mainActionButton: {
    flex: 1,
    height: 48,
    borderRadius: borderRadius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  mainActionButtonPlay: {
    backgroundColor: colors.primary,
  },
  mainActionButtonPause: {
    backgroundColor: '#D97706',
  },
  mainActionButtonSuccess: {
    backgroundColor: colors.primary,
  },
  mainActionIcon: {
    fontSize: 16,
    color: colors.textInverse,
  },
  mainActionText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textInverse,
  },
  resetButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  resetButtonText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
  },
  presetsSection: {
    gap: spacing.xs,
  },
  presetsTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  presetsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
  },
  presetChip: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  presetChipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  presetChipText: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  presetChipTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  dismissButton: {
    backgroundColor: colors.surfaceSubtle,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: spacing.xs,
  },
  dismissButtonText: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
});

export default RestTimerModal;
