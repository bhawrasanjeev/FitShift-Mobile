import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { GroceryEntry } from '../../types';
import { GroceryItem } from './GroceryItem';
import { Icon, IconName } from '../common/Icon';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface GroceryCategoryCardProps {
  category: string;
  items: GroceryEntry[];
  onToggleItem: (id: string, checked: boolean) => void;
  initiallyExpanded?: boolean;
  style?: ViewStyle;
}

export const GroceryCategoryCard: React.FC<GroceryCategoryCardProps> = ({
  category,
  items,
  onToggleItem,
  initiallyExpanded = true,
  style,
}) => {
  const [expanded, setExpanded] = useState<boolean>(initiallyExpanded);

  const getCategoryConfig = (cat: string): { iconName: IconName; label: string } => {
    const c = cat.toLowerCase();
    if (c.includes('grain') || c.includes('cereal') || c.includes('atta') || c.includes('rice')) {
      return { iconName: 'leaf', label: 'Grains & Carbohydrates' };
    }
    if (c.includes('legume') || c.includes('pulse') || c.includes('dal') || c.includes('chana') || c.includes('soya')) {
      return { iconName: 'target', label: 'Lentils, Dals & Pulses' };
    }
    if (c.includes('dairy') || c.includes('milk') || c.includes('paneer') || c.includes('curd')) {
      return { iconName: 'shield', label: 'Dairy & Fermented' };
    }
    if (c.includes('poultry') || c.includes('egg') || c.includes('meat') || c.includes('fish')) {
      return { iconName: 'activity', label: 'Poultry, Eggs & Meats' };
    }
    if (c.includes('nut') || c.includes('seed') || c.includes('peanut')) {
      return { iconName: 'leaf', label: 'Nuts & Healthy Fats' };
    }
    if (c.includes('fruit')) {
      return { iconName: 'leaf', label: 'Fresh Fruits & Fuel' };
    }
    if (c.includes('veg')) {
      return { iconName: 'leaf', label: 'Vegetables & Greens' };
    }
    return { iconName: 'shopping-bag', label: cat };
  };

  const config = getCategoryConfig(category);
  const categoryTotalCost = items.reduce((sum, i) => sum + i.estimatedWeeklyCost, 0);
  const checkedItemsCount = items.filter((i) => i.checked).length;

  return (
    <View style={[styles.card, style]}>
      {/* Category Header Bar */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
        style={styles.header}
      >
        <View style={styles.headerLeft}>
          <View style={styles.catIconContainer}>
            <Icon name={config.iconName} size={15} color={colors.primaryDark} />
          </View>
          <View>
            <Text style={styles.catTitle}>{config.label}</Text>
            <Text style={styles.catSub}>
              {checkedItemsCount} / {items.length} purchased • ₹{categoryTotalCost}/wk
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={14}
            color={colors.textSecondary}
          />
        </View>
      </TouchableOpacity>

      {/* Expanded Items */}
      {expanded ? (
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <GroceryItem
              key={item.id}
              item={item}
              onToggle={onToggleItem}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.surfaceSubtle,
    borderBottomColor: colors.borderSubtle,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  catIconContainer: {
    width: 28,
    height: 28,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTitle: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  catSub: {
    ...typography.caption,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  headerRight: {
    paddingLeft: spacing.sm,
  },
  itemsContainer: {
    backgroundColor: colors.surface,
  },
});

export default GroceryCategoryCard;
