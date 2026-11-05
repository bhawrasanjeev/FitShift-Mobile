import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { OptimizedFood } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface FoodItemRowProps {
  food: OptimizedFood;
  style?: ViewStyle;
}

export const FoodItemRow: React.FC<FoodItemRowProps> = ({ food, style }) => {
  const costPer10g =
    food.proteinGrams > 0
      ? ((food.estimatedCost / food.proteinGrams) * 10).toFixed(1)
      : 'N/A';

  return (
    <View style={[styles.container, style]}>
      <View style={styles.leftCol}>
        <View style={styles.typeBadge}>
          <Text style={styles.typeText}>
            {food.isSupplement ? 'SUPPLEMENT' : 'WHOLE FOOD'}
          </Text>
        </View>
        <Text style={styles.nameText} numberOfLines={1}>
          {food.name}
        </Text>
        <Text style={styles.portionText}>
          {food.quantityGrams}g portion • ₹{costPer10g}/10g pro
        </Text>
      </View>

      <View style={styles.rightCol}>
        <Text style={styles.proteinText}>{food.proteinGrams}g Pro</Text>
        <Text style={styles.costText}>~₹{food.estimatedCost}/day</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  leftCol: {
    flex: 1,
    gap: 2,
    marginRight: spacing.sm,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    ...typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.4,
  },
  nameText: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  portionText: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  rightCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  proteinText: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 12,
  },
  costText: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
});

export default FoodItemRow;
