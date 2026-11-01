import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import {
  Button,
  Card,
  Badge,
  ProgressBar,
  Header,
  Divider,
  SectionHeader,
  IconButton,
  Avatar,
  Toast,
  OfflineStatusBanner,
} from '../components/common';
import {
  SelectCard,
  MultiSelectCard,
  OptionChip,
  NumberInput,
  ChoiceGroup,
} from '../components/selection';
import {
  MacroRingCard,
  MacroBarCard,
  StatCard,
  ExerciseCard,
  MealCard,
  ProgressSummary,
} from '../components/fitness';
import {
  BottomSheet,
  Modal,
  ExpandableCard,
  TabSelector,
  DaySelector,
  SearchBar,
} from '../components/interactive';
import { Exercise, PlannedMeal } from '../types';

export interface DesignSystemShowcaseProps {
  onBack?: () => void;
}

export const DesignSystemShowcase: React.FC<DesignSystemShowcaseProps> = ({ onBack }) => {
  // Selection States
  const [singleChoice, setSingleChoice] = useState<'home' | 'gym'>('home');
  const [multiChoice, setMultiChoice] = useState<string[]>(['dumbbells']);
  const [selectedChip, setSelectedChip] = useState<string>('vegetarian');
  const [sampleWeight, setSampleWeight] = useState<number>(72);
  const [sampleBudget, setSampleBudget] = useState<number>(75);

  // Interactive UI States
  const [activeTab, setActiveTab] = useState<string>('selection');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [searchText, setSearchText] = useState<string>('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOfflineBanner, setShowOfflineBanner] = useState<boolean>(false);

  // Sample Exercise matching free-exercise-db CDN
  const sampleExercise: Exercise = {
    id: 'Pushups',
    name: 'Standard Pushups',
    targetMuscle: 'Chest',
    setsReps: '4 sets × 10–12 reps',
    restSeconds: 60,
    environment: 'home',
    equipment: 'body only',
    thumbnailUrl: 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pushups/0.jpg',
    instructions: [
      'Lie face down on the floor with hands placed slightly wider than shoulder-width.',
      'Maintain a rigid core and neutral spine as you press upward.',
    ],
    commonMistakes: [
      'Sagging hips',
      'Flaring elbows out past 90 degrees',
    ],
    alternative: {
      id: 'Diamond_Pushup',
      name: 'Diamond Pushup',
      targetMuscle: 'Triceps',
      environment: 'home',
      equipment: 'body only',
      note: 'Focuses primarily on triceps recruitment.',
    },
  };

  // Sample Indian Whole-Food Meal
  const sampleMeal: PlannedMeal = {
    id: 'sample-meal-1',
    mealType: 'breakfast',
    title: 'Chana Sattu Drink & Roasted Peanuts',
    totalProteinGrams: 28,
    estimatedCost: 17,
    prepTimeMinutes: 5,
    cookingTip: 'Stir roasted sattu in chilled water or buttermilk with roasted cumin powder.',
    items: [
      {
        name: 'Chana Sattu (Roasted Gram Flour)',
        quantityGrams: 60,
        proteinGrams: 15,
        estimatedCost: 9,
        category: 'Protein Staples',
      },
      {
        name: 'Roasted Peanuts',
        quantityGrams: 50,
        proteinGrams: 13,
        estimatedCost: 8,
        category: 'Nuts & Seeds',
      },
    ],
  };

  const sampleDays = [
    { dayNumber: 1, dayName: 'Monday', isRestDay: false },
    { dayNumber: 2, dayName: 'Tuesday', isRestDay: false },
    { dayNumber: 3, dayName: 'Wednesday', isRestDay: true },
    { dayNumber: 4, dayName: 'Thursday', isRestDay: false },
    { dayNumber: 5, dayName: 'Friday', isRestDay: false },
    { dayNumber: 6, dayName: 'Saturday', isRestDay: true },
    { dayNumber: 7, dayName: 'Sunday', isRestDay: true },
  ];

  return (
    <View style={styles.screen}>
      <OfflineStatusBanner
        isOffline={showOfflineBanner}
        onRetry={() => {
          setShowOfflineBanner(false);
          setToastMessage('Reconnected to FitShift Engine');
        }}
      />

      <Header
        showBrand
        rightAction={
          <View style={styles.headerRight}>
            {onBack ? (
              <Button
                title="← Back"
                variant="outline"
                size="sm"
                onPress={onBack}
              />
            ) : null}
            <Avatar name="Aarav Sharma" size="sm" variant="emerald" />
            <IconButton
              icon={<Text style={{ fontSize: 16 }}>🔔</Text>}
              size="sm"
              variant="surface"
              badge
              onPress={() => setToastMessage('Notification: New high-protein staple added')}
            />
          </View>
        }
      />

      {/* Main Showcase Tab Selector */}
      <View style={styles.topTabs}>
        <TabSelector
          tabs={[
            { id: 'selection', label: 'Selection' },
            { id: 'fitness', label: 'Fitness & Food' },
            { id: 'modals', label: 'Modals & Sheets' },
            { id: 'common', label: 'Common UI' },
          ]}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ================= TAB 1: SELECTION ================= */}
        {activeTab === 'selection' && (
          <View style={styles.section}>
            <SectionHeader
              title="Selection Controls (Onboarding)"
              subtitle="Single and multiple selection cards for the 7-step wizard"
            />

            <Text style={styles.groupLabel}>Single Selection Cards (SelectCard):</Text>
            <SelectCard
              title="Home Workouts"
              description="Bodyweight calisthenics and dumbbells with zero gym fees"
              badge="Zero Gear"
              selected={singleChoice === 'home'}
              onSelect={() => setSingleChoice('home')}
            />
            <SelectCard
              title="Commercial Gym"
              description="Barbells, cable crossover stations, and heavy progressive overload"
              badge="Full Access"
              selected={singleChoice === 'gym'}
              onSelect={() => setSingleChoice('gym')}
            />

            <Divider label="Multi-Select" />

            <Text style={styles.groupLabel}>Multi-Selection Cards (MultiSelectCard):</Text>
            <MultiSelectCard
              title="Dumbbells / Resistance Bands"
              description="Portable equipment available at home"
              badge="Recommended"
              selected={multiChoice.includes('dumbbells')}
              onToggle={() => {
                setMultiChoice((prev) =>
                  prev.includes('dumbbells')
                    ? prev.filter((i) => i !== 'dumbbells')
                    : [...prev, 'dumbbells']
                );
              }}
            />
            <MultiSelectCard
              title="Pull-up Bar"
              description="Doorway or ceiling mounted upper body anchor"
              selected={multiChoice.includes('pullup')}
              onToggle={() => {
                setMultiChoice((prev) =>
                  prev.includes('pullup')
                    ? prev.filter((i) => i !== 'pullup')
                    : [...prev, 'pullup']
                );
              }}
            />

            <Divider label="Compact Option Chips" />

            <Text style={styles.groupLabel}>Individual Option Chips (OptionChip):</Text>
            <View style={styles.chipRow}>
              {['pure_veg', 'eggetarian', 'non_veg'].map((diet) => (
                <OptionChip
                  key={diet}
                  label={diet.replace('_', ' ').toUpperCase()}
                  selected={selectedChip === diet}
                  onToggle={() => setSelectedChip(diet)}
                />
              ))}
            </View>

            <Text style={[styles.groupLabel, { marginTop: spacing.md }]}>Grouped Chips (ChoiceGroup):</Text>
            <ChoiceGroup
              layout="chips"
              options={[
                { value: 'pure_veg', title: 'PURE VEG' },
                { value: 'eggetarian', title: 'EGGETARIAN' },
                { value: 'non_veg', title: 'NON VEG' },
              ]}
              selected={selectedChip}
              onChange={setSelectedChip}
            />

            <Divider label="Numeric Inputs" />

            <NumberInput
              label="Body Weight"
              value={sampleWeight}
              onChangeValue={setSampleWeight}
              min={35}
              max={200}
              step={1}
              unit="kg"
            />

            <NumberInput
              label="Daily Food Budget"
              value={sampleBudget}
              onChangeValue={setSampleBudget}
              min={30}
              max={500}
              step={5}
              unit="₹/day"
            />
          </View>
        )}

        {/* ================= TAB 2: FITNESS & FOOD ================= */}
        {activeTab === 'fitness' && (
          <View style={styles.section}>
            <SectionHeader
              title="Fitness & Nutrition Modules"
              subtitle="Domain components displaying calculated metrics and meals"
            />

            {/* Macro Ring Card */}
            <MacroRingCard
              calorieTarget={2895}
              calorieAchieved={2895}
              proteinTarget={119}
              proteinAchieved={120}
              goal="Muscle Gain"
            />

            {/* Horizontal Macro Bar Card */}
            <MacroBarCard
              title="Macro Target Breakdown"
              items={[
                { label: 'Protein Target', current: 120, target: 119, unit: 'g', color: colors.primary },
                { label: 'Energy Requirement', current: 2895, target: 2895, unit: 'kcal', color: '#D97706' },
                { label: 'Daily Budget Cost', current: 72, target: 75, unit: '₹', color: '#2563EB' },
              ]}
              style={{ marginTop: spacing.md }}
            />

            {/* Statistics Row */}
            <View style={styles.statsRow}>
              <StatCard
                title="BMR"
                value="1,674"
                unit="kcal"
                subtitle="Basal Metabolic Rate"
                style={{ flex: 1, marginRight: spacing.sm }}
              />
              <StatCard
                title="TDEE"
                value="2,595"
                unit="kcal"
                subtitle="Total Daily Energy"
                badge="+300 goal"
                style={{ flex: 1 }}
              />
            </View>

            <ProgressSummary
              weeklyFrequencyDays={4}
              dailyBudgetRupees={75}
              environment="Home"
              isFeasible
              style={{ marginVertical: spacing.md }}
            />

            <SectionHeader title="Exercise Demonstration Card" />
            <ExerciseCard
              exercise={sampleExercise}
              onViewDetails={(ex) => {
                setToastMessage(`Viewing ${ex.name} instructions`);
              }}
              onSwapAlternative={(id) => {
                setToastMessage(`Swapped exercise: ${id}`);
              }}
            />

            <SectionHeader title="Indian Whole-Food Meal Card" />
            <MealCard
              meal={sampleMeal}
              onSwap={(id) => {
                setToastMessage(`Opened alternative swaps for ${id}`);
              }}
            />
          </View>
        )}

        {/* ================= TAB 3: MODALS & SHEETS ================= */}
        {activeTab === 'modals' && (
          <View style={styles.section}>
            <SectionHeader
              title="Mobile Interaction Components"
              subtitle="Native bottom sheets, dialog modals, search & day selectors"
            />

            <SearchBar
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Search exercise by muscle group..."
              onClear={() => setToastMessage('Search cleared')}
              style={{ marginBottom: spacing.md }}
            />

            <Text style={styles.groupLabel}>7-Day Schedule Selector (DaySelector):</Text>
            <DaySelector
              days={sampleDays}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
            />
            <Text style={styles.selectedDayNote}>
              Active Day: {sampleDays.find((d) => d.dayNumber === selectedDay)?.dayName} ({sampleDays.find((d) => d.dayNumber === selectedDay)?.isRestDay ? 'Rest & Neuromuscular Recovery' : 'Active Training Session'})
            </Text>

            <Divider label="Trigger Modals" />

            <View style={styles.buttonStack}>
              <Button
                title="Open Native BottomSheet"
                onPress={() => setIsBottomSheetVisible(true)}
                variant="primary"
                size="md"
              />

              <Button
                title="Open Centered Dialog Modal"
                onPress={() => setIsModalVisible(true)}
                variant="outline"
                size="md"
              />
            </View>

            <Divider label="Expandable Card" />

            <ExpandableCard
              title="Indian High-Protein Staples Guide"
              subtitle="Cost per 10g protein analysis"
              badge="₹0.62/g"
            >
              <Text style={styles.expandText}>
                • Soya Chunks: 52g protein per 100g (~₹16) — most affordable plant protein.
                {'\n'}• Chana Sattu: 20g protein per 100g (~₹15) — gut-friendly roasted gram flour.
                {'\n'}• Kala Chana: 19g protein per 100g (~₹10) — high dietary fiber & sustained energy.
                {'\n'}• Fresh Paneer: 18g protein per 100g (~₹35) — slow-digesting micellar casein.
              </Text>
            </ExpandableCard>
          </View>
        )}

        {/* ================= TAB 4: COMMON UI ================= */}
        {activeTab === 'common' && (
          <View style={styles.section}>
            <SectionHeader title="Common UI Primitives" />

            <Card padding="md" style={{ marginBottom: spacing.md }}>
              <Text style={styles.groupLabel}>Progress Indicator:</Text>
              <ProgressBar progress={0.7} height={8} />

              <Divider label="Button Variants" />
              <Text style={styles.groupLabel}>Button Variants:</Text>
              <View style={styles.buttonGrid}>
                <Button title="Primary" variant="primary" size="sm" onPress={() => setToastMessage('Primary Pressed')} />
                <Button title="Secondary" variant="secondary" size="sm" onPress={() => setToastMessage('Secondary Pressed')} />
                <Button title="Outline" variant="outline" size="sm" onPress={() => setToastMessage('Outline Pressed')} />
                <Button title="Danger" variant="danger" size="sm" onPress={() => setToastMessage('Danger Action')} />
              </View>

              <Divider label="Badge Statuses" />
              <View style={styles.badgeRow}>
                <Badge label="Accent Green" variant="accent" />
                <Badge label="Success" variant="success" />
                <Badge label="Warning" variant="warning" />
                <Badge label="Danger" variant="danger" />
                <Badge label="Neutral" variant="neutral" />
              </View>

              <Divider label="Offline Banner Control" />
              <Button
                title={showOfflineBanner ? 'Hide Offline Banner' : 'Simulate Offline Banner'}
                variant="outline"
                size="sm"
                onPress={() => setShowOfflineBanner((prev) => !prev)}
              />
            </Card>

            <Card padding="md">
              <Text style={styles.groupLabel}>Avatars & Initials:</Text>
              <View style={styles.avatarRow}>
                <Avatar name="Sanjeev Bhawra" size="sm" />
                <Avatar name="FitShift Admin" size="md" />
                <Avatar name="Coach Rahul" size="lg" />
              </View>
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Reusable Native Bottom Sheet Preview */}
      <BottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        title="Late / Tired Routine"
        subtitle="15-minute gentle mobility activator"
        footer={
          <Button
            title="Activate Gentle 15-Min Flow"
            onPress={() => {
              setIsBottomSheetVisible(false);
              setToastMessage('Late / Tired routine activated');
            }}
            variant="primary"
          />
        }
      >
        <Text style={styles.modalText}>
          Had a late shift or exhausting commute?
          {'\n\n'}
          FitShift adapts by switching today's heavy session into a 15-minute restorative flow (Child's Pose, Cat-Cow, Deep Hip Opener) and recommends sleeping 30 minutes earlier.
        </Text>
      </BottomSheet>

      {/* Reusable Centered Modal Preview */}
      <Modal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        title="Edit Active Plan"
        description="Quickly adjust your parameters without redoing the full onboarding wizard."
        footer={
          <View style={styles.modalFooterRow}>
            <Button
              title="Cancel"
              onPress={() => setIsModalVisible(false)}
              variant="ghost"
              size="sm"
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title="Save Changes"
              onPress={() => {
                setIsModalVisible(false);
                setToastMessage('Plan updated successfully');
              }}
              variant="primary"
              size="sm"
              style={{ flex: 1 }}
            />
          </View>
        }
      >
        <Text style={styles.modalText}>
          You can toggle your training environment between Home and Gym or fine-tune your daily food budget from ₹{sampleBudget}/day.
        </Text>
      </Modal>

      {/* Toast Notification Container */}
      <Toast
        message={toastMessage || ''}
        visible={Boolean(toastMessage)}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  topTabs: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  section: {
    gap: spacing.xs,
  },
  groupLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
  },
  buttonStack: {
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginVertical: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  selectedDayNote: {
    fontSize: typography.sizes.xs,
    color: colors.primaryDark,
    fontWeight: typography.weights.semibold,
    marginTop: spacing.xs,
    marginLeft: 2,
  },
  expandText: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    lineHeight: typography.lineHeights.sm,
  },
  modalText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    lineHeight: typography.lineHeights.base,
  },
  modalFooterRow: {
    flexDirection: 'row',
    width: '100%',
  },
});

export default DesignSystemShowcase;
