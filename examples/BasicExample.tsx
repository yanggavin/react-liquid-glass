import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  // Actions
  LiquidGlassCard,
  LiquidGlassButton,
  LiquidGlassFAB,
  LiquidGlassIconButton,
  LiquidGlassSegmentedButton,
  // Communication
  LiquidGlassBadge,
  LiquidGlassProgressIndicator,
  // Containment
  LiquidGlassPanel,
  LiquidGlassModal,
  // Text Input
  LiquidGlassTextField,
} from 'react-liquid-glass';

export default function BasicExample() {
  const [modalVisible, setModalVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState('option1');
  const [badgeCount, setBadgeCount] = useState(5);
  const [progress, setProgress] = useState(65);
  const [textValue, setTextValue] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Glass Cards */}
        <Text style={styles.sectionTitle}>Glass Cards</Text>
        
        <LiquidGlassCard
          style={styles.card}
          onPress={() => console.log('Card 1 pressed')}
        >
          <Text style={styles.cardText}>
            Interactive Glass Card
          </Text>
          <Text style={styles.cardSubtext}>
            Tap me to see the liquid effect!
          </Text>
        </LiquidGlassCard>

        <LiquidGlassCard
          style={styles.card}
          tintColor="#007AFF"
          opacity={0.2}
          liquidEffect={false}
        >
          <Text style={styles.cardText}>
            Blue Tinted Card
          </Text>
          <Text style={styles.cardSubtext}>
            No liquid effect, just glass
          </Text>
        </LiquidGlassCard>

        {/* Buttons */}
        <Text style={styles.sectionTitle}>Buttons</Text>
        
        <View style={styles.buttonRow}>
          <LiquidGlassButton
            title="Primary"
            onPress={() => console.log('Primary pressed')}
            variant="primary"
            size="medium"
          />
          
          <LiquidGlassButton
            title="Secondary"
            onPress={() => console.log('Secondary pressed')}
            variant="secondary"
            size="medium"
          />
        </View>

        <View style={styles.buttonRow}>
          <LiquidGlassButton
            title="Outline"
            onPress={() => console.log('Outline pressed')}
            variant="outline"
            size="large"
            style={styles.fullWidthButton}
          />
        </View>

        {/* Modal & Panel Examples */}
        <Text style={styles.sectionTitle}>Modals & Panels</Text>
        
        <View style={styles.buttonRow}>
          <LiquidGlassButton
            title="Show Modal"
            onPress={() => setModalVisible(true)}
            variant="primary"
            size="medium"
          />
          
          <LiquidGlassButton
            title="Show Panel"
            onPress={() => setPanelVisible(true)}
            variant="secondary"
            size="medium"
          />
        </View>

        {/* Panel Example */}
        {panelVisible && (
          <LiquidGlassPanel
            position="center"
            slideAnimation={true}
            slideDirection="up"
            style={styles.panel}
          >
            <Text style={styles.panelTitle}>Glass Panel</Text>
            <Text style={styles.panelText}>
              This is a beautiful glass panel with slide animation.
            </Text>
            <LiquidGlassButton
              title="Close Panel"
              onPress={() => setPanelVisible(false)}
              variant="outline"
              size="small"
              style={styles.closeButton}
            />
          </LiquidGlassPanel>
        )}

      </ScrollView>

      {/* Modal Example */}
      <LiquidGlassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        animationType="scale"
        backdropBlur={true}
        closeOnBackdropPress={true}
      >
        <Text style={styles.modalTitle}>Glass Modal</Text>
        <Text style={styles.modalText}>
          This modal features backdrop blur and scale animation.
        </Text>
        <Text style={styles.modalText}>
          You can tap outside to close it, or use the button below.
        </Text>
        
        <LiquidGlassButton
          title="Close Modal"
          onPress={() => setModalVisible(false)}
          variant="primary"
          size="medium"
          style={styles.modalButton}
        />
      </LiquidGlassModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    marginTop: 20,
  },
  card: {
    padding: 20,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  cardSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fullWidthButton: {
    flex: 1,
  },
  panel: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  panelText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    marginTop: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalButton: {
    marginTop: 20,
  },
});