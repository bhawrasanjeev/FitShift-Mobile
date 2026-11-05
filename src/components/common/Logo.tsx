import React from 'react';
import { Image, StyleSheet, View, ImageStyle, StyleProp } from 'react-native';
import { borderRadius } from '../../theme/borderRadius';

export interface LogoProps {
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  style?: StyleProp<ImageStyle>;
  rounded?: boolean;
}

const SIZES = {
  sm: 24,
  md: 32,
  lg: 44,
  xl: 64,
};

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  style,
  rounded = true,
}) => {
  const pixelSize = typeof size === 'number' ? size : SIZES[size] || 32;
  const radius = rounded ? Math.round(pixelSize * 0.22) : 0;

  return (
    <View style={[styles.container, { width: pixelSize, height: pixelSize }]}>
      <Image
        source={require('../../assets/images/logo.png')}
        style={[
          styles.image,
          {
            width: pixelSize,
            height: pixelSize,
            borderRadius: radius,
          },
          style,
        ]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    borderRadius: borderRadius.md,
  },
});

export default Logo;
