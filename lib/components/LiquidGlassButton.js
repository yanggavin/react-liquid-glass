"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiquidGlassButton = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const blur_1 = require("@react-native-community/blur");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const glassEffects_1 = require("../utils/glassEffects");
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
const LiquidGlassButton = ({ title, onPress, disabled = false, style, textStyle, variant = 'primary', size = 'medium', loading = false, hapticFeedback = true, blurRadius = 8, tintColor, opacity = 0.2, ...glassProps }) => {
    const scaleAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const liquidAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const buttonColorAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const sizeConfig = SIZE_CONFIGS[size];
    const baseColor = tintColor || VARIANT_COLORS[variant];
    const glassStyle = (0, glassEffects_1.createGlassStyle)({
        blurRadius,
        tintColor: baseColor,
        opacity: variant === 'outline' ? 0.1 : opacity,
        borderColor: variant === 'outline' ? (0, glassEffects_1.createRgbaColor)(baseColor, 0.5) : (0, glassEffects_1.createRgbaColor)(baseColor, 0.3),
        borderWidth: variant === 'outline' ? 2 : 1,
        ...glassProps,
    });
    const liquidGradient = (0, glassEffects_1.createLiquidGradient)(baseColor, 1.5);
    const handlePressIn = (0, react_1.useCallback)(() => {
        if (disabled || loading)
            return;
        // Haptic feedback would be implemented with expo-haptics or react-native-haptic-feedback
        const pressConfig = (0, glassEffects_1.getLiquidAnimationConfig)('press');
        react_native_1.Animated.parallel([
            react_native_1.Animated.spring(scaleAnim, {
                toValue: 0.96,
                ...pressConfig,
            }),
            react_native_1.Animated.timing(liquidAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(buttonColorAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: false,
            }),
        ]).start();
    }, [disabled, loading, hapticFeedback, scaleAnim, liquidAnim, buttonColorAnim]);
    const handlePressOut = (0, react_1.useCallback)(() => {
        if (disabled || loading)
            return;
        const releaseConfig = (0, glassEffects_1.getLiquidAnimationConfig)('release');
        react_native_1.Animated.parallel([
            react_native_1.Animated.spring(scaleAnim, {
                toValue: 1,
                ...releaseConfig,
            }),
            react_native_1.Animated.timing(liquidAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(buttonColorAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    }, [disabled, loading, scaleAnim, liquidAnim, buttonColorAnim]);
    const handlePress = (0, react_1.useCallback)(() => {
        if (disabled || loading)
            return;
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
    return (<react_native_1.Animated.View style={[
            styles.container,
            glassStyle,
            { height: sizeConfig.height, opacity: disabledOpacity },
            animatedStyle,
            style,
        ]}>
      <blur_1.BlurView style={react_native_1.StyleSheet.absoluteFill} blurType={variant === 'outline' ? 'light' : 'dark'} blurAmount={blurRadius} reducedTransparencyFallbackColor={baseColor}/>
      
      <react_native_1.TouchableOpacity style={[
            styles.button,
            { paddingHorizontal: sizeConfig.paddingHorizontal },
        ]} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handlePress} disabled={disabled || loading} activeOpacity={1}>
        <react_native_1.Animated.View style={[
            react_native_1.StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: glassProps.borderRadius || 12 },
        ]}>
          <react_native_linear_gradient_1.default colors={liquidGradient.colors} locations={liquidGradient.locations} start={liquidGradient.start} end={liquidGradient.end} style={react_native_1.StyleSheet.absoluteFill}/>
        </react_native_1.Animated.View>

        {loading ? (<react_native_1.ActivityIndicator color={textColor} size={size === 'large' ? 'large' : 'small'}/>) : (<react_native_1.Text style={[
                styles.text,
                {
                    fontSize: sizeConfig.fontSize,
                    color: textColor,
                    fontWeight: variant === 'primary' ? '600' : '500',
                },
                textStyle,
            ]}>
            {title}
          </react_native_1.Text>)}
      </react_native_1.TouchableOpacity>
    </react_native_1.Animated.View>);
};
exports.LiquidGlassButton = LiquidGlassButton;
const styles = react_native_1.StyleSheet.create({
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
//# sourceMappingURL=LiquidGlassButton.js.map