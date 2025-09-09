const tintColorLight = '#720110';
const tintColorDark = '#720110';

export const Colors = {
  // Dark theme colors
  background: '#0a0a0a',
  surface: '#111215',
  surfaceSecondary: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  textTertiary: '#666666',
  primary: '#720110',
  primaryDark: '#5a010d',
  iconPrimary: '#AB0110',
  border: '#333333',
  borderLight: '#444444',
  shadow: '#000000',
  
  // Badge colors
  earrings: '#FFD700',
  glasses: '#4A90E2',
  hat: '#8B4513',
  necklace: '#C0C0C0',
  tattoo: '#FF6B6B',
};

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};