import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { Badge } from '../common/Badge';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface TabSelectorProps {
  tabs: TabItem[];
  activeTab: string;
  onSelectTab: (id: string) => void;
  scrollable?: boolean;
  style?: ViewStyle;
}

export const TabSelector: React.FC<TabSelectorProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  scrollable = false,
  style,
}) => {
  const renderTab = (tab: TabItem) => {
    const isActive = tab.id === activeTab;
    return (
      <TouchableOpacity
        key={tab.id}
        activeOpacity={0.75}
        onPress={() => onSelectTab(tab.id)}
        style={[
          styles.tab,
          scrollable && styles.scrollableTab,
          isActive && styles.activeTab,
        ]}
      >
        {tab.icon ? <View style={styles.iconBox}>{tab.icon}</View> : null}
        <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
          {tab.label}
        </Text>
        {tab.badge ? (
          <Badge
            label={tab.badge}
            variant={isActive ? 'accent' : 'neutral'}
            size="sm"
            style={styles.tabBadge}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, style]}
      >
        {tabs.map(renderTab)}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.fixedContainer, style]}>
      {tabs.map(renderTab)}
    </View>
  );
};

const styles = StyleSheet.create({
  fixedContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.xl,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  scrollableTab: {
    flex: 0,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
  },
  activeTab: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  iconBox: {
    marginRight: spacing.xs,
  },
  tabLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
  },
  activeTabLabel: {
    color: colors.primaryDark,
    fontWeight: typography.weights.bold,
  },
  tabBadge: {
    marginLeft: spacing.xs,
  },
});

export default TabSelector;
