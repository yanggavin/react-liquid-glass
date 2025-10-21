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

export interface LiquidGlassIconButtonProps extends GlassEffectProps {
  onPress: () => void;
  icon: React.ReactNode;
  size?: number;
  variant?: 'standard' | 'filled' | 'tonal' | 'outlined';
  disabled?: boolean;
  style?: ViewStyle;
  selected?: boolean;
  toggle?: boolean;
}

const VARIANT_CONFIGS = {
  standard: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  filled: {
    backgroundColor: '#6750A4',
    borderWidth: 0,
    elevation: 1,
  },
  tonal: {
    backgroundColor: '#E8DEF8',
    borderWidth: 0,
    elevation: 1,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#79747E',
    elevation: 0,
  },
};

export const LiquidGlassIconButton: React.FC<LiquidGlassIconButtonProps> = ({
  onPress,
  icon,
  size = 40,
  variant = 'standard',
  disabled = false,
  style,
  selected = false,
  toggle = false,
  blurRadius = 8,
  tintColor,
  opacity = 0.15,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const rippleAnim = useRef(new Animated.Value(0)).current;
  const rippleOpacity = useRef(new Animated.Value(0)).current;
  const selectionAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  const variantConfig = VARIANT_CONFIGS[variant];
  const baseColor = tintColor || (selected ? '#6750A4' : variantConfig.backgroundColor || '#FFFFFF');
  
  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity: variant === 'standard' ? 0.1 : opacity,
    borderRadius: size / 2,
    borderWidth: variantConfig.borderWidth,
    borderColor: variantConfig.borderColor,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, selected ? 2.0 : 1.5);

  React.useEffect(() => {
    if (toggle) {
      Animated.spring(selectionAnim, {
        toValue: selected ? 1 : 0,
        tension: 150,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }, [selected, toggle, selectionAnim]);

  const handlePressIn = useCallback(() => {
    if (disabled) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.94,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(rippleOpacity, {
          toValue: 0.4,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(rippleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [disabled, scaleAnim, liquidAnim, rippleAnim, rippleOpacity]);

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
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(rippleOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, scaleAnim, liquidAnim, rippleOpacity]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const rippleStyle = {
    opacity: rippleOpacity,
    transform: [{
      scale: rippleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 2],
      }),
    }],
  };

  const selectionOverlayStyle = {
    opacity: selectionAnim,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        glassStyle,
        {
          width: size,
          height: size,
          opacity: disabled ? 0.38 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={variant === 'filled' || selected ? 'dark' : 'light'}
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={baseColor}
      />
      
      {/* Selection overlay for toggle buttons */}
      {toggle && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            selectionOverlayStyle,
            { borderRadius: size / 2 },
          ]}
        >
          <LinearGradient
            colors={['#6750A440', '#6750A480', '#6750A440']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
      
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
            { borderRadius: size / 2 },
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
            styles.ripple,
            rippleStyle,
            {
              width: size * 0.6,
              height: size * 0.6,
              borderRadius: size * 0.3,
            },
          ]}
        />

        <Animated.View style={styles.iconContainer}>
          {icon}
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});