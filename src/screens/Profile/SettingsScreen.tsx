import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
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
    plan,
    userProfile,
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
        subtitle="Application configuration & local data management"
        showBrand={false}
        onBack={onBack}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Appearance */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="sun" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Appearance & Design</Text>
            </View>
            <Badge label="Emerald Light" variant="accent" size="sm" />
          </View>
          <Text style={styles.sectionDesc}>
            FitShift uses a high-contrast emerald visual palette with clean paper surfaces, optimized for daylight visibility during workouts and kitchen meal prep.
          </Text>
        </View>

        {/* Section 2: Units & Standards */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="target" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Units & Measurement Standards</Text>
            </View>
            <Badge label="Metric System" variant="neutral" size="sm" />
          </View>

          <View style={styles.unitList}>
            <View style={styles.unitRow}>
              <Text style={styles.unitLabel}>Height Measurement</Text>
              <Text style={styles.unitValue}>Centimetres (cm)</Text>
            </View>
            <View style={styles.unitRow}>
              <Text style={styles.unitLabel}>Body Weight</Text>
              <Text style={styles.unitValue}>Kilograms (kg)</Text>
            </View>
            <View style={styles.unitRow}>
              <Text style={styles.unitLabel}>Energy Calculation</Text>
              <Text style={styles.unitValue}>Kilocalories (kcal)</Text>
            </View>
            <View style={styles.unitRow}>
              <Text style={styles.unitLabel}>Currency & Food Pricing</Text>
              <Text style={styles.unitValue}>Indian Rupee (₹ INR)</Text>
            </View>
          </View>
        </View>

        {/* Section 3: AI Coach Preferences */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="bot" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>AI Coach Configuration</Text>
            </View>
            <Badge label="Backend Synced" variant="accent" size="sm" />
          </View>

          <Text style={styles.sectionDesc}>
            FitShift AI uses server-side Gemini 2.5 Flash with automatic OpenAI fallback. Your fitness goal ({userProfile.personal.goal}), environment ({userProfile.training.environment}), and budget (₹{userProfile.budget.dailyBudgetRupees}/day) are securely injected as context when toggled on.
          </Text>

          <View style={styles.actionRow}>
            <Button
              title="Clear AI Conversation History"
              variant="outline"
              size="sm"
              onPress={() => setIsClearChatModalOpen(true)}
              style={styles.actionBtn}
            />
          </View>
        </View>

        {/* Section 4: Adaptive Routine Mode */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="moon" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Adaptive Mode (Late / Tired)</Text>
            </View>
            <Badge
              label={isLateTiredActive ? 'Active' : 'Standard Routine'}
              variant={isLateTiredActive ? 'warning' : 'neutral'}
              size="sm"
            />
          </View>

          <Text style={styles.sectionDesc}>
            Downshifts training volume to a 15-minute gentle mobility routine and highlights easy-to-digest recovery meals when you work late shifts or experience low energy.
          </Text>

          <View style={styles.actionRow}>
            <Button
              title={isLateTiredActive ? 'Deactivate Late Mode' : 'Activate Late / Tired Mode'}
              variant={isLateTiredActive ? 'secondary' : 'outline'}
              size="sm"
              onPress={() => {
                const next = !isLateTiredActive;
                setIsLateTiredActive(next);
                setToastMessage(next ? 'Late / Tired mode activated.' : 'Standard routine restored.');
              }}
              style={styles.actionBtn}
            />
          </View>
        </View>

        {/* Section 5: Data & Local Storage */}
        <View style={styles.sectionCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="shield" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Local Storage & Plan Lifecycle</Text>
            </View>
            <Badge label="Offline First" variant="neutral" size="sm" />
          </View>

          <Text style={styles.sectionDesc}>
            FitShift never uploads your personal metrics to cloud user accounts. All plans, customized swaps, and grocery checklists are saved directly to your device storage.
          </Text>

          <View style={styles.dangerActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsResetPlanModalOpen(true)}
              style={styles.warningActionBtn}
            >
              <Icon name="refresh" size={15} color="#D97706" />
              <View style={styles.actionBtnTextCol}>
                <Text style={styles.warningActionTitle}>Reset Active Fitness Plan</Text>
                <Text style={styles.warningActionSub}>
                  Clears the current workout & diet plan while preserving your profile basics.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsClearAllDataModalOpen(true)}
              style={styles.dangerActionBtn}
            >
              <Icon name="trash" size={15} color="#DC2626" />
              <View style={styles.actionBtnTextCol}>
                <Text style={styles.dangerActionTitle}>Clear All Local Application Data</Text>
                <Text style={styles.dangerActionSub}>
                  Completely wipes all profile details, saved plans, and AI conversation messages.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section 5: Transparent Privacy */}
        <View style={styles.privacyCard}>
          <View style={styles.privacyHeader}>
            <Icon name="shield" size={18} color={colors.primary} />
            <Text style={styles.privacyTitle}>FitShift Privacy Philosophy</Text>
          </View>
          <View style={styles.privacyList}>
            <View style={styles.privacyItem}>
              <Text style={styles.privacyBullet}>•</Text>
              <Text style={styles.privacyText}>
                <Text style={styles.bold}>Zero Login Barrier: </Text>
                No mandatory email, password, or cloud account required to use FitShift.
              </Text>
            </View>
            <View style={styles.privacyItem}>
              <Text style={styles.privacyBullet}>•</Text>
              <Text style={styles.privacyText}>
                <Text style={styles.bold}>Local Storage: </Text>
                Your workout splits, meal plans, and grocery checklists stay on your Android device.
              </Text>
            </View>
            <View style={styles.privacyItem}>
              <Text style={styles.privacyBullet}>•</Text>
              <Text style={styles.privacyText}>
                <Text style={styles.bold}>Server-Side Security: </Text>
                AI API credentials remain strictly protected on the backend server.
              </Text>
            </View>
          </View>
        </View>

        {/* Section 6: About FitShift */}
        <View style={styles.aboutCard}>
          <View style={styles.aboutHeader}>
            <Logo size={32} />
            <View style={styles.aboutMeta}>
              <Text style={styles.aboutTitle}>FitShift Android Edition</Text>
              <Text style={styles.aboutVersion}>Version 1.0.0 (Release Build)</Text>
            </View>
          </View>
          <Text style={styles.aboutDesc}>
            A routine-first, budget-realistic fitness blueprint generator built around authentic Indian food staples and practical daily schedules. Planning, Not Tracking.
          </Text>
        </View>

        {/* Back to Profile */}
        <View style={styles.bottomSection}>
          <Button
            title="← Back to Profile"
            variant="outline"
            size="md"
            onPress={onBack}
            style={styles.backBtn}
          />
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
        subtitle="This will remove your current 7-day workout split, meal blueprint, and active grocery list."
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

      {/* Toast */}
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
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.md,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xs,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  cardTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sectionDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  unitList: {
    gap: spacing.xs,
  },
  unitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  unitLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  unitValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  actionRow: {
    marginTop: spacing.xs,
  },
  actionBtn: {
    alignSelf: 'flex-start',
  },
  dangerActions: {
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  warningActionBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  warningActionTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: '#92400E',
  },
  warningActionSub: {
    ...typography.caption,
    color: '#B45309',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  dangerActionBtn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  dangerActionTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: '#DC2626',
  },
  dangerActionSub: {
    ...typography.caption,
    color: '#B91C1C',
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
  },
  actionBtnTextCol: {
    flex: 1,
  },
  privacyCard: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.accentBorder,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  privacyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  privacyTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  privacyList: {
    gap: 6,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
  },
  privacyBullet: {
    color: colors.primary,
    fontWeight: '700',
  },
  privacyText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  bold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.sm,
  },
  aboutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  aboutMeta: {
    gap: 2,
  },
  aboutTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  aboutVersion: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  aboutDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  bottomSection: {
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  backBtn: {
    width: '100%',
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
    lineHeight: 20,
  },
  modalWarningText: {
    ...typography.bodySmall,
    color: '#DC2626',
    fontWeight: '500',
    lineHeight: 20,
  },
});
