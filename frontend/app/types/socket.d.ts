import type { Server as HTTPServer } from 'http';
import type { Socket as NetSocket } from 'net';
import type { Server as IOServer } from 'socket.io';
import type { NextFunction, Request, Response } from 'express';
import type { CollaborationClient, OperationMessage, SelectionMessage, SyncMessage } from './collaboration';

export interface SocketServer extends IOServer {
  _ns?: {
    name: string;
  };
}

export interface SocketWithIO extends NetSocket {
  server: HTTPServer & {
    io?: SocketServer;
  };
}

export interface RequestWithSocket extends Request {
  socket: SocketWithIO;
}

export interface CollaborationSocket extends Socket {
  data: {
    documentId?: string;
    client?: CollaborationClient;
  };
}

export interface ServerToClientEvents {
  operation: (msg: OperationMessage) => void;
  selection: (msg: SelectionMessage) => void;
  sync_complete: (msg: SyncMessage) => void;
  client_joined: (msg: { clientId: string; client: CollaborationClient }) => void;
  client_left: (msg: { clientId: string }) => void;
  error: (msg: { message: string }) => void;
}

export interface ClientToServerEvents {
  join: (msg: { documentId: string }) => void;
  operation: (msg: OperationMessage) => void;
  selection: (msg: SelectionMessage) => void;
}
