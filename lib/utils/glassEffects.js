"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRgbaColor = exports.hexToRgb = exports.getLiquidAnimationConfig = exports.generateRippleEffect = exports.calculateBlurRadius = exports.createLiquidGradient = exports.createGlassStyle = exports.DEFAULT_GLASS_PROPS = void 0;
const react_native_1 = require("react-native");
exports.DEFAULT_GLASS_PROPS = {
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
const createGlassStyle = (props = {}) => {
    const config = { ...exports.DEFAULT_GLASS_PROPS, ...props };
    const baseStyle = {
        backgroundColor: `${config.tintColor}${Math.round(config.opacity * 255).toString(16).padStart(2, '0')}`,
        borderRadius: config.borderRadius,
        borderWidth: config.borderWidth,
        borderColor: config.borderColor,
        overflow: 'hidden',
    };
    if (config.shadow) {
        if (react_native_1.Platform.OS === 'ios') {
            return {
                ...baseStyle,
                shadowColor: config.shadowColor,
                shadowOpacity: config.shadowOpacity,
                shadowRadius: config.shadowRadius,
                shadowOffset: config.shadowOffset,
            };
        }
        else {
            return {
                ...baseStyle,
                elevation: config.shadowRadius,
            };
        }
    }
    return baseStyle;
};
exports.createGlassStyle = createGlassStyle;
/**
 * Creates a gradient configuration for liquid effects
 */
const createLiquidGradient = (baseColor, intensity = 1) => {
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
exports.createLiquidGradient = createLiquidGradient;
/**
 * Calculates blur radius based on component size and intensity
 */
const calculateBlurRadius = (width, height, intensity = 1) => {
    const size = Math.max(width, height);
    const baseBlur = Math.min(size * 0.05, 30);
    return Math.round(baseBlur * intensity);
};
exports.calculateBlurRadius = calculateBlurRadius;
/**
 * Generates ripple effect coordinates
 */
const generateRippleEffect = (touchX, touchY, containerWidth, containerHeight) => {
    const maxRadius = Math.sqrt(Math.pow(containerWidth, 2) + Math.pow(containerHeight, 2));
    return {
        centerX: touchX,
        centerY: touchY,
        maxRadius,
    };
};
exports.generateRippleEffect = generateRippleEffect;
/**
 * Creates animation timing configuration for liquid effects
 */
const getLiquidAnimationConfig = (type) => {
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
exports.getLiquidAnimationConfig = getLiquidAnimationConfig;
/**
 * Converts hex color to RGB values
 */
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
    } : { r: 255, g: 255, b: 255 };
};
exports.hexToRgb = hexToRgb;
/**
 * Creates RGBA color string with opacity
 */
const createRgbaColor = (hex, opacity) => {
    const { r, g, b } = (0, exports.hexToRgb)(hex);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};
exports.createRgbaColor = createRgbaColor;
//# sourceMappingURL=glassEffects.js.map