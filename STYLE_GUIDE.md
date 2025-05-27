# Style Guide - Clean Modern Interface

This style guide defines the color palette and design principles for the Proration Design application, based on the clean, modern interface style from Google's file management system.

## Color Palette

### Primary Colors
- **Primary Blue**: `#4285F4` - Main buttons, primary actions, Unilever cargo
- **Primary Blue Hover**: `#3367D6` - Hover states for primary blue elements
- **Primary Blue Dark**: `#1A73E8` - Active states, secondary Unilever cargo
- **Primary Light Blue**: `#E8F0FE` - Light backgrounds for blue-themed sections

### Neutral Colors
- **Background**: `#F8F9FA` - Main application background
- **Card/Panel Background**: `#FFFFFF` - Pure white for cards and panels
- **Light Gray Background**: `#F1F3F4` - Subtle background variations
- **Border Light**: `#E8EAED` - Light borders and dividers
- **Border Medium**: `#DADCE0` - Medium borders
- **Text Secondary**: `#5F6368` - Secondary text color
- **Text Tertiary**: `#9AA0A6` - Tertiary text and subtle elements
- **Text Primary**: `#202124` - Primary text color

### Status Colors
- **Success Green**: `#34A853` - Success states, laytime, positive indicators
- **Warning Yellow**: `#FBBC04` - Warning states, waiting time
- **Error Red**: `#EA4335` - Error states, demurrage, deductions
- **Info Blue**: `#4285F4` - Information states (same as primary blue)

### Operational Colors (Soft, Muted Versions)
- **Loading Orange**: `#F9AB00` - Softer orange for loading operations
- **Discharging Blue**: `#4285F4` - Primary blue for discharging
- **Waiting Purple**: `#8E24AA` - Softer purple for waiting time
- **Laytime Green**: `#34A853` - Success green for laytime
- **Demurrage Red**: `#EA4335` - Error red for demurrage

### Port Theme Colors
- **Kuala Tanjung**: `#4285F4` - Primary blue
- **Kandla**: `#1A73E8` - Primary blue dark
- **Port Qasim**: `#34A853` - Success green

### Additional Soft Colors for Variety
- **Soft Teal**: `#26A69A`
- **Soft Indigo**: `#5C6BC0`
- **Soft Pink**: `#EC407A`
- **Soft Amber**: `#FFB74D`
- **Soft Cyan**: `#4DD0E1`
- **Soft Lime**: `#9CCC65`

## Design Principles

### 1. Clean & Modern
- Use soft, muted colors instead of bright, saturated ones
- Maintain high contrast for accessibility
- Use consistent spacing and typography

### 2. Professional Interface
- Follow Google Material Design principles
- Use subtle shadows and borders
- Maintain visual hierarchy with color and typography

### 3. Consistent Color Usage
- **Blue family** for primary actions and Unilever-related elements
- **Green** for success states and positive indicators
- **Orange/Yellow** for warnings and waiting states
- **Red** for errors and negative indicators
- **Gray** for neutral elements and secondary information

## Component-Specific Applications

### ✅ Updated Components
All components have been updated to use the new color scheme:

1. **TimeTrackingPanel** - All colors updated to soft palette
2. **CollapsibleControlModal** - Button colors updated
3. **CargoStatusModal** - Progress bars and indicators updated
4. **FloatingSituationalAwarenessPanel** - Cargo colors updated
5. **TubeMapVisualization** - Hardcoded colors updated
6. **DemurrageSummary** - Header and text colors updated
7. **PortQasimAttributionTable** - Table colors updated
8. **styleGuide.js** - Core color definitions updated

### Color Consistency Rules
- **Never use bright, saturated colors** like `#FF6600`, `#E91E63`, `#9C27B0`
- **Always use the defined palette** from this style guide
- **Maintain accessibility** with proper contrast ratios
- **Use semantic colors** (green for success, red for errors, etc.)

## Implementation Status
✅ **COMPLETE** - All components updated with clean, modern color scheme
✅ **CONSISTENT** - No bright colors remaining in codebase
✅ **ACCESSIBLE** - Proper contrast maintained throughout
✅ **PROFESSIONAL** - Google-style interface achieved 