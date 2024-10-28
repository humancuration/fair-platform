import { Server } from 'socket.io';
import type { Server as HTTPServer } from 'http';
import { CollaborationService } from './ot.server';
import type { Operation, Selection } from 'ot-json1';

const collaborationService = new CollaborationService();

export function initSocketServer(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  });

  // Handle real-time collaboration
  io.on('connection', (socket) => {
    let currentDocId: string | null = null;

    socket.on('join', async ({ documentId }) => {
      currentDocId = documentId;
      socket.join(documentId);

      const doc = await collaborationService.initDocument(documentId);
      if (!doc) return;

      // Send initial state
      socket.emit('sync_complete', {
        content: doc.content,
        version: doc.version,
        clients: Array.from(doc.clients).map(clientId => ({
          id: clientId,
          selection: doc.selections.get(clientId),
        })),
      });

      // Notify others
      socket.to(documentId).emit('client_joined', {
        clientId: socket.id,
        client: {
          id: socket.id,
          name: `User ${Math.floor(Math.random() * 1000)}`,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        },
      });
    });

    socket.on('operation', async ({ operation, baseVersion }) => {
      if (!currentDocId) return;

      try {
        const result = await collaborationService.submitOperation(
          currentDocId,
          socket.id,
          operation,
          baseVersion
        );

        // Broadcast to others in the same document
        socket.to(currentDocId).emit('operation', {
          operation: result.operation,
          clientId: socket.id,
          newVersion: result.version,
        });
      } catch (error) {
        console.error('Error applying operation:', error);
        socket.emit('error', { message: 'Failed to apply operation' });
      }
    });

    socket.on('selection', ({ selection }) => {
      if (!currentDocId) return;

      collaborationService.updateSelection(currentDocId, socket.id, selection);
      socket.to(currentDocId).emit('selection', {
        clientId: socket.id,
        selection,
      });
    });

    socket.on('disconnect', () => {
      if (currentDocId) {
        socket.to(currentDocId).emit('client_left', {
          clientId: socket.id,
        });
      }
    });
  });

  return io;
}
