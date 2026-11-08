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
import { Icon, IconName } from '../components/common';

export interface MainTabNavigatorProps {
  onBackToWelcome?: () => void;
  onOpenProfile?: () => void;
}

export const MainTabNavigator: React.FC<MainTabNavigatorProps> = ({
  onBackToWelcome,
  onOpenProfile,
}) => {
  const { activeTab, setActiveTab } = usePlan();
  const insets = useSafeAreaInsets();

  const tabs: { id: MainNavTab; label: string; iconName: IconName }[] = [
    { id: 'overview', label: 'Overview', iconName: 'home' },
    { id: 'workout', label: 'Workout', iconName: 'dumbbell' },
    { id: 'diet', label: 'Diet', iconName: 'utensils' },
    { id: 'schedule', label: 'Schedule', iconName: 'clock' },
    { id: 'ai', label: 'AI Coach', iconName: 'sparkles' },
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
            onOpenProfile={onOpenProfile}
          />
        )}
        {activeTab === 'workout' && <WorkoutTabScreen />}
        {activeTab === 'diet' && <DietTabScreen />}
        {activeTab === 'schedule' && <ScheduleTabScreen />}
        {activeTab === 'ai' && <AICoachTabScreen />}
      </View>

      {/* Floating Capsule Bottom Tab Navigation Bar */}
      <View
        style={[
          styles.bottomBarWrapper,
          {
            paddingBottom: Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 16),
          },
        ]}
      >
        <View style={styles.tabBarPill}>
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
                  <Icon
                    name={tab.iconName}
                    size={20}
                    color={isActive ? colors.primaryDark : colors.textMuted}
                  />
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
  bottomBarWrapper: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 6,
  },
  tabBarPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    paddingVertical: 6,
    paddingHorizontal: 4,
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  tabIconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    overflow: 'hidden',
  },
  tabIconContainerActive: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
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
    fontWeight: '700',
  },
});
