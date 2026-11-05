import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Icon, IconName } from '../../components/common/Icon';
import { LateTiredModal } from '../../components/interactive/LateTiredModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface RecoveryScreenProps {
  onBackToSchedule?: () => void;
  showHeader?: boolean;
}

export const RecoveryScreen: React.FC<RecoveryScreenProps> = ({
  onBackToSchedule,
  showHeader = true,
}) => {
  const { userProfile, isLateTiredActive, setIsLateTiredActive } = usePlan();
  const [isLateTiredModalOpen, setIsLateTiredModalOpen] = useState<boolean>(false);

  const sleepHours = userProfile.rhythm?.sleepHours || 7.5;
  const wakeUpTime = userProfile.rhythm?.wakeUpTime || '06:30';

  // Calculate target bedtime: subtract (sleepHours + 0.5) from wakeUpTime
  const calculateBedtime = (wakeTime: string, hours: number): string => {
    try {
      const [hStr, mStr] = wakeTime.split(':');
      let h = parseInt(hStr, 10);
      let m = parseInt(mStr, 10);
      if (isNaN(h)) h = 6;
      if (isNaN(m)) m = 30;

      const totalMinutesWake = h * 60 + m;
      const sleepMinutes = Math.round((hours + 0.5) * 60); // 30m latency
      let bedtimeTotalMinutes = totalMinutesWake - sleepMinutes;
      if (bedtimeTotalMinutes < 0) {
        bedtimeTotalMinutes += 24 * 60;
      }

      const bedH = Math.floor(bedtimeTotalMinutes / 60);
      const bedM = bedtimeTotalMinutes % 60;
      const ampm = bedH >= 12 ? 'PM' : 'AM';
      const displayH = bedH % 12 === 0 ? 12 : bedH % 12;
      const displayM = bedM < 10 ? `0${bedM}` : bedM;
      return `${displayH}:${displayM} ${ampm}`;
    } catch {
      return '10:30 PM';
    }
  };

  const bedtimeTarget = calculateBedtime(wakeUpTime, sleepHours);

  const recoveryPillars: {
    id: string;
    iconName: IconName;
    title: string;
    badge: string;
    tip: string;
    actionableStep: string;
  }[] = [
    {
      id: 'sleep',
      iconName: 'moon',
      title: 'Sleep & Endocrine Repair',
      badge: `${sleepHours}h Target`,
      tip: `Your configured target is ${sleepHours} hours of sleep, waking up at ${wakeUpTime}. Non-REM deep sleep is when human growth hormone (HGH) naturally peaks to rebuild micro-damaged myofibrils.`,
      actionableStep: `Aim to be in bed by ${bedtimeTarget} to account for natural sleep latency without clock anxiety.`,
    },
    {
      id: 'hydration',
      iconName: 'droplet',
      title: 'Daily Hydration & Electrolytes',
      badge: '2.5–3.5 Liters',
      tip: 'In Indian climates, sub-clinical dehydration elevates core temperature, increases perceived exertion during lifts, and slows nutrient transport to muscle cells.',
      actionableStep: 'Drink 500ml water within 20 minutes of waking up. Keep a 1-liter bottle at your desk and sip buttermilk (chaas) or lemon water mid-afternoon.',
    },
    {
      id: 'mobility',
      iconName: 'activity',
      title: 'Spinal Decompression & Posture Reset',
      badge: '5–10 Minutes',
      tip: 'Prolonged desk sitting tightens the psoas and hip flexors while deactivating glutes. Quick joint mobility lubricates articular cartilage with synovial fluid.',
      actionableStep: 'Perform 60 seconds of deep malasana (bodyweight squat hold) and 10 slow Cat-Cow spinal arches after daily work transit.',
    },
    {
      id: 'nervous_system',
      iconName: 'leaf',
      title: 'Cortisol & Autonomic Downregulation',
      badge: 'Active Reset',
      tip: 'Chronic academic or professional deadlines keep the sympathetic nervous system locked in fight-or-flight, impairing glycogen replenishment.',
      actionableStep: 'Take a casual 10–15 minute device-free evening walk after dinner to trigger parasympathetic tone before sleep.',
    },
  ];

  return (
    <View style={styles.screen}>
      {showHeader && (
        <Header
          title="Rest, Sleep & Recovery"
          subtitle={`${sleepHours}h Sleep Target • ${wakeUpTime} Wake-Up`}
          showBrand={false}
          rightAction={
            onBackToSchedule ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onBackToSchedule}
                style={styles.backPill}
              >
                <Icon name="arrow-left" size={12} color={colors.primaryDark} />
                <Text style={styles.backPillText}>Timeline</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Late / Tired Today Activator Banner */}
        <View style={styles.lateTiredBanner}>
          <View style={styles.lateTiredTop}>
            <View style={styles.lateTiredIconBox}>
              <Icon name="moon" size={18} color="#B45309" />
            </View>
            <View style={styles.lateTiredTextBox}>
              <Text style={styles.lateTiredTag}>ADAPTIVE RECOVERY TRIGGER</Text>
              <Text style={styles.lateTiredTitle}>Feeling Exhausted or Late Today?</Text>
            </View>
          </View>
          <Text style={styles.lateTiredDesc}>
            Convert demanding gym/home workouts into an unhurried 15-minute gentle mobility session with an earlier bedtime recommendation. Zero guilt, zero streak penalty.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsLateTiredModalOpen(true)}
            style={[
              styles.lateTiredButton,
              isLateTiredActive && styles.lateTiredButtonActive,
            ]}
          >
            <View style={styles.lateTiredButtonContent}>
              {isLateTiredActive ? (
                <Icon name="check" size={14} color={colors.surface} strokeWidth={2.5} />
              ) : null}
              <Text style={styles.lateTiredButtonText}>
                {isLateTiredActive ? 'Late / Tired Routine Active' : 'Activate 15m Mobility Routine'}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Philosophy Card */}
        <View style={styles.philosophyCard}>
          <Text style={styles.philosophyTag}>SCIENCE-BACKED FOUNDATION</Text>
          <Text style={styles.philosophyTitle}>
            Training Triggers Growth. Rest Completes It.
          </Text>
          <Text style={styles.philosophyBody}>
            Resistance training creates microscopic tension in muscle fibers. It is exclusively during restorative deep sleep and nutritious rest days that your endocrine system releases anabolic hormones to repair those fibers stronger.
          </Text>
        </View>

        {/* 4 Core Recovery Pillars */}
        <View style={styles.pillarsSection}>
          <Text style={styles.sectionHeading}>4 LIFESTYLE RECOVERY PILLARS</Text>
          {recoveryPillars.map((pillar) => (
            <View key={pillar.id} style={styles.pillarCard}>
              <View style={styles.pillarHeader}>
                <View style={styles.pillarTitleRow}>
                  <Icon name={pillar.iconName} size={16} color={colors.primary} />
                  <Text style={styles.pillarTitle}>{pillar.title}</Text>
                </View>
                <Badge label={pillar.badge} variant="neutral" size="sm" />
              </View>

              <Text style={styles.pillarTip}>{pillar.tip}</Text>

              <View style={styles.actionRow}>
                <Icon name="check" size={13} color={colors.primaryDark} />
                <Text style={styles.actionText}>
                  <Text style={styles.actionBold}>Immediate Action: </Text>
                  {pillar.actionableStep}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Non-Tracking Reminder */}
        <View style={styles.reminderBox}>
          <Icon name="shield" size={15} color={colors.primaryDark} />
          <Text style={styles.reminderText}>
            <Text style={styles.reminderBold}>Planning, Not Tracking: </Text>
            FitShift never requires continuous wearable monitoring or sleep score anxiety. Focus on honest lifestyle consistency over gamified metrics.
          </Text>
        </View>
      </ScrollView>

      {/* Late Tired Modal */}
      <LateTiredModal
        visible={isLateTiredModalOpen}
        onClose={() => setIsLateTiredModalOpen(false)}
        isActive={isLateTiredActive}
        onToggleActive={(active) => setIsLateTiredActive(active)}
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
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  backPillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  lateTiredBanner: {
    backgroundColor: colors.surface,
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  lateTiredTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  lateTiredIconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.lg,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lateTiredTextBox: {
    flex: 1,
    gap: 1,
  },
  lateTiredTag: {
    ...typography.caption,
    fontWeight: '800',
    color: '#4338CA',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  lateTiredTitle: {
    ...typography.h3,
    fontSize: 15,
    color: colors.textPrimary,
  },
  lateTiredDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 11,
  },
  lateTiredButton: {
    backgroundColor: '#4338CA',
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lateTiredButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lateTiredButtonActive: {
    backgroundColor: colors.primaryDark,
  },
  lateTiredButtonText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.surface,
    fontSize: 12,
  },
  philosophyCard: {
    backgroundColor: '#111827',
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.xs,
  },
  philosophyTag: {
    ...typography.caption,
    fontWeight: '800',
    color: '#34D399',
    fontSize: 9,
    letterSpacing: 0.6,
  },
  philosophyTitle: {
    ...typography.h3,
    fontSize: 15,
    color: '#FFFFFF',
  },
  philosophyBody: {
    ...typography.caption,
    color: '#D1D5DB',
    lineHeight: 16,
    fontSize: 11,
  },
  pillarsSection: {
    gap: spacing.md,
  },
  sectionHeading: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  pillarCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  pillarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pillarTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  pillarTitle: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  pillarTip: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  actionText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontSize: 11,
    lineHeight: 15,
    flex: 1,
  },
  actionBold: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  reminderBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  reminderText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  reminderBold: {
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

export default RecoveryScreen;
