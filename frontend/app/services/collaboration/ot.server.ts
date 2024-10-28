import type { Operation, Selection } from "ot-json1";
import { type } from "ot-json1";

interface CollaborativeDocument {
  id: string;
  content: any;
  version: number;
  operations: Operation[];
  selections: Map<string, Selection>;
  clients: Set<string>;
}

export class CollaborationService {
  private documents: Map<string, CollaborativeDocument> = new Map();

  async initDocument(docId: string, initialContent: any = {}) {
    if (!this.documents.has(docId)) {
      this.documents.set(docId, {
        id: docId,
        content: initialContent,
        version: 0,
        operations: [],
        selections: new Map(),
        clients: new Set(),
      });
    }
    return this.documents.get(docId);
  }

  async joinDocument(docId: string, clientId: string) {
    const doc = await this.getDocument(docId);
    doc.clients.add(clientId);
    return {
      content: doc.content,
      version: doc.version,
      selections: Array.from(doc.selections.entries()),
    };
  }

  async submitOperation(docId: string, clientId: string, operation: Operation, baseVersion: number) {
    const doc = await this.getDocument(docId);
    
    // Transform operation against all concurrent operations
    const concurrent = doc.operations.slice(baseVersion);
    const transformed = concurrent.reduce((op, concurrentOp) => {
      return type.transform(op, concurrentOp, 'left');
    }, operation);

    // Apply transformed operation
    doc.content = type.apply(doc.content, transformed);
    doc.operations.push(transformed);
    doc.version++;

    // Broadcast to other clients
    this.broadcastOperation(doc, clientId, transformed, doc.version);

    return {
      version: doc.version,
      operation: transformed,
    };
  }

  async updateSelection(docId: string, clientId: string, selection: Selection) {
    const doc = await this.getDocument(docId);
    doc.selections.set(clientId, selection);
    this.broadcastSelection(doc, clientId, selection);
  }

  private async getDocument(docId: string): Promise<CollaborativeDocument> {
    const doc = this.documents.get(docId);
    if (!doc) {
      throw new Error(`Document ${docId} not found`);
    }
    return doc;
  }

  private broadcastOperation(doc: CollaborativeDocument, senderId: string, operation: Operation, version: number) {
    // In a real implementation, this would use WebSocket or SSE
    doc.clients.forEach(clientId => {
      if (clientId !== senderId) {
        // Send operation to client
      }
    });
  }

  private broadcastSelection(doc: CollaborativeDocument, senderId: string, selection: Selection) {
    doc.clients.forEach(clientId => {
      if (clientId !== senderId) {
        // Send selection to client
      }
    });
  }
}
