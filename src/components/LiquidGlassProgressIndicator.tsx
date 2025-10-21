import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient } from '../utils/glassEffects';

export interface LiquidGlassProgressIndicatorProps extends GlassEffectProps {
  progress?: number; // 0-100 for determinate, undefined for indeterminate
  variant?: 'linear' | 'circular';
  size?: number;
  thickness?: number;
  style?: ViewStyle;
  color?: string;
  trackColor?: string;
  animate?: boolean;
}

export const LiquidGlassProgressIndicator: React.FC<LiquidGlassProgressIndicatorProps> = ({
  progress,
  variant = 'circular',
  size = 40,
  thickness = 4,
  style,
  color = '#6750A4',
  trackColor = 'rgba(255, 255, 255, 0.2)',
  animate = true,
  blurRadius = 6,
  tintColor,
  opacity = 0.2,
  ...glassProps
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const baseColor = tintColor || color;
  const isIndeterminate = progress === undefined;

  useEffect(() => {
    if (isIndeterminate && animate) {
      // Indeterminate animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotationAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      );
      
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      rotateAnimation.start();
      pulseAnimation.start();

      return () => {
        rotateAnimation.stop();
        pulseAnimation.stop();
      };
    } else if (progress !== undefined) {
      // Determinate animation
      Animated.timing(animatedValue, {
        toValue: progress / 100,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, isIndeterminate, animate, animatedValue, rotationAnim, pulseAnim]);

  const liquidGradient = createLiquidGradient(baseColor, 1.5);

  if (variant === 'linear') {
    const containerStyle = createGlassStyle({
      blurRadius,
      tintColor: trackColor,
      opacity: 0.3,
      borderRadius: thickness / 2,
      ...glassProps,
    });

    return (
      <View style={[styles.linearContainer, { height: thickness }, containerStyle, style]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={blurRadius}
          reducedTransparencyFallbackColor={trackColor}
        />
        
        <Animated.View
          style={[
            styles.linearProgress,
            {
              height: thickness,
              borderRadius: thickness / 2,
              width: isIndeterminate 
                ? '30%' 
                : animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
              transform: isIndeterminate ? [{
                translateX: rotationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-100, 300],
                }),
              }] : [],
            },
          ]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="dark"
            blurAmount={blurRadius}
            reducedTransparencyFallbackColor={baseColor}
          />
          <LinearGradient
            colors={liquidGradient.colors}
            locations={liquidGradient.locations}
            start={liquidGradient.start}
            end={liquidGradient.end}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      </View>
    );
  }

  // Circular variant
  const containerStyle = createGlassStyle({
    blurRadius,
    tintColor: trackColor,
    opacity: 0.2,
    borderRadius: size / 2,
    borderWidth: thickness,
    borderColor: trackColor,
    ...glassProps,
  });

  return (
    <Animated.View
      style={[
        styles.circularContainer,
        {
          width: size,
          height: size,
          transform: [{
            scale: animate ? pulseAnim : 1,
          }, {
            rotate: isIndeterminate 
              ? rotationAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                })
              : '0deg',
          }],
        },
        containerStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={trackColor}
      />

      {/* Progress arc */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: baseColor,
            borderTopColor: baseColor,
            borderRightColor: isIndeterminate || (progress || 0) > 25 ? baseColor : 'transparent',
            borderBottomColor: isIndeterminate || (progress || 0) > 50 ? baseColor : 'transparent',
            borderLeftColor: isIndeterminate || (progress || 0) > 75 ? baseColor : 'transparent',
            transform: [{
              rotate: isIndeterminate 
                ? '0deg'
                : `${-90 + ((progress || 0) / 100) * 360}deg`,
            }],
          },
        ]}
      >
        <LinearGradient
          colors={[baseColor, `${baseColor}80`, baseColor]}
          locations={[0, 0.5, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  linearContainer: {
    overflow: 'hidden',
    width: '100%',
  },
  linearProgress: {
    overflow: 'hidden',
  },
  circularContainer: {
    overflow: 'hidden',
  },
});