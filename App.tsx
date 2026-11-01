import React, { useEffect } from 'react';
import { StatusBar, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { PlanProvider } from './src/context/PlanContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      try {
        (StatusBar as unknown as { setBackgroundColor: (c: string, a: boolean) => void }).setBackgroundColor(
          colors.surface,
          true
        );
      } catch {
        // Safe fallback
      }
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <ThemeProvider>
        <PlanProvider>
          <RootNavigator />
        </PlanProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
