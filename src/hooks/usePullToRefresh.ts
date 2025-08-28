import { useState, useCallback, useRef, useEffect } from "react";

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number; // Distance in pixels to trigger refresh
  resistance?: number; // How much resistance when pulling beyond threshold
  enabled?: boolean; // Whether pull-to-refresh is enabled
}

interface PullToRefreshState {
  isRefreshing: boolean;
  pullDistance: number;
  isPulling: boolean;
}

export const usePullToRefresh = ({
  onRefresh,
  threshold = 80,
  resistance = 0.5,
  enabled = true,
}: UsePullToRefreshOptions) => {
  const [state, setState] = useState<PullToRefreshState>({
    isRefreshing: false,
    pullDistance: 0,
    isPulling: false,
  });

  const startY = useRef<number>(0);
  const currentY = useRef<number>(0);
  const elementRef = useRef<HTMLElement | null>(null);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (!enabled || state.isRefreshing) return;

      const element = e.currentTarget as HTMLElement;
      if (element.scrollTop > 0) return; // Only trigger when at top

      startY.current = e.touches[0].clientY;
      currentY.current = startY.current;
      setState((prev) => ({ ...prev, isPulling: true }));
    },
    [enabled, state.isRefreshing]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!enabled || state.isRefreshing || !state.isPulling) return;

      const element = e.currentTarget as HTMLElement;
      if (element.scrollTop > 0) return;

      currentY.current = e.touches[0].clientY;
      const deltaY = currentY.current - startY.current;

      if (deltaY > 0) {
        e.preventDefault();
        const pullDistance = Math.min(deltaY * resistance, threshold * 2);
        setState((prev) => ({ ...prev, pullDistance }));
      }
    },
    [enabled, state.isRefreshing, state.isPulling, threshold, resistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || state.isRefreshing || !state.isPulling) return;

    if (state.pullDistance >= threshold) {
      setState((prev) => ({ ...prev, isRefreshing: true, isPulling: false }));

      try {
        await onRefresh();
      } finally {
        setState((prev) => ({ ...prev, isRefreshing: false, pullDistance: 0 }));
      }
    } else {
      setState((prev) => ({ ...prev, isPulling: false, pullDistance: 0 }));
    }
  }, [
    enabled,
    state.isRefreshing,
    state.isPulling,
    state.pullDistance,
    threshold,
    onRefresh,
  ]);

  const resetPullState = useCallback(() => {
    setState((prev) => ({ ...prev, pullDistance: 0, isPulling: false }));
  }, []);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !enabled) return;

    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    element.addEventListener("touchmove", handleTouchMove, { passive: false });
    element.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("touchmove", handleTouchMove);
      element.removeEventListener("touchend", handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    elementRef,
    resetPullState,
  };
};
