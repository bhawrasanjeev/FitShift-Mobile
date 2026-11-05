import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, BackHandler } from 'react-native';
import { usePlan } from '../context/PlanContext';
import { OnboardingData } from '../types';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { OnboardingWizard } from '../components/onboarding/OnboardingWizard';
import { GeneratingPlanScreen } from '../screens/GeneratingPlanScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { DesignSystemShowcase } from '../screens/DesignSystemShowcase';
import { ApiValidationConsole } from '../screens/ApiValidationConsole';
import { LoadingState } from '../components/common/LoadingState';
import { ProfileScreen, SettingsScreen } from '../screens/Profile';
import { colors } from '../theme/colors';

export type RootScreen =
  | 'welcome'
  | 'onboarding'
  | 'generating'
  | 'main'
  | 'showcase'
  | 'api_console'
  | 'profile'
  | 'settings';

export const RootNavigator: React.FC = () => {
  const { hasPlan, isInitializing, userProfile } = usePlan();
  const [currentScreen, setCurrentScreen] = useState<RootScreen>('welcome');
  const [previousScreen, setPreviousScreen] = useState<RootScreen>('welcome');
  const [pendingOnboardingData, setPendingOnboardingData] = useState<OnboardingData | null>(null);

  // If session restored and user has a plan, land on the dashboard
  useEffect(() => {
    if (!isInitializing && hasPlan) {
      setCurrentScreen('main');
    }
  }, [isInitializing, hasPlan]);

  // Handle hardware back for sub-screens
  useEffect(() => {
    const handleHardwareBackPress = () => {
      if (currentScreen === 'settings') {
        setCurrentScreen('profile');
        return true;
      }
      if (currentScreen === 'profile') {
        setCurrentScreen('main');
        return true;
      }
      if (currentScreen === 'showcase' || currentScreen === 'api_console') {
        setCurrentScreen(previousScreen);
        return true;
      }
      if (currentScreen === 'main') {
        setCurrentScreen('welcome');
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', handleHardwareBackPress);
    return () => sub.remove();
  }, [currentScreen, previousScreen]);

  const navigateTo = useCallback((screen: RootScreen) => {
    setCurrentScreen((curr) => {
      setPreviousScreen(curr);
      return screen;
    });
  }, []);

  const handleStartOnboarding = useCallback(() => {
    navigateTo('onboarding');
  }, [navigateTo]);

  const handleCancelOnboarding = useCallback(() => {
    navigateTo('welcome');
  }, [navigateTo]);

  const handleCompleteOnboarding = useCallback((data: OnboardingData) => {
    setPendingOnboardingData(data);
    navigateTo('generating');
  }, [navigateTo]);

  const handleGenerationSuccess = useCallback(() => {
    navigateTo('main');
  }, [navigateTo]);

  const handleGenerationCancel = useCallback(() => {
    navigateTo('onboarding');
  }, [navigateTo]);

  const handleResetPlan = useCallback(() => {
    navigateTo('welcome');
  }, [navigateTo]);

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingState message="Restoring saved FitShift routine..." />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentScreen === 'welcome' && (
        <WelcomeScreen
          onStartOnboarding={handleStartOnboarding}
          onViewActivePlan={() => navigateTo('main')}
          onOpenShowcase={() => navigateTo('showcase')}
          onOpenApiConsole={() => navigateTo('api_console')}
        />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingWizard
          initialData={pendingOnboardingData || userProfile}
          onComplete={handleCompleteOnboarding}
          onCancel={handleCancelOnboarding}
        />
      )}

      {currentScreen === 'generating' && (
        <GeneratingPlanScreen
          data={pendingOnboardingData || userProfile}
          onSuccess={handleGenerationSuccess}
          onCancel={handleGenerationCancel}
        />
      )}

      {currentScreen === 'main' && (
        <MainTabNavigator
          onBackToWelcome={handleResetPlan}
          onOpenProfile={() => navigateTo('profile')}
        />
      )}

      {currentScreen === 'profile' && (
        <View style={styles.subScreenContainer}>
          <ProfileScreen
            onBack={() => navigateTo('main')}
            onOpenSettings={() => navigateTo('settings')}
          />
        </View>
      )}

      {currentScreen === 'settings' && (
        <View style={styles.subScreenContainer}>
          <SettingsScreen
            onBack={() => navigateTo('profile')}
            onResetPlan={handleResetPlan}
          />
        </View>
      )}

      {currentScreen === 'showcase' && (
        <View style={styles.subScreenContainer}>
          <DesignSystemShowcase onBack={() => setCurrentScreen(previousScreen)} />
        </View>
      )}

      {currentScreen === 'api_console' && (
        <View style={styles.subScreenContainer}>
          <ApiValidationConsole onBack={() => setCurrentScreen(previousScreen)} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subScreenContainer: {
    flex: 1,
  },
});
