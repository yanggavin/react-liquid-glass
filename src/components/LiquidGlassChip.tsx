import React, { useRef, useCallback, useState } from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient, getLiquidAnimationConfig } from '../utils/glassEffects';

export interface LiquidGlassChipProps extends GlassEffectProps {
  label: string;
  variant?: 'assist' | 'filter' | 'input' | 'suggestion';
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onClose?: () => void;
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  closeIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  size?: 'small' | 'medium';
  elevated?: boolean;
}

const SIZE_CONFIGS = {
  small: {
    height: 24,
    paddingHorizontal: 8,
    fontSize: 11,
    iconSize: 14,
  },
  medium: {
    height: 32,
    paddingHorizontal: 16,
    fontSize: 14,
    iconSize: 18,
  },
};

const VARIANT_CONFIGS = {
  assist: {
    defaultColor: '#6750A4',
    selectedColor: '#E8DEF8',
    showClose: false,
  },
  filter: {
    defaultColor: '#79747E',
    selectedColor: '#E8DEF8',
    showClose: false,
  },
  input: {
    defaultColor: '#6750A4',
    selectedColor: '#E8DEF8',
    showClose: true,
  },
  suggestion: {
    defaultColor: '#79747E',
    selectedColor: '#E8DEF8',
    showClose: false,
  },
};

export const LiquidGlassChip: React.FC<LiquidGlassChipProps> = ({
  label,
  variant = 'assist',
  selected = false,
  disabled = false,
  onPress,
  onClose,
  avatar,
  icon,
  closeIcon,
  style,
  textStyle,
  size = 'medium',
  elevated = false,
  blurRadius = 8,
  tintColor,
  opacity = 0.15,
  ...glassProps
}) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const selectionAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;
  const closeAnim = useRef(new Animated.Value(1)).current;

  const sizeConfig = SIZE_CONFIGS[size];
  const variantConfig = VARIANT_CONFIGS[variant];
  const baseColor = tintColor || (selected ? variantConfig.selectedColor : variantConfig.defaultColor);
  const showClose = variantConfig.showClose && onClose;

  React.useEffect(() => {
    Animated.spring(selectionAnim, {
      toValue: selected ? 1 : 0,
      tension: 150,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [selected, selectionAnim]);

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity: selected ? opacity * 1.5 : opacity,
    borderRadius: sizeConfig.height / 2,
    borderWidth: selected || variant === 'filter' ? 0 : 1,
    borderColor: `${baseColor}60`,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, selected ? 2.0 : 1.5);

  const handlePressIn = useCallback(() => {
    if (disabled) return;
    setIsPressed(true);

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.95,
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
    setIsPressed(false);

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

  const handleClosePress = useCallback(() => {
    if (disabled || !onClose) return;

    Animated.sequence([
      Animated.timing(closeAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(closeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  }, [disabled, onClose, closeAnim]);

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const selectionBackgroundStyle = {
    backgroundColor: selectionAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', `${baseColor}30`],
    }),
  };

  const closeAnimStyle = {
    transform: [{ scale: closeAnim }],
  };

  const textColor = selected 
    ? '#1C1B1F' 
    : variant === 'input' && !selected
      ? '#6750A4'
      : '#FFFFFF';

  return (
    <Animated.View
      style={[
        styles.container,
        glassStyle,
        {
          height: sizeConfig.height,
          paddingHorizontal: sizeConfig.paddingHorizontal,
          opacity: disabled ? 0.38 : 1,
          elevation: elevated ? 1 : 0,
        },
        animatedStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType={selected ? 'light' : 'dark'}
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={baseColor}
      />

      {/* Selection background */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          selectionBackgroundStyle,
          { borderRadius: sizeConfig.height / 2 },
        ]}
      />

      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled || !onPress}
        activeOpacity={1}
      >
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

        <View style={styles.content}>
          {/* Avatar or Icon */}
          {(avatar || icon) && (
            <View style={[styles.leadingElement, { marginRight: 8 }]}>
              {avatar || icon}
            </View>
          )}

          {/* Label */}
          <Text
            style={[
              styles.label,
              {
                fontSize: sizeConfig.fontSize,
                color: textColor,
                fontWeight: selected ? '600' : '500',
              },
              textStyle,
            ]}
          >
            {label}
          </Text>

          {/* Close button */}
          {showClose && (
            <Animated.View style={[styles.closeButton, closeAnimStyle]}>
              <TouchableOpacity
                style={styles.closeButtonTouchable}
                onPress={handleClosePress}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                {closeIcon || (
                  <View style={styles.defaultCloseIcon}>
                    <View style={styles.closeIconLine} />
                    <View style={[styles.closeIconLine, styles.closeIconLineRotated]} />
                  </View>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  touchable: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  leadingElement: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    letterSpacing: 0.1,
    textAlign: 'center',
  },
  closeButton: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonTouchable: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultCloseIcon: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIconLine: {
    position: 'absolute',
    width: 10,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    transform: [{ rotate: '45deg' }],
  },
  closeIconLineRotated: {
    transform: [{ rotate: '-45deg' }],
  },
});