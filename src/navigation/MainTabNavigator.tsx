import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  BackHandler,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePlan, MainNavTab } from '../context/PlanContext';
import {
  OverviewScreen,
  WorkoutTabScreen,
  DietTabScreen,
  ScheduleTabScreen,
  AICoachTabScreen,
} from '../screens/Dashboard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { borderRadius } from '../theme/borderRadius';

export interface MainTabNavigatorProps {
  onBackToWelcome?: () => void;
}

export const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({
  onBackToWelcome,
}) => {
  const { activeTab, setActiveTab } = usePlan();
  const insets = useSafeAreaInsets();

  const tabs: { id: MainNavTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '🏠' },
    { id: 'workout', label: 'Workout', icon: '🏋️' },
    { id: 'diet', label: 'Diet', icon: '🥗' },
    { id: 'schedule', label: 'Schedule', icon: '⏱️' },
    { id: 'ai', label: 'AI Coach', icon: '🤖' },
  ];

  // Android hardware back button handler
  useEffect(() => {
    const handleHardwareBackPress = () => {
      if (activeTab !== 'overview') {
        setActiveTab('overview');
        return true;
      }
      if (onBackToWelcome) {
        onBackToWelcome();
        return true;
      }
      return false;
    };

    const sub = BackHandler.addEventListener(
      'hardwareBackPress',
      handleHardwareBackPress
    );
    return () => sub.remove();
  }, [activeTab, setActiveTab, onBackToWelcome]);

  const handleTabPress = (tabId: MainNavTab) => {
    setActiveTab(tabId);
  };

  return (
    <View style={styles.container}>
      {/* Screen Container */}
      <View style={styles.screenContainer}>
        {activeTab === 'overview' && (
          <OverviewScreen
            onNavigateTab={handleTabPress}
            onResetPlan={onBackToWelcome}
          />
        )}
        {activeTab === 'workout' && <WorkoutTabScreen />}
        {activeTab === 'diet' && <DietTabScreen />}
        {activeTab === 'schedule' && <ScheduleTabScreen />}
        {activeTab === 'ai' && <AICoachTabScreen />}
      </View>

      {/* Native-Style Bottom Tab Navigation Bar */}
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 8 : 16),
          },
        ]}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => handleTabPress(tab.id)}
              style={styles.tabItem}
            >
              <View
                style={[
                  styles.tabIconContainer,
                  isActive && styles.tabIconContainerActive,
                ]}
              >
                <Text style={styles.tabIcon}>{tab.icon}</Text>
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopColor: colors.borderSubtle,
    borderTopWidth: 1,
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.sm,
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxs,
  },
  tabIconContainer: {
    width: 38,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.full,
  },
  tabIconContainerActive: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    fontSize: 18,
  },
  tabLabel: {
    ...typography.caption,
    fontSize: 10,
    fontWeight: '600',
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
});
