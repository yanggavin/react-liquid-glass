import React, { useRef, useCallback } from 'react';
import {
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  ActivityIndicator,
  // Haptics - import from expo-haptics if available
  Platform,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { LiquidGlassButtonProps } from '../types';
import { createGlassStyle, createLiquidGradient, getLiquidAnimationConfig, createRgbaColor } from '../utils/glassEffects';

const SIZE_CONFIGS = {
  small: { height: 40, paddingHorizontal: 16, fontSize: 14 },
  medium: { height: 48, paddingHorizontal: 24, fontSize: 16 },
  large: { height: 56, paddingHorizontal: 32, fontSize: 18 },
};

const VARIANT_COLORS = {
  primary: '#007AFF',
  secondary: '#8E8E93',
  outline: '#FFFFFF',
};

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  title,
  onPress,
  disabled = false,
  style,
  textStyle,
  variant = 'primary',
  size = 'medium',
  loading = false,
  hapticFeedback = true,
  blurRadius = 8,
  tintColor,
  opacity = 0.2,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const buttonColorAnim = useRef(new Animated.Value(0)).current;

  const sizeConfig = SIZE_CONFIGS[size];
  const baseColor = tintColor || VARIANT_COLORS[variant];
  
  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity: variant === 'outline' ? 0.1 : opacity,
    borderColor: variant === 'outline' ? createRgbaColor(baseColor, 0.5) : createRgbaColor(baseColor, 0.3),
    borderWidth: variant === 'outline' ? 2 : 1,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, 1.5);

  const handlePressIn = useCallback(() => {
    if (disabled || loading) return;

    // Haptic feedback would be implemented with expo-haptics or react-native-haptic-feedback

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonColorAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: false,
      }),
    ]).start();
  }, [disabled, loading, hapticFeedback, scaleAnim, liquidAnim, buttonColorAnim]);

  const handlePressOut = useCallback(() => {
    if (disabled || loading) return;

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
      Animated.timing(buttonColorAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [disabled, loading, scaleAnim, liquidAnim, buttonColorAnim]);

  const handlePress = useCallback(() => {
    if (disabled || loading) return;
    
    // Haptic feedback would be implemented with expo-haptics or react-native-haptic-feedback
    
    onPress();
  }, [disabled, loading, hapticFeedback, onPress]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const textColor = variant === 'outline' ? baseColor : '#FFFFFF';
  const disabledOpacity = disabled ? 0.5 : 1;

  return (
    <Animated.View
      style={[
        styles.container,
        glassStyle,
        { height: sizeConfig.height, opacity: disabledOpacity },
        animatedStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={variant === 'outline' ? 'light' : 'dark'}
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={baseColor}
      />
      
      <TouchableOpacity
        style={[
          styles.button,
          { paddingHorizontal: sizeConfig.paddingHorizontal },
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled || loading}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: glassProps.borderRadius || 12 },
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

        {loading ? (
          <ActivityIndicator 
            color={textColor} 
            size={size === 'large' ? 'large' : 'small'} 
          />
        ) : (
          <Text
            style={[
              styles.text,
              {
                fontSize: sizeConfig.fontSize,
                color: textColor,
                fontWeight: variant === 'primary' ? '600' : '500',
              },
              textStyle,
            ]}
          >
            {title}
          </Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
  },
});