import React, { useRef, useEffect } from 'react';
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { LiquidGlassPanelProps } from '../types';
import { createGlassStyle, createLiquidGradient } from '../utils/glassEffects';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const POSITION_STYLES = {
  top: { top: 0, left: 0, right: 0 },
  bottom: { bottom: 0, left: 0, right: 0 },
  left: { top: 0, left: 0, bottom: 0, width: '80%' },
  right: { top: 0, right: 0, bottom: 0, width: '80%' },
  center: { 
    position: 'absolute' as const, 
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

export const LiquidGlassPanel: React.FC<LiquidGlassPanelProps> = ({
  children,
  style,
  position = 'center',
  slideAnimation = true,
  slideDirection = 'up',
  blurRadius = 12,
  tintColor = '#FFFFFF',
  opacity = 0.2,
  ...glassProps
}) => {
  const slideAnim = useRef(new Animated.Value(slideAnimation ? SLIDE_CONFIGS[slideDirection].from : 0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(tintColor, 0.8);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: SLIDE_CONFIGS[slideDirection].to,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
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
      } else {
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
        position: 'absolute' as const,
        alignSelf: 'center',
        top: '20%',
        width: '85%',
        maxHeight: '60%',
      };

  return (
    <Animated.View
      style={[
        styles.container,
        glassStyle,
        positionStyle,
        getAnimatedStyle(),
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
          { opacity: 0.3 }
        ]}
      />
      
      <View style={styles.content}>
        {children}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
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