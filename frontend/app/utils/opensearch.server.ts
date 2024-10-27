import { Client } from '@opensearch-project/opensearch';
import { logger } from './logger.server';

export class OpenSearchClient {
  private client: Client;

  constructor() {
    this.client = new Client({
      node: process.env.OPENSEARCH_NODE_URL!,
      auth: {
        username: process.env.OPENSEARCH_USERNAME!,
        password: process.env.OPENSEARCH_PASSWORD!,
      },
    });
  }

  async index(params: any) {
    try {
      await this.client.index(params);
      await this.client.indices.refresh({ index: params.index });
    } catch (error) {
      logger.error('OpenSearch indexing error:', error);
      throw error;
    }
  }

  // Implement other OpenSearch methods as needed
}
