import React, { useRef, useEffect, useCallback } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { LiquidGlassModalProps } from '../types';
import { createGlassStyle, createLiquidGradient } from '../utils/glassEffects';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export const LiquidGlassModal: React.FC<LiquidGlassModalProps> = ({
  visible,
  onClose,
  children,
  style,
  backdropBlur = true,
  backdropOpacity = 0.4,
  animationType = 'fade',
  closeOnBackdropPress = true,
  blurRadius = 15,
  tintColor = '#FFFFFF',
  opacity = 0.25,
  ...glassProps
}) => {
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const contentAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const slideAnim = useRef(new Animated.Value(screenHeight)).current;

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(tintColor, 1.2);

  useEffect(() => {
    if (visible) {
      const animations = [
        Animated.timing(backdropAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ];

      switch (animationType) {
        case 'scale':
          animations.push(
            Animated.spring(scaleAnim, {
              toValue: 1,
              tension: 150,
              friction: 8,
              useNativeDriver: true,
            })
          );
          break;
        case 'slide':
          animations.push(
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            })
          );
          break;
        default: // fade
          animations.push(
            Animated.timing(contentAnim, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            })
          );
          break;
      }

      Animated.parallel(animations).start();
    } else {
      const animations = [
        Animated.timing(backdropAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ];

      switch (animationType) {
        case 'scale':
          animations.push(
            Animated.timing(scaleAnim, {
              toValue: 0.8,
              duration: 250,
              useNativeDriver: true,
            })
          );
          break;
        case 'slide':
          animations.push(
            Animated.timing(slideAnim, {
              toValue: screenHeight,
              duration: 300,
              useNativeDriver: true,
            })
          );
          break;
        default: // fade
          animations.push(
            Animated.timing(contentAnim, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            })
          );
          break;
      }

      Animated.parallel(animations).start();
    }
  }, [visible, animationType, backdropAnim, contentAnim, scaleAnim, slideAnim]);

  const handleBackdropPress = useCallback(() => {
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
    >
      <StatusBar backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            { opacity: backdropAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, backdropOpacity],
            })},
          ]}
        >
          {backdropBlur ? (
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={8}
              reducedTransparencyFallbackColor="rgba(0, 0, 0, 0.8)"
            />
          ) : (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]} />
          )}
        </Animated.View>

        {/* Backdrop TouchableOpacity */}
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
          activeOpacity={1}
        />

        <SafeAreaView style={styles.safeArea}>
          <View style={styles.modalContainer}>
            <Animated.View
              style={[
                styles.content,
                glassStyle,
                getContentStyle(),
                style,
              ]}
            >
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={blurRadius}
                reducedTransparencyFallbackColor={tintColor}
              />
              
              <LinearGradient
                colors={liquidGradient.colors}
                locations={liquidGradient.locations}
                start={liquidGradient.start}
                end={liquidGradient.end}
                style={[
                  StyleSheet.absoluteFill,
                  { opacity: 0.4, borderRadius: glassProps.borderRadius || 24 }
                ]}
              />
              
              <View style={styles.childrenContainer}>
                {children}
              </View>
            </Animated.View>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
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