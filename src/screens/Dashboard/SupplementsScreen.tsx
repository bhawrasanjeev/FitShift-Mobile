import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { usePlan } from '../../context/PlanContext';
import { Header } from '../../components/common/Header';
import { Badge } from '../../components/common/Badge';
import { Icon } from '../../components/common/Icon';
import { SupplementCard } from '../../components/diet/SupplementCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { borderRadius } from '../../theme/borderRadius';

export interface SupplementsScreenProps {
  onBackToDiet?: () => void;
  showHeader?: boolean;
}

export const SupplementsScreen: React.FC<SupplementsScreenProps> = ({
  onBackToDiet,
  showHeader = true,
}) => {
  const { plan, userProfile } = usePlan();

  const preference = userProfile.supplements?.preference || 'no_supplements';
  const monthlyBudget = userProfile.supplements?.monthlyBudgetRupees;
  const isFoodFirst = preference === 'no_supplements';
  const isOpenToSupplements = preference === 'open_to_supplements';
  const activeSupplements = plan?.diet?.foods?.filter((f) => f.isSupplement) || [];

  // Primary high-protein Indian whole food staples (Food-First philosophy)
  const highProteinIndianFoods = [
    {
      name: 'Roasted Chana Sattu',
      category: 'whole_food' as const,
      purpose: 'Natural roasted Bengal gram flour soluble in cold water or chaas. High in dietary fiber, potassium, and minerals.',
      proteinYield: '20g / 100g',
      costEstimate: '~₹15 / 100g',
      costPerGramPro: '₹0.75 / g',
      usageGuidance: 'Mix 40–50g with cold buttermilk, pinch of roasted cumin and lemon for an instant natural post-workout or college fuel stop.',
      limitationNote: 'Natural slow-digesting complex carbohydrate base; count towards daily carb target.',
    },
    {
      name: 'Defatted Soya Chunks',
      category: 'whole_food' as const,
      purpose: 'One of the most cost-effective and protein-dense whole foods on earth (52% bioavailable protein). Complete amino acid profile.',
      proteinYield: '52g / 100g dry',
      costEstimate: '~₹14 / 100g',
      costPerGramPro: '₹0.27 / g',
      usageGuidance: 'Boil for 5–7 mins in salted water, squeeze out water thoroughly, and add to bhurji, curries, or pulao.',
      limitationNote: 'FitShift enforces a safe 50g/day dry ceiling for balanced phytoestrogen and digestive health.',
    },
    {
      name: 'Desi Kala Chana (Black Chickpeas)',
      category: 'whole_food' as const,
      purpose: 'Sustained low-glycemic fuel rich in iron, zinc, and slow-release complex carbohydrates.',
      proteinYield: '20g / 100g dry',
      costEstimate: '~₹10 / 100g',
      costPerGramPro: '₹0.50 / g',
      usageGuidance: 'Soak overnight for 8 hours before pressure cooking to break down oligosaccharides for effortless digestion.',
      limitationNote: 'Requires overnight planning to soak properly.',
    },
    {
      name: 'Fresh Curd (Dahi) & Loose Paneer',
      category: 'whole_food' as const,
      purpose: 'Rich in micellar casein protein for sustained overnight amino acid release and active probiotic gut flora.',
      proteinYield: '18g / 100g paneer',
      costEstimate: '~₹40 / 100g',
      costPerGramPro: '₹2.22 / g',
      usageGuidance: 'Have curd with lunch to optimize nutrient absorption, and add paneer cubes to dinner without deep frying.',
      limitationNote: 'Whole milk paneer contains saturated milk fats; incorporate within overall daily calorie allowance.',
    },
    {
      name: 'Yellow Moong Dal (Split)',
      category: 'whole_food' as const,
      purpose: 'Lightest and most easily assimilated Indian legume, gentle on the digestive tract with zero bloating.',
      proteinYield: '24g / 100g dry',
      costEstimate: '~₹13 / 100g',
      costPerGramPro: '₹0.54 / g',
      usageGuidance: 'Ideal for weekday dinners as comforting dal tadka or morning moong dal chilla.',
      limitationNote: 'Pair with grain (roti or rice) to form a complete complementary amino acid profile.',
    },
    {
      name: 'Whole Eggs / Boiled Egg Whites',
      category: 'whole_food' as const,
      purpose: 'Gold standard biological value (BV 100) protein for optimal muscle protein synthesis and micronutrient density.',
      proteinYield: '6g per whole egg',
      costEstimate: '~₹6.50 / egg',
      costPerGramPro: '₹1.08 / g',
      usageGuidance: 'Boil for 8 minutes for tender yolks, or prepare homestyle egg bhurji with onions and green chillies.',
      limitationNote: 'For eggetarian and non-vegetarian plans only.',
    },
  ];

  // Evidence-backed supplements (convenience tools)
  const supplementItems = [
    {
      name: 'Whey Protein Concentrate (80%)',
      category: 'supplement' as const,
      purpose: 'Fast-digesting dairy whey isolate/concentrate extracted during cheese manufacturing. Pure convenience when cooking time is zero.',
      proteinYield: '24g / 30g scoop',
      costEstimate: '~₹70–85 / scoop',
      costPerGramPro: '₹3.10–3.50 / g',
      foodFirstAlternatives: ['Chana Sattu (60g)', 'Soya Chunks (45g)', '4 Egg Whites + 1 Egg'],
      usageGuidance: 'Consume 1 scoop with cold water after workouts or when daily work transit prevents home cooking.',
      limitationNote: 'Convenience supplement only. Whole Indian foods provide superior micronutrients, dietary fiber, and satiety.',
    },
    {
      name: 'Creatine Monohydrate (Creapure)',
      category: 'supplement' as const,
      purpose: 'Naturally occurring cellular compound that replenishes intramuscular phosphocreatine (ATP) during high-intensity lifts.',
      proteinYield: '0g (ATP ergogenic)',
      costEstimate: '~₹15–20 / 3g dose',
      costPerGramPro: 'N/A (Energy Buffer)',
      foodFirstAlternatives: ['Red meat / Fish (in small traces)', 'Whole-food plant nutrition'],
      usageGuidance: 'Take 3–5g daily with water at any consistent time of day. No loading phase necessary.',
      limitationNote: 'Drink an additional 500ml water daily to maintain cellular hydration balance.',
    },
  ];

  const preferenceLabel = isFoodFirst
    ? '100% Food-First Active'
    : isOpenToSupplements
    ? 'Open to Evidence-Backed'
    : 'Food-First Default (Unsure)';

  return (
    <View style={styles.screen}>
      {showHeader && (
        <Header
          title="Supplements & Food-First"
          subtitle="Indian Kitchen Economics & Science"
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
        {/* Preference Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerTop}>
            <View style={styles.bannerIconBox}>
              <Icon name="leaf" size={18} color={colors.primaryDark} />
            </View>
            <View style={styles.bannerTitleBox}>
              <Text style={styles.bannerTag}>ONBOARDING PREFERENCE</Text>
              <Text style={styles.bannerHeading}>{preferenceLabel}</Text>
            </View>
          </View>

          <Text style={styles.bannerDesc}>
            {isFoodFirst
              ? 'Your plan is fully powered by whole Indian kitchen staples. Supplements are entirely optional convenience tools and are never required for muscle growth or health.'
              : 'You selected openness to evidence-backed tools. FitShift presents regular whole food as the primary foundation, with supplements strictly evaluated by cost per gram of protein.'}
          </Text>

          {monthlyBudget && !isFoodFirst ? (
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Configured Monthly Supplement Cap:</Text>
              <Text style={styles.budgetValue}>₹{monthlyBudget} / month</Text>
            </View>
          ) : null}
        </View>

        {/* Active Diet Optimizer Allocation */}
        {!isFoodFirst && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>ACTIVE PLAN ALLOCATION</Text>
              <Badge
                label={activeSupplements.length > 0 ? `${activeSupplements.length} Allocated` : '100% Whole Food'}
                variant={activeSupplements.length > 0 ? 'accent' : 'neutral'}
                size="sm"
              />
            </View>
            {activeSupplements.length === 0 ? (
              <View style={styles.optimizerMetCard}>
                <Text style={styles.optimizerMetTitle}>No supplements required for your target</Text>
                <Text style={styles.optimizerMetText}>
                  FitShift&apos;s budget optimizer met your daily protein target using authentic Indian whole foods (soya, paneer, dals, sattu) within your budget limit.
                </Text>
              </View>
            ) : (
              activeSupplements.map((sup, sIdx) => (
                <View key={sIdx} style={styles.activeSupCard}>
                  <Text style={styles.activeSupTitle}>{sup.name}</Text>
                  <Text style={styles.activeSupSub}>
                    {sup.quantityGrams}g portion • {sup.proteinGrams}g protein • ₹{sup.estimatedCost}/day
                  </Text>
                </View>
              ))
            )}
          </View>
        )}

        {/* Evidence-Backed Supplements (if allowed) */}
        {!isFoodFirst && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>EVIDENCE-BACKED CONVENIENCE TOOLS</Text>
              <Badge label="Optional" variant="neutral" size="sm" />
            </View>
            <View style={styles.cardsList}>
              {supplementItems.map((item, idx) => (
                <SupplementCard
                  key={idx}
                  name={item.name}
                  category={item.category}
                  purpose={item.purpose}
                  proteinYield={item.proteinYield}
                  costEstimate={item.costEstimate}
                  costPerGramPro={item.costPerGramPro}
                  foodFirstAlternatives={item.foodFirstAlternatives}
                  usageGuidance={item.usageGuidance}
                  limitationNote={item.limitationNote}
                />
              ))}
            </View>
          </View>
        )}

        {/* Primary Whole Food Staples Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>
              HIGH-PROTEIN WHOLE INDIAN STAPLES
            </Text>
            <Badge label="Food-First Foundation" variant="accent" size="sm" />
          </View>

          <View style={styles.cardsList}>
            {highProteinIndianFoods.map((item, idx) => (
              <SupplementCard
                key={idx}
                name={item.name}
                category={item.category}
                purpose={item.purpose}
                proteinYield={item.proteinYield}
                costEstimate={item.costEstimate}
                costPerGramPro={item.costPerGramPro}
                usageGuidance={item.usageGuidance}
                limitationNote={item.limitationNote}
              />
            ))}
          </View>
        </View>

        {/* Non-Medical Advisory Notice */}
        <View style={styles.medicalNotice}>
          <Icon name="shield" size={15} color={colors.textSecondary} />
          <Text style={styles.medicalText}>
            <Text style={styles.medicalBold}>Educational Guide: </Text>
            FitShift provides evidence-based dietary planning with Indian food metrics. Consult a healthcare provider before making major dietary adjustments.
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
  banner: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: borderRadius['2xl'],
    padding: spacing.md,
    gap: spacing.sm,
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  bannerIconBox: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTitleBox: {
    flex: 1,
    gap: 1,
  },
  bannerTag: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  bannerHeading: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textPrimary,
  },
  bannerDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 17,
    fontSize: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceSubtle,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
    marginTop: 2,
  },
  budgetLabel: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
  },
  budgetValue: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.primaryDark,
    fontSize: 12,
  },
  section: {
    gap: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...typography.caption,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  cardsList: {
    gap: spacing.md,
  },
  optimizerMetCard: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.borderSubtle,
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: 4,
  },
  optimizerMetTitle: {
    ...typography.bodySmall,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  optimizerMetText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 16,
    fontSize: 11,
  },
  activeSupCard: {
    backgroundColor: '#FAF5FF',
    borderColor: '#E9D5FF',
    borderWidth: 1,
    borderRadius: borderRadius.xl,
    padding: spacing.md,
    gap: 2,
    marginBottom: spacing.xs,
  },
  activeSupTitle: {
    ...typography.bodySmall,
    fontWeight: '800',
    color: '#581C87',
  },
  activeSupSub: {
    ...typography.caption,
    color: '#6B21A8',
    fontSize: 11,
  },
  medicalNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: borderRadius.lg,
    padding: spacing.sm,
  },
  medicalText: {
    ...typography.caption,
    color: colors.textMuted,
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  medicalBold: {
    fontWeight: '700',
    color: colors.textSecondary,
  },
});

export default SupplementsScreen;
