import React, { useRef, useCallback } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient, getLiquidAnimationConfig } from '../utils/glassEffects';

export interface SegmentedButtonOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface LiquidGlassSegmentedButtonProps extends GlassEffectProps {
  options: SegmentedButtonOption[];
  selectedValue?: string;
  onValueChange: (value: string) => void;
  multiSelect?: boolean;
  selectedValues?: string[];
  style?: ViewStyle;
  buttonStyle?: ViewStyle;
  textStyle?: TextStyle;
  density?: 'default' | 'comfortable' | 'compact';
}

const DENSITY_CONFIGS = {
  default: { height: 40, paddingHorizontal: 24, fontSize: 14 },
  comfortable: { height: 48, paddingHorizontal: 24, fontSize: 14 },
  compact: { height: 32, paddingHorizontal: 16, fontSize: 12 },
};

export const LiquidGlassSegmentedButton: React.FC<LiquidGlassSegmentedButtonProps> = ({
  options,
  selectedValue,
  onValueChange,
  multiSelect = false,
  selectedValues = [],
  style,
  buttonStyle,
  textStyle,
  density = 'default',
  blurRadius = 8,
  tintColor = '#6750A4',
  opacity = 0.15,
  ...glassProps
}) => {
  const densityConfig = DENSITY_CONFIGS[density];
  const buttonAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;
  const liquidAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;
  const selectionAnimations = useRef<Map<string, Animated.Value>>(new Map()).current;

  // Initialize animations for each option
  options.forEach(option => {
    if (!buttonAnimations.has(option.value)) {
      buttonAnimations.set(option.value, new Animated.Value(1));
    }
    if (!liquidAnimations.has(option.value)) {
      liquidAnimations.set(option.value, new Animated.Value(0));
    }
    if (!selectionAnimations.has(option.value)) {
      const isSelected = multiSelect 
        ? selectedValues.includes(option.value)
        : selectedValue === option.value;
      selectionAnimations.set(option.value, new Animated.Value(isSelected ? 1 : 0));
    }
  });

  const containerStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity: 0.1,
    borderRadius: densityConfig.height / 2,
    borderWidth: 1,
    borderColor: `${tintColor}40`,
    ...glassProps,
  });

  // Update selection animations when selectedValue/selectedValues change
  React.useEffect(() => {
    options.forEach(option => {
      const isSelected = multiSelect 
        ? selectedValues.includes(option.value)
        : selectedValue === option.value;
      const anim = selectionAnimations.get(option.value);
      if (anim) {
        Animated.spring(anim, {
          toValue: isSelected ? 1 : 0,
          tension: 150,
          friction: 8,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [selectedValue, selectedValues, multiSelect, options, selectionAnimations]);

  const handlePressIn = useCallback((value: string) => {
    const buttonAnim = buttonAnimations.get(value);
    const liquidAnim = liquidAnimations.get(value);
    if (!buttonAnim || !liquidAnim) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(buttonAnim, {
        toValue: 0.96,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonAnimations, liquidAnimations]);

  const handlePressOut = useCallback((value: string) => {
    const buttonAnim = buttonAnimations.get(value);
    const liquidAnim = liquidAnimations.get(value);
    if (!buttonAnim || !liquidAnim) return;

    const releaseConfig = getLiquidAnimationConfig('release');
    
    Animated.parallel([
      Animated.spring(buttonAnim, {
        toValue: 1,
        ...releaseConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [buttonAnimations, liquidAnimations]);

  const handlePress = useCallback((value: string) => {
    if (multiSelect) {
      // Multi-select logic would be handled by parent component
      onValueChange(value);
    } else {
      onValueChange(value);
    }
  }, [multiSelect, onValueChange]);

  const renderButton = (option: SegmentedButtonOption, index: number) => {
    const isSelected = multiSelect 
      ? selectedValues.includes(option.value)
      : selectedValue === option.value;
    const isFirst = index === 0;
    const isLast = index === options.length - 1;
    
    const buttonAnim = buttonAnimations.get(option.value) || new Animated.Value(1);
    const liquidAnim = liquidAnimations.get(option.value) || new Animated.Value(0);
    const selectionAnim = selectionAnimations.get(option.value) || new Animated.Value(isSelected ? 1 : 0);

    const liquidGradient = createLiquidGradient(tintColor, 1.5);

    const buttonAnimatedStyle = {
      transform: [{ scale: buttonAnim }],
    };

    const liquidOverlayStyle = {
      opacity: liquidAnim,
    };

    return (
      <Animated.View
        key={option.value}
        style={[
          styles.buttonContainer,
          {
            flex: 1,
            height: densityConfig.height,
            borderTopLeftRadius: isFirst ? densityConfig.height / 2 : 0,
            borderBottomLeftRadius: isFirst ? densityConfig.height / 2 : 0,
            borderTopRightRadius: isLast ? densityConfig.height / 2 : 0,
            borderBottomRightRadius: isLast ? densityConfig.height / 2 : 0,
            borderRightWidth: isLast ? 0 : 0.5,
            borderRightColor: `${tintColor}20`,
          },
          buttonAnimatedStyle,
          buttonStyle,
        ]}
      >
        {/* Selection background */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: selectionAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['transparent', `${tintColor}30`],
              }),
              borderTopLeftRadius: isFirst ? densityConfig.height / 2 : 0,
              borderBottomLeftRadius: isFirst ? densityConfig.height / 2 : 0,
              borderTopRightRadius: isLast ? densityConfig.height / 2 : 0,
              borderBottomRightRadius: isLast ? densityConfig.height / 2 : 0,
            },
          ]}
        />

        <TouchableOpacity
          style={styles.button}
          onPressIn={() => handlePressIn(option.value)}
          onPressOut={() => handlePressOut(option.value)}
          onPress={() => handlePress(option.value)}
          disabled={option.disabled}
          activeOpacity={1}
        >
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              liquidOverlayStyle,
              {
                borderTopLeftRadius: isFirst ? densityConfig.height / 2 : 0,
                borderBottomLeftRadius: isFirst ? densityConfig.height / 2 : 0,
                borderTopRightRadius: isLast ? densityConfig.height / 2 : 0,
                borderBottomRightRadius: isLast ? densityConfig.height / 2 : 0,
              },
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

          <View style={styles.buttonContent}>
            {option.icon && (
              <View style={styles.iconContainer}>
                {option.icon}
              </View>
            )}
            <Animated.Text
              style={[
                styles.buttonText,
                {
                  fontSize: densityConfig.fontSize,
                  color: selectionAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['rgba(255, 255, 255, 0.7)', '#FFFFFF'],
                  }),
                  fontWeight: isSelected ? '600' : '400',
                  marginLeft: option.icon ? 8 : 0,
                },
                textStyle,
              ]}
            >
              {option.label}
            </Animated.Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={[styles.container, containerStyle, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={tintColor}
      />
      <View style={styles.buttonsContainer}>
        {options.map(renderButton)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  buttonContainer: {
    overflow: 'hidden',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    textAlign: 'center',
    letterSpacing: 0.1,
  },
});