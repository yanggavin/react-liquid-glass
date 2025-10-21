import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient, getLiquidAnimationConfig } from '../utils/glassEffects';

export interface LiquidGlassFABProps extends GlassEffectProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  variant?: 'surface' | 'primary' | 'secondary' | 'tertiary';
  disabled?: boolean;
  style?: ViewStyle;
  extended?: boolean;
  label?: string;
}

const SIZE_CONFIGS = {
  small: { size: 40, iconSize: 18 },
  medium: { size: 56, iconSize: 24 },
  large: { size: 96, iconSize: 36 },
};

const VARIANT_COLORS = {
  surface: '#FFFFFF',
  primary: '#6750A4',
  secondary: '#625B71',
  tertiary: '#7D5260',
};

export const LiquidGlassFAB: React.FC<LiquidGlassFABProps> = ({
  onPress,
  icon,
  size = 'medium',
  variant = 'primary',
  disabled = false,
  style,
  extended = false,
  label,
  blurRadius = 10,
  tintColor,
  opacity = 0.2,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const sizeConfig = SIZE_CONFIGS[size];
  const baseColor = tintColor || VARIANT_COLORS[variant];
  
  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity,
    borderRadius: extended ? 16 : sizeConfig.size / 2,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, 1.8);

  const handlePressIn = useCallback(() => {
    if (disabled) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.92,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, scaleAnim, liquidAnim, rotateAnim]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;

    const releaseConfig = getLiquidAnimationConfig('release');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...releaseConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, scaleAnim, liquidAnim, rotateAnim]);

  const animatedStyle = {
    transform: [
      { scale: scaleAnim },
      {
        rotate: rotateAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '15deg'],
        }),
      },
    ],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const containerStyle = [
    styles.container,
    glassStyle,
    {
      width: extended ? 'auto' : sizeConfig.size,
      height: sizeConfig.size,
      opacity: disabled ? 0.5 : 1,
      paddingHorizontal: extended ? 16 : 0,
    },
    animatedStyle,
    style,
  ];

  return (
    <Animated.View style={containerStyle}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={variant === 'surface' ? 'light' : 'dark'}
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={baseColor}
      />
      
      <TouchableOpacity
        style={styles.button}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: extended ? 16 : sizeConfig.size / 2 },
          ]}
        >
          <LinearGradient
            colors={liquidGradient.colors}
            locations={liquidGradient.locations}
            start={liquidGradient.start}
            end={liquidGradient.end}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.iconContainer,
            {
              marginRight: extended && label ? 8 : 0,
            },
          ]}
        >
          {icon}
        </Animated.View>

        {extended && label && (
          <Animated.Text
            style={[
              styles.label,
              {
                color: variant === 'surface' ? '#1C1B1F' : '#FFFFFF',
              },
            ]}
          >
            {label}
          </Animated.Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    elevation: 6,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});