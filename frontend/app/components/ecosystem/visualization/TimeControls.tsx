interface TimeRange {
  start: Date;
  end: Date;
  scale: "hour" | "day" | "week" | "month" | "year";
}

export function TimeControls({ range }: { range: TimeRange }) {
  return (
    <div className="absolute bottom-4 right-4 bg-white/90 p-4 rounded-lg">
      {/* Timeline controls */}
    </div>
  );
}
