import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { type } from "ot-json1";
import { useWebSocket } from "~/hooks/useWebSocket";
import { FaUsers, FaSpinner, FaWifi, FaWifiSlash } from "react-icons/fa";
import type { Operation, Selection } from "ot-json1";

interface CollaborativeEditorProps {
  documentId: string;
  initialContent?: any;
  onSave?: (content: any) => void;
  height?: string;
}

interface Client {
  id: string;
  name: string;
  color: string;
  selection?: Selection;
}

export function CollaborativeEditor({
  documentId,
  initialContent = {},
  onSave,
  height = '400px',
}: CollaborativeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [version, setVersion] = useState(0);
  const [clients, setClients] = useState<Map<string, Client>>(new Map());
  const [pendingOperations, setPendingOperations] = useState<Operation[]>([]);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const editorRef = useRef<HTMLDivElement>(null);
  const socket = useWebSocket(`ws://localhost:3000/collaboration/${documentId}`);

  // Handle incoming operations from server
  useEffect(() => {
    if (!socket) return;

    socket.on('operation', ({ operation, clientId, newVersion }) => {
      if (clientId !== socket.id) {
        // Transform pending operations against received operation
        const transformedPending = pendingOperations.map(pending => 
          type.transform(pending, operation, 'left')
        );

        // Apply received operation
        const newContent = type.apply(content, operation);
        
        setContent(newContent);
        setVersion(newVersion);
        setPendingOperations(transformedPending);
      }
    });

    socket.on('selection', ({ clientId, selection, client }) => {
      if (clientId !== socket.id) {
        setClients(prev => new Map(prev).set(clientId, {
          ...client,
          selection,
        }));
      }
    });

    socket.on('client_joined', ({ clientId, client }) => {
      setClients(prev => new Map(prev).set(clientId, client));
    });

    socket.on('client_left', ({ clientId }) => {
      setClients(prev => {
        const newClients = new Map(prev);
        newClients.delete(clientId);
        return newClients;
      });
    });

    socket.on('connect', () => {
      setIsConnected(true);
      setIsSyncing(true);
      // Request initial state
      socket.emit('join', { documentId });
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('sync_complete', ({ content, version, clients }) => {
      setContent(content);
      setVersion(version);
      setClients(new Map(Object.entries(clients)));
      setIsSyncing(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket, content, pendingOperations]);

  // Handle local changes
  const handleChange = (change: any) => {
    const operation = createOperation(change);
    const newContent = type.apply(content, operation);
    
    // Apply locally
    setContent(newContent);
    setPendingOperations([...pendingOperations, operation]);

    // Send to server
    socket?.emit('operation', {
      operation,
      baseVersion: version,
    });
  };

  // Handle selection changes
  const handleSelectionChange = () => {
    if (!editorRef.current) return;

    const selection = getSelection();
    if (!selection) return;

    const range = selection.getRangeAt(0);
    const editorBounds = editorRef.current.getBoundingClientRect();

    const selectionData = {
      start: getTextOffset(editorRef.current, range.startContainer, range.startOffset),
      end: getTextOffset(editorRef.current, range.endContainer, range.endOffset),
      bounds: {
        top: range.getBoundingClientRect().top - editorBounds.top,
        left: range.getBoundingClientRect().left - editorBounds.left,
        width: range.getBoundingClientRect().width,
        height: range.getBoundingClientRect().height,
      },
    };

    setSelection(selectionData);
    socket?.emit('selection', { selection: selectionData });
  };

  return (
    <div className="relative">
      {/* Connection status */}
      <div className="absolute top-2 right-2 flex items-center gap-2">
        {isConnected ? (
          <FaWifi className="text-green-400" />
        ) : (
          <FaWifiSlash className="text-red-400" />
        )}
        {isSyncing && <FaSpinner className="animate-spin text-yellow-400" />}
        <div className="flex -space-x-2">
          {Array.from(clients.values()).map(client => (
            <div
              key={client.id}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 border-white"
              style={{ backgroundColor: client.color }}
              title={client.name}
            >
              {client.name[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="prose prose-invert max-w-none p-4 bg-white/5 rounded-lg"
        style={{ height }}
        contentEditable
        onInput={(e) => handleChange(e.currentTarget.innerHTML)}
        onSelect={handleSelectionChange}
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Remote selections */}
      {Array.from(clients.values()).map(client => 
        client.selection && (
          <div
            key={client.id}
            className="absolute pointer-events-none"
            style={{
              top: client.selection.bounds.top,
              left: client.selection.bounds.left,
              width: client.selection.bounds.width,
              height: client.selection.bounds.height,
              backgroundColor: `${client.color}33`,
              border: `2px solid ${client.color}`,
            }}
          >
            <div
              className="absolute -top-5 px-2 py-1 rounded text-xs text-white"
              style={{ backgroundColor: client.color }}
            >
              {client.name}
            </div>
          </div>
        )
      )}
    </div>
  );
}

// Helper functions for text offsets and operation creation
function getTextOffset(root: Node, node: Node, offset: number): number {
  // Implementation for converting DOM position to text offset
  // This would need to handle various node types and nested structures
  return 0;
}

function createOperation(change: any): Operation {
  // Implementation for creating OT operations from DOM changes
  // This would need to handle insertions, deletions, and replacements
  return [];
}
