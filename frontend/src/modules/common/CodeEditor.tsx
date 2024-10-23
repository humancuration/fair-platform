import React from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  value: string;
  language?: string;
  readOnly?: boolean;
  onChange?: (value: string | undefined) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  language = 'javascript',
  readOnly = false,
  onChange
}) => {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Editor
        height="300px"
        defaultLanguage={language}
        value={value}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          readOnly,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
        onChange={onChange}
      />
    </div>
  );
};

export default CodeEditor;
