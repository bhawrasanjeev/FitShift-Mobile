import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlan, ProfileSectionKey } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Icon, IconName } from '../../components/common/Icon';
import { Button } from '../../components/common/Button';
import { Toast } from '../../components/common/Toast';
import { EditSectionModal } from '../../components/profile/EditSectionModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface ProfileScreenProps {
  onBack: () => void;
  onOpenSettings: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  onOpenSettings,
}) => {
  const insets = useSafeAreaInsets();
  const { userProfile, plan, hasPlan } = usePlan();

  const [activeEditSection, setActiveEditSection] = useState<ProfileSectionKey | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const goalNames: Record<string, string> = {
    muscle_gain: 'Muscle Gain & Strength',
    fat_loss: 'Fat Loss & Lean Definition',
    weight_loss: 'Weight Reduction',
    maintenance: 'Vitality & Maintenance',
  };

  const dietNames: Record<string, string> = {
    pure_veg: 'Pure Vegetarian',
    eggetarian: 'Eggetarian',
    non_veg: 'Non-Vegetarian',
  };

  const occNames: Record<string, string> = {
    student: 'Student',
    working_professional: 'Working Professional',
    homemaker: 'Homemaker',
    business_owner: 'Business Owner',
    freelancer: 'Freelancer',
    other: 'General Rhythm',
  };

  const situationNames: Record<string, string> = {
    hostel_mess: 'Hostel / PG / Mess',
    family_provided: 'Home / Tiffin Provided',
    self_cooking: 'Self-Cooking & Meal Prep',
  };

  const styleNames: Record<string, string> = {
    simple_homestyle: 'Simple Ghar-ka-Khana',
    high_protein_everyday: 'High-Protein Everyday',
    north_indian: 'North Indian Regional',
    south_indian: 'South Indian Regional',
  };

  const handleSaved = (message: string) => {
    setToastMessage(message);
  };

  const displayName = userProfile.personal.name?.trim() || 'FitShift Member';

  return (
    <View style={styles.screen}>
      <Header
        title="Profile & Routine"
        subtitle="Manage your personal parameters & fitness blueprint"
        showBrand={false}
        onBack={onBack}
        rightAction={
          <View style={styles.headerActions}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onOpenSettings}
              style={styles.headerIconBtn}
            >
              <Icon name="settings" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        }
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroTop}>
            <Avatar name={displayName} size="lg" variant="emerald" />
            <View style={styles.heroMeta}>
              <Text style={styles.heroName}>{displayName}</Text>
              <Text style={styles.heroGoal}>
                {goalNames[userProfile.personal.goal] || 'Fitness Planning'}
              </Text>
              <View style={styles.heroBadgesRow}>
                <Badge
                  label={
                    userProfile.training.environment === 'home'
                      ? 'Home Workouts'
                      : 'Commercial Gym'
                  }
                  variant="neutral"
                  size="sm"
                />
                <Badge
                  label={hasPlan ? 'Active Routine' : 'Draft Profile'}
                  variant="accent"
                  size="sm"
                />
              </View>
            </View>
          </View>

          {/* Quick Metrics Bar */}
          <View style={styles.metricsBar}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {userProfile.personal.age ? `${userProfile.personal.age} yrs` : '—'}
              </Text>
              <Text style={styles.metricLabel}>Age</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {userProfile.personal.heightCm ? `${userProfile.personal.heightCm} cm` : '—'}
              </Text>
              <Text style={styles.metricLabel}>Height</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {userProfile.personal.weightKg ? `${userProfile.personal.weightKg} kg` : '—'}
              </Text>
              <Text style={styles.metricLabel}>Weight</Text>
            </View>
            <View style={styles.vDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                ₹{userProfile.budget.dailyBudgetRupees}
              </Text>
              <Text style={styles.metricLabel}>Daily Food</Text>
            </View>
          </View>
        </View>

        {/* Section 1: Personal Basics */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="user" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Personal Basics</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveEditSection('personal')}
              style={styles.editPill}
            >
              <Icon name="edit" size={12} color={colors.primaryDark} />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{displayName}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Gender</Text>
              <Text style={styles.infoValue}>
                {userProfile.personal.gender.toUpperCase()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Age & Metrics</Text>
              <Text style={styles.infoValue}>
                {userProfile.personal.age} yrs • {userProfile.personal.heightCm} cm • {userProfile.personal.weightKg} kg
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Fitness Goal</Text>
              <Text style={styles.infoValue}>
                {goalNames[userProfile.personal.goal]}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 2: Daily Rhythm */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="clock" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Daily Rhythm & Timetable</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveEditSection('rhythm')}
              style={styles.editPill}
            >
              <Icon name="edit" size={12} color={colors.primaryDark} />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Occupation</Text>
              <Text style={styles.infoValue}>
                {occNames[userProfile.rhythm.occupation]}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Transit Hours</Text>
              <Text style={styles.infoValue}>
                {userProfile.rhythm.departureTime} (Out) → {userProfile.rhythm.returnTime} (Home)
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Sleep Rhythm</Text>
              <Text style={styles.infoValue}>
                {userProfile.rhythm.sleepHours} hrs (Wake: {userProfile.rhythm.wakeUpTime})
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Activity Level</Text>
              <Text style={styles.infoValue}>
                {userProfile.rhythm.activityLevel.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 3: Training Setup */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="dumbbell" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Training Setup</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveEditSection('training')}
              style={styles.editPill}
            >
              <Icon name="edit" size={12} color={colors.primaryDark} />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Environment</Text>
              <Text style={styles.infoValue}>
                {userProfile.training.environment === 'home'
                  ? 'Home Workouts'
                  : 'Commercial / Society Gym'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Session Structure</Text>
              <Text style={styles.infoValue}>
                {userProfile.training.durationMinutes} mins • {userProfile.training.weeklyFrequencyDays} days/wk
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Level & Preferred Slot</Text>
              <Text style={styles.infoValue}>
                {userProfile.training.experienceLevel.toUpperCase()} • {userProfile.training.preferredTime}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 4: Food & Nutrition */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="utensils" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Food & Nutrition Preferences</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveEditSection('food')}
              style={styles.editPill}
            >
              <Icon name="edit" size={12} color={colors.primaryDark} />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Dietary Discipline</Text>
              <Text style={styles.infoValue}>
                {dietNames[userProfile.food.dietType]}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Kitchen Setup</Text>
              <Text style={styles.infoValue}>
                {situationNames[userProfile.food.cookingSituation] || userProfile.food.cookingSituation}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Meals & Regional Style</Text>
              <Text style={styles.infoValue}>
                {userProfile.food.mealsPerDay} meals • {styleNames[userProfile.food.indianFoodStyle] || userProfile.food.indianFoodStyle}
              </Text>
            </View>
          </View>
        </View>

        {/* Section 5: Daily Food Budget */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="wallet" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Daily Food Budget</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveEditSection('budget')}
              style={styles.editPill}
            >
              <Icon name="edit" size={12} color={colors.primaryDark} />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Budget Tier</Text>
              <Text style={styles.infoValue}>
                {userProfile.budget.tier.replace('_', ' ').toUpperCase()}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Daily Allowance</Text>
              <Text style={styles.infoValue}>
                ₹{userProfile.budget.dailyBudgetRupees} / day (~₹{userProfile.budget.dailyBudgetRupees * 7} / week)
              </Text>
            </View>
          </View>
        </View>

        {/* Section 6: Supplement Preference */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Icon name="pill" size={16} color={colors.primary} />
              <Text style={styles.cardTitle}>Supplement Philosophy</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setActiveEditSection('supplements')}
              style={styles.editPill}
            >
              <Icon name="edit" size={12} color={colors.primaryDark} />
              <Text style={styles.editPillText}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoList}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Preference</Text>
              <Text style={styles.infoValue}>
                {userProfile.supplements.preference === 'no_supplements'
                  ? 'Food-Only Nutrition (No Powders)'
                  : userProfile.supplements.preference === 'open_to_supplements'
                  ? `Open to Supplements (Max ₹${userProfile.supplements.monthlyBudgetRupees || 1200}/mo)`
                  : 'Educational Guide Requested'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.bottomSection}>
          <Button
            title="Application Settings & Data Controls"
            variant="outline"
            size="md"
            onPress={onOpenSettings}
            style={styles.settingsNavBtn}
          />
          <Button
            title="← Back to Dashboard"
            variant="ghost"
            size="sm"
            onPress={onBack}
          />
        </View>
      </ScrollView>

      {/* Edit Section Modal */}
      <EditSectionModal
        visible={Boolean(activeEditSection)}
        section={activeEditSection}
        onClose={() => setActiveEditSection(null)}
        onSaved={handleSaved}
      />

      {/* Confirmation Toast */}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  headerIconBtn: {
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.md,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.lg,
    gap: spacing.md,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroMeta: {
    flex: 1,
    gap: 4,
  },
  heroName: {
    ...typography.h3,
    fontSize: 18,
    color: colors.textPrimary,
  },
  heroGoal: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  heroBadgesRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginTop: 4,
  },
  metricsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metricLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 1,
  },
  vDivider: {
    width: 1,
    height: 20,
    backgroundColor: colors.border,
  },
  card: {
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
  editPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primaryLight,
  },
  editPillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  infoList: {
    gap: spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },
  bottomSection: {
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  settingsNavBtn: {
    width: '100%',
  },
});
