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

const HEX_COLOR_REGEX = /^#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const RGBA_COLOR_REGEX = /^rgba?\((\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(\d*\.?\d+))?\)$/i;

const clampOpacity = (value: number) => {
  if (Number.isNaN(value)) {
    return 0;
  }
  return Math.min(Math.max(value, 0), 1);
};

const normalizeHex = (hex: string) => {
  let value = hex.replace('#', '');

  if (value.length === 3 || value.length === 4) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('');
  }

  if (value.length === 6) {
    return { rgb: value, alpha: 1 };
  }

  if (value.length === 8) {
    const rgb = value.slice(0, 6);
    const alpha = parseInt(value.slice(6, 8), 16) / 255;
    return { rgb, alpha: clampOpacity(alpha) };
  }

  return null;
};

const applyOpacityToColor = (color: string, opacity: number): string => {
  const safeOpacity = clampOpacity(opacity);

  if (HEX_COLOR_REGEX.test(color)) {
    const normalized = normalizeHex(color);

    if (!normalized) {
      return color;
    }

    const combinedAlpha = clampOpacity((normalized.alpha ?? 1) * safeOpacity);
    const alphaHex = Math.round(combinedAlpha * 255)
      .toString(16)
      .padStart(2, '0');

    return `#${normalized.rgb}${alphaHex}`;
  }

  const rgbaMatch = color.match(RGBA_COLOR_REGEX);

  if (rgbaMatch) {
    const r = Math.min(255, parseInt(rgbaMatch[1], 10));
    const g = Math.min(255, parseInt(rgbaMatch[2], 10));
    const b = Math.min(255, parseInt(rgbaMatch[3], 10));
    const alpha = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    const combinedAlpha = clampOpacity(alpha * safeOpacity);

    return `rgba(${r}, ${g}, ${b}, ${combinedAlpha})`;
  }

  if (color.toLowerCase() === 'transparent') {
    return 'rgba(0, 0, 0, 0)';
  }

  return color;
};

/**
 * Generates glass effect styles for a component
 */
export const createGlassStyle = (props: GlassEffectProps = {}): ViewStyle => {
  const config = { ...DEFAULT_GLASS_PROPS, ...props };
  const tintColor = config.tintColor ?? DEFAULT_GLASS_PROPS.tintColor;
  const opacity = config.opacity ?? DEFAULT_GLASS_PROPS.opacity;
  
  const baseStyle: ViewStyle = {
    backgroundColor: applyOpacityToColor(tintColor, opacity),
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
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return { r: 255, g: 255, b: 255, a: 1 };
  }

  return {
    r: parseInt(normalized.rgb.slice(0, 2), 16),
    g: parseInt(normalized.rgb.slice(2, 4), 16),
    b: parseInt(normalized.rgb.slice(4, 6), 16),
    a: normalized.alpha,
  };
};

/**
 * Creates RGBA color string with opacity
 */
export const createRgbaColor = (hex: string, opacity: number): string => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
