import { ViewStyle, TextStyle } from 'react-native';
export interface GlassEffectProps {
    /** Blur radius for the glass effect (0-30) */
    blurRadius?: number;
    /** Background opacity (0-1) */
    opacity?: number;
    /** Glass tint color */
    tintColor?: string;
    /** Border radius */
    borderRadius?: number;
    /** Border width */
    borderWidth?: number;
    /** Border color */
    borderColor?: string;
    /** Enable drop shadow */
    shadow?: boolean;
    /** Shadow color */
    shadowColor?: string;
    /** Shadow opacity (0-1) */
    shadowOpacity?: number;
    /** Shadow radius */
    shadowRadius?: number;
    /** Shadow offset */
    shadowOffset?: {
        width: number;
        height: number;
    };
}
export interface LiquidGlassCardProps extends GlassEffectProps {
    children: React.ReactNode;
    style?: ViewStyle;
    onPress?: () => void;
    disabled?: boolean;
    /** Enable liquid animation on press */
    liquidEffect?: boolean;
    /** Animation duration in milliseconds */
    animationDuration?: number;
}
export interface LiquidGlassButtonProps extends GlassEffectProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline';
    /** Button size */
    size?: 'small' | 'medium' | 'large';
    /** Loading state */
    loading?: boolean;
    /** Enable haptic feedback */
    hapticFeedback?: boolean;
}
export interface LiquidGlassPanelProps extends GlassEffectProps {
    children: React.ReactNode;
    style?: ViewStyle;
    /** Panel position */
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
    /** Enable slide animation */
    slideAnimation?: boolean;
    /** Animation direction */
    slideDirection?: 'up' | 'down' | 'left' | 'right';
}
export interface LiquidGlassModalProps extends GlassEffectProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
    /** Enable backdrop blur */
    backdropBlur?: boolean;
    /** Backdrop opacity */
    backdropOpacity?: number;
    /** Animation type */
    animationType?: 'fade' | 'slide' | 'scale';
    /** Close on backdrop press */
    closeOnBackdropPress?: boolean;
}
export interface GradientConfig {
    colors: string[];
    locations?: number[];
    start?: {
        x: number;
        y: number;
    };
    end?: {
        x: number;
        y: number;
    };
}
export interface LiquidAnimationConfig {
    duration: number;
    tension?: number;
    friction?: number;
    useNativeDriver?: boolean;
}
//# sourceMappingURL=index.d.ts.map