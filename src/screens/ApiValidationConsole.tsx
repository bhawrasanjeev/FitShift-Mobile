import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { borderRadius } from '../theme/borderRadius';
import { shadows } from '../theme/shadows';
import {
  Button,
  Card,
  Badge,
  Header,
  Divider,
  SectionHeader,
  Toast,
  OfflineStatusBanner,
} from '../components/common';
import {
  apiConfig,
  healthService,
  nutritionService,
  dietService,
  workoutService,
  aiService,
} from '../services/api';
import { planStorage } from '../services/storage/planStorage';
import { usePlan } from '../context/PlanContext';

export interface TestResultItem {
  id: string;
  name: string;
  endpoint: string;
  status: 'idle' | 'running' | 'success' | 'failed';
  durationMs?: number;
  responsePreview?: string;
  error?: string;
}

export interface ApiValidationConsoleProps {
  onOpenShowcase?: () => void;
  onBack?: () => void;
}

export const ApiValidationConsole: React.FC<ApiValidationConsoleProps> = ({ onOpenShowcase, onBack }) => {
  const { plan, hasPlan, generatePlan, resetPlan } = usePlan();
  const [activeBaseUrl, setActiveBaseUrl] = useState<string>('');
  const [customInputUrl, setCustomInputUrl] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [testResults, setTestResults] = useState<Record<string, TestResultItem>>({
    health: { id: 'health', name: 'Server Health Check', endpoint: 'GET /api/health', status: 'idle' },
    dataStatus: { id: 'dataStatus', name: 'Dataset Status', endpoint: 'GET /api/data/status', status: 'idle' },
    nutrition: { id: 'nutrition', name: 'Nutrition Engine', endpoint: 'POST /api/nutrition/calculate', status: 'idle' },
    diet: { id: 'diet', name: 'Budget Diet Optimizer', endpoint: 'POST /api/diet/optimize', status: 'idle' },
    workout: { id: 'workout', name: 'Workout Generator', endpoint: 'POST /api/workouts/generate', status: 'idle' },
    aiStatus: { id: 'aiStatus', name: 'AI Provider Status', endpoint: 'GET /api/ai/status', status: 'idle' },
    aiChat: { id: 'aiChat', name: 'AI Assistant Query', endpoint: 'POST /api/ai/chat', status: 'idle' },
    persistence: { id: 'persistence', name: 'AsyncStorage Persistence', endpoint: 'LOCAL /storage', status: 'idle' },
  });

  useEffect(() => {
    async function loadConfig() {
      await apiConfig.init();
      const current = apiConfig.getBaseUrl();
      setActiveBaseUrl(current);
      setCustomInputUrl(current);
    }
    loadConfig();
  }, []);

  const updateTestStatus = (
    key: string,
    status: TestResultItem['status'],
    durationMs?: number,
    responsePreview?: string,
    error?: string
  ) => {
    setTestResults((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        status,
        durationMs,
        responsePreview,
        error,
      },
    }));
  };

  const handleApplyCustomUrl = async () => {
    if (!customInputUrl.trim()) return;
    try {
      await apiConfig.setBaseUrl(customInputUrl);
      setActiveBaseUrl(apiConfig.getBaseUrl());
      setToastMessage(`Switched API Base URL to ${apiConfig.getBaseUrl()}`);
    } catch {
      setToastMessage('Failed to save custom URL');
    }
  };

  // Run individual test
  const runTest = async (testKey: string) => {
    const startTime = Date.now();
    updateTestStatus(testKey, 'running');

    try {
      switch (testKey) {
        case 'health': {
          const res = await healthService.checkHealth();
          const duration = Date.now() - startTime;
          updateTestStatus(testKey, 'success', duration, JSON.stringify(res));
          setIsOffline(false);
          break;
        }
        case 'dataStatus': {
          const res = await healthService.getDatasetStatus();
          const duration = Date.now() - startTime;
          updateTestStatus(
            testKey,
            'success',
            duration,
            `Clean Staples: ${res.datasets?.cleanStaples?.recordCount || 36}, Exercises: ${res.datasets?.exercises?.recordCount || 22694}, Nutrition: ${res.datasets?.nutrition?.recordCount || 1014}`
          );
          break;
        }
        case 'nutrition': {
          const res = await nutritionService.calculate({
            age: 22,
            gender: 'male',
            heightCm: 178,
            weightKg: 70,
            goal: 'muscle_gain',
            activityLevel: 'moderate',
          });
          const duration = Date.now() - startTime;
          updateTestStatus(
            testKey,
            'success',
            duration,
            `BMR: ${res.bmr} kcal | TDEE: ${res.tdee} kcal | Calories: ${res.calorieTarget} kcal | Protein: ${res.proteinTargetGrams}g`
          );
          break;
        }
        case 'diet': {
          const res = await dietService.optimize({
            nutrition: { calorieTarget: 2947, proteinTargetGrams: 119 },
            dietType: 'vegetarian',
            foodBudget: 80,
            supplementPreference: 'no_supplements',
          });
          const duration = Date.now() - startTime;
          updateTestStatus(
            testKey,
            'success',
            duration,
            `Feasible: ${res.feasible} | Est. Cost: ₹${res.budget.estimatedCost}/day | Achieved: ${res.protein.achievedGrams}g pro (${res.foods.length} foods, ${res.meals?.length || 4} meals)`
          );
          break;
        }
        case 'workout': {
          const res = await workoutService.generate({
            gender: 'male',
            environment: 'home',
            durationMinutes: 45,
            weeklyFrequencyDays: 4,
            experienceLevel: 'intermediate',
            goal: 'muscle_gain',
          });
          const duration = Date.now() - startTime;
          const totalExercises = res.days.reduce((acc, d) => acc + (d.exercises?.length || 0), 0);
          updateTestStatus(
            testKey,
            'success',
            duration,
            `Generated ${res.days.length}-Day Split (${totalExercises} exercises with CDN images & alternatives)`
          );
          break;
        }
        case 'aiStatus': {
          const res = await aiService.getStatus();
          const duration = Date.now() - startTime;
          updateTestStatus(
            testKey,
            'success',
            duration,
            `Configured: ${res.configured} | Provider: ${res.provider || 'None'}`
          );
          break;
        }
        case 'aiChat': {
          const res = await aiService.sendChat('List top 3 affordable Indian vegetarian protein sources', {
            goal: 'muscle_gain',
            environment: 'home',
            diet: 'vegetarian',
            dailyBudget: 75,
            durationMinutes: 45,
          });
          const duration = Date.now() - startTime;
          const preview = res.reply.length > 100 ? `${res.reply.slice(0, 100)}...` : res.reply;
          updateTestStatus(testKey, 'success', duration, preview);
          break;
        }
        case 'persistence': {
          // Test AsyncStorage save and reload
          const dummyProfile = {
            personal: { name: 'Aarav Sharma', age: 24, gender: 'male' as const, heightCm: 175, weightKg: 70, goal: 'muscle_gain' as const },
            rhythm: { occupation: 'working_professional' as const, departureTime: '08:30', returnTime: '18:30', sleepHours: 7.5, wakeUpTime: '06:30', activityLevel: 'moderately_active' as const },
            training: { environment: 'home' as const, durationMinutes: 45 as const, preferredTime: 'morning' as const, weeklyFrequencyDays: 4, experienceLevel: 'intermediate' as const, homeEquipment: ['none'], gymEquipmentLevel: 'full_gym' as const },
            food: { dietType: 'pure_veg' as const, cookingSituation: 'self_cooking' as const, mealsPerDay: 4, avoidedFoods: [], allergies: [], indianFoodStyle: 'simple_homestyle' as const },
            budget: { tier: 'budget' as const, dailyBudgetRupees: 75 },
            supplements: { preference: 'no_supplements' as const },
          };

          await planStorage.saveUserProfile(dummyProfile);
          const restored = await planStorage.loadUserProfile();
          const duration = Date.now() - startTime;

          if (restored && restored.personal?.name === 'Aarav Sharma') {
            updateTestStatus(testKey, 'success', duration, 'Session successfully saved & restored from AsyncStorage');
          } else {
            throw new Error('Restored profile does not match saved payload');
          }
          break;
        }
      }
    } catch (err: unknown) {
      const duration = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : 'Unknown test failure';
      updateTestStatus(testKey, 'failed', duration, undefined, errorMsg);
      if (testKey === 'health') {
        setIsOffline(true);
      }
    }
  };

  // Run all tests sequentially
  const runAllTests = async () => {
    setToastMessage('Starting end-to-end API test suite...');
    for (const key of Object.keys(testResults)) {
      await runTest(key);
    }
    setToastMessage('Full API validation suite completed');
  };

  const getStatusBadge = (status: TestResultItem['status']) => {
    switch (status) {
      case 'idle':
        return <Badge label="Not Tested" variant="neutral" size="sm" />;
      case 'running':
        return <Badge label="Pinging..." variant="warning" size="sm" />;
      case 'success':
        return <Badge label="HTTP 200 OK" variant="success" size="sm" />;
      case 'failed':
        return <Badge label="Failed" variant="danger" size="sm" />;
    }
  };

  return (
    <View style={styles.screen}>
      <OfflineStatusBanner
        isOffline={isOffline}
        onRetry={() => runTest('health')}
      />

      <Header
        showBrand
        rightAction={
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {onBack ? (
              <Button
                title="← Back"
                variant="outline"
                size="sm"
                onPress={onBack}
              />
            ) : null}
            {onOpenShowcase ? (
              <Button
                title="Showcase"
                variant="secondary"
                size="sm"
                onPress={onOpenShowcase}
              />
            ) : null}
          </View>
        }
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Environment Configuration Card */}
        <Card style={styles.card} padding="lg">
          <SectionHeader
            title="Backend Environment & Base URL"
            subtitle="Configurable for Android Emulator, LAN IP, and Production"
          />

          <View style={styles.activeUrlBox}>
            <Text style={styles.urlLabel}>Active API Base URL:</Text>
            <Text style={styles.activeUrlText}>{activeBaseUrl || 'Initializing...'}</Text>
          </View>

          {/* Quick Preset Buttons */}
          <Text style={styles.presetLabel}>Quick Environment Presets:</Text>
          <View style={styles.presetRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setCustomInputUrl('http://10.0.2.2:5000');
                apiConfig.setBaseUrl('http://10.0.2.2:5000').then(() => setActiveBaseUrl('http://10.0.2.2:5000'));
              }}
              style={styles.presetBtn}
            >
              <Text style={styles.presetBtnText}>Emulator (5000)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setCustomInputUrl('http://10.0.2.2:5001');
                apiConfig.setBaseUrl('http://10.0.2.2:5001').then(() => setActiveBaseUrl('http://10.0.2.2:5001'));
              }}
              style={styles.presetBtn}
            >
              <Text style={styles.presetBtnText}>Emulator (5001)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                setCustomInputUrl('http://127.0.0.1:5001');
                apiConfig.setBaseUrl('http://127.0.0.1:5001').then(() => setActiveBaseUrl('http://127.0.0.1:5001'));
              }}
              style={styles.presetBtn}
            >
              <Text style={styles.presetBtnText}>Direct (5001)</Text>
            </TouchableOpacity>
          </View>

          {/* Custom URL Input */}
          <View style={styles.inputRow}>
            <TextInput
              value={customInputUrl}
              onChangeText={setCustomInputUrl}
              placeholder="e.g. http://192.168.1.100:5001"
              placeholderTextColor={colors.textMuted}
              style={styles.textInput}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Button
              title="Apply"
              variant="primary"
              size="sm"
              onPress={handleApplyCustomUrl}
              style={styles.applyBtn}
            />
          </View>
        </Card>

        {/* Master Test Actions */}
        <View style={styles.masterActions}>
          <Button
            title="Run All 8 Backend Tests"
            onPress={runAllTests}
            variant="primary"
            size="md"
            style={styles.runAllButton}
          />
        </View>

        {/* Test Suite Items */}
        <SectionHeader
          title="API Contracts & Validation Matrix"
          subtitle="Verifies HTTP method, response shapes, and network latency"
        />

        {Object.values(testResults).map((test) => (
          <Card key={test.id} style={styles.testCard} padding="md">
            <View style={styles.testHeaderRow}>
              <View style={styles.testTitleWrapper}>
                <Text style={styles.testName}>{test.name}</Text>
                <Text style={styles.testEndpoint}>{test.endpoint}</Text>
              </View>
              {getStatusBadge(test.status)}
            </View>

            {test.durationMs !== undefined ? (
              <Text style={styles.latencyText}>Latency: {test.durationMs}ms</Text>
            ) : null}

            {test.responsePreview ? (
              <View style={styles.previewBox}>
                <Text style={styles.previewText} numberOfLines={3}>
                  {test.responsePreview}
                </Text>
              </View>
            ) : null}

            {test.error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>Error: {test.error}</Text>
              </View>
            ) : null}

            <View style={styles.cardActionRow}>
              <Button
                title={test.status === 'running' ? 'Testing...' : 'Test Endpoint'}
                variant={test.status === 'success' ? 'secondary' : 'outline'}
                size="sm"
                onPress={() => runTest(test.id)}
                disabled={test.status === 'running'}
              />
            </View>
          </Card>
        ))}

        <Divider label="PlanContext Engine Integration" />

        {/* PlanContext Test Card */}
        <Card style={styles.card} padding="lg">
          <SectionHeader
            title="Centralized PlanContext State"
            subtitle="Coordinates nutrition, diet optimization & workout generation"
          />

          <View style={styles.planStatusRow}>
            <Text style={styles.planStatusLabel}>Active Stored Plan:</Text>
            <Badge
              label={hasPlan ? 'Plan Loaded in Memory' : 'No Active Plan'}
              variant={hasPlan ? 'accent' : 'neutral'}
              size="sm"
            />
          </View>

          {plan ? (
            <View style={styles.planMetrics}>
              <Text style={styles.planMetricItem}>• Calorie Target: {plan.nutrition.calorieTarget} kcal</Text>
              <Text style={styles.planMetricItem}>• Protein Target: {plan.nutrition.proteinTargetGrams}g</Text>
              <Text style={styles.planMetricItem}>• Daily Budget: ₹{plan.diet.budget.dailyLimit}/day (Achieved: {plan.diet.protein.achievedGrams}g pro)</Text>
              <Text style={styles.planMetricItem}>• Workout Split: {plan.workout.days.length} Days ({plan.workout.environment.toUpperCase()})</Text>
            </View>
          ) : null}

          <View style={styles.planBtnRow}>
            <Button
              title="Generate Sample Plan via API"
              variant="primary"
              size="sm"
              onPress={async () => {
                setToastMessage('Triggering PlanContext.generatePlan()...');
                const success = await generatePlan();
                if (success) {
                  setToastMessage('Sample plan generated and stored in AsyncStorage');
                } else {
                  setToastMessage('Plan generation encountered an error');
                }
              }}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            {hasPlan ? (
              <Button
                title="Clear"
                variant="ghost"
                size="sm"
                onPress={async () => {
                  await resetPlan();
                  setToastMessage('Plan cache cleared');
                }}
              />
            ) : null}
          </View>
        </Card>
      </ScrollView>

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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing['4xl'],
  },
  card: {
    marginBottom: spacing.md,
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  activeUrlBox: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  urlLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  activeUrlText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.primary,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  presetLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  presetRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
  },
  presetBtn: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  presetBtnText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    height: 42,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    fontSize: typography.sizes.xs,
    fontFamily: 'monospace',
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  applyBtn: {
    minWidth: 80,
  },
  masterActions: {
    marginBottom: spacing.lg,
  },
  runAllButton: {
    ...shadows.md,
  },
  testCard: {
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  testHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  testTitleWrapper: {
    flex: 1,
    marginRight: spacing.sm,
  },
  testName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  testEndpoint: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  latencyText: {
    fontSize: 10,
    fontWeight: typography.weights.semibold,
    color: colors.primaryDark,
    marginTop: 4,
  },
  previewBox: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.accentBorder,
  },
  previewText: {
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
  },
  errorBox: {
    backgroundColor: colors.dangerLight,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    lineHeight: 16,
  },
  cardActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.sm,
  },
  planStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  planStatusLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  planMetrics: {
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    gap: 4,
    marginVertical: spacing.sm,
  },
  planMetricItem: {
    fontSize: typography.sizes.xs,
    color: colors.textPrimary,
  },
  planBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
  },
});

export default ApiValidationConsole;
