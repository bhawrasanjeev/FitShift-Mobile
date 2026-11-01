import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { borderRadius } from '../../theme/borderRadius';

export interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  trackColor?: string;
  height?: number;
  style?: ViewStyle;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color = colors.primary,
  trackColor = colors.borderSubtle,
  height = 6,
  style,
}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          backgroundColor: trackColor,
          borderRadius: borderRadius.full,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: color,
            borderRadius: borderRadius.full,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});

export default ProgressBar;
