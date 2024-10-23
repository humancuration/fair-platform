import React from 'react';
import ReactJson from 'react-json-view';

interface JsonViewerProps {
  data: any;
  theme?: 'monokai' | 'bright' | 'chalk' | 'twilight';
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data, theme = 'monokai' }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
      <ReactJson
        src={data}
        theme={theme}
        style={{ 
          backgroundColor: 'transparent',
          fontFamily: 'monospace'
        }}
        displayDataTypes={false}
        enableClipboard={true}
        collapsed={2}
      />
    </div>
  );
};

export default JsonViewer;
