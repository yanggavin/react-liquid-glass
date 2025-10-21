import { ViewStyle, Platform } from 'react-native';
import { GlassEffectProps, GradientConfig } from '../types';

export const DEFAULT_GLASS_PROPS: Required<GlassEffectProps> = {
  blurRadius: 10,
  opacity: 0.15,
  tintColor: '#FFFFFF',
  borderRadius: 16,
  borderWidth: 1,
  borderColor: 'rgba(255, 255, 255, 0.2)',
  shadow: true,
  shadowColor: '#000000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
};

/**
 * Generates glass effect styles for a component
 */
export const createGlassStyle = (props: GlassEffectProps = {}): ViewStyle => {
  const config = { ...DEFAULT_GLASS_PROPS, ...props };
  
  const baseStyle: ViewStyle = {
    backgroundColor: `${config.tintColor}${Math.round(config.opacity * 255).toString(16).padStart(2, '0')}`,
    borderRadius: config.borderRadius,
    borderWidth: config.borderWidth,
    borderColor: config.borderColor,
    overflow: 'hidden',
  };

  if (config.shadow) {
    if (Platform.OS === 'ios') {
      return {
        ...baseStyle,
        shadowColor: config.shadowColor,
        shadowOpacity: config.shadowOpacity,
        shadowRadius: config.shadowRadius,
        shadowOffset: config.shadowOffset,
      };
    } else {
      return {
        ...baseStyle,
        elevation: config.shadowRadius,
      };
    }
  }

  return baseStyle;
};

/**
 * Creates a gradient configuration for liquid effects
 */
export const createLiquidGradient = (
  baseColor: string,
  intensity: number = 1
): GradientConfig => {
  const alpha = Math.min(intensity * 0.3, 0.8);
  
  return {
    colors: [
      `${baseColor}${Math.round(alpha * 0.1 * 255).toString(16).padStart(2, '0')}`,
      `${baseColor}${Math.round(alpha * 0.3 * 255).toString(16).padStart(2, '0')}`,
      `${baseColor}${Math.round(alpha * 0.1 * 255).toString(16).padStart(2, '0')}`,
    ],
    locations: [0, 0.5, 1],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  };
};

/**
 * Calculates blur radius based on component size and intensity
 */
export const calculateBlurRadius = (
  width: number,
  height: number,
  intensity: number = 1
): number => {
  const size = Math.max(width, height);
  const baseBlur = Math.min(size * 0.05, 30);
  return Math.round(baseBlur * intensity);
};

/**
 * Generates ripple effect coordinates
 */
export const generateRippleEffect = (
  touchX: number,
  touchY: number,
  containerWidth: number,
  containerHeight: number
) => {
  const maxRadius = Math.sqrt(
    Math.pow(containerWidth, 2) + Math.pow(containerHeight, 2)
  );
  
  return {
    centerX: touchX,
    centerY: touchY,
    maxRadius,
  };
};

/**
 * Creates animation timing configuration for liquid effects
 */
export const getLiquidAnimationConfig = (type: 'press' | 'release' | 'bounce') => {
  switch (type) {
    case 'press':
      return {
        duration: 150,
        tension: 200,
        friction: 7,
        useNativeDriver: true,
      };
    case 'release':
      return {
        duration: 300,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      };
    case 'bounce':
      return {
        duration: 800,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      };
    default:
      return {
        duration: 300,
        tension: 100,
        friction: 7,
        useNativeDriver: true,
      };
  }
};

/**
 * Converts hex color to RGB values
 */
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : { r: 255, g: 255, b: 255 };
};

/**
 * Creates RGBA color string with opacity
 */
export const createRgbaColor = (hex: string, opacity: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};