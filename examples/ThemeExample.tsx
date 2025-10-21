import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Switch,
} from 'react-native';
import {
  LiquidGlassCard,
  LiquidGlassButton,
  createGlassStyle,
  createLiquidGradient,
} from 'react-liquid-glass';

// Custom theme configurations
const themes = {
  aurora: {
    name: 'Aurora',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#1a1a2e',
    primary: '#16213e',
    accent: '#e94560',
    tint: '#00f5ff',
    opacity: 0.25,
  },
  sunset: {
    name: 'Sunset',
    background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)',
    backgroundColor: '#2d1b69',
    primary: '#f093fb',
    accent: '#f5576c',
    tint: '#ffeaa7',
    opacity: 0.2,
  },
  ocean: {
    name: 'Ocean',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    backgroundColor: '#0c2461',
    primary: '#3742fa',
    accent: '#2ed573',
    tint: '#70a1ff',
    opacity: 0.18,
  },
  dark: {
    name: 'Dark',
    background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
    backgroundColor: '#000000',
    primary: '#FFFFFF',
    accent: '#007AFF',
    tint: '#FFFFFF',
    opacity: 0.15,
  },
};

export default function ThemeExample() {
  const [selectedTheme, setSelectedTheme] = useState<keyof typeof themes>('aurora');
  const [highContrast, setHighContrast] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  const currentTheme = themes[selectedTheme];
  
  // Adjust theme based on accessibility settings
  const adjustedTheme = {
    ...currentTheme,
    opacity: highContrast ? currentTheme.opacity * 1.5 : currentTheme.opacity,
  };

  const customGlassStyle = createGlassStyle({
    tintColor: adjustedTheme.tint,
    opacity: adjustedTheme.opacity,
    blurRadius: highContrast ? 8 : 12,
    borderRadius: 20,
    borderWidth: highContrast ? 2 : 1,
    borderColor: `${adjustedTheme.accent}40`,
  });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: adjustedTheme.backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Theme Controls */}
        <LiquidGlassCard
          style={styles.controlsCard}
          tintColor={adjustedTheme.tint}
          opacity={adjustedTheme.opacity}
        >
          <Text style={styles.controlsTitle}>Theme Controls</Text>
          
          {/* Theme Selection */}
          <View style={styles.themeGrid}>
            {Object.entries(themes).map(([key, theme]) => (
              <LiquidGlassButton
                key={key}
                title={theme.name}
                onPress={() => setSelectedTheme(key as keyof typeof themes)}
                variant={selectedTheme === key ? "primary" : "outline"}
                size="small"
                tintColor={theme.tint}
                style={styles.themeButton}
              />
            ))}
          </View>

          {/* Accessibility Controls */}
          <View style={styles.accessibilityControls}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>High Contrast</Text>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ false: '#767577', true: adjustedTheme.accent }}
                thumbColor={highContrast ? adjustedTheme.tint : '#f4f3f4'}
              />
            </View>
            
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Reduced Motion</Text>
              <Switch
                value={reducedMotion}
                onValueChange={setReducedMotion}
                trackColor={{ false: '#767577', true: adjustedTheme.accent }}
                thumbColor={reducedMotion ? adjustedTheme.tint : '#f4f3f4'}
              />
            </View>
          </View>
        </LiquidGlassCard>

        {/* Themed Components Showcase */}
        <Text style={[styles.sectionTitle, { color: adjustedTheme.tint }]}>
          {currentTheme.name} Theme Showcase
        </Text>

        {/* Cards with different intensities */}
        <LiquidGlassCard
          style={styles.showcaseCard}
          tintColor={adjustedTheme.tint}
          opacity={adjustedTheme.opacity}
          borderColor={`${adjustedTheme.accent}60`}
          liquidEffect={!reducedMotion}
          animationDuration={reducedMotion ? 0 : 300}
        >
          <Text style={[styles.cardTitle, { color: adjustedTheme.tint }]}>
            Primary Card
          </Text>
          <Text style={styles.cardDescription}>
            This card uses the primary theme colors with liquid effects.
          </Text>
        </LiquidGlassCard>

        <LiquidGlassCard
          style={styles.showcaseCard}
          tintColor={adjustedTheme.accent}
          opacity={adjustedTheme.opacity * 0.8}
          borderColor={`${adjustedTheme.primary}80`}
          liquidEffect={!reducedMotion}
          animationDuration={reducedMotion ? 0 : 300}
        >
          <Text style={[styles.cardTitle, { color: adjustedTheme.accent }]}>
            Accent Card
          </Text>
          <Text style={styles.cardDescription}>
            This card uses accent colors for a different visual hierarchy.
          </Text>
        </LiquidGlassCard>

        {/* Button Variations */}
        <View style={styles.buttonGrid}>
          <LiquidGlassButton
            title="Primary Action"
            onPress={() => console.log('Primary action')}
            variant="primary"
            size="medium"
            tintColor={adjustedTheme.primary}
            hapticFeedback={!reducedMotion}
          />
          
          <LiquidGlassButton
            title="Secondary"
            onPress={() => console.log('Secondary action')}
            variant="secondary"
            size="medium"
            tintColor={adjustedTheme.accent}
            hapticFeedback={!reducedMotion}
          />
          
          <LiquidGlassButton
            title="Outline Style"
            onPress={() => console.log('Outline action')}
            variant="outline"
            size="large"
            tintColor={adjustedTheme.tint}
            style={styles.fullWidthButton}
            hapticFeedback={!reducedMotion}
          />
        </View>

        {/* Custom Glass Effect Example */}
        <View style={[customGlassStyle, styles.customGlassContainer]}>
          <Text style={[styles.customGlassTitle, { color: adjustedTheme.tint }]}>
            Custom Glass Effect
          </Text>
          <Text style={styles.customGlassText}>
            This container uses custom glass styling created with the createGlassStyle utility.
            The effect adjusts based on your accessibility preferences.
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: adjustedTheme.accent }]}>
                {Math.round(adjustedTheme.opacity * 100)}%
              </Text>
              <Text style={styles.statLabel}>Opacity</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: adjustedTheme.accent }]}>
                {highContrast ? '8px' : '12px'}
              </Text>
              <Text style={styles.statLabel}>Blur</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: adjustedTheme.accent }]}>
                {reducedMotion ? 'OFF' : 'ON'}
              </Text>
              <Text style={styles.statLabel}>Animation</Text>
            </View>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  controlsCard: {
    padding: 20,
    marginBottom: 24,
  },
  controlsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  themeButton: {
    minWidth: '22%',
  },
  accessibilityControls: {
    gap: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: 'white',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  showcaseCard: {
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  buttonGrid: {
    gap: 12,
    marginBottom: 24,
  },
  fullWidthButton: {
    width: '100%',
  },
  customGlassContainer: {
    padding: 24,
    marginBottom: 20,
  },
  customGlassTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  customGlassText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});