import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion } from 'framer-motion';
import { FaCopy, FaExpand, FaCompress } from 'react-icons/fa';
import { useState } from 'react';

interface CodeViewerProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  maxHeight?: string;
}

export function CodeViewer({
  code,
  language = 'typescript',
  showLineNumbers = true,
  highlightLines = [],
  maxHeight = '500px'
}: CodeViewerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      className="relative group rounded-lg overflow-hidden"
      animate={{ maxHeight: isExpanded ? 'none' : maxHeight }}
    >
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleCopy}
          className="p-2 bg-gray-800/80 rounded-lg backdrop-blur-sm"
          title={isCopied ? 'Copied!' : 'Copy code'}
        >
          <FaCopy className={isCopied ? 'text-green-400' : 'text-gray-400'} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 bg-gray-800/80 rounded-lg backdrop-blur-sm"
        >
          {isExpanded ? (
            <FaCompress className="text-gray-400" />
          ) : (
            <FaExpand className="text-gray-400" />
          )}
        </motion.button>
      </div>

      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        wrapLines={true}
        lineProps={(lineNumber) => ({
          style: {
            backgroundColor: highlightLines.includes(lineNumber)
              ? 'rgba(147, 51, 234, 0.1)'
              : undefined,
            borderLeft: highlightLines.includes(lineNumber)
              ? '3px solid rgba(147, 51, 234, 0.5)'
              : undefined,
            paddingLeft: highlightLines.includes(lineNumber) ? '1rem' : undefined,
          },
        })}
        customStyle={{
          margin: 0,
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </motion.div>
  );
}
