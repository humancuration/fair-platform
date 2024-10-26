import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { motion } from 'framer-motion';

interface MarkdownProps {
  content: string;
  className?: string;
  animate?: boolean;
}

export default function Markdown({ 
  content, 
  className = '',
  animate = true
}: MarkdownProps) {
  const components = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={atomDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }: any) => (
      <motion.p
        initial={animate ? { opacity: 0, y: 20 } : undefined}
        animate={animate ? { opacity: 1, y: 0 } : undefined}
        className="mb-4"
      >
        {children}
      </motion.p>
    ),
    h1: ({ children }: any) => (
      <motion.h1
        initial={animate ? { opacity: 0, x: -20 } : undefined}
        animate={animate ? { opacity: 1, x: 0 } : undefined}
        className="text-3xl font-bold mb-4"
      >
        {children}
      </motion.h1>
    ),
    // Add other custom components...
  }), [animate]);

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
