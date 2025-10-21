import React, { useRef, useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Modal,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient, getLiquidAnimationConfig } from '../utils/glassEffects';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export interface MenuItemProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  destructive?: boolean;
}

export interface LiquidGlassMenuProps extends GlassEffectProps {
  visible: boolean;
  onDismiss: () => void;
  anchor?: { x: number; y: number };
  items: MenuItemProps[];
  style?: ViewStyle;
  itemStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  width?: number;
  maxHeight?: number;
}

export const LiquidGlassMenu: React.FC<LiquidGlassMenuProps> = ({
  visible,
  onDismiss,
  anchor = { x: 0, y: 0 },
  items,
  style,
  itemStyle,
  titleStyle,
  subtitleStyle,
  width = 200,
  maxHeight = 300,
  blurRadius = 12,
  tintColor = '#FFFFFF',
  opacity = 0.25,
  ...glassProps
}) => {
  const [menuLayout, setMenuLayout] = useState({ width: 0, height: 0 });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const itemAnimations = useRef<Animated.Value[]>([]).current;

  // Initialize item animations
  useEffect(() => {
    itemAnimations.splice(0, itemAnimations.length);
    items.forEach((_, index) => {
      itemAnimations.push(new Animated.Value(0));
    });
  }, [items.length, itemAnimations]);

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${tintColor}40`,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(tintColor, 1.5);

  useEffect(() => {
    if (visible) {
      // Show animations
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 150,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(liquidAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Staggered item animations
      const itemStaggeredAnimations = itemAnimations.map((anim, index) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 200,
          delay: index * 50,
          useNativeDriver: true,
        })
      );
      
      Animated.stagger(50, itemStaggeredAnimations).start();
    } else {
      // Hide animations
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(liquidAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();

      // Reset item animations
      itemAnimations.forEach(anim => anim.setValue(0));
    }
  }, [visible, scaleAnim, fadeAnim, liquidAnim, itemAnimations]);

  const getMenuPosition = () => {
    let x = anchor.x;
    let y = anchor.y;

    // Ensure menu stays within screen bounds
    if (x + width > screenWidth - 20) {
      x = screenWidth - width - 20;
    }
    if (x < 20) {
      x = 20;
    }

    if (y + menuLayout.height > screenHeight - 100) {
      y = anchor.y - menuLayout.height - 10;
    }
    if (y < 100) {
      y = 100;
    }

    return { x, y };
  };

  const position = getMenuPosition();

  const animatedStyle = {
    opacity: fadeAnim,
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onDismiss}
    >
      <TouchableWithoutFeedback onPress={onDismiss}>
        <View style={styles.overlay}>
          <Animated.View
            style={[
              styles.menu,
              glassStyle,
              {
                left: position.x,
                top: position.y,
                width,
                maxHeight,
              },
              animatedStyle,
              style,
            ]}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              setMenuLayout({ width, height });
            }}
          >
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="dark"
              blurAmount={blurRadius}
              reducedTransparencyFallbackColor={tintColor}
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

            <View style={styles.itemsContainer}>
              {items.map((item, index) => (
                <MenuItem
                  key={index}
                  item={item}
                  animation={itemAnimations[index]}
                  itemStyle={itemStyle}
                  titleStyle={titleStyle}
                  subtitleStyle={subtitleStyle}
                  onPress={() => {
                    item.onPress?.();
                    onDismiss();
                  }}
                />
              ))}
            </View>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// Menu Item Component
interface MenuItemComponentProps {
  item: MenuItemProps;
  animation: Animated.Value;
  itemStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  onPress: () => void;
}

const MenuItem: React.FC<MenuItemComponentProps> = ({
  item,
  animation,
  itemStyle,
  titleStyle,
  subtitleStyle,
  onPress,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;

  const handlePressIn = useCallback(() => {
    if (item.disabled) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [item.disabled, scaleAnim, liquidAnim]);

  const handlePressOut = useCallback(() => {
    if (item.disabled) return;

    const releaseConfig = getLiquidAnimationConfig('release');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        ...releaseConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [item.disabled, scaleAnim, liquidAnim]);

  const animatedItemStyle = {
    opacity: animation,
    transform: [
      { scale: scaleAnim },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-20, 0],
        }),
      },
    ],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  return (
    <Animated.View style={[styles.menuItem, animatedItemStyle, itemStyle]}>
      <TouchableOpacity
        style={styles.menuItemTouchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={item.disabled}
        activeOpacity={1}
      >
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            liquidOverlayStyle,
            { borderRadius: 8 },
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.1)']}
            locations={[0, 0.5, 1]}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>

        <View style={styles.menuItemContent}>
          {item.icon && (
            <View style={styles.menuItemIcon}>
              {item.icon}
            </View>
          )}

          <View style={styles.menuItemText}>
            <Text
              style={[
                styles.menuItemTitle,
                {
                  color: item.destructive ? '#FF453A' : item.disabled ? 'rgba(255, 255, 255, 0.4)' : '#FFFFFF',
                },
                titleStyle,
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            
            {item.subtitle && (
              <Text
                style={[
                  styles.menuItemSubtitle,
                  {
                    color: item.disabled ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.6)',
                  },
                  subtitleStyle,
                ]}
                numberOfLines={1}
              >
                {item.subtitle}
              </Text>
            )}
          </View>

          {item.trailingIcon && (
            <View style={styles.menuItemTrailing}>
              {item.trailingIcon}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menu: {
    position: 'absolute',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  itemsContainer: {
    padding: 8,
  },
  menuItem: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 1,
  },
  menuItemTouchable: {
    minHeight: 40,
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  menuItemIcon: {
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
  menuItemSubtitle: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  menuItemTrailing: {
    marginLeft: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});