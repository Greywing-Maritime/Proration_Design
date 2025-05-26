# Style Guide Documentation

## Overview
This style guide defines the visual design system for the Proration Design application. It has been updated from a purple/violet gradient theme to a professional blue/gray color scheme.

## Color Scheme

### Primary Colors
- **Primary Blue**: `#4A90E2` - Main interactive elements, buttons, links
- **Dark Blue**: `#2C5282` - Headers, active states, emphasis
- **Light Blue**: `#E6F2FF` - Subtle backgrounds, hover states
- **Sky Blue**: `#87CEEB` - Accent color for special elements

### Neutral Colors (Grays)
- **White**: `#FFFFFF` - Primary background
- **Off White**: `#F8F9FA` - Secondary backgrounds
- **Light Gray**: `#F5F6FA` - Sidebar backgrounds
- **Gray 100**: `#E8E9ED` - Borders, dividers
- **Gray 200**: `#D1D3D9` - Secondary borders
- **Gray 300**: `#B8BBC3` - Disabled states
- **Gray 400**: `#9EA2AD` - Secondary text
- **Gray 500**: `#6C7280` - Primary text (light)
- **Gray 600**: `#4B5563` - Primary text (medium)
- **Gray 700**: `#374151` - Primary text (dark)
- **Gray 800**: `#1F2937` - Headings, emphasis
- **Black**: `#000000` - Maximum contrast

### Status Colors
- **Success**: `#10B981` - Positive actions, completed states
- **Warning**: `#F59E0B` - Warnings, attention needed
- **Error**: `#EF4444` - Errors, critical issues
- **Info**: `#3B82F6` - Informational messages

### Operational Colors
- **Loading**: `#FF9800` - Loading operations
- **Discharging**: `#2196F3` - Discharging operations
- **Waiting**: `#9C27B0` - Waiting states
- **Laytime**: `#4CAF50` - Active laytime
- **Demurrage**: `#F44336` - Demurrage periods

### Port Theme Colors
These colors are maintained for backward compatibility with the existing port visualization:
- **Kuala Tanjung**: `#E91E63` (Pink)
- **Kandla**: `#9C27B0` (Purple)
- **Port Qasim**: `#2196F3` (Blue)

## Background Gradients
- **Main Background**: `linear-gradient(135deg, #F5F6FA 0%, #E8E9ED 100%)` - Subtle gray gradient
- **Header Gradient**: `linear-gradient(135deg, #4A90E2 0%, #2C5282 100%)` - Blue gradient for headers
- **Card Gradient**: `linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)` - White to off-white for cards

## Shadows
- **Small**: `0 2px 4px rgba(0, 0, 0, 0.06)` - Subtle elevation
- **Medium**: `0 4px 16px rgba(0, 0, 0, 0.08)` - Standard cards and panels
- **Large**: `0 8px 32px rgba(0, 0, 0, 0.12)` - Modals and overlays
- **Hover**: `0 6px 20px rgba(0, 0, 0, 0.15)` - Interactive hover states

## Typography
- **Primary Font**: Inter, system fonts fallback
- **Monospace Font**: SF Mono, Monaco, Inconsolata, Fira Code

### Font Sizes
- `xs`: 10px
- `sm`: 12px
- `base`: 14px
- `md`: 16px
- `lg`: 18px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 30px

## Migration from Old Color Scheme

### Key Changes
1. **Background**: Changed from purple gradient (`#667eea → #764ba2`) to gray gradient (`#F5F6FA → #E8E9ED`)
2. **Primary Action Color**: Changed from tube blue (`#0019a8`) to modern blue (`#4A90E2`)
3. **Text Colors**: Updated to use the gray scale for better readability
4. **Shadows**: Reduced opacity for a more subtle, professional look

### Files Updated
- `src/index.css` - Global CSS variables and base styles
- `src/App.css` - Application-specific styles
- `src/styles/styleGuide.js` - Centralized style guide configuration

### Backup Location
The original color scheme has been backed up to: `backup/original_style_guide_[timestamp]/`

## Usage

### Importing the Style Guide
```javascript
import styleGuide from './styles/styleGuide';

// Access colors
const primaryBlue = styleGuide.colors.primary.blue;

// Access typography
const headerFont = styleGuide.typography.fontSize['2xl'];

// Access shadows
const cardShadow = styleGuide.colors.shadows.medium;
```

### CSS Variables
The color scheme is also available as CSS variables:
```css
/* Primary colors */
var(--primary-blue)
var(--primary-dark-blue)

/* Neutral colors */
var(--neutral-gray-700)
var(--neutral-gray-500)

/* Status colors */
var(--status-success)
var(--status-error)
```

## Maintenance
When adding new colors or modifying the scheme:
1. Update the `styleGuide.js` file first
2. Update corresponding CSS variables in `index.css`
3. Update this documentation
4. Create a backup before making major changes 