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
exports.LiquidGlassPanel = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const blur_1 = require("@react-native-community/blur");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const glassEffects_1 = require("../utils/glassEffects");
const { width: screenWidth, height: screenHeight } = react_native_1.Dimensions.get('window');
const POSITION_STYLES = {
    top: { top: 0, left: 0, right: 0 },
    bottom: { bottom: 0, left: 0, right: 0 },
    left: { top: 0, left: 0, bottom: 0, width: '80%' },
    right: { top: 0, right: 0, bottom: 0, width: '80%' },
    center: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -screenWidth * 0.4 }, { translateY: -100 }],
        width: '80%',
        maxHeight: '70%'
    },
};
const SLIDE_CONFIGS = {
    up: { from: screenHeight, to: 0 },
    down: { from: -screenHeight, to: 0 },
    left: { from: screenWidth, to: 0 },
    right: { from: -screenWidth, to: 0 },
};
const LiquidGlassPanel = ({ children, style, position = 'center', slideAnimation = true, slideDirection = 'up', blurRadius = 12, tintColor = '#FFFFFF', opacity = 0.2, ...glassProps }) => {
    const slideAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(slideAnimation ? SLIDE_CONFIGS[slideDirection].from : 0)).current;
    const fadeAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const scaleAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0.9)).current;
    const glassStyle = (0, glassEffects_1.createGlassStyle)({
        blurRadius,
        tintColor,
        opacity,
        ...glassProps,
    });
    const liquidGradient = (0, glassEffects_1.createLiquidGradient)(tintColor, 0.8);
    (0, react_1.useEffect)(() => {
        react_native_1.Animated.parallel([
            react_native_1.Animated.spring(slideAnim, {
                toValue: SLIDE_CONFIGS[slideDirection].to,
                tension: 100,
                friction: 8,
                useNativeDriver: true,
            }),
            react_native_1.Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            react_native_1.Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 150,
                friction: 8,
                useNativeDriver: true,
            }),
        ]).start();
    }, [slideAnim, fadeAnim, scaleAnim, slideDirection]);
    const getAnimatedStyle = () => {
        const baseTransform = [];
        if (slideAnimation) {
            if (slideDirection === 'up' || slideDirection === 'down') {
                baseTransform.push({ translateY: slideAnim });
            }
            else {
                baseTransform.push({ translateX: slideAnim });
            }
        }
        if (position === 'center') {
            baseTransform.push({ scale: scaleAnim });
        }
        return {
            opacity: fadeAnim,
            transform: baseTransform,
        };
    };
    const positionStyle = position !== 'center'
        ? POSITION_STYLES[position]
        : {
            position: 'absolute',
            alignSelf: 'center',
            top: '20%',
            width: '85%',
            maxHeight: '60%',
        };
    return (<react_native_1.Animated.View style={[
            styles.container,
            glassStyle,
            positionStyle,
            getAnimatedStyle(),
            style,
        ]}>
      <blur_1.BlurView style={react_native_1.StyleSheet.absoluteFill} blurType="light" blurAmount={blurRadius} reducedTransparencyFallbackColor={tintColor}/>
      
      <react_native_linear_gradient_1.default colors={liquidGradient.colors} locations={liquidGradient.locations} start={liquidGradient.start} end={liquidGradient.end} style={[
            react_native_1.StyleSheet.absoluteFill,
            { opacity: 0.3 }
        ]}/>
      
      <react_native_1.View style={styles.content}>
        {children}
      </react_native_1.View>
    </react_native_1.Animated.View>);
};
exports.LiquidGlassPanel = LiquidGlassPanel;
const styles = react_native_1.StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 100,
    },
    content: {
        flex: 1,
        padding: 20,
    },
});
//# sourceMappingURL=LiquidGlassPanel.js.map