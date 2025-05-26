// Style Guide for Proration Design System
// Based on the professional blue/gray color scheme
// This file contains all color definitions, typography, spacing, and component styles

export const colors = {
  // Primary Colors - Professional Blue/Gray Palette
  primary: {
    blue: '#4A90E2',        // Primary blue (from screenshots)
    darkBlue: '#2C5282',    // Darker blue for headers
    lightBlue: '#E6F2FF',   // Light blue for backgrounds
    skyBlue: '#87CEEB',     // Sky blue for accents
  },
  
  // Neutral Colors - Grays
  neutral: {
    white: '#FFFFFF',
    offWhite: '#F8F9FA',    // Slight off-white for backgrounds
    lightGray: '#F5F6FA',   // Very light gray (sidebar background)
    gray100: '#E8E9ED',     // Light gray borders
    gray200: '#D1D3D9',     // Medium light gray
    gray300: '#B8BBC3',     // Medium gray
    gray400: '#9EA2AD',     // Text gray
    gray500: '#6C7280',     // Dark gray text
    gray600: '#4B5563',     // Darker gray
    gray700: '#374151',     // Very dark gray
    gray800: '#1F2937',     // Almost black
    black: '#000000',
  },
  
  // Status Colors
  status: {
    success: '#10B981',     // Green for success/processed
    warning: '#F59E0B',     // Orange for warnings
    error: '#EF4444',       // Red for errors
    info: '#3B82F6',        // Blue for information
  },
  
  // Operational Colors (for cargo operations)
  operations: {
    loading: '#FF9800',     // Orange for loading
    discharging: '#2196F3', // Blue for discharging
    waiting: '#9C27B0',     // Purple for waiting
    laytime: '#4CAF50',     // Green for laytime
    demurrage: '#F44336',   // Red for demurrage
  },
  
  // Port Theme Colors (maintaining existing functionality)
  portThemes: {
    kualaTanjung: '#E91E63', // Pink
    kandla: '#9C27B0',       // Purple
    portQasim: '#2196F3',    // Blue
  },
  
  // Background Gradients
  gradients: {
    main: 'linear-gradient(135deg, #F5F6FA 0%, #E8E9ED 100%)', // Subtle gray gradient
    header: 'linear-gradient(135deg, #4A90E2 0%, #2C5282 100%)', // Blue gradient
    card: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',   // White to off-white
  },
  
  // Shadows
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.06)',
    medium: '0 4px 16px rgba(0, 0, 0, 0.08)',
    large: '0 8px 32px rgba(0, 0, 0, 0.12)',
    hover: '0 6px 20px rgba(0, 0, 0, 0.15)',
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
    success: '#10B981',     // Green for success/processed
    warning: '#F59E0B',     // Orange for warnings
    error: '#EF4444',       // Red for errors
    info: '#3B82F6',        // Blue for information
  },
};

export default styleGuide; 