import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { GroceryEntry } from '../../types';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';
import { Icon } from '../common/Icon';

export interface GroceryItemProps {
  item: GroceryEntry;
  onToggle: (id: string, checked: boolean) => void;
  style?: ViewStyle;
}

export const GroceryItem: React.FC<GroceryItemProps> = ({
  item,
  onToggle,
  style,
}) => {
  const isChecked = Boolean(item.checked);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onToggle(item.id, !isChecked)}
      style={[
        styles.row,
        isChecked && styles.rowChecked,
        style,
      ]}
    >
      <View style={styles.leftGroup}>
        {/* Checkbox Icon */}
        <View
          style={[
            styles.checkbox,
            isChecked && styles.checkboxActive,
          ]}
        >
          {isChecked ? <Icon name="check" size={12} color={colors.white} strokeWidth={3} /> : null}
        </View>

        <View style={styles.itemInfo}>
          <Text
            style={[
              styles.itemName,
              isChecked && styles.itemNameChecked,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.itemQuantity}>
            Weekly: <Text style={styles.quantityBold}>{item.weeklyQuantity}</Text>
            {item.weeklyGrams > 0 ? (
              <Text style={styles.dailyPortion}>
                {' '}(~{Math.round(item.weeklyGrams / 7)}g / day)
              </Text>
            ) : null}
          </Text>
        </View>
      </View>

      <View style={styles.rightGroup}>
        <Text
          style={[
            styles.itemCost,
            isChecked && styles.itemCostChecked,
          ]}
        >
          ₹{item.estimatedWeeklyCost}
        </Text>
        <Text style={styles.dailyCost}>
          ~₹{item.estimatedDailyCost}/day
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
    backgroundColor: colors.surface,
  },
  rowChecked: {
    backgroundColor: colors.surfaceSubtle,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
    marginRight: spacing.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  checkmark: {
    color: colors.surface,
    fontSize: 13,
    fontWeight: '900',
  },
  itemInfo: {
    flex: 1,
    gap: 2,
  },
  itemName: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemNameChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  itemQuantity: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
  },
  quantityBold: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  dailyPortion: {
    color: colors.textMuted,
  },
  rightGroup: {
    alignItems: 'flex-end',
    gap: 2,
  },
  itemCost: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  itemCostChecked: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  dailyCost: {
    ...typography.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
});

export default GroceryItem;
