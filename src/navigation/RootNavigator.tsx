import React, { useState, useEffect } from 'react';
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
import { colors } from '../theme/colors';

export type RootScreen =
  | 'welcome'
  | 'onboarding'
  | 'generating'
  | 'main'
  | 'showcase'
  | 'api_console';

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

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingState message="Restoring saved FitShift routine..." />
      </View>
    );
  }

  const navigateTo = (screen: RootScreen) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
  };

  const handleStartOnboarding = () => {
    navigateTo('onboarding');
  };

  const handleCancelOnboarding = () => {
    navigateTo('welcome');
  };

  const handleCompleteOnboarding = (data: OnboardingData) => {
    setPendingOnboardingData(data);
    navigateTo('generating');
  };

  const handleGenerationSuccess = () => {
    navigateTo('main');
  };

  const handleGenerationCancel = () => {
    navigateTo('onboarding');
  };

  const handleResetPlan = () => {
    navigateTo('welcome');
  };

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
        <MainTabNavigator onBackToWelcome={handleResetPlan} />
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
