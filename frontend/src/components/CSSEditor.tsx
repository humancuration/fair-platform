import React from 'react';

interface CSSEditorProps {
  css: string;
  setCSS: (css: string) => void;
}

const CSSEditor: React.FC<CSSEditorProps> = ({ css, setCSS }) => {
  return (
    <div className="mb-4">
      <label htmlFor="css-editor" className="block text-sm font-medium mb-1">Custom CSS</label>
      <textarea
        id="css-editor"
        value={css}
        onChange={(e) => setCSS(e.target.value)}
        className="w-full border rounded px-3 py-2 h-40 font-mono text-sm"
        placeholder="Enter your custom CSS here"
        spellCheck="false"
      />
    </div>
  );
};

export default CSSEditor;