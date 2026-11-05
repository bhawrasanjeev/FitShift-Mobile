import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
} from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { ProgressBar } from '../../components/common/ProgressBar';
import { Icon } from '../../components/common/Icon';
import { GroceryCategoryCard } from '../../components/diet/GroceryCategoryCard';
import { BudgetSummaryCard } from '../../components/diet/BudgetSummaryCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface GroceryScreenProps {
  onBackToDiet?: () => void;
  showHeader?: boolean;
}

export const GroceryScreen: React.FC<GroceryScreenProps> = ({
  onBackToDiet,
  showHeader = true,
}) => {
  const { plan, userProfile, updateGroceryChecklist } = usePlan();
  const [copied, setCopied] = useState<boolean>(false);

  if (!plan || !plan.diet) {
    return (
      <View style={styles.screen}>
        {showHeader && <Header title="Grocery Shopping List" showBrand={false} />}
        <View style={styles.emptyContainer}>
          <Icon name="shopping-bag" size={44} color={colors.primary} />
          <Text style={styles.emptyTitle}>No Grocery List Available</Text>
          <Text style={styles.emptySub}>
            Generate an optimized diet plan through the onboarding wizard to calculate your weekly grocery requirements.
          </Text>
        </View>
      </View>
    );
  }

  const { diet } = plan;
  const groceryItems = diet.groceryList || [];
  const dailySpend = diet.budget?.estimatedCost || userProfile.budget.dailyBudgetRupees;
  const weeklySpend = Math.round(dailySpend * 7);

  // Calculate checked progress
  const totalCount = groceryItems.length;
  const checkedCount = groceryItems.filter((i) => i.checked).length;
  const progressRatio = totalCount > 0 ? checkedCount / totalCount : 0;

  // Group items by category (only include categories with actual items)
  const categoriesMap = new Map<string, typeof groceryItems>();
  groceryItems.forEach((item) => {
    const cat = item.category || 'Pantry Staples';
    if (!categoriesMap.has(cat)) {
      categoriesMap.set(cat, []);
    }
    categoriesMap.get(cat)!.push(item);
  });
  const categories = Array.from(categoriesMap.entries());

  // Copy / Share shopping list
  const handleCopyClipboard = async () => {
    const formatted = groceryItems
      .map(
        (item) =>
          `[${item.checked ? 'x' : ' '}] ${item.name} (${item.weeklyQuantity}) - ~₹${item.estimatedWeeklyCost}/wk [${item.category}]`
      )
      .join('\n');

    const textToCopy = `FitShift Indian Grocery Shopping List (Est: ₹${weeklySpend}/week):\n\n${formatted}\n\nGenerated deterministically from FitShift Whole-Food Engine.`;

    try {
      await Share.share({
        message: textToCopy,
        title: 'FitShift Weekly Grocery List',
      });
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Share grocery list error:', err);
    }
  };

  const handleToggle = (id: string, checked: boolean) => {
    updateGroceryChecklist(id, checked);
  };

  return (
    <View style={styles.screen}>
      {showHeader && (
        <Header
          title="Weekly Grocery List"
          subtitle={`₹${weeklySpend}/week • ${groceryItems.length} Indian Staples`}
          showBrand={false}
          rightAction={
            onBackToDiet ? (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={onBackToDiet}
                style={styles.backPill}
              >
                <Icon name="arrow-left" size={12} color={colors.primaryDark} />
                <Text style={styles.backPillText}>Meals</Text>
              </TouchableOpacity>
            ) : undefined
          }
        />
      )}

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Budget Economics Summary */}
        <BudgetSummaryCard
          dailySpend={dailySpend}
          dailyLimit={userProfile.budget.dailyBudgetRupees}
          weeklySpend={weeklySpend}
          feasible={diet.feasible}
          totalItemsCount={groceryItems.length}
        />

        {/* Shopping Checklist Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={styles.progressTag}>SHOPPING CHECKLIST</Text>
              <Text style={styles.progressTitle}>
                {checkedCount} of {totalCount} Items Purchased
              </Text>
            </View>
            <Badge
              label={`${Math.round(progressRatio * 100)}% Complete`}
              variant={progressRatio === 1 ? 'accent' : 'neutral'}
              size="sm"
            />
          </View>

          <ProgressBar progress={progressRatio} style={styles.progressBar} />

          <View style={styles.checklistActions}>
            <Text style={styles.checklistHint}>
              Tap any item to mark as purchased in your shopping cart.
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCopyClipboard}
              style={[styles.copyBtn, copied && styles.copyBtnSuccess]}
            >
              <Icon
                name={copied ? 'check' : 'copy'}
                size={14}
                color={copied ? '#065F46' : colors.primaryDark}
              />
              <Text style={[styles.copyBtnText, copied && styles.copyBtnTextSuccess]}>
                {copied ? 'Copied Shopping List!' : 'Copy to Clipboard'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categorized Grocery Lists */}
        <View style={styles.categoriesSection}>
          <Text style={styles.categoriesHeading}>
            CATEGORIZED INGREDIENTS ({categories.length} AISLES)
          </Text>

          {categories.map(([category, items]) => (
            <GroceryCategoryCard
              key={category}
              category={category}
              items={items}
              onToggleItem={handleToggle}
              style={styles.categoryCard}
            />
          ))}
        </View>

        {/* Lineage & Freshness Disclaimer */}
        <View style={styles.disclaimerBox}>
          <Icon name="info" size={15} color={colors.textSecondary} />
          <Text style={styles.disclaimerText}>
            <Text style={styles.disclaimerBold}>Authentic Indian Pricing: </Text>
            Quantities reflect 7 days of planned consumption based on FitShift&apos;s verified clean Indian staples dataset. Prices vary slightly by local kirana, mandi, or quick-commerce vendors.
          </Text>
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
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing['4xl'],
    gap: spacing.lg,
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
  backPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  backPillText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.primaryDark,
    fontSize: 11,
  },
  progressCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressTag: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  progressTitle: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 1,
  },
  progressBar: {
    height: 8,
    borderRadius: borderRadius.full,
    marginVertical: 2,
  },
  checklistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingTop: 2,
  },
  checklistHint: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    flex: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
    borderWidth: 1,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
    borderRadius: borderRadius.md,
  },
  copyBtnSuccess: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  copyBtnText: {
    ...typography.caption,
    fontWeight: '700',
    color: colors.textPrimary,
    fontSize: 11,
  },
  copyBtnTextSuccess: {
    color: colors.primaryDark,
  },
  categoriesSection: {
    gap: spacing.sm,
  },
  categoriesHeading: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  categoryCard: {
    marginBottom: spacing.xs,
  },
  disclaimerBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  disclaimerBold: {
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

export default GroceryScreen;
