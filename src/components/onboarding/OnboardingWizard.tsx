import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  BackHandler,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingData } from '../../types';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';
import { StepPersonalBasics } from './StepPersonalBasics';
import { StepDailyRhythm } from './StepDailyRhythm';
import { StepTrainingSetup } from './StepTrainingSetup';
import { StepFoodPreferences } from './StepFoodPreferences';
import { StepBudget } from './StepBudget';
import { StepSupplements } from './StepSupplements';
import { StepReview } from './StepReview';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface OnboardingWizardProps {
  initialData: OnboardingData;
  onComplete: (data: OnboardingData) => void;
  onCancel: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  initialData,
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<OnboardingData>(() => ({
    ...initialData,
    personal: {
      ...initialData.personal,
      age: initialData.personal?.age > 0 ? initialData.personal.age : 24,
      heightCm: initialData.personal?.heightCm > 0 ? initialData.personal.heightCm : 175,
      weightKg: initialData.personal?.weightKg > 0 ? initialData.personal.weightKg : 70,
    },
  }));
  const [step1Error, setStep1Error] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const insets = useSafeAreaInsets();

  const scrollViewRef = useRef<any>(null);
  const totalSteps = 7;

  const stepMeta = [
    {
      step: 1,
      title: "Let's start with you.",
      subtitle:
        'Your physical metrics and primary fitness target provide the baseline for training intensity and protein requirements.',
    },
    {
      step: 2,
      title: 'Fit fitness into your day.',
      subtitle:
        'Tell us about your daily work and sleep rhythm so workouts sit comfortably into your natural timetable.',
    },
    {
      step: 3,
      title: 'How do you want to move?',
      subtitle:
        'Choose where and how you like to exercise. We construct realistic volume whether at home or in a gym.',
    },
    {
      step: 4,
      title: 'Build your plan around real food.',
      subtitle:
        'Authentic Indian whole foods—roti, dal, sattu, chana, dahi, and paneer—tailored to your kitchen situation.',
    },
    {
      step: 5,
      title: 'Your goals. Your budget.',
      subtitle:
        'Select a comfortable daily grocery spend. Fitness nutrition should never strain your personal finances.',
    },
    {
      step: 6,
      title: 'Food first. Your choice.',
      subtitle:
        'Whole foods are always sufficient. Supplements remain strictly optional convenience tools.',
    },
    {
      step: 7,
      title: 'Your plan starts here.',
      subtitle:
        'Verify your lifestyle parameters below. Tap generate to construct your customized routine and meal framework.',
    },
  ];

  const currentMeta = stepMeta[currentStep - 1];

  // Android Hardware Back Button handling
  useEffect(() => {
    const handleHardwareBackPress = () => {
      if (currentStep > 1) {
        setCurrentStep((prev) => prev - 1);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        return true;
      } else {
        onCancel();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBackPress
    );

    return () => backHandler.remove();
  }, [currentStep, onCancel]);

  const isStep1Valid =
    formData.personal.age >= 14 &&
    formData.personal.age <= 100 &&
    formData.personal.heightCm >= 100 &&
    formData.personal.heightCm <= 250 &&
    formData.personal.weightKg >= 30 &&
    formData.personal.weightKg <= 300;

  const handleNext = () => {
    if (currentStep === 1) {
      if (!isStep1Valid) {
        setStep1Error(
          'Please enter a valid age (14–100), height (100–250 cm), and current weight (30–300 kg).'
        );
        return;
      }
      setStep1Error(null);
    }

    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleBack = () => {
    setStep1Error(null);
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      onCancel();
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    onComplete(formData);
  };

  const handleEditStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  return (
    <View style={styles.container}>
      {/* Wizard Progress Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, spacing.md) }]}>
        <View style={styles.headerMetaRow}>
          <View style={styles.brandTag}>
            <Text style={styles.brandTagIcon}>✓</Text>
            <Text style={styles.brandTagText}>FitShift Onboarding</Text>
          </View>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>
              Step {currentStep} of {totalSteps}
            </Text>
          </View>
        </View>

        <ProgressBar
          progress={currentStep / totalSteps}
          height={6}
          color={colors.primary}
          trackColor={colors.borderSubtle}
          style={styles.progressBar}
        />

        <View style={styles.titleContainer}>
          <Text style={styles.stepTitle}>{currentMeta.title}</Text>
          <Text style={styles.stepSubtitle}>{currentMeta.subtitle}</Text>
        </View>
      </View>

      {/* Dynamic Step Content */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.stepWrapper}>
          {currentStep === 1 && (
            <StepPersonalBasics
              data={formData.personal}
              onChange={(updated) => {
                setStep1Error(null);
                setFormData((prev) => ({
                  ...prev,
                  personal: { ...prev.personal, ...updated },
                }));
              }}
              error={step1Error}
            />
          )}

          {currentStep === 2 && (
            <StepDailyRhythm
              data={formData.rhythm}
              onChange={(updated) =>
                setFormData((prev) => ({
                  ...prev,
                  rhythm: { ...prev.rhythm, ...updated },
                }))
              }
            />
          )}

          {currentStep === 3 && (
            <StepTrainingSetup
              data={formData.training}
              onChange={(updated) =>
                setFormData((prev) => ({
                  ...prev,
                  training: { ...prev.training, ...updated },
                }))
              }
            />
          )}

          {currentStep === 4 && (
            <StepFoodPreferences
              data={formData.food}
              onChange={(updated) =>
                setFormData((prev) => ({
                  ...prev,
                  food: { ...prev.food, ...updated },
                }))
              }
            />
          )}

          {currentStep === 5 && (
            <StepBudget
              data={formData.budget}
              onChange={(updated) =>
                setFormData((prev) => ({
                  ...prev,
                  budget: { ...prev.budget, ...updated },
                }))
              }
            />
          )}

          {currentStep === 6 && (
            <StepSupplements
              data={formData.supplements}
              onChange={(updated) =>
                setFormData((prev) => ({
                  ...prev,
                  supplements: { ...prev.supplements, ...updated },
                }))
              }
            />
          )}

          {currentStep === 7 && (
            <StepReview
              data={formData}
              onEditStep={handleEditStep}
              onGeneratePlan={handleGenerate}
              isGenerating={isGenerating}
            />
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomBar}>
        <Button
          title={currentStep === 1 ? 'Cancel' : 'Back'}
          variant="outline"
          size="md"
          onPress={handleBack}
          style={styles.navButton}
        />

        {currentStep < 7 ? (
          <Button
            title="Continue"
            variant="primary"
            size="md"
            onPress={handleNext}
            style={styles.navButtonPrimary}
          />
        ) : (
          <Button
            title="Back to Edit"
            variant="ghost"
            size="md"
            onPress={handleBack}
            style={styles.navButton}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  headerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  brandTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  brandTagIcon: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '700',
  },
  brandTagText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  stepBadge: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xxs,
    borderRadius: borderRadius.full,
  },
  stepBadgeText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
  },
  progressBar: {
    marginVertical: spacing.xs,
  },
  titleContainer: {
    marginTop: spacing.xs,
    gap: spacing.xxs,
  },
  stepTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  stepSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
  },
  stepWrapper: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    gap: spacing.md,
  },
  navButton: {
    minWidth: 100,
  },
  navButtonPrimary: {
    minWidth: 130,
    flex: 1,
  },
});
