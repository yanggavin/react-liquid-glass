import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  // Actions
  LiquidGlassButton,
  LiquidGlassFAB,
  LiquidGlassIconButton,
  LiquidGlassSegmentedButton,
  // Communication
  LiquidGlassBadge,
  LiquidGlassProgressIndicator,
  LiquidGlassSnackbar,
  // Containment
  LiquidGlassCard,
  LiquidGlassPanel,
  LiquidGlassModal,
  // Lists
  LiquidGlassList,
  LiquidGlassListItem,
  // Menu
  LiquidGlassMenu,
  // Selection
  LiquidGlassCheckbox,
  LiquidGlassSwitch,
  // Text Input
  LiquidGlassTextField,
  // Chips
  LiquidGlassChip,
} from 'react-liquid-glass';

// Mock icon components
const PlusIcon = () => <Text style={{ color: '#FFF', fontSize: 18 }}>+</Text>;
const HeartIcon = () => <Text style={{ color: '#FFF', fontSize: 16 }}>♥</Text>;
const SettingsIcon = () => <Text style={{ color: '#FFF', fontSize: 16 }}>⚙</Text>;
const PersonIcon = () => <Text style={{ color: '#FFF', fontSize: 16 }}>👤</Text>;
const MenuIcon = () => <Text style={{ color: '#FFF', fontSize: 16 }}>☰</Text>;

export default function ComprehensiveShowcase() {
  // State for various components
  const [modalVisible, setModalVisible] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  
  const [selectedSegment, setSelectedSegment] = useState('design');
  const [isChecked, setIsChecked] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [progress, setProgress] = useState(65);
  
  const [selectedChips, setSelectedChips] = useState<string[]>(['react']);
  const [selectedListItem, setSelectedListItem] = useState<string | null>('item1');

  // Sample data for lists
  const listData = [
    { id: 'item1', title: 'Inbox', subtitle: '24 messages', icon: '📧' },
    { id: 'item2', title: 'Starred', subtitle: '8 items', icon: '⭐' },
    { id: 'item3', title: 'Sent Mail', subtitle: 'Last sent 2h ago', icon: '📤' },
    { id: 'item4', title: 'Drafts', subtitle: '3 drafts', icon: '📝' },
  ];

  // Menu items
  const menuItems = [
    {
      title: 'Profile',
      subtitle: 'View your profile',
      icon: <PersonIcon />,
      onPress: () => Alert.alert('Profile', 'Profile selected'),
    },
    {
      title: 'Settings',
      subtitle: 'App preferences',
      icon: <SettingsIcon />,
      onPress: () => Alert.alert('Settings', 'Settings selected'),
    },
    {
      title: 'Sign Out',
      icon: <Text style={{ color: '#FF453A' }}>↗</Text>,
      onPress: () => Alert.alert('Sign Out', 'Sign out selected'),
      destructive: true,
    },
  ];

  // Chip data
  const chipVariants = [
    { label: 'React Native', value: 'react', variant: 'filter' as const },
    { label: 'TypeScript', value: 'ts', variant: 'filter' as const },
    { label: 'JavaScript', value: 'js', variant: 'assist' as const },
    { label: 'UI/UX Design', value: 'design', variant: 'suggestion' as const },
  ];

  const handleChipToggle = (value: string) => {
    setSelectedChips(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value)
        : [...prev, value]
    );
  };

  const progressAnimation = () => {
    const newProgress = Math.floor(Math.random() * 100);
    setProgress(newProgress);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Header */}
        <LiquidGlassCard style={styles.headerCard}>
          <Text style={styles.headerTitle}>Material Design 3</Text>
          <Text style={styles.headerSubtitle}>Liquid Glass Components Showcase</Text>
        </LiquidGlassCard>

        {/* Action Components */}
        <Text style={styles.sectionTitle}>Actions</Text>
        
        <View style={styles.section}>
          <View style={styles.buttonRow}>
            <LiquidGlassButton
              title="Primary"
              onPress={() => Alert.alert('Primary', 'Button pressed')}
              variant="primary"
              size="medium"
            />
            <LiquidGlassButton
              title="Secondary"
              onPress={() => Alert.alert('Secondary', 'Button pressed')}
              variant="secondary"
              size="medium"
            />
          </View>

          <LiquidGlassSegmentedButton
            options={[
              { label: 'Design', value: 'design' },
              { label: 'Code', value: 'code' },
              { label: 'Test', value: 'test' },
            ]}
            selectedValue={selectedSegment}
            onValueChange={setSelectedSegment}
            style={styles.segmentedButton}
          />

          <View style={styles.iconButtonRow}>
            <LiquidGlassIconButton
              icon={<HeartIcon />}
              onPress={() => Alert.alert('Like', 'Item liked')}
              variant="filled"
            />
            <LiquidGlassIconButton
              icon={<SettingsIcon />}
              onPress={() => Alert.alert('Settings', 'Settings opened')}
              variant="tonal"
            />
            <LiquidGlassIconButton
              icon={<MenuIcon />}
              onPress={() => setMenuVisible(true)}
              variant="outlined"
            />
          </View>
        </View>

        {/* Communication */}
        <Text style={styles.sectionTitle}>Communication</Text>
        
        <View style={styles.section}>
          <View style={styles.badgeRow}>
            <LiquidGlassBadge count={5} variant="primary">
              <LiquidGlassIconButton
                icon={<Text style={{ color: '#FFF' }}>📧</Text>}
                onPress={() => {}}
                variant="tonal"
              />
            </LiquidGlassBadge>
            
            <LiquidGlassBadge dot variant="error">
              <LiquidGlassIconButton
                icon={<Text style={{ color: '#FFF' }}>🔔</Text>}
                onPress={() => {}}
                variant="tonal"
              />
            </LiquidGlassBadge>
          </View>

          <View style={styles.progressRow}>
            <LiquidGlassProgressIndicator
              progress={progress}
              variant="circular"
              size={60}
            />
            <LiquidGlassProgressIndicator
              progress={progress}
              variant="linear"
              style={styles.linearProgress}
            />
            <LiquidGlassButton
              title="Update"
              onPress={progressAnimation}
              size="small"
            />
          </View>

          <LiquidGlassButton
            title="Show Snackbar"
            onPress={() => setSnackbarVisible(true)}
            variant="outline"
          />
        </View>

        {/* Selection Components */}
        <Text style={styles.sectionTitle}>Selection</Text>
        
        <View style={styles.section}>
          <View style={styles.selectionRow}>
            <LiquidGlassCheckbox
              checked={isChecked}
              onValueChange={setIsChecked}
            />
            <Text style={styles.selectionLabel}>Enable notifications</Text>
          </View>

          <View style={styles.selectionRow}>
            <LiquidGlassSwitch
              value={switchValue}
              onValueChange={setSwitchValue}
            />
            <Text style={styles.selectionLabel}>Dark mode</Text>
          </View>
        </View>

        {/* Chips */}
        <Text style={styles.sectionTitle}>Chips</Text>
        
        <View style={styles.section}>
          <View style={styles.chipContainer}>
            {chipVariants.map((chip) => (
              <LiquidGlassChip
                key={chip.value}
                label={chip.label}
                variant={chip.variant}
                selected={selectedChips.includes(chip.value)}
                onPress={() => handleChipToggle(chip.value)}
                style={styles.chip}
              />
            ))}
          </View>
        </View>

        {/* Text Input */}
        <Text style={styles.sectionTitle}>Text Input</Text>
        
        <View style={styles.section}>
          <LiquidGlassTextField
            label="Email"
            value={textValue}
            onChangeText={setTextValue}
            placeholder="Enter your email"
            leadingIcon={<Text style={{ color: '#FFF' }}>📧</Text>}
          />
        </View>

        {/* Lists */}
        <Text style={styles.sectionTitle}>Lists</Text>
        
        <View style={styles.section}>
          <LiquidGlassList style={styles.list}>
            {listData.map((item) => (
              <LiquidGlassListItem
                key={item.id}
                title={item.title}
                subtitle={item.subtitle}
                leadingContent={<Text style={{ fontSize: 20 }}>{item.icon}</Text>}
                onPress={() => setSelectedListItem(item.id)}
                selected={selectedListItem === item.id}
                variant="two-line"
              />
            ))}
          </LiquidGlassList>
        </View>

        {/* Modal & Panel Triggers */}
        <Text style={styles.sectionTitle}>Containers</Text>
        
        <View style={styles.section}>
          <View style={styles.buttonRow}>
            <LiquidGlassButton
              title="Show Modal"
              onPress={() => setModalVisible(true)}
              variant="primary"
            />
            <LiquidGlassButton
              title="Show Panel"
              onPress={() => setPanelVisible(true)}
              variant="secondary"
            />
          </View>
        </View>

        {/* Floating Action Button */}
        <LiquidGlassFAB
          icon={<PlusIcon />}
          onPress={() => Alert.alert('FAB', 'Create new item')}
          variant="primary"
          style={styles.fab}
        />

        {/* Panel */}
        {panelVisible && (
          <LiquidGlassPanel
            position="center"
            slideAnimation={true}
            slideDirection="up"
          >
            <Text style={styles.panelTitle}>Information Panel</Text>
            <Text style={styles.panelText}>
              This is a glass panel with slide animations and beautiful blur effects.
            </Text>
            <LiquidGlassButton
              title="Close"
              onPress={() => setPanelVisible(false)}
              variant="outline"
              size="small"
            />
          </LiquidGlassPanel>
        )}

      </ScrollView>

      {/* Modal */}
      <LiquidGlassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        animationType="scale"
        backdropBlur={true}
      >
        <Text style={styles.modalTitle}>Liquid Glass Modal</Text>
        <Text style={styles.modalText}>
          This modal demonstrates the beautiful glass effect with backdrop blur
          and smooth scale animations.
        </Text>
        <LiquidGlassButton
          title="Close Modal"
          onPress={() => setModalVisible(false)}
          variant="primary"
        />
      </LiquidGlassModal>

      {/* Menu */}
      <LiquidGlassMenu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={{ x: 300, y: 200 }}
        items={menuItems}
      />

      {/* Snackbar */}
      <LiquidGlassSnackbar
        visible={snackbarVisible}
        message="Action completed successfully!"
        onDismiss={() => setSnackbarVisible(false)}
        variant="success"
        action={{
          label: 'UNDO',
          onPress: () => Alert.alert('Undo', 'Action undone'),
        }}
      />
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
    paddingBottom: 100,
  },
  headerCard: {
    padding: 24,
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
    marginTop: 24,
  },
  section: {
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  segmentedButton: {
    marginBottom: 16,
  },
  iconButtonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 16,
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  linearProgress: {
    flex: 1,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectionLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    marginBottom: 8,
  },
  list: {
    maxHeight: 300,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
  },
  panelTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 22,
  },
});