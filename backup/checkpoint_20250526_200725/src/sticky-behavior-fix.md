# Floating Port Modal Sticky Behavior Fix

## Problem
The floating port modals were scrolling away too early, degrading situational awareness. When analyzing data in the left sidebar, the right-hand floating modals would disappear even though their related port sections were still visible.

## Solution
Updated the positioning logic in `FloatingPortModal.js` to keep modals visible for the entire duration of their port section visibility.

### Key Changes:

1. **Extended Visibility Range**
   - Modals now stay visible as long as ANY part of their port section is visible in the viewport
   - Previously, modals would scroll away when just the top of the port section passed the sticky point

2. **Improved Sticky Behavior**
   - When a port section is partially visible, the modal remains in view
   - The modal only starts scrolling up when the port section is ending and there isn't enough room
   - Uses `Math.max()` to ensure smooth transition as sections end

3. **Three Positioning States**
   ```javascript
   // State 1: Port section visible and past sticky point
   position: fixed
   top: stickyTopViewport (or adjusted if section ending)
   
   // State 2: Port section visible but not yet at sticky point  
   position: absolute
   top: aligned with port title
   
   // State 3: Port section completely out of view
   position: absolute
   top: anchored to section bottom or title
   ```

4. **Viewport Awareness**
   - Added `viewportHeight` calculation to determine if port sections are visible
   - Checks both top and bottom boundaries of port sections

## Benefits
- **Better Situational Awareness**: Modals remain visible while analyzing related data
- **Smoother Scrolling**: Modals transition smoothly as sections end
- **Consistent Behavior**: All three port modals follow the same rules
- **Special Handling**: Kuala Tanjung modal still respects sidebar position

## Testing
To verify the fix:
1. Scroll through the tube map visualization
2. Notice that floating modals stay visible for their entire port sections
3. Modals only scroll away when their port section is completely out of view
4. When analyzing data in the left sidebar, related floating modals remain accessible 