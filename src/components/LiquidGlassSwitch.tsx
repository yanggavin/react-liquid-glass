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

export interface LiquidGlassSwitchProps extends GlassEffectProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: ViewStyle;
  trackColor?: { false?: string; true?: string };
  thumbColor?: string;
  ios_backgroundColor?: string;
}

const SIZE_CONFIGS = {
  small: {
    width: 40,
    height: 24,
    thumbSize: 20,
    padding: 2,
  },
  medium: {
    width: 52,
    height: 32,
    thumbSize: 28,
    padding: 2,
  },
  large: {
    width: 64,
    height: 40,
    thumbSize: 36,
    padding: 2,
  },
};

export const LiquidGlassSwitch: React.FC<LiquidGlassSwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  size = 'medium',
  style,
  trackColor = { false: '#79747E', true: '#6750A4' },
  thumbColor = '#FFFFFF',
  ios_backgroundColor,
  blurRadius = 8,
  tintColor,
  opacity = 0.25,
  ...glassProps
}) => {
  const sizeConfig = SIZE_CONFIGS[size];
  
  const switchAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const thumbScaleAnim = useRef(new Animated.Value(1)).current;

  const activeTrackColor = tintColor || trackColor.true || '#6750A4';
  const inactiveTrackColor = ios_backgroundColor || trackColor.false || '#79747E';
  const currentTrackColor = value ? activeTrackColor : inactiveTrackColor;

  React.useEffect(() => {
    Animated.spring(switchAnim, {
      toValue: value ? 1 : 0,
      tension: 150,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [value, switchAnim]);

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: currentTrackColor,
    opacity,
    borderRadius: sizeConfig.height / 2,
    borderWidth: 1,
    borderColor: `${currentTrackColor}60`,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(currentTrackColor, value ? 2.0 : 1.0);

  const handlePressIn = useCallback(() => {
    if (disabled) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        ...pressConfig,
      }),
      Animated.spring(thumbScaleAnim, {
        toValue: 1.1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, scaleAnim, thumbScaleAnim, liquidAnim]);

  const handlePressOut = useCallback(() => {
    if (disabled) return;

    const releaseConfig = getLiquidAnimationConfig('release');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...releaseConfig,
      }),
      Animated.spring(thumbScaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(liquidAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, scaleAnim, thumbScaleAnim, liquidAnim]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    onValueChange(!value);
  }, [disabled, value, onValueChange]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const trackColorStyle = {
    backgroundColor: switchAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [inactiveTrackColor + '40', activeTrackColor + '60'],
    }),
  };

  const thumbTranslateX = switchAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [sizeConfig.padding, sizeConfig.width - sizeConfig.thumbSize - sizeConfig.padding],
  });

  const thumbAnimatedStyle = {
    transform: [
      { translateX: thumbTranslateX },
      { scale: thumbScaleAnim },
    ],
  };

  return (
    <Animated.View
      style={[
        styles.container,
        glassStyle,
        {
          width: sizeConfig.width,
          height: sizeConfig.height,
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={currentTrackColor}
      />

      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1}
      >
        {/* Track color background */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            trackColorStyle,
            { borderRadius: sizeConfig.height / 2 },
          ]}
        />

        {/* Liquid overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: sizeConfig.height / 2 },
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

        {/* Thumb */}
        <Animated.View
          style={[
            styles.thumb,
            {
              width: sizeConfig.thumbSize,
              height: sizeConfig.thumbSize,
              borderRadius: sizeConfig.thumbSize / 2,
              top: sizeConfig.padding,
              backgroundColor: thumbColor,
            },
            thumbAnimatedStyle,
          ]}
        >
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"
            blurAmount={4}
            reducedTransparencyFallbackColor={thumbColor}
          />
          
          {/* Thumb liquid effect */}
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              { 
                borderRadius: sizeConfig.thumbSize / 2,
                opacity: liquidAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 0.3],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={[thumbColor + '40', thumbColor + '80', thumbColor + '40']}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
    justifyContent: 'center',
  },
  thumb: {
    position: 'absolute',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    overflow: 'hidden',
  },
});