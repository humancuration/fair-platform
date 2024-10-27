interface FlowControl {
  type: "speed" | "density" | "visibility" | "highlight";
  value: number;
  onChange: (value: number) => void;
}

export function FlowControls({ controls }: { controls: FlowControl[] }) {
  return (
    <div className="absolute top-4 right-4 bg-white/90 p-4 rounded-lg">
      {/* Flow control sliders and toggles */}
    </div>
  );
}
