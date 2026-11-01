import React, { ReactNode, useEffect } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  StyleSheet,
  ViewStyle,
  RefreshControl,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

export interface ScreenContainerProps {
  children: ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  refreshing?: boolean;
  onRefresh?: () => void;
  headerComponent?: ReactNode;
  footerComponent?: ReactNode;
  noPadding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
  refreshing = false,
  onRefresh,
  headerComponent,
  footerComponent,
  noPadding = false,
}) => {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === 'android') {
      (StatusBar as unknown as { setBackgroundColor?: (color: string, animated: boolean) => void })
        .setBackgroundColor?.(colors.background, true);
    }
  }, []);

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={[styles.root, style]}>
      <StatusBar barStyle="dark-content" />
      {headerComponent}
      {scrollable ? (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            !noPadding && styles.defaultPadding,
            { paddingBottom: insets.bottom + spacing.xl },
            contentContainerStyle,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
                tintColor={colors.primary}
              />
            ) : undefined
          }
        >
          {children}
        </ScrollView>
      ) : (
        <View
          style={[
            styles.content,
            !noPadding && styles.defaultPadding,
            { paddingBottom: insets.bottom + spacing.md },
            contentContainerStyle,
          ]}
        >
          {children}
        </View>
      )}
      {footerComponent}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
  },
  defaultPadding: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});

export default ScreenContainer;
