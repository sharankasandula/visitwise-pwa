import React, { ComponentType } from "react";
import { PullToRefresh } from "./PullToRefresh";

interface WithPullToRefreshOptions {
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
  showIndicator?: boolean;
  indicatorColor?: string;
  indicatorSize?: number;
}

export function withPullToRefresh<P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithPullToRefreshOptions = {}
) {
  const {
    threshold = 80,
    resistance = 0.5,
    enabled = true,
    showIndicator = true,
    indicatorColor = "#3b82f6",
    indicatorSize = 24,
  } = options;

  // Create a new component that wraps the original
  const WithPullToRefreshComponent = React.forwardRef<
    any,
    P & { onRefresh?: () => Promise<void> | void }
  >((props, ref) => {
    const { onRefresh, ...restProps } = props;

    // If no onRefresh is provided, just render the original component
    if (!onRefresh) {
      return <WrappedComponent {...(restProps as P)} ref={ref} />;
    }

    return (
      <PullToRefresh
        onRefresh={onRefresh}
        threshold={threshold}
        resistance={resistance}
        enabled={enabled}
        showIndicator={showIndicator}
        indicatorColor={indicatorColor}
        indicatorSize={indicatorSize}
      >
        <WrappedComponent {...(restProps as P)} ref={ref} />
      </PullToRefresh>
    );
  });

  WithPullToRefreshComponent.displayName = `withPullToRefresh(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithPullToRefreshComponent;
}
