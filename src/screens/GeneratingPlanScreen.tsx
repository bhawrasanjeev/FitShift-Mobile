import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { OnboardingData } from '../types';
import { usePlan } from '../context/PlanContext';
import { Button } from '../components/common/Button';
import { ErrorState } from '../components/common/ErrorState';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { borderRadius } from '../theme/borderRadius';

export interface GeneratingPlanScreenProps {
  data: OnboardingData;
  onSuccess: () => void;
  onCancel: () => void;
}

export const GeneratingPlanScreen: React.FC<GeneratingPlanScreenProps> = ({
  data,
  onSuccess,
  onCancel,
}) => {
  const { generatePlan, error, clearError } = usePlan();
  const [activeStage, setActiveStage] = useState<number>(1);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [generationFailed, setGenerationFailed] = useState<boolean>(false);

  const stages = [
    { id: 1, title: 'Calculating BMR, TDEE & Macro Targets', desc: 'Mifflin-St Jeor calculation with activity multiplier' },
    { id: 2, title: 'Optimizing Indian Whole-Food Staples', desc: '0/1 Knapsack optimizer with ₹ budget and 50g soya cap' },
    { id: 3, title: 'Synthesizing 7-Day Workout Split', desc: 'Deterministic routine with free-exercise-db media CDN' },
    { id: 4, title: 'Finalizing 24-Hour Rhythm & Grocery Plan', desc: 'Timing meals & workouts to your transit schedule' },
  ];

  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [pulseAnim]);

  // Stage advancement ticker
  useEffect(() => {
    if (generationFailed) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < 4 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, [generationFailed]);

  // Execute plan generation
  useEffect(() => {
    let isMounted = true;

    async function execute() {
      if (hasStarted) return;
      setHasStarted(true);
      setGenerationFailed(false);
      clearError();

      const success = await generatePlan(data);
      if (!isMounted) return;

      if (success) {
        // Small pause to allow animations to settle
        setTimeout(() => {
          if (isMounted) onSuccess();
        }, 500);
      } else {
        setGenerationFailed(true);
      }
    }

    execute();

    return () => {
      isMounted = false;
    };
  }, [data, generatePlan, hasStarted, onSuccess, clearError]);

  const handleRetry = async () => {
    setGenerationFailed(false);
    clearError();
    setActiveStage(1);
    const success = await generatePlan(data);
    if (success) {
      onSuccess();
    } else {
      setGenerationFailed(true);
    }
  };

  if (generationFailed) {
    return (
      <View style={styles.errorContainer}>
        <ErrorState
          title="Plan Generation Failed"
          message={
            error ||
            'Could not connect to the FitShift backend. Please ensure the Express server is running on port 5001.'
          }
          onRetry={handleRetry}
        />
        <Button
          title="Back to Review"
          variant="outline"
          size="md"
          onPress={onCancel}
          style={styles.backButton}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Brand Icon Pulse */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: pulseAnim }],
          },
        ]}
      >
        <Text style={styles.logoIcon}>🏋️</Text>
      </Animated.View>

      {/* Primary Status Title */}
      <View style={styles.statusCol}>
        <Text style={styles.title}>Constructing Your FitShift Plan</Text>
        <Text style={styles.subtitle}>
          Applying Indian grocery economics and your personal timetable...
        </Text>
      </View>

      {/* Stage Checklist */}
      <View style={styles.stagesBox}>
        {stages.map((stage) => {
          const isDone = activeStage > stage.id;
          const isCurrent = activeStage === stage.id;

          return (
            <View key={stage.id} style={styles.stageRow}>
              <View
                style={[
                  styles.stageIndicator,
                  isDone && styles.stageIndicatorDone,
                  isCurrent && styles.stageIndicatorCurrent,
                ]}
              >
                {isDone ? (
                  <Text style={styles.checkIcon}>✓</Text>
                ) : isCurrent ? (
                  <ActivityIndicator size="small" color={colors.primary} />
                ) : (
                  <Text style={styles.pendingDot}>•</Text>
                )}
              </View>

              <View style={styles.stageTextCol}>
                <Text
                  style={[
                    styles.stageTitle,
                    (isDone || isCurrent) && styles.stageTitleActive,
                  ]}
                >
                  {stage.title}
                </Text>
                <Text style={styles.stageDesc}>{stage.desc}</Text>
              </View>
            </View>
          );
        })}
      </View>

      <Text style={styles.footerNote}>
        Zero mock data. Running live backend optimization algorithms.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.xl,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    gap: spacing.md,
  },
  backButton: {
    minWidth: 200,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 38,
  },
  statusCol: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 18,
  },
  stagesBox: {
    width: '100%',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  stageIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  stageIndicatorDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stageIndicatorCurrent: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  checkIcon: {
    color: colors.surface,
    fontWeight: '700',
    fontSize: 14,
  },
  pendingDot: {
    color: colors.textMuted,
    fontSize: 18,
  },
  stageTextCol: {
    flex: 1,
    gap: 2,
  },
  stageTitle: {
    ...typography.bodySmall,
    color: colors.textMuted,
    fontWeight: '600',
  },
  stageTitleActive: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  stageDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
  footerNote: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
  },
});
