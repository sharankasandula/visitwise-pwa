# Pull-to-Refresh Implementation

This document explains how to use the pull-to-refresh functionality implemented throughout the Visitwise app.

## Overview

The pull-to-refresh feature allows users to refresh content by pulling down from the top of the screen, similar to native mobile apps. It's implemented using a custom hook and wrapper component that provides smooth animations and visual feedback.

## Components

### 1. `usePullToRefresh` Hook

A custom React hook that handles the touch gestures and refresh logic.

```typescript
import { usePullToRefresh } from "../hooks/usePullToRefresh";

const { isRefreshing, pullDistance, isPulling, elementRef, resetPullState } =
  usePullToRefresh({
    onRefresh: async () => {
      // Your refresh logic here
      await fetchData();
    },
    threshold: 80, // Distance in pixels to trigger refresh
    resistance: 0.5, // How much resistance when pulling beyond threshold
    enabled: true, // Whether pull-to-refresh is enabled
  });
```

### 2. `PullToRefresh` Component

A wrapper component that provides visual feedback and handles the pull-to-refresh functionality.

```typescript
import { PullToRefresh } from "./ui/PullToRefresh";

<PullToRefresh
  onRefresh={handleRefresh}
  threshold={80}
  resistance={0.5}
  enabled={true}
  showIndicator={true}
  indicatorColor="#3b82f6"
  indicatorSize={24}
>
  {/* Your content here */}
</PullToRefresh>;
```

### 3. `withPullToRefresh` HOC

A higher-order component that wraps any component with pull-to-refresh functionality.

```typescript
import { withPullToRefresh } from "./ui/withPullToRefresh";

const MyComponentWithRefresh = withPullToRefresh(MyComponent, {
  threshold: 80,
  resistance: 0.5,
  enabled: true,
  showIndicator: true,
  indicatorColor: "#3b82f6",
  indicatorSize: 24,
});

// Usage
<MyComponentWithRefresh onRefresh={handleRefresh} />;
```

## Implementation Examples

### Basic Usage

```typescript
import React, { useCallback } from "react";
import { PullToRefresh } from "./ui/PullToRefresh";

const MyComponent: React.FC = () => {
  const handleRefresh = useCallback(async () => {
    try {
      // Your refresh logic here
      await fetchData();
      await updateUI();
    } catch (error) {
      console.error("Refresh failed:", error);
    }
  }, []);

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="content">{/* Your content here */}</div>
    </PullToRefresh>
  );
};
```

### With Custom Configuration

```typescript
<PullToRefresh
  onRefresh={handleRefresh}
  threshold={100} // Higher threshold for easier triggering
  resistance={0.3} // Less resistance for smoother feel
  indicatorColor="#ef4444" // Red indicator
  indicatorSize={32} // Larger indicator
>
  <div className="content">{/* Your content here */}</div>
</PullToRefresh>
```

### Using the HOC

```typescript
import { withPullToRefresh } from "./ui/withPullToRefresh";

const EnhancedComponent = withPullToRefresh(MyComponent, {
  threshold: 80,
  resistance: 0.5,
  showIndicator: true,
  indicatorColor: "#10b981",
});

// Usage - onRefresh prop is optional
<EnhancedComponent onRefresh={handleRefresh} />;
```

## Props Reference

### PullToRefresh Props

| Prop             | Type                          | Default   | Description                                     |
| ---------------- | ----------------------------- | --------- | ----------------------------------------------- |
| `onRefresh`      | `() => Promise<void> \| void` | Required  | Function to call when refresh is triggered      |
| `threshold`      | `number`                      | `80`      | Distance in pixels to trigger refresh           |
| `resistance`     | `number`                      | `0.5`     | Resistance factor when pulling beyond threshold |
| `enabled`        | `boolean`                     | `true`    | Whether pull-to-refresh is enabled              |
| `showIndicator`  | `boolean`                     | `true`    | Whether to show the refresh indicator           |
| `indicatorColor` | `string`                      | `#3b82f6` | Color of the refresh indicator                  |
| `indicatorSize`  | `number`                      | `24`      | Size of the refresh indicator in pixels         |
| `className`      | `string`                      | `''`      | Additional CSS classes                          |
| `style`          | `CSSProperties`               | `{}`      | Additional inline styles                        |

### usePullToRefresh Hook Return Values

| Value            | Type                     | Description                                |
| ---------------- | ------------------------ | ------------------------------------------ |
| `isRefreshing`   | `boolean`                | Whether a refresh is currently in progress |
| `pullDistance`   | `number`                 | Current pull distance in pixels            |
| `isPulling`      | `boolean`                | Whether user is currently pulling          |
| `elementRef`     | `RefObject<HTMLElement>` | Ref to attach to the scrollable element    |
| `resetPullState` | `() => void`             | Function to reset pull state               |

## Where It's Implemented

### 1. Home Component

- Wraps the main patient list content
- Refreshes patient data when pulled
- Includes earnings card and search functionality

### 2. ArchivedPatients Component

- Wraps the archived patients list
- Refreshes archived patient data when pulled
- Includes search functionality

### 3. Future Implementations

- PatientProfile component
- Visit history pages
- Settings pages
- Any other scrollable content

## Customization

### Custom Indicator

You can customize the indicator by modifying the `PullToRefresh` component or creating your own:

```typescript
<PullToRefresh
  onRefresh={handleRefresh}
  showIndicator={false} // Hide default indicator
>
  <div className="custom-indicator">{/* Your custom indicator */}</div>
</PullToRefresh>
```

### Custom Thresholds

Different components can have different thresholds based on their content:

```typescript
// For lists with many items
<PullToRefresh threshold={60} onRefresh={handleRefresh}>

// For forms or detailed views
<PullToRefresh threshold={120} onRefresh={handleRefresh}>

// For minimal content
<PullToRefresh threshold={40} onRefresh={handleRefresh}>
```

## Best Practices

### 1. Refresh Function

- Always make your refresh function async
- Handle errors gracefully
- Show loading states if needed
- Update UI after successful refresh

### 2. Performance

- Debounce refresh calls if needed
- Avoid unnecessary re-renders
- Use `useCallback` for refresh handlers

### 3. User Experience

- Provide visual feedback during refresh
- Show success/error messages
- Maintain scroll position when possible
- Use appropriate thresholds for different content types

### 4. Accessibility

- Ensure keyboard navigation works
- Provide alternative refresh methods
- Use appropriate ARIA labels

## Troubleshooting

### Common Issues

1. **Indicator not showing**: Check if `showIndicator` is true and content is scrollable
2. **Refresh not triggering**: Verify `onRefresh` function is provided and `enabled` is true
3. **Touch events not working**: Ensure the component is mounted and touch events are enabled
4. **Performance issues**: Check if refresh function is optimized and not causing unnecessary re-renders

### Debug Mode

Enable debug logging by checking the browser console for:

- Touch event logs
- Refresh function calls
- Error messages

## Browser Support

- **Mobile**: Full support for touch gestures
- **Desktop**: Touch events supported on touch-enabled devices
- **Fallback**: Graceful degradation for non-touch devices

## Future Enhancements

- [ ] Haptic feedback on mobile devices
- [ ] Custom animation curves
- [ ] Multiple refresh zones
- [ ] Pull-to-refresh in nested scrollable areas
- [ ] Gesture-based refresh (swipe patterns)
- [ ] Accessibility improvements for screen readers
