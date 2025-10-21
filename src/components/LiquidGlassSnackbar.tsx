import React, { useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient } from '../utils/glassEffects';

const { width: screenWidth } = Dimensions.get('window');

export interface LiquidGlassSnackbarProps extends GlassEffectProps {
  visible: boolean;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  duration?: number; // milliseconds, 0 for indefinite
  onDismiss?: () => void;
  position?: 'top' | 'bottom';
  variant?: 'default' | 'success' | 'warning' | 'error';
  style?: ViewStyle;
  messageStyle?: TextStyle;
  actionStyle?: TextStyle;
}

const VARIANT_COLORS = {
  default: '#6750A4',
  success: '#16A34A',
  warning: '#EA580C',
  error: '#DC2626',
};

const VARIANT_ICONS = {
  default: '•',
  success: '✓',
  warning: '⚠',
  error: '✕',
};

export const LiquidGlassSnackbar: React.FC<LiquidGlassSnackbarProps> = ({
  visible,
  message,
  action,
  duration = 4000,
  onDismiss,
  position = 'bottom',
  variant = 'default',
  style,
  messageStyle,
  actionStyle,
  blurRadius = 12,
  tintColor,
  opacity = 0.3,
  ...glassProps
}) => {
  const translateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const baseColor = tintColor || VARIANT_COLORS[variant];
  const isTop = position === 'top';

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor: baseColor,
    opacity,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${baseColor}60`,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(baseColor, 1.8);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.spring(translateAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(liquidAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Progress animation for duration
      if (duration > 0) {
        Animated.timing(progressAnim, {
          toValue: 1,
          duration,
          useNativeDriver: false,
        }).start();

        // Auto dismiss
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(translateAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(liquidAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Reset progress
      progressAnim.setValue(0);
    }
  }, [visible, duration, translateAnim, scaleAnim, liquidAnim, progressAnim]);

  const handleDismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  const getTranslateY = () => {
    return translateAnim.interpolate({
      inputRange: [0, 1],
      outputRange: isTop ? [-100, 0] : [100, 0],
    });
  };

  const animatedStyle = {
    transform: [
      { translateY: getTranslateY() },
      { scale: scaleAnim },
    ],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const progressBarStyle = {
    width: progressAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
  };

  if (!visible && translateAnim._value === 0) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          [position]: 20,
          left: 20,
          right: 20,
        },
        animatedStyle,
      ]}
    >
      <View style={[styles.snackbar, glassStyle, style]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={blurRadius}
          reducedTransparencyFallbackColor={baseColor}
        />

        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: 12 },
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

        {/* Progress bar */}
        {duration > 0 && (
          <Animated.View style={[styles.progressBar, progressBarStyle]}>
            <LinearGradient
              colors={[baseColor + '80', baseColor, baseColor + '80']}
              locations={[0, 0.5, 1]}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        )}

        <View style={styles.content}>
          {/* Variant icon */}
          <View style={styles.iconContainer}>
            <Text style={[styles.icon, { color: '#FFFFFF' }]}>
              {VARIANT_ICONS[variant]}
            </Text>
          </View>

          {/* Message */}
          <Text
            style={[
              styles.message,
              { color: '#FFFFFF' },
              messageStyle,
            ]}
            numberOfLines={2}
          >
            {message}
          </Text>

          {/* Action button */}
          {action && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={action.onPress}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.actionText,
                  { color: baseColor === '#FFFFFF' ? '#1C1B1F' : '#FFFFFF' },
                  actionStyle,
                ]}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          )}

          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleDismiss}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 999,
  },
  snackbar: {
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
    overflow: 'hidden',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 3,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.25,
  },
  actionButton: {
    marginLeft: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.1,
    textTransform: 'uppercase',
  },
  closeButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '300',
  },
});