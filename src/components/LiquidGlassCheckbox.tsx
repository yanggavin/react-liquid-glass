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

export interface LiquidGlassCheckboxProps extends GlassEffectProps {
  checked: boolean;
  onValueChange: (checked: boolean) => void;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: number;
  style?: ViewStyle;
  checkColor?: string;
  error?: boolean;
}

export const LiquidGlassCheckbox: React.FC<LiquidGlassCheckboxProps> = ({
  checked,
  onValueChange,
  disabled = false,
  indeterminate = false,
  size = 24,
  style,
  checkColor = '#FFFFFF',
  error = false,
  blurRadius = 8,
  tintColor = '#6750A4',
  opacity = 0.2,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const checkAnim = useRef(new Animated.Value(checked ? 1 : 0)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const indeterminateAnim = useRef(new Animated.Value(indeterminate ? 1 : 0)).current;
  const errorAnim = useRef(new Animated.Value(error ? 1 : 0)).current;

  const baseColor = error ? '#DC2626' : tintColor;

  React.useEffect(() => {
    Animated.spring(checkAnim, {
      toValue: checked ? 1 : 0,
      tension: 200,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [checked, checkAnim]);

  React.useEffect(() => {
    Animated.spring(indeterminateAnim, {
      toValue: indeterminate ? 1 : 0,
      tension: 150,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [indeterminate, indeterminateAnim]);

  React.useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [error, errorAnim]);

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity: checked || indeterminate ? opacity * 1.5 : opacity,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: checked || indeterminate ? baseColor : `${baseColor}80`,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, checked ? 2.0 : 1.5);

  const handlePressIn = useCallback(() => {
    if (disabled) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, scaleAnim, liquidAnim]);

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
    ]).start();
  }, [disabled, scaleAnim, liquidAnim]);

  const handlePress = useCallback(() => {
    if (disabled) return;
    onValueChange(!checked);
  }, [disabled, checked, onValueChange]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const checkedBackgroundStyle = {
    opacity: checkAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };

  const errorBorderStyle = {
    borderColor: errorAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [checked || indeterminate ? baseColor : `${baseColor}80`, '#DC2626'],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.container,
        glassStyle,
        {
          width: size,
          height: size,
          opacity: disabled ? 0.5 : 1,
        },
        errorBorderStyle,
        animatedStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={checked || indeterminate ? 'dark' : 'light'}
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={baseColor}
      />

      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={1}
      >
        {/* Checked background */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            checkedBackgroundStyle,
            { borderRadius: 4 },
          ]}
        >
          <LinearGradient
            colors={[baseColor, `${baseColor}E0`, baseColor]}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        {/* Liquid overlay */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: 4 },
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

        {/* Checkmark */}
        <Animated.View
          style={[
            styles.checkContainer,
            {
              opacity: checkAnim,
              transform: [
                {
                  scale: checkAnim.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 1.2, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.checkmark,
              {
                width: size * 0.3,
                height: size * 0.15,
                borderColor: checkColor,
                transform: [{ rotate: '-45deg' }],
              },
            ]}
          />
        </Animated.View>

        {/* Indeterminate state */}
        <Animated.View
          style={[
            styles.indeterminateContainer,
            {
              opacity: indeterminateAnim,
              transform: [
                {
                  scale: indeterminateAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.indeterminateLine,
              {
                width: size * 0.5,
                height: 2,
                backgroundColor: checkColor,
              },
            ]}
          />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  indeterminateContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  indeterminateLine: {
    borderRadius: 1,
  },
});