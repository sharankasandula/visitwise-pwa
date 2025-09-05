import React, { ReactNode, forwardRef } from "react";
import { usePullToRefresh } from "../../hooks/usePullToRefresh";

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showIndicator?: boolean;
  indicatorColor?: string;
  indicatorSize?: number;
}

export const PullToRefresh = forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      children,
      onRefresh,
      threshold = 80,
      resistance = 0.5,
      enabled = true,
      className = "",
      style = {},
      showIndicator = true,
      indicatorColor = "#3b82f6",
      indicatorSize = 24,
    },
    ref
  ) => {
    const {
      isRefreshing,
      pullDistance,
      isPulling,
      elementRef,
      resetPullState,
    } = usePullToRefresh({
      onRefresh,
      threshold,
      resistance,
      enabled,
    });

    // Combine refs
    const combinedRef = (node: HTMLDivElement | null) => {
      elementRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    };

    const shouldShowIndicator = showIndicator && (isPulling || isRefreshing);
    const indicatorOpacity = Math.min(pullDistance / threshold, 1);
    const indicatorRotation = isRefreshing ? 360 : pullDistance * 2;

    return (
      <div
        ref={combinedRef}
        className={`relative ${className}`}
        style={{
          ...style,
          touchAction: "pan-y",
        }}
      >
        {/* Pull-to-refresh indicator */}
        {shouldShowIndicator && (
          <div
            className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 items-center justify-center"
            style={{
              top: Math.max(0, pullDistance - 40),
              opacity: indicatorOpacity,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full bg-white shadow-lg"
              style={{
                width: indicatorSize,
                height: indicatorSize,
                border: `2px solid ${indicatorColor}`,
              }}
            >
              {isRefreshing ? (
                <div
                  className="animate-spin rounded-full border-2 border-transparent"
                  style={{
                    width: indicatorSize - 8,
                    height: indicatorSize - 8,
                    borderTopColor: indicatorColor,
                  }}
                />
              ) : (
                <svg
                  width={indicatorSize - 8}
                  height={indicatorSize - 8}
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{
                    transform: `rotate(${indicatorRotation}deg)`,
                    transition: "transform 0.2s ease-out",
                  }}
                >
                  <path
                    d="M12 4V2M12 4C13.1046 4 14 4.89543 14 6C14 7.10457 13.1046 8 12 8C10.8954 8 10 7.10457 10 6C10 4.89543 10.8954 4 12 4ZM12 20V22M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20ZM4 12H2M4 12C4 13.1046 4.89543 14 6 14C7.10457 14 8 13.1046 8 12C8 10.8954 7.10457 10 6 10C4.89543 10 4 10.8954 4 12ZM20 12H22M20 12C20 13.1046 19.1046 14 18 14C16.8954 14 16 13.1046 16 12C16 10.8954 16.8954 10 18 10C19.1046 10 20 10.8954 20 12Z"
                    stroke={indicatorColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div
          style={{
            transform: `translateY(${Math.max(0, pullDistance * 0.3)}px)`,
            transition: isRefreshing ? "none" : "transform 0.2s ease-out",
          }}
        >
          {children}
        </div>

        {/* Overlay to prevent interaction during refresh */}
        {isRefreshing && <div className="absolute inset-0 z-20 bg-black/5" />}
      </div>
    );
  }
);

PullToRefresh.displayName = "PullToRefresh";
