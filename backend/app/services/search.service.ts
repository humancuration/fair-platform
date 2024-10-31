import { Client } from '@opensearch-project/opensearch';
import { logger } from '../utils/logger';

export class SearchService {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.OPENSEARCH_URL
    });
  }

  async index(index: string, id: string, document: any): Promise<void> {
    await this.client.index({
      index,
      id,
      body: document,
      refresh: true
    });
  }

  async search(index: string, query: any) {
    const response = await this.client.search({
      index,
      body: query
    });

    return response.body.hits.hits.map(hit => ({
      id: hit._id,
      score: hit._score,
      ...hit._source
    }));
  }
} 