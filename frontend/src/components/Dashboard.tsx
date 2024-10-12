import React, { useState, useEffect } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';

const Dashboard: React.FC = () => {
  const [layout, setLayout] = useState<Layout[]>([
    { i: 'clock', x: 0, y: 0, w: 2, h: 2 },
    { i: 'weather', x: 2, y: 0, w: 2, h: 2 },
  ]);

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      onLayoutChange={(newLayout: Layout[]) => setLayout(newLayout)}
    >
      <div key="clock">
        <ClockWidget />
      </div>
      <div key="weather">
        <WeatherWidget />
      </div>
    </GridLayout>
  );
};

const ClockWidget: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <div>{time.toLocaleTimeString()}</div>;
};

const WeatherWidget: React.FC = () => {
  // Implement weather widget
  return <div>Weather Widget</div>;
};

export default Dashboard;
