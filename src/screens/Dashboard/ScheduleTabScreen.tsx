import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Icon, IconName } from '../../components/common/Icon';
import { RecoveryScreen } from './RecoveryScreen';
import { generateUserSchedule } from '../../utils/schedule';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export type ScheduleSubView = 'rhythm' | 'recovery';

export const ScheduleTabScreen: React.FC = () => {
  const { plan, userProfile } = usePlan();
  const [activeSubView, setActiveSubView] = useState<ScheduleSubView>('rhythm');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (!plan) {
    return (
      <View style={styles.screen}>
        <Header title="24-Hour Rhythm" showBrand={false} />
        <View style={styles.emptyContainer}>
          <Icon name="clock" size={44} color={colors.primary} />
          <Text style={styles.emptyTitle}>No Schedule Active</Text>
          <Text style={styles.emptySub}>
            Complete onboarding to align workout and meal windows with your daily transit.
          </Text>
        </View>
      </View>
    );
  }

  const events = generateUserSchedule(userProfile);

  const filteredEvents = activeFilter === 'all'
    ? events
    : events.filter((e) => e.type === activeFilter);

  const filterTabs = [
    { id: 'all', label: 'All (24h)' },
    { id: 'workout', label: 'Workout' },
    { id: 'meal', label: 'Meals' },
    { id: 'work', label: 'Transit' },
    { id: 'sleep', label: 'Sleep' },
  ];

  const typeConfig: Record<
    string,
    { badgeText: string; badgeVariant: 'accent' | 'neutral' | 'warning' | 'success'; iconName: IconName }
  > = {
    workout: { badgeText: 'Training', badgeVariant: 'accent', iconName: 'dumbbell' },
    meal: { badgeText: 'Nutrition', badgeVariant: 'warning', iconName: 'utensils' },
    work: { badgeText: 'Occupational', badgeVariant: 'neutral', iconName: 'briefcase' },
    sleep: { badgeText: 'Recovery', badgeVariant: 'accent', iconName: 'moon' },
    recovery: { badgeText: 'Hydration', badgeVariant: 'success', iconName: 'droplet' },
  };

  return (
    <View style={styles.screen}>
      <Header
        title="24-Hour Rhythm"
        subtitle={`Wake: ${userProfile.rhythm.wakeUpTime || '06:30'} • Sleep: ${userProfile.rhythm.sleepHours}h`}
        showBrand={false}
        rightAction={
          <Badge
            label={userProfile.rhythm.occupation.replace(/_/g, ' ')}
            variant="neutral"
            size="sm"
          />
        }
      />

      {/* Segmented Sub-Navigation Bar */}
      <View style={styles.subViewTabBar}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveSubView('rhythm')}
          style={[
            styles.subViewTab,
            activeSubView === 'rhythm' && styles.subViewTabActive,
          ]}
        >
          <Icon
            name="clock"
            size={14}
            color={activeSubView === 'rhythm' ? colors.primaryDark : colors.textMuted}
          />
          <Text
            style={[
              styles.subViewTabText,
              activeSubView === 'rhythm' && styles.subViewTabTextActive,
            ]}
          >
            Daily Schedule
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setActiveSubView('recovery')}
          style={[
            styles.subViewTab,
            activeSubView === 'recovery' && styles.subViewTabActive,
          ]}
        >
          <Icon
            name="moon"
            size={14}
            color={activeSubView === 'recovery' ? colors.primaryDark : colors.textMuted}
          />
          <Text
            style={[
              styles.subViewTabText,
              activeSubView === 'recovery' && styles.subViewTabTextActive,
            ]}
          >
            Sleep & Recovery
          </Text>
        </TouchableOpacity>
      </View>

      {activeSubView === 'recovery' ? (
        <RecoveryScreen
          showHeader={false}
          onBackToSchedule={() => setActiveSubView('rhythm')}
        />
      ) : (
        <View style={styles.tabContent}>
          {/* Filter Chips Bar */}
          <View style={styles.filterBar}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {filterTabs.map((tab) => {
                const isSelected = activeFilter === tab.id;
                return (
                  <TouchableOpacity
                    key={tab.id}
                    activeOpacity={0.7}
                    onPress={() => setActiveFilter(tab.id)}
                    style={[
                      styles.filterChip,
                      isSelected ? styles.filterChipSelected : styles.filterChipUnselected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        isSelected && styles.filterChipTextSelected,
                      ]}
                    >
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Rhythm Anchors Card */}
            <View style={styles.anchorsCard}>
              <Text style={styles.anchorsTitle}>CIRCADIAN & TRANSIT ANCHORS</Text>
              <View style={styles.anchorsGrid}>
                <View style={styles.anchorCol}>
                  <Text style={styles.anchorLabel}>WAKE UP</Text>
                  <Text style={styles.anchorVal}>{userProfile.rhythm.wakeUpTime || '06:30'}</Text>
                </View>
                <View style={styles.anchorVDivider} />
                <View style={styles.anchorCol}>
                  <Text style={styles.anchorLabel}>DEPARTURE</Text>
                  <Text style={styles.anchorVal}>{userProfile.rhythm.departureTime || '08:30'}</Text>
                </View>
                <View style={styles.anchorVDivider} />
                <View style={styles.anchorCol}>
                  <Text style={styles.anchorLabel}>RETURN</Text>
                  <Text style={styles.anchorVal}>{userProfile.rhythm.returnTime || '18:30'}</Text>
                </View>
                <View style={styles.anchorVDivider} />
                <View style={styles.anchorCol}>
                  <Text style={styles.anchorLabel}>SLEEP</Text>
                  <Text style={styles.anchorVal}>{userProfile.rhythm.sleepHours} hrs</Text>
                </View>
              </View>
            </View>

            {/* Chronological Timeline */}
            <View style={styles.timelineList}>
              {filteredEvents.map((evt, idx) => {
                const conf = typeConfig[evt.type] || {
                  badgeText: evt.type,
                  badgeVariant: 'neutral' as const,
                  iconName: 'clock' as const,
                };

                return (
                  <View key={evt.id} style={styles.timelineItem}>
                    <View style={styles.timelineLeftCol}>
                      <Text style={styles.timelineTimeText}>{evt.time}</Text>
                      {idx < filteredEvents.length - 1 ? (
                        <View style={styles.timelineLine} />
                      ) : null}
                    </View>

                    <View style={styles.timelineCard}>
                      <View style={styles.timelineCardHeader}>
                        <View style={styles.timelineTitleRow}>
                          <Icon name={conf.iconName} size={15} color={colors.primary} />
                          <Text style={styles.timelineTitle}>{evt.title}</Text>
                        </View>
                        <Badge
                          label={conf.badgeText}
                          variant={conf.badgeVariant}
                          size="sm"
                        />
                      </View>
                      <Text style={styles.timelineDesc}>{evt.description}</Text>
                      {evt.duration ? (
                        <Text style={styles.timelineDuration}>Duration: {evt.duration}</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabContent: {
    flex: 1,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  emptySub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 280,
  },
  subViewTabBar: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    gap: spacing.xs,
  },
  subViewTab: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.lg,
  },
  subViewTabActive: {
    backgroundColor: colors.primaryLight,
  },
  subViewTabText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textMuted,
    fontSize: 11,
  },
  subViewTabTextActive: {
    color: colors.primaryDark,
    fontWeight: '800',
  },
  filterBar: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    paddingVertical: spacing.xs,
  },
  filterScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  filterChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipUnselected: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },
  filterChipText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    fontSize: 11,
  },
  filterChipTextSelected: {
    color: colors.surface,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
  },
  anchorsCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.xs,
  },
  anchorsTitle: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  anchorsGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  anchorCol: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  anchorLabel: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  anchorVal: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  anchorVDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.borderSubtle,
  },
  timelineList: {
    gap: spacing.xs,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  timelineLeftCol: {
    width: 64,
    alignItems: 'center',
  },
  timelineTimeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
    fontSize: 11,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.borderSubtle,
    marginVertical: 4,
    minHeight: 40,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  timelineTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 11,
  },
  timelineDuration: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '600',
  },
});

export default ScheduleTabScreen;
