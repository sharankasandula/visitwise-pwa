import React, { useState } from "react";
import { PullToRefresh } from "./PullToRefresh";

export const PullToRefreshDemo: React.FC = () => {
  const [refreshCount, setRefreshCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const handleRefresh = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setRefreshCount((prev) => prev + 1);
    setLastRefresh(new Date());
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Pull-to-Refresh Demo</h2>

      <PullToRefresh onRefresh={handleRefresh}>
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium text-blue-900">Instructions</h3>
            <p className="text-blue-700 text-sm mt-1">
              Pull down from the top of this content to trigger a refresh.
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-900">Refresh Stats</h3>
            <p className="text-green-700 text-sm mt-1">
              Total refreshes: <span className="font-bold">{refreshCount}</span>
            </p>
            {lastRefresh && (
              <p className="text-green-700 text-sm mt-1">
                Last refresh: {lastRefresh.toLocaleTimeString()}
              </p>
            )}
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="font-medium text-purple-900">Features</h3>
            <ul className="text-purple-700 text-sm mt-1 space-y-1">
              <li>• Visual feedback during pull</li>
              <li>• Smooth animations</li>
              <li>• Touch gesture support</li>
              <li>• Customizable threshold</li>
              <li>• Loading states</li>
            </ul>
          </div>
        </div>
      </PullToRefresh>
    </div>
  );
};
