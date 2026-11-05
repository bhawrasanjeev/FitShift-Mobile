import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Badge } from '../common/Badge';
import { Icon } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface SupplementCardProps {
  name: string;
  category: 'supplement' | 'whole_food';
  purpose: string;
  proteinYield: string;
  costEstimate: string;
  costPerGramPro: string;
  foodFirstAlternatives?: string[];
  usageGuidance: string;
  limitationNote?: string;
  style?: ViewStyle;
}

export const SupplementCard: React.FC<SupplementCardProps> = ({
  name,
  category,
  purpose,
  proteinYield,
  costEstimate,
  costPerGramPro,
  foodFirstAlternatives,
  usageGuidance,
  limitationNote,
  style,
}) => {
  const isSupplement = category === 'supplement';

  return (
    <View
      style={[
        styles.card,
        isSupplement ? styles.cardSupplement : styles.cardWholeFood,
        style,
      ]}
    >
      {/* Top Header */}
      <View style={styles.topRow}>
        <View style={styles.titleWrapper}>
          <Icon
            name={isSupplement ? 'pill' : 'leaf'}
            size={18}
            color={isSupplement ? colors.primaryDark : colors.success}
          />
          <Text style={styles.title}>{name}</Text>
        </View>
        <Badge
          label={isSupplement ? 'Convenience Tool' : 'Food First Staple'}
          variant={isSupplement ? 'neutral' : 'accent'}
          size="sm"
        />
      </View>

      {/* Purpose Description */}
      <Text style={styles.purposeText}>{purpose}</Text>

      {/* Metrics Strip */}
      <View style={styles.metricsStrip}>
        <View style={styles.metricCol}>
          <Text style={styles.metricVal}>{proteinYield}</Text>
          <Text style={styles.metricLbl}>Protein</Text>
        </View>
        <View style={styles.vDivider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricVal}>{costEstimate}</Text>
          <Text style={styles.metricLbl}>Est. Cost</Text>
        </View>
        <View style={styles.vDivider} />
        <View style={styles.metricCol}>
          <Text style={styles.metricVal}>{costPerGramPro}</Text>
          <Text style={styles.metricLbl}>Cost / Gram Pro</Text>
        </View>
      </View>

      {/* Food First Alternatives if supplement */}
      {isSupplement && foodFirstAlternatives && foodFirstAlternatives.length > 0 ? (
        <View style={styles.alternativesSection}>
          <Text style={styles.alternativesLabel}>FOOD-FIRST INDIAN ALTERNATIVES:</Text>
          <View style={styles.pillsRow}>
            {foodFirstAlternatives.map((alt, idx) => (
              <View key={idx} style={styles.altPill}>
                <Text style={styles.altPillText}>{alt}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      {/* Usage Guidance */}
      <View style={styles.guidanceBox}>
        <Text style={styles.guidanceHeading}>Practical Guidance:</Text>
        <Text style={styles.guidanceText}>{usageGuidance}</Text>
      </View>

      {/* Limitation / Safety Note */}
      {limitationNote ? (
        <View style={styles.limitationRow}>
          <Text style={styles.limitationIcon}>ℹ️</Text>
          <Text style={styles.limitationText}>{limitationNote}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius['2xl'],
    borderWidth: 1,
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardSupplement: {
    borderColor: '#DDD6FE', // light purple border
  },
  cardWholeFood: {
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  icon: {
    fontSize: 18,
  },
  title: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  purposeText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 12,
  },
  metricsStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  metricVal: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textPrimary,
    fontSize: 11,
  },
  metricLbl: {
    ...typography.caption,
    fontSize: 9,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  vDivider: {
    width: 1,
    height: 22,
    backgroundColor: colors.borderSubtle,
  },
  alternativesSection: {
    gap: 4,
  },
  alternativesLabel: {
    ...typography.caption,
    fontWeight: '700',
    fontSize: 9,
    color: colors.primaryDark,
    letterSpacing: 0.5,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  altPill: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  altPillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 10,
  },
  guidanceBox: {
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 2,
  },
  guidanceHeading: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 10,
  },
  guidanceText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  limitationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  limitationIcon: {
    fontSize: 12,
    marginTop: 1,
  },
  limitationText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 10,
    flex: 1,
    lineHeight: 14,
  },
});

export default SupplementCard;
