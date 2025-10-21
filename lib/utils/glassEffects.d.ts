import { ViewStyle } from 'react-native';
import { GlassEffectProps, GradientConfig } from '../types';
export declare const DEFAULT_GLASS_PROPS: Required<GlassEffectProps>;
/**
 * Generates glass effect styles for a component
 */
export declare const createGlassStyle: (props?: GlassEffectProps) => ViewStyle;
/**
 * Creates a gradient configuration for liquid effects
 */
export declare const createLiquidGradient: (baseColor: string, intensity?: number) => GradientConfig;
/**
 * Calculates blur radius based on component size and intensity
 */
export declare const calculateBlurRadius: (width: number, height: number, intensity?: number) => number;
/**
 * Generates ripple effect coordinates
 */
export declare const generateRippleEffect: (touchX: number, touchY: number, containerWidth: number, containerHeight: number) => {
    centerX: number;
    centerY: number;
    maxRadius: number;
};
/**
 * Creates animation timing configuration for liquid effects
 */
export declare const getLiquidAnimationConfig: (type: "press" | "release" | "bounce") => {
    duration: number;
    tension: number;
    friction: number;
    useNativeDriver: boolean;
};
/**
 * Converts hex color to RGB values
 */
export declare const hexToRgb: (hex: string) => {
    r: number;
    g: number;
    b: number;
};
/**
 * Creates RGBA color string with opacity
 */
export declare const createRgbaColor: (hex: string, opacity: number) => string;
//# sourceMappingURL=glassEffects.d.ts.map