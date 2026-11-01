import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Modal } from './Modal';
import { Button } from '../common/Button';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface LateTiredModalProps {
  visible: boolean;
  onClose: () => void;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
}

export const LateTiredModal: React.FC<LateTiredModalProps> = ({
  visible,
  onClose,
  isActive,
  onToggleActive,
}) => {
  const recoveryRoutine = [
    { title: "Cat-Cow & Child's Pose", duration: '3 mins', desc: 'Decompress lumbar spine and relieve sitting stiffness' },
    { title: '90/90 Hip Flow & Lunge Stretch', duration: '5 mins', desc: 'Open tight hip flexors from long commute or desk chair' },
    { title: 'Thoracic Pillow Roll & Diaphragmatic Breath', duration: '4 mins', desc: 'Downregulate nervous system and lower cortisol' },
    { title: 'Legs-Up-The-Wall Elevation', duration: '3 mins', desc: 'Passive venous circulation return and whole-body drain' },
  ];

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={isActive ? 'Late / Tired Routine is Active' : 'Had a Late or Tiring Day?'}
      subtitle="Adaptive downshift that modifies daily expectations to protect endocrine recovery."
      footer={
        <View style={styles.footerRow}>
          {isActive ? (
            <Button
              title="Return to Regular Plan"
              variant="outline"
              size="sm"
              onPress={() => {
                onToggleActive(false);
                onClose();
              }}
              style={styles.footerButton}
            />
          ) : (
            <Button
              title="Dismiss"
              variant="ghost"
              size="sm"
              onPress={onClose}
              style={styles.footerButton}
            />
          )}

          {!isActive ? (
            <Button
              title="Activate Late Mode"
              variant="primary"
              size="sm"
              onPress={() => {
                onToggleActive(true);
                onClose();
              }}
              style={styles.footerButtonActive}
            />
          ) : (
            <Button
              title="Keep Active Today"
              variant="primary"
              size="sm"
              onPress={onClose}
              style={styles.footerButtonActive}
            />
          )}
        </View>
      }
    >
      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* Status Banner */}
          <View
            style={[
              styles.statusBanner,
              isActive ? styles.statusBannerActive : styles.statusBannerInactive,
            ]}
          >
            <Text style={styles.statusBannerIcon}>🌙</Text>
            <View style={styles.statusBannerTextCol}>
              <Text
                style={[
                  styles.statusBannerTitle,
                  isActive ? styles.statusBannerTitleActive : styles.statusBannerTitleInactive,
                ]}
              >
                {isActive ? 'Adaptive Low-Intensity Mode Active' : 'Preserve Consistency Without Exhaustion'}
              </Text>
              <Text style={styles.statusBannerDesc}>
                When work runs late or biological energy is depleted, attempting high-intensity training raises cortisol and impairs sleep. Adaptive mode prioritizes nervous system downregulation.
              </Text>
            </View>
          </View>

          {/* Quick Pillars */}
          <View style={styles.pillarsGrid}>
            <View style={styles.pillarCard}>
              <Text style={styles.pillarIcon}>⏱️</Text>
              <Text style={styles.pillarTitle}>15-Min Mobility Flow</Text>
              <Text style={styles.pillarDesc}>
                Replaces heavy sets with gentle joint decompression and spinal mobility.
              </Text>
            </View>

            <View style={styles.pillarCard}>
              <Text style={styles.pillarIcon}>🛌</Text>
              <Text style={styles.pillarTitle}>Earlier Sleep Shift</Text>
              <Text style={styles.pillarDesc}>
                Shift bedtime 30–45 minutes earlier to recover your hormone and energy baseline.
              </Text>
            </View>
          </View>

          {/* 15-Minute Recovery Routine Preview */}
          <View style={styles.routineSection}>
            <Text style={styles.routineSectionTitle}>15-MINUTE RESTORATIVE FLOW</Text>
            <View style={styles.routineList}>
              {recoveryRoutine.map((item, idx) => (
                <View key={idx} style={styles.routineItem}>
                  <View style={styles.routineItemHeader}>
                    <Text style={styles.routineItemIndex}>{idx + 1}.</Text>
                    <Text style={styles.routineItemName}>{item.title}</Text>
                    <Text style={styles.routineItemDuration}>{item.duration}</Text>
                  </View>
                  <Text style={styles.routineItemDesc}>{item.desc}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Integrity Note */}
          <View style={styles.noteBox}>
            <Text style={styles.noteIcon}>🛡️</Text>
            <Text style={styles.noteText}>
              <Text style={styles.noteBold}>Zero Guilt Principle: </Text>
              Consistency is about staying in the movement rhythm, not grinding when depleted. Tomorrow your regular routine resumes automatically.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollArea: {
    maxHeight: 460,
  },
  contentContainer: {
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
  },
  statusBannerActive: {
    backgroundColor: colors.warningLight,
    borderColor: '#FCD34D',
  },
  statusBannerInactive: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },
  statusBannerIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  statusBannerTextCol: {
    flex: 1,
    gap: 2,
  },
  statusBannerTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  statusBannerTitleActive: {
    color: '#92400E',
  },
  statusBannerTitleInactive: {
    color: colors.textPrimary,
  },
  statusBannerDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
    marginTop: 2,
  },
  pillarsGrid: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pillarCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 2,
  },
  pillarIcon: {
    fontSize: 18,
    marginBottom: spacing.xxs,
  },
  pillarTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pillarDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  routineSection: {
    gap: spacing.xs,
  },
  routineSectionTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  routineList: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  routineItem: {
    gap: 2,
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  routineItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  routineItemIndex: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primary,
  },
  routineItemName: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  routineItemDuration: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.primaryDark,
    fontSize: 11,
  },
  routineItemDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    marginLeft: spacing.md,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  noteIcon: {
    fontSize: 16,
    marginTop: 2,
  },
  noteText: {
    ...typography.caption,
    color: colors.primaryDark,
    flex: 1,
    lineHeight: 16,
    fontSize: 11,
  },
  noteBold: {
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    width: '100%',
  },
  footerButton: {
    minWidth: 110,
  },
  footerButtonActive: {
    minWidth: 130,
  },
});
