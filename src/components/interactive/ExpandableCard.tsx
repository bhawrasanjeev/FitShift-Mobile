import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/borderRadius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { Badge } from '../common/Badge';

export interface ExpandableCardProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  children: ReactNode;
  initiallyExpanded?: boolean;
  style?: ViewStyle;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  subtitle,
  badge,
  icon,
  children,
  initiallyExpanded = false,
  style,
}) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  return (
    <View style={[styles.card, style]}>
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          {icon ? <View style={styles.iconBox}>{icon}</View> : null}
          <View style={styles.textWrapper}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{title}</Text>
              {badge ? <Badge label={badge} variant="accent" size="sm" /> : null}
            </View>
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>

        <View style={[styles.chevronBox, expanded && styles.chevronBoxExpanded]}>
          <Text style={styles.chevronText}>{expanded ? '▲' : '▼'}</Text>
        </View>
      </TouchableOpacity>

      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xs,
    overflow: 'hidden',
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    marginRight: spacing.sm,
  },
  textWrapper: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  chevronBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  chevronBoxExpanded: {
    backgroundColor: colors.primaryLight,
  },
  chevronText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.weights.bold,
  },
  content: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    paddingTop: spacing.sm,
  },
});

export default ExpandableCard;
