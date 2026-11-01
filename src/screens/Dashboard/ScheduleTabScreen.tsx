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
import { generateUserSchedule } from '../../utils/schedule';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export const ScheduleTabScreen: React.FC = () => {
  const { plan, userProfile } = usePlan();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  if (!plan) {
    return (
      <View style={styles.screen}>
        <Header title="24-Hour Rhythm" showBrand={false} />
        <View style={[styles.anchorsCard, { margin: spacing.lg }]}>
          <Text style={styles.anchorsTitle}>No Schedule Active</Text>
          <Text style={styles.timelineDesc}>
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
    { badgeText: string; badgeVariant: 'accent' | 'neutral' | 'warning' | 'success'; icon: string }
  > = {
    workout: { badgeText: 'Training', badgeVariant: 'accent', icon: '🏋️' },
    meal: { badgeText: 'Nutrition', badgeVariant: 'warning', icon: '🥗' },
    work: { badgeText: 'Occupational', badgeVariant: 'neutral', icon: '💼' },
    sleep: { badgeText: 'Recovery', badgeVariant: 'accent', icon: '🌙' },
    recovery: { badgeText: 'Hydration', badgeVariant: 'success', icon: '💧' },
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
              icon: '⏱️',
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
                      <Text style={styles.timelineIcon}>{conf.icon}</Text>
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
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
    fontWeight: '700',
    color: colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  anchorVal: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  anchorVDivider: {
    width: 1,
    height: 28,
    backgroundColor: colors.borderSubtle,
  },
  timelineList: {
    gap: spacing.sm,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  timelineLeftCol: {
    width: 52,
    alignItems: 'center',
    gap: 4,
  },
  timelineTimeText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
    fontSize: 12,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    minHeight: 40,
    backgroundColor: colors.borderStrong,
    marginTop: 4,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: 4,
  },
  timelineCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.xs,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  timelineIcon: {
    fontSize: 14,
  },
  timelineTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
    flex: 1,
  },
  timelineDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  timelineDuration: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    marginTop: 2,
  },
});
