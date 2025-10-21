import React, { useState } from 'react';
import './WebDemo.css';
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
} from '../src/index';

// Mock icons for web
const PlusIcon = () => <span className="icon">+</span>;
const HeartIcon = () => <span className="icon">♥</span>;
const SettingsIcon = () => <span className="icon">⚙</span>;
const PersonIcon = () => <span className="icon">👤</span>;
const MenuIcon = () => <span className="icon">☰</span>;
const EmailIcon = () => <span className="icon">📧</span>;
const BellIcon = () => <span className="icon">🔔</span>;
const StarIcon = () => <span className="icon">⭐</span>;
const SendIcon = () => <span className="icon">📤</span>;
const DraftIcon = () => <span className="icon">📝</span>;

export default function WebDemo() {
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
  const [menuAnchor, setMenuAnchor] = useState<{ x: number; y: number } | null>(null);

  // Sample data for lists
  const listData = [
    { id: 'item1', title: 'Inbox', subtitle: '24 messages', icon: <EmailIcon /> },
    { id: 'item2', title: 'Starred', subtitle: '8 items', icon: <StarIcon /> },
    { id: 'item3', title: 'Sent Mail', subtitle: 'Last sent 2h ago', icon: <SendIcon /> },
    { id: 'item4', title: 'Drafts', subtitle: '3 drafts', icon: <DraftIcon /> },
  ];

  // Menu items
  const menuItems = [
    {
      title: 'Profile',
      subtitle: 'View your profile',
      icon: <PersonIcon />,
      onPress: () => alert('Profile selected'),
    },
    {
      title: 'Settings',
      subtitle: 'App preferences',
      icon: <SettingsIcon />,
      onPress: () => alert('Settings selected'),
    },
    {
      title: 'Sign Out',
      icon: <span className="icon" style={{ color: '#FF453A' }}>↗</span>,
      onPress: () => alert('Sign out selected'),
      destructive: true,
    },
  ];

  // Chip data
  const chipVariants = [
    { label: 'React', value: 'react', variant: 'filter' as const },
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

  const handleMenuToggle = (event: React.MouseEvent) => {
    if (menuVisible) {
      setMenuVisible(false);
      setMenuAnchor(null);
    } else {
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setMenuAnchor({ x: rect.left, y: rect.bottom });
      setMenuVisible(true);
    }
  };

  return (
    <div className="web-demo">
      <div className="demo-container">
        
        {/* Header */}
        <LiquidGlassCard className="header-card">
          <h1 className="header-title">React Liquid Glass</h1>
          <p className="header-subtitle">Beautiful glassmorphism components for modern web applications</p>
        </LiquidGlassCard>

        {/* Action Components */}
        <section className="demo-section">
          <h2 className="section-title">Action Components</h2>
          
          <div className="component-group">
            <h3>Buttons</h3>
            <div className="button-row">
              <LiquidGlassButton
                title="Primary"
                onPress={() => alert('Primary button pressed')}
                variant="primary"
                size="medium"
              />
              <LiquidGlassButton
                title="Secondary"
                onPress={() => alert('Secondary button pressed')}
                variant="secondary"
                size="medium"
              />
              <LiquidGlassButton
                title="Outline"
                onPress={() => alert('Outline button pressed')}
                variant="outline"
                size="medium"
              />
            </div>
          </div>

          <div className="component-group">
            <h3>Segmented Button</h3>
            <LiquidGlassSegmentedButton
              options={[
                { label: 'Design', value: 'design' },
                { label: 'Code', value: 'code' },
                { label: 'Test', value: 'test' },
              ]}
              selectedValue={selectedSegment}
              onValueChange={setSelectedSegment}
            />
          </div>

          <div className="component-group">
            <h3>Icon Buttons</h3>
            <div className="icon-button-row">
              <LiquidGlassIconButton
                icon={<HeartIcon />}
                onPress={() => alert('Liked!')}
                variant="filled"
              />
              <LiquidGlassIconButton
                icon={<SettingsIcon />}
                onPress={() => alert('Settings opened')}
                variant="tonal"
              />
              <LiquidGlassIconButton
                icon={<MenuIcon />}
                onPress={handleMenuToggle}
                variant="outlined"
              />
            </div>
          </div>
        </section>

        {/* Communication Components */}
        <section className="demo-section">
          <h2 className="section-title">Communication</h2>
          
          <div className="component-group">
            <h3>Badges</h3>
            <div className="badge-row">
              <LiquidGlassBadge count={5} variant="primary">
                <LiquidGlassIconButton
                  icon={<EmailIcon />}
                  onPress={() => {}}
                  variant="tonal"
                />
              </LiquidGlassBadge>
              
              <LiquidGlassBadge dot variant="error">
                <LiquidGlassIconButton
                  icon={<BellIcon />}
                  onPress={() => {}}
                  variant="tonal"
                />
              </LiquidGlassBadge>
            </div>
          </div>

          <div className="component-group">
            <h3>Progress Indicators</h3>
            <div className="progress-row">
              <LiquidGlassProgressIndicator
                progress={progress}
                variant="circular"
                size={60}
              />
              <LiquidGlassProgressIndicator
                progress={progress}
                variant="linear"
                className="linear-progress"
              />
              <LiquidGlassButton
                title="Update"
                onPress={progressAnimation}
                size="small"
              />
            </div>
          </div>

          <div className="component-group">
            <h3>Snackbar</h3>
            <LiquidGlassButton
              title="Show Snackbar"
              onPress={() => setSnackbarVisible(true)}
              variant="outline"
            />
          </div>
        </section>

        {/* Selection Components */}
        <section className="demo-section">
          <h2 className="section-title">Selection</h2>
          
          <div className="component-group">
            <div className="selection-row">
              <LiquidGlassCheckbox
                checked={isChecked}
                onValueChange={setIsChecked}
              />
              <label className="selection-label">Enable notifications</label>
            </div>

            <div className="selection-row">
              <LiquidGlassSwitch
                value={switchValue}
                onValueChange={setSwitchValue}
              />
              <label className="selection-label">Dark mode</label>
            </div>
          </div>
        </section>

        {/* Chips */}
        <section className="demo-section">
          <h2 className="section-title">Chips</h2>
          
          <div className="component-group">
            <div className="chip-container">
              {chipVariants.map((chip) => (
                <LiquidGlassChip
                  key={chip.value}
                  label={chip.label}
                  variant={chip.variant}
                  selected={selectedChips.includes(chip.value)}
                  onPress={() => handleChipToggle(chip.value)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Text Input */}
        <section className="demo-section">
          <h2 className="section-title">Text Input</h2>
          
          <div className="component-group">
            <LiquidGlassTextField
              label="Email Address"
              value={textValue}
              onChangeText={setTextValue}
              placeholder="Enter your email"
              leadingIcon={<EmailIcon />}
            />
          </div>
        </section>

        {/* Lists */}
        <section className="demo-section">
          <h2 className="section-title">Lists</h2>
          
          <div className="component-group">
            <LiquidGlassList className="demo-list">
              {listData.map((item) => (
                <LiquidGlassListItem
                  key={item.id}
                  title={item.title}
                  subtitle={item.subtitle}
                  leadingContent={item.icon}
                  onPress={() => setSelectedListItem(item.id)}
                  selected={selectedListItem === item.id}
                  variant="two-line"
                />
              ))}
            </LiquidGlassList>
          </div>
        </section>

        {/* Container Components */}
        <section className="demo-section">
          <h2 className="section-title">Containers</h2>
          
          <div className="component-group">
            <div className="button-row">
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
            </div>
          </div>
        </section>

        {/* Cards Showcase */}
        <section className="demo-section">
          <h2 className="section-title">Cards</h2>
          
          <div className="cards-grid">
            <LiquidGlassCard className="demo-card">
              <h3>Feature Card</h3>
              <p>This is a beautiful glass card with smooth blur effects and transparency.</p>
            </LiquidGlassCard>
            
            <LiquidGlassCard className="demo-card">
              <h3>Another Card</h3>
              <p>Cards can contain any content and adapt to different themes seamlessly.</p>
            </LiquidGlassCard>
          </div>
        </section>

        {/* Floating Action Button */}
        <LiquidGlassFAB
          icon={<PlusIcon />}
          onPress={() => alert('Create new item')}
          variant="primary"
          className="demo-fab"
        />

        {/* Panel */}
        {panelVisible && (
          <LiquidGlassPanel
            position="center"
            slideAnimation={true}
            slideDirection="up"
          >
            <div className="panel-content">
              <h3 className="panel-title">Information Panel</h3>
              <p className="panel-text">
                This is a glass panel with slide animations and beautiful blur effects.
                It can be positioned anywhere and supports various animation types.
              </p>
              <LiquidGlassButton
                title="Close Panel"
                onPress={() => setPanelVisible(false)}
                variant="outline"
                size="small"
              />
            </div>
          </LiquidGlassPanel>
        )}
      </div>

      {/* Modal */}
      <LiquidGlassModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        animationType="scale"
        backdropBlur={true}
      >
        <div className="modal-content">
          <h2 className="modal-title">Liquid Glass Modal</h2>
          <p className="modal-text">
            This modal demonstrates the beautiful glass effect with backdrop blur
            and smooth scale animations. Perfect for displaying important information
            or forms while maintaining the aesthetic of your application.
          </p>
          <LiquidGlassButton
            title="Close Modal"
            onPress={() => setModalVisible(false)}
            variant="primary"
          />
        </div>
      </LiquidGlassModal>

      {/* Menu */}
      {menuVisible && menuAnchor && (
        <LiquidGlassMenu
          visible={menuVisible}
          onDismiss={() => {
            setMenuVisible(false);
            setMenuAnchor(null);
          }}
          anchor={menuAnchor}
          items={menuItems}
        />
      )}

      {/* Snackbar */}
      <LiquidGlassSnackbar
        visible={snackbarVisible}
        message="Action completed successfully! ✨"
        onDismiss={() => setSnackbarVisible(false)}
        variant="success"
        action={{
          label: 'UNDO',
          onPress: () => alert('Action undone'),
        }}
      />
    </div>
  );
}