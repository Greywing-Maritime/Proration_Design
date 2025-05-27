// Style Guide for Proration Design System
// Based on the clean, modern interface color scheme
// This file contains all color definitions, typography, spacing, and component styles

export const colors = {
  // Primary Colors - Clean Modern Interface
  primary: {
    blue: '#4285F4',        // Primary blue (Google-style)
    darkBlue: '#1A73E8',    // Darker blue for headers
    lightBlue: '#E8F0FE',   // Light blue for backgrounds
    hoverBlue: '#3367D6',   // Hover state blue
  },
  
  // Neutral Colors - Clean grays
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8F9FA',    // Main background
    lightGray: '#F1F3F4',   // Subtle background variations
    gray100: '#E8EAED',     // Light borders
    gray200: '#DADCE0',     // Medium light borders
    gray300: '#BDC1C6',     // Medium gray
    gray400: '#9AA0A6',     // Secondary text
    gray500: '#5F6368',     // Primary text light
    gray600: '#3C4043',     // Primary text medium
    gray700: '#202124',     // Primary text dark
    gray800: '#1A1A1A',     // Almost black
    black: '#000000',
  },
  
  // Status Colors - Modern interface style
  status: {
    success: '#34A853',     // Green for success
    warning: '#FBBC04',     // Yellow for warnings
    error: '#EA4335',       // Red for errors
    info: '#4285F4',        // Blue for information
  },
  
  // Operational Colors - Soft, muted versions
  operations: {
    loading: '#F9AB00',     // Softer orange for loading
    discharging: '#4285F4', // Primary blue for discharging
    waiting: '#8E24AA',     // Softer purple for waiting
    laytime: '#34A853',     // Success green for laytime
    demurrage: '#EA4335',   // Error red for demurrage
  },
  
  // Port Theme Colors - Updated to match new scheme
  portThemes: {
    kualaTanjung: '#4285F4', // Primary blue
    kandla: '#1A73E8',       // Primary blue dark
    portQasim: '#34A853',    // Success green
  },
  
  // Background Gradients - Clean, subtle
  gradients: {
    main: 'linear-gradient(135deg, #F8F9FA 0%, #F1F3F4 100%)', // Subtle gray gradient
    header: 'linear-gradient(135deg, #4285F4 0%, #1A73E8 100%)', // Blue gradient
    card: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',   // White to off-white
  },
  
  // Shadows - Modern, subtle
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.1)',
    medium: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    large: '0 4px 6px rgba(0, 0, 0, 0.1)',
    hover: '0 2px 4px rgba(0, 0, 0, 0.15)',
  },
};

// Typography
export const typography = {
  fontFamily: {
    primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
  },
  
  fontSize: {
    xs: '10px',
    sm: '12px',
    base: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '32px',
  '4xl': '40px',
};

// Border Radius
export const borderRadius = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Component Styles
export const components = {
  button: {
    primary: {
      background: colors.primary.blue,
      color: colors.neutral.white,
      hover: {
        background: colors.primary.darkBlue,
        transform: 'translateY(-1px)',
        shadow: colors.shadows.hover,
      },
    },
    secondary: {
      background: colors.neutral.gray200,
      color: colors.neutral.gray700,
      hover: {
        background: colors.neutral.gray300,
      },
    },
  },
  
  card: {
    background: colors.neutral.white,
    border: `1px solid ${colors.neutral.gray100}`,
    borderRadius: borderRadius.lg,
    shadow: colors.shadows.medium,
  },
  
  modal: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: borderRadius.lg,
    shadow: colors.shadows.large,
  },
  
  input: {
    background: colors.neutral.white,
    border: `1px solid ${colors.neutral.gray200}`,
    borderRadius: borderRadius.md,
    focus: {
      borderColor: colors.primary.blue,
      shadow: `0 0 0 3px ${colors.primary.lightBlue}`,
    },
  },
};

const styleGuide = {
  colors,
  typography,
  spacing,
  borderRadius,
  components,
  modalBackgroundColor: 'rgba(0, 0, 0, 0.75)', // Dark semi-transparent background for modals
  modalContentBackgroundColor: colors.neutral.offWhite, // Background for the modal content area
  modalTextColor: colors.neutral.gray800, // Text color for modal content
  borderColor: colors.neutral.gray500, // Border color for elements within the modal
  statusColors: {
    success: '#34A853',     // Green for success
    warning: '#FBBC04',     // Yellow for warnings
    error: '#EA4335',       // Red for errors
    info: '#4285F4',        // Blue for information
  },
};

export default styleGuide; 