import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient } from '../utils/glassEffects';

export interface LiquidGlassBadgeProps extends GlassEffectProps {
  count?: number;
  maxCount?: number;
  showZero?: boolean;
  dot?: boolean;
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'default' | 'large';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  placement?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  offset?: [number, number];
  animate?: boolean;
}

const SIZE_CONFIGS = {
  small: { 
    minSize: 16,
    fontSize: 10,
    padding: 4,
    dotSize: 8,
  },
  default: {
    minSize: 20,
    fontSize: 12,
    padding: 6,
    dotSize: 10,
  },
  large: {
    minSize: 24,
    fontSize: 14,
    padding: 8,
    dotSize: 12,
  },
};

const VARIANT_COLORS = {
  primary: '#6750A4',
  secondary: '#625B71',
  success: '#16A34A',
  warning: '#EA580C',
  error: '#DC2626',
};

const PLACEMENT_STYLES = {
  'top-right': { top: 0, right: 0 },
  'top-left': { top: 0, left: 0 },
  'bottom-right': { bottom: 0, right: 0 },
  'bottom-left': { bottom: 0, left: 0 },
};

export const LiquidGlassBadge: React.FC<LiquidGlassBadgeProps> = ({
  count = 0,
  maxCount = 99,
  showZero = false,
  dot = false,
  children,
  style,
  textStyle,
  size = 'default',
  variant = 'primary',
  placement = 'top-right',
  offset = [0, 0],
  animate = true,
  blurRadius = 6,
  tintColor,
  opacity = 0.25,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const sizeConfig = SIZE_CONFIGS[size];
  const baseColor = tintColor || VARIANT_COLORS[variant];
  const placementStyle = PLACEMENT_STYLES[placement];

  // Determine display text
  const displayText = count > maxCount ? `${maxCount}+` : count.toString();
  const shouldShow = dot || count > 0 || showZero;

  // Badge dimensions
  const badgeWidth = dot 
    ? sizeConfig.dotSize 
    : Math.max(sizeConfig.minSize, displayText.length * sizeConfig.fontSize * 0.8 + sizeConfig.padding * 2);
  const badgeHeight = dot ? sizeConfig.dotSize : sizeConfig.minSize;

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity,
    borderRadius: Math.max(badgeWidth, badgeHeight) / 2,
    borderWidth: 1,
    borderColor: `${baseColor}60`,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, 1.8);

  // Animation effects
  useEffect(() => {
    if (shouldShow && animate) {
      // Entry animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          tension: 200,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();

      // Continuous pulse animation
      const pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      );
      pulseAnimation.start();

      // Subtle rotation animation
      const rotateAnimation = Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        })
      );
      rotateAnimation.start();

      return () => {
        pulseAnimation.stop();
        rotateAnimation.stop();
      };
    } else if (!shouldShow) {
      // Exit animation
      Animated.timing(scaleAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [shouldShow, animate, scaleAnim, pulseAnim, rotateAnim]);

  const animatedStyle = {
    transform: [
      { scale: animate ? Animated.multiply(scaleAnim, pulseAnim) : 1 },
      {
        rotate: animate 
          ? rotateAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg'],
            })
          : '0deg',
      },
    ],
  };

  if (!children) {
    // Standalone badge
    return shouldShow ? (
      <Animated.View
        style={[
          styles.standalone,
          glassStyle,
          {
            width: badgeWidth,
            height: badgeHeight,
            ...placementStyle,
            transform: [
              { translateX: offset[0] },
              { translateY: offset[1] },
              ...animatedStyle.transform,
            ],
          },
          style,
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
          style={[
            StyleSheet.absoluteFill,
            { opacity: 0.6 }
          ]}
        />
        
        {!dot && (
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeConfig.fontSize,
                color: '#FFFFFF',
                fontWeight: '600',
              },
              textStyle,
            ]}
          >
            {displayText}
          </Text>
        )}
      </Animated.View>
    ) : null;
  }

  // Badge with children (wrapper)
  return (
    <View style={styles.wrapper}>
      {children}
      {shouldShow && (
        <Animated.View
          style={[
            styles.badge,
            glassStyle,
            {
              width: badgeWidth,
              height: badgeHeight,
              ...placementStyle,
              transform: [
                { translateX: offset[0] },
                { translateY: offset[1] },
                ...animatedStyle.transform,
              ],
            },
            style,
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
            style={[
              StyleSheet.absoluteFill,
              { opacity: 0.6 }
            ]}
          />
          
          {!dot && (
            <Text
              style={[
                styles.text,
                {
                  fontSize: sizeConfig.fontSize,
                  color: '#FFFFFF',
                  fontWeight: '600',
                },
                textStyle,
              ]}
            >
              {displayText}
            </Text>
          )}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  standalone: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  badge: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 4,
    zIndex: 1,
  },
  text: {
    textAlign: 'center',
    letterSpacing: 0.5,
  },
});