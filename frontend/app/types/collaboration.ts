import type { Operation, Selection } from 'ot-json1';

export interface CollaborativeDocument {
  id: string;
  content: any;
  version: number;
  operations: Operation[];
  selections: Map<string, Selection>;
  clients: Set<string>;
}

export interface CollaborationClient {
  id: string;
  name: string;
  color: string;
  selection?: Selection;
}

export interface OperationMessage {
  operation: Operation;
  clientId: string;
  baseVersion: number;
}

export interface SelectionMessage {
  selection: Selection;
  clientId: string;
  client: CollaborationClient;
}

export interface SyncMessage {
  content: any;
  version: number;
  clients: Record<string, CollaborationClient>;
}
