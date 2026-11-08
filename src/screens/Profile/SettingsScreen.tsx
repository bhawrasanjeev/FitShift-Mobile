import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Icon } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/interactive/Modal';
import { Toast } from '../../components/common/Toast';
import { Logo } from '../../components/common/Logo';
import { usePlan } from '../../context/PlanContext';
import { planStorage } from '../../services/storage/planStorage';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface SettingsScreenProps {
  onBack: () => void;
  onResetPlan: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  onBack,
  onResetPlan,
}) => {
  const {
    resetPlan,
    clearAllData,
    isLateTiredActive,
    setIsLateTiredActive,
  } = usePlan();

  const [isResetPlanModalOpen, setIsResetPlanModalOpen] = useState(false);
  const [isClearChatModalOpen, setIsClearChatModalOpen] = useState(false);
  const [isClearAllDataModalOpen, setIsClearAllDataModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirmClearChat = async () => {
    setIsProcessing(true);
    await planStorage.clearChatHistory();
    setIsProcessing(false);
    setIsClearChatModalOpen(false);
    setToastMessage('AI conversation history cleared.');
  };

  const handleConfirmResetPlan = async () => {
    setIsProcessing(true);
    await resetPlan();
    setIsProcessing(false);
    setIsResetPlanModalOpen(false);
    onResetPlan();
  };

  const handleConfirmClearAllData = async () => {
    setIsProcessing(true);
    await clearAllData();
    setIsProcessing(false);
    setIsClearAllDataModalOpen(false);
    onResetPlan();
  };

  return (
    <View style={styles.screen}>
      <Header
        title="Settings & Privacy"
        subtitle="Preferences & Local Storage"
        showBrand={false}
        onBack={onBack}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Routine & Preferences */}
        <Text style={styles.sectionHeader}>PREFERENCES</Text>
        <View style={styles.groupCard}>
          {/* Adaptive Late / Tired Toggle */}
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="moon" size={16} color="#D97706" />
              </View>
              <View style={styles.settingRowTextCol}>
                <Text style={styles.settingTitle}>Adaptive Mode (Late / Tired)</Text>
                <Text style={styles.settingSubtitle}>15-min light routine for low-energy days</Text>
              </View>
            </View>
            <Switch
              value={isLateTiredActive}
              onValueChange={(val) => {
                setIsLateTiredActive(val);
                setToastMessage(val ? 'Late / Tired mode activated.' : 'Standard routine restored.');
              }}
              trackColor={{ false: colors.border, true: '#A7F3D0' }}
              thumbColor={isLateTiredActive ? colors.primary : '#D4D4D8'}
              style={styles.switch}
            />
          </View>

          <View style={styles.rowDivider} />

          {/* Theme */}
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="sun" size={16} color={colors.primary} />
              </View>
              <View style={styles.settingRowTextCol}>
                <Text style={styles.settingTitle}>Theme</Text>
              </View>
            </View>
            <Text style={styles.settingValueText}>Emerald Light</Text>
          </View>

          <View style={styles.rowDivider} />

          {/* Units */}
          <View style={styles.settingRow}>
            <View style={styles.settingRowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                <Icon name="target" size={16} color="#2563EB" />
              </View>
              <View style={styles.settingRowTextCol}>
                <Text style={styles.settingTitle}>Measurement Units</Text>
              </View>
            </View>
            <Text style={styles.settingValueText}>Metric (cm, kg, ₹)</Text>
          </View>
        </View>

        {/* Section 2: AI Coach */}
        <Text style={styles.sectionHeader}>AI ASSISTANT</Text>
        <View style={styles.groupCard}>
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => setIsClearChatModalOpen(true)}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#ECFDF5' }]}>
                <Icon name="sparkles" size={16} color={colors.primary} />
              </View>
              <View style={styles.settingRowTextCol}>
                <Text style={styles.settingTitle}>Clear AI Chat History</Text>
                <Text style={styles.settingSubtitle}>Erase coach messages from this device</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Section 3: Data & Storage */}
        <Text style={styles.sectionHeader}>STORAGE & ROUTINE LIFECYCLE</Text>
        <View style={styles.groupCard}>
          {/* Reset Active Routine */}
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => setIsResetPlanModalOpen(true)}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
                <Icon name="refresh" size={16} color="#D97706" />
              </View>
              <View style={styles.settingRowTextCol}>
                <Text style={[styles.settingTitle, { color: '#B45309' }]}>Reset Active Plan</Text>
                <Text style={styles.settingSubtitle}>Clears workout & diet, preserves profile</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={16} color="#D97706" />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          {/* Clear All Data */}
          <TouchableOpacity
            style={styles.settingRow}
            activeOpacity={0.7}
            onPress={() => setIsClearAllDataModalOpen(true)}
          >
            <View style={styles.settingRowLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                <Icon name="trash" size={16} color="#DC2626" />
              </View>
              <View style={styles.settingRowTextCol}>
                <Text style={[styles.settingTitle, { color: '#DC2626' }]}>Clear All Application Data</Text>
                <Text style={styles.settingSubtitle}>Deletes profile, plans & resets to start</Text>
              </View>
            </View>
            <Icon name="chevron-right" size={16} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* Section 4: About & Privacy Footer */}
        <View style={styles.aboutCard}>
          <Logo size={28} />
          <View style={styles.aboutMeta}>
            <Text style={styles.aboutTitle}>FitShift • Routine-First Fitness</Text>
            <Text style={styles.aboutSubtitle}>
              Version 1.0.0 • Offline-First • Zero Cloud Tracking
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Clear Chat Confirmation Modal */}
      <Modal
        visible={isClearChatModalOpen}
        onClose={() => setIsClearChatModalOpen(false)}
        title="Clear AI Conversation?"
        subtitle="This will permanently remove saved chat history with FitShift Coach from your device."
        footer={
          <View style={styles.modalFooterRow}>
            <Button
              title="Cancel"
              variant="ghost"
              size="sm"
              onPress={() => setIsClearChatModalOpen(false)}
              disabled={isProcessing}
            />
            <Button
              title={isProcessing ? 'Clearing...' : 'Clear History'}
              variant="danger"
              size="sm"
              onPress={handleConfirmClearChat}
              loading={isProcessing}
            />
          </View>
        }
      >
        <Text style={styles.modalNoticeText}>
          Your fitness plan, saved workouts, and diet blueprints will NOT be deleted.
        </Text>
      </Modal>

      {/* Reset Plan Confirmation Modal */}
      <Modal
        visible={isResetPlanModalOpen}
        onClose={() => setIsResetPlanModalOpen(false)}
        title="Reset Fitness Plan?"
        subtitle="This will remove your current workout split, meal blueprint, and active grocery list."
        footer={
          <View style={styles.modalFooterRow}>
            <Button
              title="Cancel"
              variant="ghost"
              size="sm"
              onPress={() => setIsResetPlanModalOpen(false)}
              disabled={isProcessing}
            />
            <Button
              title={isProcessing ? 'Resetting...' : 'Reset Plan'}
              variant="danger"
              size="sm"
              onPress={handleConfirmResetPlan}
              loading={isProcessing}
            />
          </View>
        }
      >
        <Text style={styles.modalNoticeText}>
          You will return to the Welcome screen where you can regenerate a new personalized plan at any time.
        </Text>
      </Modal>

      {/* Clear All Data Modal */}
      <Modal
        visible={isClearAllDataModalOpen}
        onClose={() => setIsClearAllDataModalOpen(false)}
        title="Clear All Application Data?"
        subtitle="This will permanently delete all stored data including your profile, generated plans, and AI conversation."
        footer={
          <View style={styles.modalFooterRow}>
            <Button
              title="Cancel"
              variant="ghost"
              size="sm"
              onPress={() => setIsClearAllDataModalOpen(false)}
              disabled={isProcessing}
            />
            <Button
              title={isProcessing ? 'Deleting...' : 'Erase Everything'}
              variant="danger"
              size="sm"
              onPress={handleConfirmClearAllData}
              loading={isProcessing}
            />
          </View>
        }
      >
        <Text style={styles.modalWarningText}>
          This action cannot be undone. You will start fresh from onboarding.
        </Text>
      </Modal>

      {/* Toast Notification */}
      <Toast
        visible={Boolean(toastMessage)}
        message={toastMessage || ''}
        type="success"
        onDismiss={() => setToastMessage(null)}
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
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  sectionHeader: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    marginTop: spacing.md,
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  groupCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: spacing.sm,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingRowTextCol: {
    flex: 1,
  },
  settingTitle: {
    ...typography.body,
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  settingSubtitle: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  settingValueText: {
    ...typography.bodySmall,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.borderSubtle,
    marginLeft: 62,
  },
  switch: {
    transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }],
  },
  aboutCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
  aboutMeta: {
    alignItems: 'flex-start',
  },
  aboutTitle: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  aboutSubtitle: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textSecondary,
    marginTop: 2,
  },
  modalFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  modalNoticeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  modalWarningText: {
    ...typography.bodySmall,
    color: colors.danger,
    lineHeight: 18,
    fontWeight: '500',
  },
});
