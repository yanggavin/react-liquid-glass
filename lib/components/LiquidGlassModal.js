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
exports.LiquidGlassModal = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const blur_1 = require("@react-native-community/blur");
const react_native_linear_gradient_1 = __importDefault(require("react-native-linear-gradient"));
const glassEffects_1 = require("../utils/glassEffects");
const { width: screenWidth, height: screenHeight } = react_native_1.Dimensions.get('window');
const LiquidGlassModal = ({ visible, onClose, children, style, backdropBlur = true, backdropOpacity = 0.4, animationType = 'fade', closeOnBackdropPress = true, blurRadius = 15, tintColor = '#FFFFFF', opacity = 0.25, ...glassProps }) => {
    const backdropAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const contentAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0)).current;
    const scaleAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(0.8)).current;
    const slideAnim = (0, react_1.useRef)(new react_native_1.Animated.Value(screenHeight)).current;
    const glassStyle = (0, glassEffects_1.createGlassStyle)({
        blurRadius,
        tintColor,
        opacity,
        ...glassProps,
    });
    const liquidGradient = (0, glassEffects_1.createLiquidGradient)(tintColor, 1.2);
    (0, react_1.useEffect)(() => {
        if (visible) {
            const animations = [
                react_native_1.Animated.timing(backdropAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ];
            switch (animationType) {
                case 'scale':
                    animations.push(react_native_1.Animated.spring(scaleAnim, {
                        toValue: 1,
                        tension: 150,
                        friction: 8,
                        useNativeDriver: true,
                    }));
                    break;
                case 'slide':
                    animations.push(react_native_1.Animated.spring(slideAnim, {
                        toValue: 0,
                        tension: 100,
                        friction: 8,
                        useNativeDriver: true,
                    }));
                    break;
                default: // fade
                    animations.push(react_native_1.Animated.timing(contentAnim, {
                        toValue: 1,
                        duration: 300,
                        useNativeDriver: true,
                    }));
                    break;
            }
            react_native_1.Animated.parallel(animations).start();
        }
        else {
            const animations = [
                react_native_1.Animated.timing(backdropAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ];
            switch (animationType) {
                case 'scale':
                    animations.push(react_native_1.Animated.timing(scaleAnim, {
                        toValue: 0.8,
                        duration: 250,
                        useNativeDriver: true,
                    }));
                    break;
                case 'slide':
                    animations.push(react_native_1.Animated.timing(slideAnim, {
                        toValue: screenHeight,
                        duration: 300,
                        useNativeDriver: true,
                    }));
                    break;
                default: // fade
                    animations.push(react_native_1.Animated.timing(contentAnim, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true,
                    }));
                    break;
            }
            react_native_1.Animated.parallel(animations).start();
        }
    }, [visible, animationType, backdropAnim, contentAnim, scaleAnim, slideAnim]);
    const handleBackdropPress = (0, react_1.useCallback)(() => {
        if (closeOnBackdropPress) {
            onClose();
        }
    }, [closeOnBackdropPress, onClose]);
    const getContentStyle = () => {
        const baseStyle = { opacity: contentAnim };
        switch (animationType) {
            case 'scale':
                return {
                    ...baseStyle,
                    transform: [{ scale: scaleAnim }],
                };
            case 'slide':
                return {
                    ...baseStyle,
                    transform: [{ translateY: slideAnim }],
                };
            default:
                return baseStyle;
        }
    };
    if (!visible) {
        return null;
    }
    return (<react_native_1.Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <react_native_1.StatusBar backgroundColor="transparent" barStyle="light-content"/>
      <react_native_1.View style={styles.overlay}>
        {/* Backdrop */}
        <react_native_1.Animated.View style={[
            react_native_1.StyleSheet.absoluteFill,
            { opacity: backdropAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, backdropOpacity],
                }) },
        ]}>
          {backdropBlur ? (<blur_1.BlurView style={react_native_1.StyleSheet.absoluteFill} blurType="dark" blurAmount={8} reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"/>) : (<react_native_1.View style={[react_native_1.StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}/>)}
        </react_native_1.Animated.View>

        {/* Backdrop TouchableOpacity */}
        <react_native_1.TouchableOpacity style={react_native_1.StyleSheet.absoluteFill} onPress={handleBackdropPress} activeOpacity={1}/>

        <react_native_1.SafeAreaView style={styles.safeArea}>
          <react_native_1.View style={styles.modalContainer}>
            <react_native_1.Animated.View style={[
            styles.content,
            glassStyle,
            getContentStyle(),
            style,
        ]}>
              <blur_1.BlurView style={react_native_1.StyleSheet.absoluteFill} blurType="light" blurAmount={blurRadius} reducedTransparencyFallbackColor={tintColor}/>
              
              <react_native_linear_gradient_1.default colors={liquidGradient.colors} locations={liquidGradient.locations} start={liquidGradient.start} end={liquidGradient.end} style={[
            react_native_1.StyleSheet.absoluteFill,
            { opacity: 0.4, borderRadius: glassProps.borderRadius || 24 }
        ]}/>
              
              <react_native_1.View style={styles.childrenContainer}>
                {children}
              </react_native_1.View>
            </react_native_1.Animated.View>
          </react_native_1.View>
        </react_native_1.SafeAreaView>
      </react_native_1.View>
    </react_native_1.Modal>);
};
exports.LiquidGlassModal = LiquidGlassModal;
const styles = react_native_1.StyleSheet.create({
    overlay: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    content: {
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
        borderRadius: 24,
        overflow: 'hidden',
    },
    childrenContainer: {
        padding: 24,
    },
});
//# sourceMappingURL=LiquidGlassModal.js.map