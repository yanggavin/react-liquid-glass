# react-liquid-glass - React Native Liquid Glass UI Components

A beautiful React Native UI components library featuring liquid glass effects with blur, transparency, and smooth animations.

[![npm version](https://badge.fury.io/js/react-liquid-glass.svg)](https://badge.fury.io/js/react-liquid-glass)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎨 **Liquid Glass Effects** - Beautiful blur and transparency effects
- 🌊 **Smooth Animations** - Fluid press animations and transitions  
- 📱 **React Native Compatible** - Works on iOS and Android
- 🎯 **TypeScript Support** - Fully typed components and utilities
- ⚡ **Performance Optimized** - Uses native drivers for animations
- 🎨 **Customizable** - Extensive theming and styling options

## Installation

```bash
npm install react-liquid-glass
```

### Peer Dependencies

This library requires the following peer dependencies:

```bash
npm install react-native-blur react-native-linear-gradient react-native-svg
```

#### iOS Setup

For iOS, you'll need to install pods:

```bash
cd ios && pod install
```

#### Android Setup

For Android, follow the setup instructions for:
- [react-native-blur](https://github.com/Kureev/react-native-blur#android)
- [react-native-linear-gradient](https://github.com/react-native-linear-gradient/react-native-linear-gradient#android)

## Quick Start

```tsx
import React from 'react';
import { View } from 'react-native';
import { LiquidGlassCard, LiquidGlassButton } from 'react-liquid-glass';

export default function App() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: '#000' }}>
      <LiquidGlassCard
        style={{ padding: 20, marginBottom: 20 }}
        onPress={() => console.log('Card pressed')}
      >
        <Text style={{ color: 'white', fontSize: 18 }}>
          Beautiful Glass Card
        </Text>
      </LiquidGlassCard>
      
      <LiquidGlassButton
        title="Press Me"
        onPress={() => console.log('Button pressed')}
        variant="primary"
        size="large"
      />
    </View>
  );
}
```

## Components

This library provides a complete set of Material Design 3 components with stunning liquid glass effects:

### Actions Components

#### LiquidGlassButton
Button with multiple variants, sizes, and loading states.

#### LiquidGlassFAB 
Floating Action Button with standard and extended variants.

#### LiquidGlassIconButton
Icon button with filled, tonal, outlined, and standard variants.

#### LiquidGlassSegmentedButton
Segmented button group with single/multi-select support.

### Communication Components

#### LiquidGlassBadge
Notification badges with count display and dot indicator.

#### LiquidGlassProgressIndicator
Linear and circular progress indicators with determinate/indeterminate states.

### Containment Components

#### LiquidGlassCard
Versatile card component with liquid glass effects and press animations.

```tsx
<LiquidGlassCard
  blurRadius={10}
  opacity={0.15}
  tintColor="#FFFFFF"
  borderRadius={16}
  liquidEffect={true}
  onPress={() => {}}
>
  <Text>Your content here</Text>
</LiquidGlassCard>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Content to display inside the card |
| `onPress` | `() => void` | - | Press handler function |
| `disabled` | `boolean` | `false` | Disable press interactions |
| `liquidEffect` | `boolean` | `true` | Enable liquid animation on press |
| `animationDuration` | `number` | `300` | Animation duration in milliseconds |
| `blurRadius` | `number` | `10` | Blur radius (0-30) |
| `opacity` | `number` | `0.15` | Background opacity (0-1) |
| `tintColor` | `string` | `"#FFFFFF"` | Glass tint color |
| `borderRadius` | `number` | `16` | Border radius |
| `shadow` | `boolean` | `true` | Enable drop shadow |

### LiquidGlassButton

A button component with multiple variants and loading states.

```tsx
<LiquidGlassButton
  title="Click Me"
  onPress={() => {}}
  variant="primary"
  size="medium"
  loading={false}
  hapticFeedback={true}
/>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Button text |
| `onPress` | `() => void` | - | Press handler function |
| `variant` | `'primary' \| 'secondary' \| 'outline'` | `'primary'` | Button style variant |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Button size |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `hapticFeedback` | `boolean` | `true` | Enable haptic feedback (iOS only) |

### LiquidGlassPanel

A panel component with slide animations and positioning options.

```tsx
<LiquidGlassPanel
  position="center"
  slideAnimation={true}
  slideDirection="up"
>
  <Text>Panel content</Text>
</LiquidGlassPanel>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | Panel content |
| `position` | `'top' \| 'bottom' \| 'left' \| 'right' \| 'center'` | `'center'` | Panel position |
| `slideAnimation` | `boolean` | `true` | Enable slide animation |
| `slideDirection` | `'up' \| 'down' \| 'left' \| 'right'` | `'up'` | Slide direction |

### LiquidGlassModal

A modal component with backdrop blur and multiple animation types.

```tsx
<LiquidGlassModal
  visible={modalVisible}
  onClose={() => setModalVisible(false)}
  animationType="scale"
  backdropBlur={true}
>
  <Text>Modal content</Text>
</LiquidGlassModal>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | - | Modal visibility |
| `onClose` | `() => void` | - | Close handler function |
| `backdropBlur` | `boolean` | `true` | Enable backdrop blur |
| `backdropOpacity` | `number` | `0.4` | Backdrop opacity |
| `animationType` | `'fade' \| 'slide' \| 'scale'` | `'fade'` | Animation type |
| `closeOnBackdropPress` | `boolean` | `true` | Close modal on backdrop press |

## Utilities

### Glass Effects

```tsx
import { createGlassStyle, createLiquidGradient } from 'react-liquid-glass';

const glassStyle = createGlassStyle({
  blurRadius: 15,
  opacity: 0.2,
  tintColor: '#FFFFFF',
});

const gradient = createLiquidGradient('#007AFF', 1.2);
```

### Animation Configurations

```tsx
import { getLiquidAnimationConfig } from 'react-liquid-glass';

const pressConfig = getLiquidAnimationConfig('press');
const releaseConfig = getLiquidAnimationConfig('release');
```

## Examples

Check out the `examples/` directory for complete implementation examples:

- Basic Usage
- Custom Theming
- Advanced Animations
- Integration Examples

## Customization

### Theme Colors

```tsx
const customTheme = {
  primary: '#007AFF',
  secondary: '#8E8E93',
  background: '#FFFFFF',
  accent: '#FF3B30',
};

<LiquidGlassButton
  tintColor={customTheme.primary}
  variant="primary"
/>
```

### Custom Animations

```tsx
<LiquidGlassCard
  animationDuration={500}
  liquidEffect={true}
  onPress={() => {
    // Custom animation logic
  }}
>
```

## Performance Tips

1. **Use Native Driver**: All animations use native drivers by default
2. **Optimize Blur Radius**: Keep blur radius between 5-20 for best performance
3. **Limit Concurrent Animations**: Avoid too many animated components simultaneously
4. **Use removeClippedSubviews**: For scrollable content with many glass components

## Compatibility

- React Native >= 0.70.0
- iOS >= 11.0
- Android >= API 21

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by iOS design patterns
- Built with React Native best practices
- Following GitHub Spec Kit guidelines

---

Made with ❤️ by [Gavin Yang](https://github.com/gavinyang)