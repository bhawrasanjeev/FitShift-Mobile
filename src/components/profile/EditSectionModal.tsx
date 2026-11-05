import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Modal } from '../interactive/Modal';
import { Button } from '../common/Button';
import { Icon, IconName } from '../common/Icon';
import { SelectCard } from '../selection/SelectCard';
import { NumberInput } from '../selection/NumberInput';
import { OptionChip } from '../selection/OptionChip';
import {
  usePlan,
  ProfileSectionKey,
  SectionUpdateResult,
} from '../../context/PlanContext';
import {
  PersonalBasics,
  DailyRhythm,
  TrainingSetup,
  FoodPreferences,
  Budget,
  Supplements,
  FitnessGoal,
  Gender,
  Occupation,
  ActivityLevel,
  TrainingEnvironment,
  WorkoutDuration,
  ExperienceLevel,
  PreferredWorkoutTime,
  DietType,
  CookingSituation,
  IndianFoodStyle,
  BudgetTier,
  SupplementPreference,
} from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface EditSectionModalProps {
  visible: boolean;
  section: ProfileSectionKey | null;
  onClose: () => void;
  onSaved?: (message: string) => void;
}

export const EditSectionModal: React.FC<EditSectionModalProps> = ({
  visible,
  section,
  onClose,
  onSaved,
}) => {
  const { userProfile, updateProfileSection, isLoading } = usePlan();

  // Local state copies for each section
  const [personalData, setPersonalData] = useState<PersonalBasics>(userProfile.personal);
  const [rhythmData, setRhythmData] = useState<DailyRhythm>(userProfile.rhythm);
  const [trainingData, setTrainingData] = useState<TrainingSetup>(userProfile.training);
  const [foodData, setFoodData] = useState<FoodPreferences>(userProfile.food);
  const [budgetData, setBudgetData] = useState<Budget>(userProfile.budget);
  const [supplementsData, setSupplementsData] = useState<Supplements>(userProfile.supplements);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Sync state whenever modal opens or section changes
  useEffect(() => {
    if (visible && section) {
      setPersonalData({ ...userProfile.personal });
      setRhythmData({ ...userProfile.rhythm });
      setTrainingData({ ...userProfile.training });
      setFoodData({ ...userProfile.food });
      setBudgetData({ ...userProfile.budget });
      setSupplementsData({ ...userProfile.supplements });
      setErrorMessage(null);
      setIsSaving(false);
    }
  }, [visible, section, userProfile]);

  if (!section) return null;

  const getSectionTitle = (): string => {
    switch (section) {
      case 'personal':
        return 'Personal Basics & Metrics';
      case 'rhythm':
        return 'Daily Rhythm & Schedule';
      case 'training':
        return 'Training Setup';
      case 'food':
        return 'Food & Nutrition Preferences';
      case 'budget':
        return 'Daily Food Budget';
      case 'supplements':
        return 'Supplement Preference';
    }
  };

  const getSectionSubtitle = (): string => {
    switch (section) {
      case 'personal':
        return 'Updating metrics or fitness goal will recalculate your calorie & protein targets.';
      case 'rhythm':
        return 'Updating departure/return times dynamically updates your 24h routine timeline.';
      case 'training':
        return 'Updating environment, frequency, or duration regenerates your 7-day workout split.';
      case 'food':
        return 'Updating diet type, cooking setup, or style re-optimizes your meal blueprint.';
      case 'budget':
        return 'Updating your daily allowance re-solves the 0/1 Knapsack grocery solver.';
      case 'supplements':
        return 'Updating supplement choices adjusts whole-food versus powder recommendations.';
    }
  };

  const handleSave = async () => {
    setErrorMessage(null);
    setIsSaving(true);

    let sectionPayload: any;
    switch (section) {
      case 'personal':
        if (!personalData.name.trim()) {
          setErrorMessage('Please provide a name or nickname.');
          setIsSaving(false);
          return;
        }
        if (personalData.age < 14 || personalData.age > 90) {
          setErrorMessage('Age must be between 14 and 90 years.');
          setIsSaving(false);
          return;
        }
        if (personalData.heightCm < 120 || personalData.heightCm > 230) {
          setErrorMessage('Height must be between 120 and 230 cm.');
          setIsSaving(false);
          return;
        }
        if (personalData.weightKg < 35 || personalData.weightKg > 200) {
          setErrorMessage('Weight must be between 35 and 200 kg.');
          setIsSaving(false);
          return;
        }
        sectionPayload = personalData;
        break;

      case 'rhythm':
        if (!rhythmData.departureTime.trim() || !rhythmData.returnTime.trim()) {
          setErrorMessage('Please specify transit/shift departure and return times.');
          setIsSaving(false);
          return;
        }
        sectionPayload = rhythmData;
        break;

      case 'training':
        sectionPayload = trainingData;
        break;

      case 'food':
        sectionPayload = foodData;
        break;

      case 'budget':
        if (budgetData.dailyBudgetRupees < 30) {
          setErrorMessage('Daily budget must be at least ₹30.');
          setIsSaving(false);
          return;
        }
        sectionPayload = budgetData;
        break;

      case 'supplements':
        sectionPayload = supplementsData;
        break;
    }

    try {
      const result: SectionUpdateResult = await updateProfileSection(section, sectionPayload);
      setIsSaving(false);

      if (result.success) {
        onClose();
        onSaved?.(result.message || 'Profile updated successfully.');
      } else {
        setErrorMessage(result.message || 'Failed to update section. Please check your connection.');
      }
    } catch (err: unknown) {
      setIsSaving(false);
      const msg = err instanceof Error ? err.message : 'An error occurred while saving.';
      setErrorMessage(msg);
    }
  };

  // --- SUB-FORMS ---

  const renderPersonalForm = () => {
    const goals: { id: FitnessGoal; title: string; desc: string; icon: IconName }[] = [
      {
        id: 'muscle_gain',
        title: 'Muscle Gain & Strength',
        desc: 'Progressive overload with caloric surplus & high-protein whole foods.',
        icon: 'dumbbell',
      },
      {
        id: 'fat_loss',
        title: 'Fat Loss & Lean Definition',
        desc: 'Controlled caloric deficit preserving lean mass with nutrient density.',
        icon: 'fire',
      },
      {
        id: 'weight_loss',
        title: 'Weight Reduction',
        desc: 'Sustained lifestyle fat loss focused on high satiety & portion stability.',
        icon: 'activity',
      },
      {
        id: 'maintenance',
        title: 'Vitality & Maintenance',
        desc: 'Balanced energy equilibrium, cardiovascular health, and daily energy.',
        icon: 'leaf',
      },
    ];

    const genders: { id: Gender; label: string }[] = [
      { id: 'male', label: 'Male' },
      { id: 'female', label: 'Female' },
      { id: 'other', label: 'Other' },
    ];

    return (
      <View style={styles.formContainer}>
        {/* Name */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>FULL NAME / NICKNAME</Text>
          <TextInput
            value={personalData.name}
            onChangeText={(val) => setPersonalData((prev) => ({ ...prev, name: val }))}
            placeholder="e.g. Aarav Sharma"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
        </View>

        {/* Gender */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>BIOLOGICAL GENDER</Text>
          <View style={styles.segmentedRow}>
            {genders.map((g) => {
              const isSelected = personalData.gender === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.7}
                  onPress={() => setPersonalData((prev) => ({ ...prev, gender: g.id }))}
                  style={[
                    styles.segmentButton,
                    isSelected && styles.segmentButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.segmentButtonText,
                      isSelected && styles.segmentButtonTextSelected,
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Numeric Metrics */}
        <View style={styles.metricsRow}>
          <NumberInput
            label="AGE"
            value={personalData.age}
            onChangeValue={(val) => setPersonalData((prev) => ({ ...prev, age: val }))}
            min={14}
            max={90}
            step={1}
            unit="yrs"
            style={styles.metricInput}
          />
          <NumberInput
            label="HEIGHT"
            value={personalData.heightCm}
            onChangeValue={(val) => setPersonalData((prev) => ({ ...prev, heightCm: val }))}
            min={120}
            max={230}
            step={1}
            unit="cm"
            style={styles.metricInput}
          />
          <NumberInput
            label="WEIGHT"
            value={personalData.weightKg}
            onChangeValue={(val) => setPersonalData((prev) => ({ ...prev, weightKg: val }))}
            min={35}
            max={200}
            step={0.5}
            unit="kg"
            style={styles.metricInput}
          />
        </View>

        {/* Fitness Goal */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>FITNESS GOAL</Text>
          <View style={styles.cardsStack}>
            {goals.map((g) => (
              <SelectCard
                key={g.id}
                title={g.title}
                description={g.desc}
                icon={
                  <Icon
                    name={g.icon}
                    size={20}
                    color={personalData.goal === g.id ? colors.primaryDark : colors.textSecondary}
                  />
                }
                selected={personalData.goal === g.id}
                onSelect={() => setPersonalData((prev) => ({ ...prev, goal: g.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderRhythmForm = () => {
    const occupations: { id: Occupation; label: string; icon: IconName }[] = [
      { id: 'student', label: 'Student', icon: 'graduation-cap' },
      { id: 'working_professional', label: 'Working Professional', icon: 'briefcase' },
      { id: 'homemaker', label: 'Homemaker', icon: 'home' },
      { id: 'business_owner', label: 'Business Owner', icon: 'building' },
      { id: 'freelancer', label: 'Freelancer', icon: 'laptop' },
      { id: 'other', label: 'General Rhythm', icon: 'compass' },
    ];

    const activities: { id: ActivityLevel; title: string; desc: string; badge: string }[] = [
      {
        id: 'sedentary',
        title: 'Sedentary',
        desc: 'Mostly desk/seated work with minimal daily walking.',
        badge: '1.2x TDEE',
      },
      {
        id: 'lightly_active',
        title: 'Lightly Active',
        desc: 'Regular short walks, transit, stairs throughout the day.',
        badge: '1.375x TDEE',
      },
      {
        id: 'moderately_active',
        title: 'Moderately Active',
        desc: 'On feet frequently, campus movement, active housework.',
        badge: '1.55x TDEE',
      },
      {
        id: 'very_active',
        title: 'Very Active',
        desc: 'Heavy physical labor or sustained continuous movement.',
        badge: '1.725x TDEE',
      },
    ];

    const departurePresets = ['07:30', '08:00', '08:30', '09:00', '09:30', '10:00'];
    const returnPresets = ['16:00', '17:00', '18:00', '18:30', '19:30', '20:30'];

    return (
      <View style={styles.formContainer}>
        {/* Occupation */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PRIMARY ROUTINE / OCCUPATION</Text>
          <View style={styles.occupationGrid}>
            {occupations.map((item) => {
              const isSelected = rhythmData.occupation === item.id;
              return (
                <TouchableOpacity
                  key={item.id}
                  activeOpacity={0.7}
                  onPress={() => setRhythmData((prev) => ({ ...prev, occupation: item.id }))}
                  style={[
                    styles.occupationCard,
                    isSelected && styles.occupationCardSelected,
                  ]}
                >
                  <Icon
                    name={item.icon}
                    size={18}
                    color={isSelected ? colors.primaryDark : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.occupationText,
                      isSelected && styles.occupationTextSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Departure Time */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>WORK / COLLEGE DEPARTURE TIME</Text>
          <TextInput
            value={rhythmData.departureTime}
            onChangeText={(val) => setRhythmData((prev) => ({ ...prev, departureTime: val }))}
            placeholder="e.g. 08:30"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
          <View style={styles.presetsRow}>
            {departurePresets.map((t) => (
              <OptionChip
                key={t}
                label={t}
                selected={rhythmData.departureTime === t}
                onPress={() => setRhythmData((prev) => ({ ...prev, departureTime: t }))}
                size="sm"
              />
            ))}
          </View>
        </View>

        {/* Return Time */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>EXPECTED RETURN / SHIFT END TIME</Text>
          <TextInput
            value={rhythmData.returnTime}
            onChangeText={(val) => setRhythmData((prev) => ({ ...prev, returnTime: val }))}
            placeholder="e.g. 18:30"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
          <View style={styles.presetsRow}>
            {returnPresets.map((t) => (
              <OptionChip
                key={t}
                label={t}
                selected={rhythmData.returnTime === t}
                onPress={() => setRhythmData((prev) => ({ ...prev, returnTime: t }))}
                size="sm"
              />
            ))}
          </View>
        </View>

        {/* Sleep & Wake */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TYPICAL WAKE-UP TIME</Text>
          <TextInput
            value={rhythmData.wakeUpTime}
            onChangeText={(val) => setRhythmData((prev) => ({ ...prev, wakeUpTime: val }))}
            placeholder="e.g. 06:30"
            placeholderTextColor={colors.textMuted}
            style={styles.textInput}
          />
        </View>

        <NumberInput
          label="NIGHTLY SLEEP DURATION"
          value={rhythmData.sleepHours}
          onChangeValue={(val) => setRhythmData((prev) => ({ ...prev, sleepHours: val }))}
          min={5}
          max={10}
          step={0.5}
          unit="hrs"
        />

        {/* Activity Level */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>NON-EXERCISE ACTIVITY LEVEL</Text>
          <View style={styles.cardsStack}>
            {activities.map((lvl) => (
              <SelectCard
                key={lvl.id}
                title={lvl.title}
                description={lvl.desc}
                badge={lvl.badge}
                selected={rhythmData.activityLevel === lvl.id}
                onSelect={() => setRhythmData((prev) => ({ ...prev, activityLevel: lvl.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderTrainingForm = () => {
    const durations: WorkoutDuration[] = [20, 30, 45, 60];
    const frequencies = [3, 4, 5, 6];
    const times: { id: PreferredWorkoutTime; label: string; period: string }[] = [
      { id: 'morning', label: 'Morning', period: '6 AM – 9 AM' },
      { id: 'afternoon', label: 'Afternoon', period: '12 PM – 3 PM' },
      { id: 'evening', label: 'Evening', period: '5 PM – 8 PM' },
      { id: 'night', label: 'Night', period: '8 PM – 11 PM' },
      { id: 'flexible', label: 'Flexible', period: 'Any slot' },
    ];
    const experiences: { id: ExperienceLevel; title: string; desc: string; badge: string }[] = [
      {
        id: 'beginner',
        title: 'Beginner',
        desc: 'New to progressive lifting. Focus on core movement mechanics.',
        badge: 'Form First',
      },
      {
        id: 'intermediate',
        title: 'Intermediate',
        desc: '6+ months experience. Ready for progressive volume & splits.',
        badge: 'Overload',
      },
      {
        id: 'advanced',
        title: 'Advanced',
        desc: '2+ years lifting experience. Tuned for intensity & compound lifts.',
        badge: 'Intensity',
      },
    ];

    return (
      <View style={styles.formContainer}>
        {/* Environment */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>TRAINING ENVIRONMENT</Text>
          <View style={styles.envRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setTrainingData((prev) => ({ ...prev, environment: 'home' }))}
              style={[
                styles.envCard,
                trainingData.environment === 'home' && styles.envCardSelected,
              ]}
            >
              <Icon
                name="home"
                size={22}
                color={trainingData.environment === 'home' ? colors.primaryDark : colors.textSecondary}
              />
              <Text
                style={[
                  styles.envCardTitle,
                  trainingData.environment === 'home' && styles.envCardTitleSelected,
                ]}
              >
                Home Workouts
              </Text>
              <Text style={styles.envCardDesc}>Bands, bodyweight & dumbbells</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setTrainingData((prev) => ({ ...prev, environment: 'gym' }))}
              style={[
                styles.envCard,
                trainingData.environment === 'gym' && styles.envCardSelected,
              ]}
            >
              <Icon
                name="dumbbell"
                size={22}
                color={trainingData.environment === 'gym' ? colors.primaryDark : colors.textSecondary}
              />
              <Text
                style={[
                  styles.envCardTitle,
                  trainingData.environment === 'gym' && styles.envCardTitleSelected,
                ]}
              >
                Commercial Gym
              </Text>
              <Text style={styles.envCardDesc}>Barbells, racks & machines</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SESSION DURATION (MINUTES)</Text>
          <View style={styles.chipsRow}>
            {durations.map((d) => {
              const isSelected = trainingData.durationMinutes === d;
              return (
                <TouchableOpacity
                  key={d}
                  activeOpacity={0.7}
                  onPress={() => setTrainingData((prev) => ({ ...prev, durationMinutes: d }))}
                  style={[
                    styles.chipBox,
                    isSelected && styles.chipBoxSelected,
                  ]}
                >
                  <Text style={[styles.chipBoxText, isSelected && styles.chipBoxTextSelected]}>
                    {d} mins
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Weekly Frequency */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>WORKOUT DAYS PER WEEK</Text>
          <View style={styles.chipsRow}>
            {frequencies.map((f) => {
              const isSelected = trainingData.weeklyFrequencyDays === f;
              return (
                <TouchableOpacity
                  key={f}
                  activeOpacity={0.7}
                  onPress={() => setTrainingData((prev) => ({ ...prev, weeklyFrequencyDays: f }))}
                  style={[
                    styles.chipBox,
                    isSelected && styles.chipBoxSelected,
                  ]}
                >
                  <Text style={[styles.chipBoxText, isSelected && styles.chipBoxTextSelected]}>
                    {f} Days
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Preferred Slot */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>PREFERRED TRAINING TIME</Text>
          <View style={styles.timeSlotGrid}>
            {times.map((t) => {
              const isSelected = trainingData.preferredTime === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  activeOpacity={0.7}
                  onPress={() => setTrainingData((prev) => ({ ...prev, preferredTime: t.id }))}
                  style={[
                    styles.timeSlotCard,
                    isSelected && styles.timeSlotCardSelected,
                  ]}
                >
                  <Text style={[styles.timeSlotTitle, isSelected && styles.timeSlotTitleSelected]}>
                    {t.label}
                  </Text>
                  <Text style={styles.timeSlotPeriod}>{t.period}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Experience */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>EXPERIENCE LEVEL</Text>
          <View style={styles.cardsStack}>
            {experiences.map((exp) => (
              <SelectCard
                key={exp.id}
                title={exp.title}
                description={exp.desc}
                badge={exp.badge}
                selected={trainingData.experienceLevel === exp.id}
                onSelect={() => setTrainingData((prev) => ({ ...prev, experienceLevel: exp.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderFoodForm = () => {
    const diets: { id: DietType; label: string; desc: string; badge: string; icon: IconName }[] = [
      {
        id: 'pure_veg',
        label: 'Pure Vegetarian',
        desc: 'Dairy, pulses, sattu, soya, paneer & whole grains. Zero eggs/meat.',
        badge: 'Zero Meat/Egg',
        icon: 'leaf',
      },
      {
        id: 'eggetarian',
        label: 'Eggetarian',
        desc: 'Vegetarian staples plus whole eggs and egg whites for budget protein.',
        badge: 'Eggs Included',
        icon: 'egg',
      },
      {
        id: 'non_veg',
        label: 'Non-Vegetarian',
        desc: 'Eggs, chicken, fish combined with traditional dal, roti and sabzi.',
        badge: 'Chicken & Eggs',
        icon: 'utensils',
      },
    ];

    const cookingSituations: { id: CookingSituation; title: string; desc: string }[] = [
      {
        id: 'hostel_mess',
        title: 'Hostel / PG / Office Mess',
        desc: 'Limited kitchen access. Focus on mess staples & no-cook add-ons.',
      },
      {
        id: 'family_provided',
        title: 'Family / Tiffin-Provided',
        desc: 'Standard home-cooked meals with simple high-protein portions added.',
      },
      {
        id: 'self_cooking',
        title: 'Self-Cooking / Meal Prep',
        desc: 'Full kitchen access for custom stir-fries, shakes & batch prep.',
      },
    ];

    const indianStyles: { id: IndianFoodStyle; title: string; desc: string }[] = [
      {
        id: 'simple_homestyle',
        title: 'Simple Ghar-ka-Khana',
        desc: 'Minimal oil, yellow dal, roti, seasonal sabzi, dahi.',
      },
      {
        id: 'high_protein_everyday',
        title: 'High-Protein Focus',
        desc: 'Sattu, soya chunks, kala chana, eggs/paneer with every meal.',
      },
      {
        id: 'north_indian',
        title: 'North Indian Regional',
        desc: 'Rajma, chole, paneer, paratha adjustments, curd chaas.',
      },
      {
        id: 'south_indian',
        title: 'South Indian Regional',
        desc: 'Idli/dosa with sambar, curd rice, sundal, rasam, egg roasts.',
      },
    ];

    return (
      <View style={styles.formContainer}>
        {/* Diet Type */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>DIETARY BASELINE</Text>
          <View style={styles.cardsStack}>
            {diets.map((d) => (
              <SelectCard
                key={d.id}
                title={d.label}
                description={d.desc}
                badge={d.badge}
                icon={
                  <Icon
                    name={d.icon}
                    size={20}
                    color={foodData.dietType === d.id ? colors.primaryDark : colors.textSecondary}
                  />
                }
                selected={foodData.dietType === d.id}
                onSelect={() => setFoodData((prev) => ({ ...prev, dietType: d.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>

        {/* Cooking Situation */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>KITCHEN & COOKING SETUP</Text>
          <View style={styles.cardsStack}>
            {cookingSituations.map((sit) => (
              <SelectCard
                key={sit.id}
                title={sit.title}
                description={sit.desc}
                selected={foodData.cookingSituation === sit.id}
                onSelect={() => setFoodData((prev) => ({ ...prev, cookingSituation: sit.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>

        {/* Meals per Day */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>MEALS PER DAY</Text>
          <View style={styles.chipsRow}>
            {[3, 4, 5].map((num) => {
              const isSelected = foodData.mealsPerDay === num;
              return (
                <TouchableOpacity
                  key={num}
                  activeOpacity={0.7}
                  onPress={() => setFoodData((prev) => ({ ...prev, mealsPerDay: num }))}
                  style={[
                    styles.chipBox,
                    isSelected && styles.chipBoxSelected,
                  ]}
                >
                  <Text style={[styles.chipBoxText, isSelected && styles.chipBoxTextSelected]}>
                    {num} Meals
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Food Style */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>INDIAN FOOD STYLE</Text>
          <View style={styles.cardsStack}>
            {indianStyles.map((st) => (
              <SelectCard
                key={st.id}
                title={st.title}
                description={st.desc}
                selected={foodData.indianFoodStyle === st.id}
                onSelect={() => setFoodData((prev) => ({ ...prev, indianFoodStyle: st.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderBudgetForm = () => {
    const tiers: { id: BudgetTier; title: string; cost: string; desc: string; defaultAmt: number }[] = [
      {
        id: 'ultra_budget',
        title: 'Ultra-Budget Tier',
        cost: '₹40 / day (~₹280/wk)',
        desc: 'Sattu, Yellow Moong Dal, Kala Chana, seasonal sabzi, roti.',
        defaultAmt: 40,
      },
      {
        id: 'budget',
        title: 'Budget Tier (Recommended)',
        cost: '₹65 / day (~₹455/wk)',
        desc: 'Includes fresh curd (dahi), eggs/paneer additions, peanuts & bananas.',
        defaultAmt: 65,
      },
      {
        id: 'moderate',
        title: 'Moderate Tier',
        cost: '₹110 / day (~₹770/wk)',
        desc: 'Generous daily paneer, whole milk, chicken portions, nuts & greens.',
        defaultAmt: 110,
      },
    ];

    return (
      <View style={styles.formContainer}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>FOOD BUDGET TIER</Text>
          <View style={styles.cardsStack}>
            {tiers.map((t) => (
              <SelectCard
                key={t.id}
                title={t.title}
                description={t.desc}
                badge={t.cost}
                selected={budgetData.tier === t.id}
                onSelect={() =>
                  setBudgetData({
                    tier: t.id,
                    dailyBudgetRupees: t.defaultAmt,
                  })
                }
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>

        <NumberInput
          label="DAILY BUDGET LIMIT (₹)"
          value={budgetData.dailyBudgetRupees}
          onChangeValue={(val) =>
            setBudgetData((prev) => ({
              ...prev,
              dailyBudgetRupees: val,
            }))
          }
          min={30}
          max={400}
          step={5}
          unit="₹/day"
        />
      </View>
    );
  };

  const renderSupplementsForm = () => {
    const options: {
      id: SupplementPreference;
      title: string;
      description: string;
      badge?: string;
      icon: IconName;
    }[] = [
      {
        id: 'no_supplements',
        title: 'No supplements — 100% regular food',
        description: 'Prioritize kitchen staples: Sattu, Moong Dal, Kala Chana, Curd, Paneer, Eggs. Zero powders.',
        badge: 'Recommended',
        icon: 'leaf',
      },
      {
        id: 'open_to_supplements',
        title: "Yes, I'm open to evidence-backed supplements",
        description: 'Consider practical additions like pure Creatine Monohydrate or convenient unflavoured Whey.',
        icon: 'pill',
      },
      {
        id: 'not_sure',
        title: 'Not sure — help me understand options',
        description: 'FitShift provides an educational breakdown showing whole food alternatives first.',
        icon: 'info',
      },
    ];

    return (
      <View style={styles.formContainer}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>SUPPLEMENT PHILOSOPHY</Text>
          <View style={styles.cardsStack}>
            {options.map((opt) => (
              <SelectCard
                key={opt.id}
                title={opt.title}
                description={opt.description}
                badge={opt.badge}
                icon={
                  <Icon
                    name={opt.icon}
                    size={20}
                    color={supplementsData.preference === opt.id ? colors.primaryDark : colors.textSecondary}
                  />
                }
                selected={supplementsData.preference === opt.id}
                onSelect={() => setSupplementsData((prev) => ({ ...prev, preference: opt.id }))}
                style={styles.cardItem}
              />
            ))}
          </View>
        </View>

        {supplementsData.preference === 'open_to_supplements' ? (
          <NumberInput
            label="OPTIONAL MONTHLY SUPPLEMENT BUDGET (₹)"
            value={supplementsData.monthlyBudgetRupees || 1200}
            onChangeValue={(val) =>
              setSupplementsData((prev) => ({ ...prev, monthlyBudgetRupees: val }))
            }
            min={400}
            max={4000}
            step={100}
            unit="₹/mo"
          />
        ) : null}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title={getSectionTitle()}
      subtitle={getSectionSubtitle()}
      footer={
        <View style={styles.footerRow}>
          <Button
            title="Cancel"
            variant="ghost"
            size="sm"
            onPress={onClose}
            disabled={isSaving}
            style={styles.cancelBtn}
          />
          <Button
            title={isSaving ? 'Updating...' : 'Save & Apply'}
            variant="primary"
            size="sm"
            onPress={handleSave}
            loading={isSaving}
            style={styles.saveBtn}
          />
        </View>
      }
    >
      <ScrollView
        style={styles.scrollBody}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Icon name="alert" size={16} color="#DC2626" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        {section === 'personal' && renderPersonalForm()}
        {section === 'rhythm' && renderRhythmForm()}
        {section === 'training' && renderTrainingForm()}
        {section === 'food' && renderFoodForm()}
        {section === 'budget' && renderBudgetForm()}
        {section === 'supplements' && renderSupplementsForm()}
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollBody: {
    maxHeight: 520,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
    gap: spacing.md,
  },
  formContainer: {
    gap: spacing.lg,
  },
  fieldGroup: {
    gap: spacing.xs,
  },
  fieldLabel: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  textInput: {
    ...typography.body,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    color: colors.textPrimary,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.md,
  },
  segmentButtonSelected: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
  },
  segmentButtonText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segmentButtonTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  metricsRow: {
    gap: spacing.sm,
  },
  metricInput: {
    marginBottom: spacing.xs,
  },
  cardsStack: {
    gap: spacing.xs,
  },
  cardItem: {
    marginBottom: spacing.xxs,
  },
  occupationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  occupationCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  occupationCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  occupationText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textSecondary,
    flex: 1,
  },
  occupationTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xxs,
  },
  envRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  envCard: {
    flex: 1,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    gap: 4,
  },
  envCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  envCardTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  envCardTitleSelected: {
    color: colors.primaryDark,
  },
  envCardDesc: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    textAlign: 'center',
  },
  chipsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  chipBox: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipBoxSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  chipBoxText: {
    ...typography.bodySmall,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  chipBoxTextSelected: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  timeSlotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  timeSlotCard: {
    width: '48%',
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  timeSlotCardSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  timeSlotTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeSlotTitleSelected: {
    color: colors.primaryDark,
  },
  timeSlotPeriod: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
  },
  errorText: {
    ...typography.caption,
    color: '#DC2626',
    flex: 1,
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  cancelBtn: {
    minWidth: 80,
  },
  saveBtn: {
    minWidth: 120,
  },
});
