# Cargo Proration Visualization Design Guidelines

## Core Visibility Rules

1. At each port, only those cargoes or tanks with operations occurring at the port should be visualized.

2. If there are 5 cargoes with operations at a port all cargo lines for those specific cargoes should be visualized at all times at that port.

3. All cargo lines with operations at a port must remain visible throughout the entire port stay - from arrival to departure.

4. **No line amalgamation** - all operational cargo lines must be distinctly visible at all times.

## Central Flow and Positioning

5. Cargo lines should flow directly down the center of the modal/container using the true center (`containerWidth / 2`).

6. Centralize cargo lines normally, except when they need to breakout to illustrate individual operational events.

7. Use the full width of the available container space efficiently, not fixed left-side positioning.

8. True container centering must be calculated dynamically based on actual container width, not fixed pixel positions.

## Breakout Operations

9. **All cargoes must branch out during operations** - Even single cargoes at a port should branch away from centerline during cargo operations.

10. **Branching is a visual signal** - The act of branching from center alerts users that the vessel is actively conducting loading or discharge operations.

11. When cargo operations commence, the cargo line should breakout from the central spine and maintain that position until operations complete.

12. Once a cargo starts individual operations, it should continue in a **straight vertical line** until operations complete - no returning to center during operations.

13. Use smart left/right branching with dedicated lane spacing for each cargo.

14. **Single cargo mandatory branching** - Even if only one cargo operates at a port, it MUST branch out during operations (minimum 150px from center) to signal active operations.

## Cargo Separation and Overlap Prevention

15. **No overlapping during operations or waiting** - Each cargo line must have its own dedicated vector path that doesn't overlap with others during active periods.

16. **Dedicated lane spacing** - Each cargo gets its own lane with minimum 80px spacing between adjacent lines to ensure clear visual separation.

17. **Scaling spacing system**:
    - Single cargo: Branch 150px to left side (mandatory branching for visual signal)
    - Two cargoes: 120px left and right respectively  
    - Three cargoes: 120px spacing (left, center, right)
    - Four cargoes: 100px spacing (two on each side)
    - Five cargoes: 100px spacing distributed symmetrically around center
    - Multiple cargoes: Distribute evenly across available space with minimum 80px from center
    - Maximum spread: 80% of container width to maintain readability

18. **Explicit overlap prohibition** - Lines must never run parallel in the same visual space. When multiple cargoes operate simultaneously, each must have a distinct horizontal position that prevents any overlapping of line paths.

19. **Lines may only overlap during transitions** - Brief overlaps are acceptable when transitioning between positions, but not during operational or waiting states.

20. **Clear identification requirement** - Users must be able to easily identify when each cargo started operations, ended operations, and what events occurred during their operational phases.

21. Use consistent, deterministic positioning (not random) to ensure stable visual rendering across updates.

## Angular Geometry Constraints

22. Only use specific angles for visual consistency:
    - **180°** - Straight vertical lines (during operations)
    - **90°** - Sharp direction changes
    - **45°** - Standard breakout transitions  
    - **22.5°** - Gradual transitions with horizontal movement

23. No curved lines or arbitrary angles - maintain geometric precision throughout.

24. Use multi-segment angular paths for complex transitions while maintaining angle constraints.

## Dynamic Spacing

25. Implement dynamic spacing based on event importance:
    - **Major operations** (Operations Start/Complete, Arrivals, Departures): 120px spacing
    - **Individual cargo operations**: 90px spacing
    - **Administrative events** (Notice of Readiness, etc.): 70px spacing

26. Spacing should provide more visual breathing room around important operational milestones.

## Line Types and Visual Hierarchy

27. **Solid Lines Only** (Main cargo flow):
    - Represent actual cargo movement and positioning
    - Thick colored lines continuous throughout port stay
    - Width: 8px for breakout operations, 6px for centralized flow
    - Opacity: 100% when currently operating, 90% when port-active, 70% when centralized

28. **No dotted or dashed lines** - All cargo flow is represented by solid colored lines only.

29. Enhanced visual prominence for currently active operations through increased line weight and opacity.

## Operational Continuity

30. During individual operations, cargo lines must:
    - Break out from center to designated left/right position
    - Maintain straight vertical alignment throughout operation sequence
    - Only return to center after "Operations Complete" event

31. Multiple simultaneous operations should be clearly separated using the dedicated lane system.

32. Operation detection must properly identify start and end phases for accurate positioning.

## Station and Event Positioning

33. Shared operations: Position stations at true center with small offsets (12px spacing) for multiple cargoes.

34. Individual operations: Position stations at breakout locations (left/right of center).

35. Enhanced station styling:
    - Shared stations: Central spine with white center dot
    - Individual stations: Colored circles with shadows at breakout positions

36. Event flow arrows positioned at true center, not fixed positions.

## Time Tracking Integration

37. Provide both individual port analysis and comprehensive "All Ports" voyage-wide analysis.

38. All Ports view should aggregate:
    - Total voyage time across all ports
    - Combined cargo breakdown showing port participation
    - Overall charterer distribution
    - Voyage-wide insights and key metrics

39. Default to "All Ports" view to provide big picture first, then allow drill-down to individual ports.

## Technical Implementation

40. Use deterministic positioning (not random) for consistent rendering across updates.

41. Implement proper CSS class hierarchy:
    - `port-active`: All cargoes operating at the port
    - `currently-operating`: Cargoes actively being worked on  
    - `has-breakout`: Cargoes with individual operations
    - `centralized`: Cargoes in center flow

42. Ensure responsive design that adapts to actual container width dynamically.

43. Process port data with actual container width to calculate true center positioning.

44. Use sorted cargo arrays for consistent positioning order across renders.

## Visual Clarity Principles

45. **Consistent color coding** throughout the voyage for each cargo type.

46. **Clean geometric design** using only specified angles for professional appearance.

47. **Efficient space utilization** through smart left/right branching rather than center clustering.

48. **Enhanced readability** through proper spacing and no overlapping during active periods.

49. **Professional aesthetics** with shadows, proper line weights, and visual hierarchy.

## Data Structure Requirements

50. Events must be properly categorized as 'shared' or 'individual' types.

51. Cargo operation start and end events must be clearly identifiable in the timeline.

52. Active cargoes must be properly specified for each event to enable correct visibility logic.

53. Port cargo sets must be determined dynamically from timeline data, not hardcoded.

## User Experience Guidelines

54. Visualization should make it easy to follow individual cargo journeys throughout port stays.

55. Clear visual distinction between centralized flow and individual operations phases.

56. Immediate visual clarity about which cargoes are operating simultaneously.

57. Easy identification of operational start/end points for each cargo.

58. **Simplicity over complexity** - remove unnecessary visual elements (like dotted connection lines) that don't add clarity.

## Operation Detection and Branching Logic

59. **Comprehensive event pattern matching** - Operation detection must handle multiple event name variations:
    - Start patterns: "Operations Start", "Hose Connected", "Loading Commenced", "Discharging Commenced", "Discharge Commenced", "Loading Started", "Discharge Started", "Loading Commences", "Discharging Commences"
    - End patterns: "Operations Complete", "Operations Completed", "Loading Complete", "Discharge Complete", "Discharging Complete"

60. **Multi-layered operation detection** - Use multiple fallback mechanisms to ensure reliable branching:
    - Primary: Match operation start/end event pairs for the cargo
    - Secondary: Detect individual event type with matching cargo ID
    - Tertiary: Check if cargo has individual operations at port AND is in activeCargoes during laytime events

61. **Mandatory individual operation branching** - ANY cargo with individual operations MUST branch out during those operations, regardless of detection method used.

62. **Event type-based branching** - If an event is marked as `type: 'individual'` and `cargo: cargoId`, that cargo MUST branch out at that event.

63. **Active cargo operational branching** - Cargoes listed in `activeCargoes` during `timeType: 'laytime'` individual events should branch out if they have any individual operations at that port.

64. **Fail-safe branching enforcement** - Multiple detection layers ensure no cargo with individual operations remains centralized during operational phases.

## Implementation Robustness

65. **Event timeline consistency** - Operation detection must work with real-world data variations in event naming and structure.

66. **Defensive programming** - Use null-safe operations and defensive checks when processing timeline events and cargo positions.

67. **Fallback positioning** - If primary positioning logic fails, ensure cargoes still get positioned (centralized) rather than disappearing.

68. **Operation phase continuity** - Once a cargo branches for operations, it should remain branched until a clear "Operations Complete" event, not return to center mid-operation.

---

*This document represents the complete design specification for the cargo proration visualization system as of the latest implementation.* 