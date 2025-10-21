import React, { useRef, useCallback } from 'react';
import {
  ScrollView,
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Animated,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ListRenderItem,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { GlassEffectProps } from '../types';
import { createGlassStyle, createLiquidGradient, getLiquidAnimationConfig } from '../utils/glassEffects';

// List Item Component
export interface LiquidGlassListItemProps extends GlassEffectProps {
  title: string;
  subtitle?: string;
  description?: string;
  leadingContent?: React.ReactNode;
  trailingContent?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  variant?: 'one-line' | 'two-line' | 'three-line';
  dense?: boolean;
}

export const LiquidGlassListItem: React.FC<LiquidGlassListItemProps> = ({
  title,
  subtitle,
  description,
  leadingContent,
  trailingContent,
  onPress,
  disabled = false,
  selected = false,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  variant = 'one-line',
  dense = false,
  blurRadius = 6,
  tintColor = '#FFFFFF',
  opacity = 0.1,
  ...glassProps
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const liquidAnim = useRef(new Animated.Value(0)).current;
  const selectionAnim = useRef(new Animated.Value(selected ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.spring(selectionAnim, {
      toValue: selected ? 1 : 0,
      tension: 150,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [selected, selectionAnim]);

  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity: selected ? opacity * 2 : opacity,
    borderRadius: 12,
    ...glassProps,
  });

  const liquidGradient = createLiquidGradient(tintColor, selected ? 1.8 : 1.2);

  const handlePressIn = useCallback(() => {
    if (disabled || !onPress) return;

    const pressConfig = getLiquidAnimationConfig('press');
    
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        ...pressConfig,
      }),
      Animated.timing(liquidAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [disabled, onPress, scaleAnim, liquidAnim]);

  const handlePressOut = useCallback(() => {
    if (disabled || !onPress) return;

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
  }, [disabled, onPress, scaleAnim, liquidAnim]);

  const getHeightForVariant = () => {
    if (dense) {
      switch (variant) {
        case 'one-line': return 48;
        case 'two-line': return 60;
        case 'three-line': return 76;
        default: return 48;
      }
    } else {
      switch (variant) {
        case 'one-line': return 56;
        case 'two-line': return 72;
        case 'three-line': return 88;
        default: return 56;
      }
    }
  };

  const animatedStyle = {
    transform: [{ scale: scaleAnim }],
  };

  const liquidOverlayStyle = {
    opacity: liquidAnim,
  };

  const selectionBackgroundStyle = {
    backgroundColor: selectionAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['transparent', `${tintColor}20`],
    }),
  };

  const content = (
    <Animated.View
      style={[
        styles.itemContainer,
        glassStyle,
        {
          height: getHeightForVariant(),
          opacity: disabled ? 0.5 : 1,
        },
        animatedStyle,
        style,
      ]}
    >
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={tintColor}
      />

      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          selectionBackgroundStyle,
          { borderRadius: 12 },
        ]}
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

      <View style={[styles.itemContent, contentStyle]}>
        {leadingContent && (
          <View style={styles.leadingContent}>
            {leadingContent}
          </View>
        )}

        <View style={styles.textContent}>
          <Text
            style={[
              styles.title,
              {
                color: '#FFFFFF',
                fontWeight: selected ? '600' : '500',
              },
              titleStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          
          {subtitle && variant !== 'one-line' && (
            <Text
              style={[
                styles.subtitle,
                { color: 'rgba(255, 255, 255, 0.7)' },
                subtitleStyle,
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          )}
          
          {description && variant === 'three-line' && (
            <Text
              style={[
                styles.description,
                { color: 'rgba(255, 255, 255, 0.6)' },
              ]}
              numberOfLines={1}
            >
              {description}
            </Text>
          )}
        </View>

        {trailingContent && (
          <View style={styles.trailingContent}>
            {trailingContent}
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={1}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return content;
};

// List Container Component
export interface LiquidGlassListProps extends GlassEffectProps {
  data?: any[];
  renderItem?: ListRenderItem<any>;
  children?: React.ReactNode;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  scrollEnabled?: boolean;
  showsVerticalScrollIndicator?: boolean;
  keyExtractor?: (item: any, index: number) => string;
  ItemSeparatorComponent?: React.ComponentType<any>;
  ListHeaderComponent?: React.ComponentType<any>;
  ListFooterComponent?: React.ComponentType<any>;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
}

export const LiquidGlassList: React.FC<LiquidGlassListProps> = ({
  data,
  renderItem,
  children,
  style,
  contentContainerStyle,
  scrollEnabled = true,
  showsVerticalScrollIndicator = false,
  keyExtractor,
  ItemSeparatorComponent,
  ListHeaderComponent,
  ListFooterComponent,
  onEndReached,
  onEndReachedThreshold,
  blurRadius = 8,
  tintColor = '#FFFFFF',
  opacity = 0.05,
  ...glassProps
}) => {
  const glassStyle = createGlassStyle({
    blurRadius,
    tintColor,
    opacity,
    borderRadius: 16,
    ...glassProps,
  });

  const defaultSeparator = () => <View style={styles.separator} />;

  if (data && renderItem) {
    return (
      <View style={[styles.listContainer, glassStyle, style]}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={blurRadius}
          reducedTransparencyFallbackColor={tintColor}
        />
        
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.flatList}
          contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}
          ItemSeparatorComponent={ItemSeparatorComponent || defaultSeparator}
          ListHeaderComponent={ListHeaderComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReached={onEndReached}
          onEndReachedThreshold={onEndReachedThreshold}
        />
      </View>
    );
  }

  return (
    <View style={[styles.listContainer, glassStyle, style]}>
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={blurRadius}
        reducedTransparencyFallbackColor={tintColor}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        scrollEnabled={scrollEnabled}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      >
        {children}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    overflow: 'hidden',
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 8,
  },
  itemContainer: {
    overflow: 'hidden',
    marginVertical: 2,
  },
  itemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  leadingContent: {
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: {
    flex: 1,
    justifyContent: 'center',
  },
  trailingContent: {
    marginLeft: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    letterSpacing: 0.15,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    letterSpacing: 0.25,
  },
  description: {
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },
});