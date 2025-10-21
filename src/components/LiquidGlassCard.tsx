import React, { useRef, useCallback, useMemo } from 'react';
import {
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { LiquidGlassCardProps } from '../types';
import { createGlassStyle, createGlassHighlights, createLiquidGradient, getLiquidAnimationConfig } from '../utils/glassEffects';

export const LiquidGlassCard: React.FC<LiquidGlassCardProps> = ({
  children,
  style,
  onPress,
  disabled = false,
  liquidEffect = true,
  animationDuration = 300,
  blurRadius = 10,
  tintColor = '#FFFFFF',
  opacity = 0.15,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;

  const ripplePosition = useRef({ x: 0, y: 0 });

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(tintColor, 1.2);
  const highlightIntensity = Math.min(Math.max(opacity * 4, 0.7), 2.2);
  const { highlight: highlightGradient, edge: edgeGradient } = useMemo(
    () => createGlassHighlights(tintColor, highlightIntensity),
    [tintColor, highlightIntensity]
  );

  const handlePressIn = useCallback((event: any) => {
    if (disabled) return;

    const { locationX, locationY } = event.nativeEvent;
    ripplePosition.current = { x: locationX || 50, y: locationY || 50 };

    const pressConfig = getLiquidAnimationConfig('press');
    const animations = [
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        ...pressConfig,
      }),
      Animated.sequence([
        Animated.timing(rippleOpacity, {
          toValue: 0.6,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: animationDuration * 1.5,
          useNativeDriver: true,
        }),
      ]),
    ];

    if (liquidEffect) {
      animations.push(
        Animated.timing(liquidAnim, {
          toValue: 1,
          duration: animationDuration,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [disabled, liquidEffect, animationDuration, scaleAnim, liquidAnim, rippleAnim, rippleOpacity]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;

    const releaseConfig = getLiquidAnimationConfig('release');

    const animations = [
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...releaseConfig,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(rippleAnim, {
        toValue: 0,
        duration: animationDuration / 2,
        useNativeDriver: true,
      }),
    ];

    if (liquidEffect) {
      animations.push(
        Animated.timing(liquidAnim, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [disabled, liquidEffect, animationDuration, scaleAnim, liquidAnim, rippleOpacity, rippleAnim]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const rippleStyle = {
    opacity: rippleOpacity,
    transform: [
      {
        scale: rippleAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 4],
        }),
      },
    ],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  if (!onPress) {
    return (
      <View style={[glassStyle, style]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={blurRadius}
          reducedTransparencyFallbackColor={tintColor}
        />
        {children}
      </View>
    );
  }

  return (
    <Animated.View style={[animatedStyle, glassStyle, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={tintColor}
      />
      <LinearGradient
        pointerEvents="none"
        colors={highlightGradient.colors}
        locations={highlightGradient.locations}
        start={highlightGradient.start}
        end={highlightGradient.end}
        style={styles.overlay}
      />
      <LinearGradient
        pointerEvents="none"
        colors={edgeGradient.colors}
        locations={edgeGradient.locations}
        start={edgeGradient.start}
        end={edgeGradient.end}
        style={styles.overlay}
      />
      
      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
      >
        {liquidEffect && (
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              liquidOverlayStyle,
              { borderRadius: glassProps.borderRadius || 16 },
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
        )}
        
        <Animated.View
          style={[
            styles.ripple,
            rippleStyle,
            {
              left: ripplePosition.current.x - 25,
              top: ripplePosition.current.y - 25,
            },
          ]}
        />
        
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  ripple: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
});
