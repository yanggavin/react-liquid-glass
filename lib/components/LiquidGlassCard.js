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
exports.LiquidGlassCard = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const blur_1 = require("@react-native-community/blur");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const glassEffects_1 = require("../utils/glassEffects");
const { width: screenWidth, height: screenHeight } = react_native_1.Dimensions.get('window');
const LiquidGlassCard = ({ children, style, onPress, disabled = false, liquidEffect = true, animationDuration = 300, blurRadius = 10, tintColor = '#FFFFFF', opacity = 0.15, ...glassProps }) => {
    const scaleAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(1)).current;
    const liquidAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const rippleAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const rippleOpacity = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const ripplePosition = (0, react_1.useRef)({ x: 0, y: 0 });
    const glassStyle = (0, glassEffects_1.createGlassStyle)({
        blurRadius,
        tintColor,
        opacity,
        ...glassProps,
    });
    const liquidGradient = (0, glassEffects_1.createLiquidGradient)(tintColor, 1.2);
    const handlePressIn = (0, react_1.useCallback)((event) => {
        if (disabled)
            return;
        const { locationX, locationY } = event.nativeEvent;
        ripplePosition.current = { x: locationX || 50, y: locationY || 50 };
        const pressConfig = (0, glassEffects_1.getLiquidAnimationConfig)('press');
        react_native_1.Animated.parallel([
            react_native_1.Animated.spring(scaleAnim, {
                toValue: 0.98,
                ...pressConfig,
            }),
            liquidEffect ? react_native_1.Animated.timing(liquidAnim, {
                toValue: 1,
                duration: animationDuration,
                useNativeDriver: true,
            }) : react_native_1.Animated.timing(new react_native_1.Animated.Value(0), { toValue: 0, duration: 0, useNativeDriver: true }),
            react_native_1.Animated.sequence([
                react_native_1.Animated.timing(rippleOpacity, {
                    toValue: 0.6,
                    duration: 0,
                    useNativeDriver: true,
                }),
                react_native_1.Animated.timing(rippleAnim, {
                    toValue: 1,
                    duration: animationDuration * 1.5,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [disabled, liquidEffect, animationDuration, scaleAnim, liquidAnim, rippleAnim, rippleOpacity]);
    const handlePressOut = (0, react_1.useCallback)(() => {
        if (disabled)
            return;
        const releaseConfig = (0, glassEffects_1.getLiquidAnimationConfig)('release');
        react_native_1.Animated.parallel([
            react_native_1.Animated.spring(scaleAnim, {
                toValue: 1,
                ...releaseConfig,
            }),
            react_native_1.Animated.timing(liquidAnim, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(rippleOpacity, {
                toValue: 0,
                duration: animationDuration,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(rippleAnim, {
                toValue: 0,
                duration: animationDuration / 2,
                useNativeDriver: true,
            }),
        ]).start();
    }, [disabled, animationDuration, scaleAnim, liquidAnim, rippleOpacity, rippleAnim]);
    const animatedStyle = {
        transform: [{ scale: scaleAnim }],
    };
    const rippleStyle = {
        opacity: rippleOpacity,
        transform: [
            {
                scale: rippleAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 4],
                }),
            },
        ],
    };
    const liquidOverlayStyle = {
        opacity: liquidAnim,
    };
    if (!onPress) {
        return (<react_native_1.View style={[glassStyle, style]}>
        <blur_1.BlurView style={react_native_1.StyleSheet.absoluteFill} blurType="light" blurAmount={blurRadius} reducedTransparencyFallbackColor={tintColor}/>
        {children}
      </react_native_1.View>);
    }
    return (<react_native_1.Animated.View style={[animatedStyle, glassStyle, style]}>
      <blur_1.BlurView style={react_native_1.StyleSheet.absoluteFill} blurType="light" blurAmount={blurRadius} reducedTransparencyFallbackColor={tintColor}/>
      
      <react_native_1.TouchableOpacity style={styles.touchable} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} disabled={disabled} activeOpacity={1}>
        {liquidEffect && (<react_native_1.Animated.View style={[
                react_native_1.StyleSheet.absoluteFill,
                liquidOverlayStyle,
                { borderRadius: glassProps.borderRadius || 16 },
            ]}>
            <react_native_linear_gradient_1.default colors={liquidGradient.colors} locations={liquidGradient.locations} start={liquidGradient.start} end={liquidGradient.end} style={react_native_1.StyleSheet.absoluteFill}/>
          </react_native_1.Animated.View>)}
        
        <react_native_1.Animated.View style={[
            styles.ripple,
            rippleStyle,
            {
                left: ripplePosition.current.x - 25,
                top: ripplePosition.current.y - 25,
            },
        ]}/>
        
        {children}
      </react_native_1.TouchableOpacity>
    </react_native_1.Animated.View>);
};
exports.LiquidGlassCard = LiquidGlassCard;
const styles = react_native_1.StyleSheet.create({
    touchable: {
        flex: 1,
        overflow: 'hidden',
    },
    ripple: {
        position: 'absolute',
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
});
//# sourceMappingURL=LiquidGlassCard.js.map