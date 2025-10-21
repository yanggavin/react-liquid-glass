import React, { useRef, useCallback, useState } from 'react';
import {
  TextInput,
  Text,
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient } from '../utils/glassEffects';

export interface LiquidGlassTextFieldProps extends GlassEffectProps, Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  variant?: 'filled' | 'outlined';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  error?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
}

const SIZE_CONFIGS = {
  small: { height: 40, fontSize: 14, paddingHorizontal: 12 },
  medium: { height: 48, fontSize: 16, paddingHorizontal: 16 },
  large: { height: 56, fontSize: 18, paddingHorizontal: 20 },
};

export const LiquidGlassTextField: React.FC<LiquidGlassTextFieldProps> = ({
  label,
  helperText,
  errorText,
  leadingIcon,
  trailingIcon,
  variant = 'filled',
  size = 'medium',
  disabled = false,
  error = false,
  style,
  inputStyle,
  labelStyle,
  value,
  onFocus,
  onBlur,
  onChangeText,
  blurRadius = 8,
  tintColor = '#6750A4',
  opacity = 0.1,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;
  const focusAnim = useRef(new Animated.Value(0)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(error ? 1 : 0)).current;

  const sizeConfig = SIZE_CONFIGS[size];
  const hasValue = Boolean(internalValue);
  const shouldFloat = isFocused || hasValue;

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: error ? '#DC2626' : tintColor,
    opacity: isFocused ? opacity * 1.5 : opacity,
    borderRadius: variant === 'outlined' ? 8 : 12,
    borderWidth: variant === 'outlined' ? 2 : 0,
    borderColor: error 
      ? '#DC2626' 
      : isFocused 
        ? tintColor 
        : 'rgba(255, 255, 255, 0.3)',
    ...props,
  });

  const liquidGradient = createLiquidGradient(
    error ? '#DC2626' : tintColor, 
    isFocused ? 1.5 : 1
  );

  React.useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: shouldFloat ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [shouldFloat, labelAnim]);

  React.useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [error, errorAnim]);

  const handleFocus = useCallback((e: any) => {
    setIsFocused(true);
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    onFocus?.(e);
  }, [focusAnim, liquidAnim, onFocus]);

  const handleBlur = useCallback((e: any) => {
    setIsFocused(false);
    Animated.parallel([
      Animated.timing(focusAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(liquidAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
    onBlur?.(e);
  }, [focusAnim, liquidAnim, onBlur]);

  const handleChangeText = useCallback((text: string) => {
    setInternalValue(text);
    onChangeText?.(text);
  }, [onChangeText]);

  const labelAnimatedStyle = {
    transform: [
      {
        translateY: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -sizeConfig.height * 0.6],
        }),
      },
      {
        scale: labelAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.8],
        }),
      },
    ],
    opacity: labelAnim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.7, 0.5, 1],
    }),
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.inputContainer,
          glassStyle,
          {
            height: sizeConfig.height,
            paddingHorizontal: sizeConfig.paddingHorizontal,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
      >
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={blurRadius}
          reducedTransparencyFallbackColor={tintColor}
        />
        
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: variant === 'outlined' ? 8 : 12 },
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

        <View style={styles.inputWrapper}>
          {leadingIcon && (
            <View style={styles.leadingIcon}>
              {leadingIcon}
            </View>
          )}
          
          <View style={styles.textInputContainer}>
            {label && (
              <Animated.Text
                style={[
                  styles.label,
                  {
                    fontSize: sizeConfig.fontSize * 0.85,
                    color: error 
                      ? '#DC2626' 
                      : isFocused 
                        ? tintColor 
                        : 'rgba(255, 255, 255, 0.7)',
                    left: 0,
                    top: sizeConfig.height * 0.3,
                  },
                  labelAnimatedStyle,
                  labelStyle,
                ]}
              >
                {label}
              </Animated.Text>
            )}
            
            <TextInput
              {...props}
              value={internalValue}
              onChangeText={handleChangeText}
              onFocus={handleFocus}
              onBlur={handleBlur}
              editable={!disabled}
              style={[
                styles.textInput,
                {
                  fontSize: sizeConfig.fontSize,
                  color: '#FFFFFF',
                  paddingTop: shouldFloat ? sizeConfig.height * 0.3 : 0,
                },
                inputStyle,
              ]}
              placeholderTextColor="rgba(255, 255, 255, 0.5)"
            />
          </View>
          
          {trailingIcon && (
            <View style={styles.trailingIcon}>
              {trailingIcon}
            </View>
          )}
        </View>
      </View>

      {/* Helper/Error text */}
      {(helperText || errorText) && (
        <Animated.Text
          style={[
            styles.helperText,
            {
              color: error ? '#DC2626' : 'rgba(255, 255, 255, 0.6)',
              opacity: error ? errorAnim : 1,
            },
          ]}
        >
          {error ? errorText : helperText}
        </Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    overflow: 'hidden',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    position: 'relative',
  },
  textInput: {
    flex: 1,
    margin: 0,
    padding: 0,
    textAlignVertical: 'center',
  },
  label: {
    position: 'absolute',
    fontWeight: '500',
    letterSpacing: 0.15,
    pointerEvents: 'none',
  },
  leadingIcon: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trailingIcon: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helperText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
    letterSpacing: 0.4,
  },
});