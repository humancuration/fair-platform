interface FlowAnalytics {
  totalValue: number;
  flowRates: Record<string, number>;
  topContributors: string[];
  impactMetrics: {
    scientific: number;
    social: number;
    economic: number;
  };
}

export function FlowAnalyticsOverlay({ analytics }: { analytics: FlowAnalytics }) {
  return (
    <div className="absolute bottom-4 left-4 bg-white/90 p-4 rounded-lg">
      {/* Real-time analytics display */}
    </div>
  );
}
