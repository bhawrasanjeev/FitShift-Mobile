import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { ExerciseCard } from '../../components/fitness/ExerciseCard';
import {
  EnvironmentToggle,
  ExerciseDetailModal,
  ExerciseAlternativesModal,
  RestTimerModal,
  DaySplitSelector,
} from '../../components/workout';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { shadows } from '../../theme/shadows';
import { Exercise, TrainingEnvironment } from '../../types';

export const WorkoutTabScreen: React.FC = () => {
  const {
    plan,
    userProfile,
    switchWorkoutEnvironment,
    swapExercise,
    isLateTiredActive,
  } = usePlan();

  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [isSwitchingEnv, setIsSwitchingEnv] = useState<boolean>(false);

  // Modals state
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState<boolean>(false);

  const [swapTargetExercise, setSwapTargetExercise] = useState<Exercise | null>(null);
  const [isSwapModalVisible, setIsSwapModalVisible] = useState<boolean>(false);

  const [timerState, setTimerState] = useState<{
    visible: boolean;
    seconds: number;
    exerciseName?: string;
  }>({
    visible: false,
    seconds: 60,
    exerciseName: undefined,
  });

  if (!plan) {
    return (
      <View style={styles.screen}>
        <Header title="Workout Routine" showBrand={false} />
        <View style={[styles.restDayCard, { margin: spacing.lg }]}>
          <Text style={styles.restDayEmoji}>🏋️</Text>
          <Text style={styles.restDayCardTitle}>No Workout Routine Active</Text>
          <Text style={styles.restDayCardDesc}>
            Generate a personalized FitShift routine to view your 7-day split and exercises.
          </Text>
        </View>
      </View>
    );
  }

  const { workout } = plan;
  const currentEnv = userProfile.training.environment;

  const currentDay =
    workout?.days?.find((d) => d.dayNumber === selectedDayNumber) ||
    workout?.days?.[0];

  const handleEnvironmentToggle = async (newEnv: TrainingEnvironment) => {
    if (newEnv === currentEnv || isSwitchingEnv) return;
    setIsSwitchingEnv(true);
    try {
      const ok = await switchWorkoutEnvironment(newEnv);
      if (!ok) {
        Alert.alert(
          'Environment Switch Failed',
          'Could not regenerate workout routine. Please verify network connection.'
        );
      }
    } catch {
      Alert.alert('Error', 'An unexpected error occurred while switching environment.');
    } finally {
      setIsSwitchingEnv(false);
    }
  };

  const handleOpenDetails = (exercise: Exercise) => {
    setDetailExercise(exercise);
    setIsDetailModalVisible(true);
  };

  const handleOpenSwap = (exerciseId: string) => {
    const ex = currentDay?.exercises.find((e) => e.id === exerciseId);
    if (ex) {
      setSwapTargetExercise(ex);
      setIsSwapModalVisible(true);
    }
  };

  const handleConfirmSwap = async (exerciseId: string) => {
    const ok = await swapExercise(selectedDayNumber, exerciseId);
    if (ok) {
      // If the swapped exercise was also in detail modal, update or close it
      if (detailExercise && detailExercise.id === exerciseId) {
        const updatedDay = plan?.workout?.days?.find((d) => d.dayNumber === selectedDayNumber);
        const updatedEx = updatedDay?.exercises.find((e) => e.id === detailExercise.alternative.id);
        if (updatedEx) {
          setDetailExercise(updatedEx);
        } else {
          setIsDetailModalVisible(false);
        }
      }
    } else {
      Alert.alert('Swap Failed', 'Unable to swap exercise at this time.');
    }
  };

  const handleStartTimer = (seconds: number, exerciseName?: string) => {
    setTimerState({
      visible: true,
      seconds: seconds > 0 ? seconds : 60,
      exerciseName,
    });
  };

  const goalLabels: Record<string, string> = {
    muscle_gain: 'Hypertrophy & Strength',
    fat_loss: 'Fat Loss & Conditioning',
    weight_loss: 'Weight Management',
    maintenance: 'Functional Maintenance',
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Workout Routine"
        subtitle={`${currentEnv === 'home' ? 'Home Calisthenics' : 'Commercial Gym'} • ${userProfile.training.durationMinutes} mins`}
        showBrand={false}
        rightAction={
          <Badge
            label={`${userProfile.training.weeklyFrequencyDays} Days/Wk`}
            variant="accent"
            size="sm"
          />
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Late / Tired Recovery Alert if active */}
        {isLateTiredActive ? (
          <View style={styles.lateTiredNotice}>
            <View style={styles.lateTiredIconBadge}>
              <Text style={styles.lateTiredIcon}>🌙</Text>
            </View>
            <View style={styles.lateTiredContent}>
              <Text style={styles.lateTiredTitle}>Late / Tired Mode Active</Text>
              <Text style={styles.lateTiredDesc}>
                15-min gentle mobility protocol active today. Heavy compound volume deferred to preserve sleep and cortisol balance.
              </Text>
            </View>
          </View>
        ) : null}

        {/* Environment Toggle Segment (Home vs Commercial Gym) */}
        <EnvironmentToggle
          environment={currentEnv}
          onEnvironmentChange={handleEnvironmentToggle}
          isLoading={isSwitchingEnv}
        />

        {/* Split Architecture Overview Banner */}
        <View style={styles.splitBanner}>
          <View style={styles.splitHeaderRow}>
            <View>
              <Text style={styles.splitCategoryTag}>DETERMINISTIC SPLIT ARCHITECTURE</Text>
              <Text style={styles.splitName}>
                {workout.weeklyFrequencyDays}-Day {currentEnv === 'home' ? 'Home' : 'Gym'} Split
              </Text>
            </View>
            <Badge
              label={userProfile.training.experienceLevel.toUpperCase()}
              variant="accent"
              size="sm"
            />
          </View>

          <Text style={styles.splitDesc}>
            Structured progressive volume balancing Push, Pull, and Leg mechanics with allocated neuromuscular recovery windows.
          </Text>

          <View style={styles.splitBadgesRow}>
            <View style={styles.splitMetaBadge}>
              <Text style={styles.splitMetaBadgeText}>
                🎯 {goalLabels[userProfile.personal.goal] || userProfile.personal.goal}
              </Text>
            </View>
            <View style={styles.splitMetaBadge}>
              <Text style={styles.splitMetaBadgeText}>
                ⏱️ {workout.durationMinutes}m / session
              </Text>
            </View>
            <View style={styles.splitMetaBadge}>
              <Text style={styles.splitMetaBadgeText}>
                🏋️ {workout.days?.reduce((acc, d) => acc + (d.exercises?.length || 0), 0)} movements programmed
              </Text>
            </View>
          </View>
        </View>

        {/* 7-Day Split Selector */}
        <View style={styles.section}>
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>7-DAY ROTATION</Text>
            <Text style={styles.sectionHint}>Tap day to view routine</Text>
          </View>

          <DaySplitSelector
            days={workout.days || []}
            selectedDayNumber={selectedDayNumber}
            onSelectDay={setSelectedDayNumber}
          />
        </View>

        {/* Active Day Detail Banner */}
        {currentDay ? (
          <View style={styles.section}>
            <View style={styles.dayFocusBanner}>
              <View style={styles.dayFocusTitleCol}>
                <Text style={styles.dayFocusSub}>
                  DAY {currentDay.dayNumber} • {currentDay.dayName.toUpperCase()}
                </Text>
                <Text style={styles.dayFocusTitle}>{currentDay.focus}</Text>
              </View>

              <Badge
                label={currentDay.isRestDay ? 'Rest & Repair' : `${currentDay.exercises?.length || 0} Movements`}
                variant={currentDay.isRestDay ? 'warning' : 'accent'}
                size="sm"
              />
            </View>

            {/* Exercises List or Rest Day Guide */}
            {!currentDay.isRestDay && currentDay.exercises && currentDay.exercises.length > 0 ? (
              <View style={styles.exercisesList}>
                {currentDay.exercises.map((exercise) => (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    onViewDetails={handleOpenDetails}
                    onSwapAlternative={handleOpenSwap}
                    onStartTimer={(secs, name) => handleStartTimer(secs, name)}
                    style={styles.exerciseCard}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.restDayCard}>
                <Text style={styles.restDayEmoji}>🧘</Text>
                <Text style={styles.restDayCardTitle}>Scheduled Rest & Neuromuscular Repair</Text>
                <Text style={styles.restDayCardDesc}>
                  Protein synthesis, nervous system restoration, and glycogen replenishment occur on rest days. Stay hydrated and hit your daily protein target today.
                </Text>

                <View style={styles.restPointersBox}>
                  <View style={styles.restPointerRow}>
                    <Text style={styles.restPointerBullet}>💧</Text>
                    <Text style={styles.restPointer}>
                      Drink 2.5–3.5L water throughout the day for cellular rehydration.
                    </Text>
                  </View>
                  <View style={styles.restPointerRow}>
                    <Text style={styles.restPointerBullet}>🚶</Text>
                    <Text style={styles.restPointer}>
                      Accumulate 5,000–8,000 casual recovery steps to clear metabolic waste.
                    </Text>
                  </View>
                  <View style={styles.restPointerRow}>
                    <Text style={styles.restPointerBullet}>🥗</Text>
                    <Text style={styles.restPointer}>
                      Maintain protein intake (dal, sattu, eggs, paneer) for tissue rebuilding.
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </View>
        ) : null}

        {/* Global Floating/Quick Rest Timer Launcher */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => handleStartTimer(60, 'Inter-Set Rest')}
          style={styles.timerQuickLauncher}
        >
          <View style={styles.timerLauncherLeft}>
            <Text style={styles.timerLauncherIcon}>⏱️</Text>
            <View>
              <Text style={styles.timerLauncherTitle}>Inter-Set Rest Timer</Text>
              <Text style={styles.timerLauncherSub}>
                Quick countdown with 30s, 45s, 60s, 90s presets
              </Text>
            </View>
          </View>
          <Badge label="Open" variant="neutral" size="sm" />
        </TouchableOpacity>
      </ScrollView>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        visible={isDetailModalVisible}
        exercise={detailExercise}
        onClose={() => {
          setIsDetailModalVisible(false);
          setDetailExercise(null);
        }}
        onSwapAlternative={(id) => {
          setIsDetailModalVisible(false);
          handleOpenSwap(id);
        }}
        onStartTimer={(secs, name) => {
          handleStartTimer(secs, name);
        }}
      />

      {/* Exercise Alternative Swap Modal */}
      <ExerciseAlternativesModal
        visible={isSwapModalVisible}
        exercise={swapTargetExercise}
        onClose={() => {
          setIsSwapModalVisible(false);
          setSwapTargetExercise(null);
        }}
        onConfirmSwap={handleConfirmSwap}
      />

      {/* Rest Timer Modal */}
      <RestTimerModal
        visible={timerState.visible}
        initialSeconds={timerState.seconds}
        exerciseName={timerState.exerciseName}
        onClose={() => setTimerState((prev) => ({ ...prev, visible: false }))}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  lateTiredNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#EEF2FF',
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  lateTiredIconBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.full,
    backgroundColor: '#E0E7FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lateTiredIcon: {
    fontSize: 18,
  },
  lateTiredContent: {
    flex: 1,
    gap: 2,
  },
  lateTiredTitle: {
    ...typography.body,
    fontWeight: '700',
    color: '#3730A3',
    fontSize: 13,
  },
  lateTiredDesc: {
    ...typography.caption,
    color: '#4338CA',
    fontSize: 11,
    lineHeight: 16,
  },
  splitBanner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
    ...shadows.sm,
  },
  splitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  splitCategoryTag: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  splitName: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  splitDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  splitBadgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    paddingTop: spacing.xs,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
  },
  splitMetaBadge: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  splitMetaBadgeText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
    fontSize: 10,
  },
  section: {
    gap: spacing.xs,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  sectionHint: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textMuted,
  },
  dayFocusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    marginBottom: spacing.xs,
  },
  dayFocusTitleCol: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  dayFocusSub: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  dayFocusTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  exercisesList: {
    gap: spacing.sm,
  },
  exerciseCard: {
    marginBottom: 0,
  },
  restDayCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  restDayEmoji: {
    fontSize: 32,
  },
  restDayCardTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  restDayCardDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  restPointersBox: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    width: '100%',
    gap: spacing.xs,
    marginTop: spacing.xs,
  },
  restPointerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  restPointerBullet: {
    fontSize: 12,
    marginTop: 1,
  },
  restPointer: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  timerQuickLauncher: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  timerLauncherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  timerLauncherIcon: {
    fontSize: 22,
  },
  timerLauncherTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 13,
  },
  timerLauncherSub: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
  },
});

export default WorkoutTabScreen;
