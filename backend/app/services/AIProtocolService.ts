import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { Redis } from 'ioredis';
import { EventEmitter } from 'events';
import { AIModel, AICapability, Protocol } from '../../../backup/models';
import { ValidationError, AuthorizationError } from '../utils/errors';

interface EncryptedPayload {
  iv: string;
  data: string;
  signature: string;
  keyId: string;
}

interface ProtocolMessage {
  type: 'request' | 'response' | 'error' | 'sync';
  action: string;
  payload: any;
  metadata: {
    sender: string;
    receiver: string;
    timestamp: number;
    protocolVersion: string;
    capabilities: string[];
    trustScore: number;
  };
}

export class AIProtocolService {
  private readonly protocolVersion = '1.0.0';
  private readonly events = new EventEmitter();
  private readonly activeProtocols = new Map<string, Protocol>();
  private readonly trustScores = new Map<string, number>();
  private readonly capabilities = new Map<string, Set<string>>();

  constructor(
    private readonly redis: Redis,
    private readonly keyStore: KeyStore,
    private readonly trustService: TrustService,
    private readonly rateLimiter: RateLimiter
  ) {
    // Set up protocol event handlers
    this.events.on('protocolRequest', this.handleProtocolRequest.bind(this));
    this.events.on('protocolResponse', this.handleProtocolResponse.bind(this));
    this.events.on('protocolError', this.handleProtocolError.bind(this));
    this.events.on('trustUpdate', this.handleTrustUpdate.bind(this));
  }

  async initiateProtocol(
    senderId: string,
    receiverId: string,
    type: string,
    payload: any,
    options: {
      requiredCapabilities?: string[];
      minimumTrustScore?: number;
      timeout?: number;
    } = {}
  ): Promise<Protocol> {
    // Validate participants
    await this.validateParticipants(senderId, receiverId);

    // Check capabilities
    if (options.requiredCapabilities) {
      await this.validateCapabilities(receiverId, options.requiredCapabilities);
    }

    // Check trust score
    if (options.minimumTrustScore) {
      await this.validateTrustScore(receiverId, options.minimumTrustScore);
    }

    // Create and encrypt protocol message
    const message = await this.createProtocolMessage(
      'request',
      type,
      payload,
      senderId,
      receiverId
    );

    // Store protocol state
    const protocol = await this.storeProtocol(message);

    // Send protocol request
    await this.sendProtocolMessage(protocol.id, message);

    return protocol;
  }

  async respondToProtocol(
    protocolId: string,
    responderId: string,
    payload: any,
    status: 'accept' | 'reject' | 'error'
  ): Promise<void> {
    const protocol = await this.getProtocol(protocolId);
    
    if (!protocol) {
      throw new ValidationError('Protocol not found');
    }

    if (protocol.receiver !== responderId) {
      throw new AuthorizationError('Unauthorized to respond to this protocol');
    }

    const message = await this.createProtocolMessage(
      'response',
      status,
      payload,
      responderId,
      protocol.sender
    );

    await this.sendProtocolMessage(protocolId, message);
    await this.updateProtocolStatus(protocolId, status);
  }

  private async createProtocolMessage(
    type: ProtocolMessage['type'],
    action: string,
    payload: any,
    sender: string,
    receiver: string
  ): Promise<ProtocolMessage> {
    const senderModel = await AIModel.findByPk(sender);
    if (!senderModel) {
      throw new ValidationError('Sender AI model not found');
    }

    return {
      type,
      action,
      payload,
      metadata: {
        sender,
        receiver,
        timestamp: Date.now(),
        protocolVersion: this.protocolVersion,
        capabilities: Array.from(this.capabilities.get(sender) || []),
        trustScore: this.trustScores.get(sender) || 0,
      },
    };
  }

  private async encryptPayload(
    payload: any,
    recipientPublicKey: string
  ): Promise<EncryptedPayload> {
    const iv = randomBytes(16);
    const key = randomBytes(32);
    
    // Encrypt payload
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encryptedData = Buffer.concat([
      cipher.update(JSON.stringify(payload)),
      cipher.final(),
    ]);

    // Encrypt symmetric key with recipient's public key
    const encryptedKey = await this.keyStore.encryptWithPublicKey(
      recipientPublicKey,
      key
    );

    // Create signature
    const signature = await this.keyStore.sign(
      Buffer.concat([iv, encryptedData])
    );

    return {
      iv: iv.toString('base64'),
      data: encryptedData.toString('base64'),
      signature: signature.toString('base64'),
      keyId: encryptedKey.toString('base64'),
    };
  }

  private async decryptPayload(
    encryptedPayload: EncryptedPayload,
    senderPublicKey: string
  ): Promise<any> {
    // Verify signature
    const isValid = await this.keyStore.verify(
      senderPublicKey,
      Buffer.from(encryptedPayload.signature, 'base64'),
      Buffer.concat([
        Buffer.from(encryptedPayload.iv, 'base64'),
        Buffer.from(encryptedPayload.data, 'base64'),
      ])
    );

    if (!isValid) {
      throw new ValidationError('Invalid message signature');
    }

    // Decrypt symmetric key
    const key = await this.keyStore.decryptWithPrivateKey(
      Buffer.from(encryptedPayload.keyId, 'base64')
    );

    // Decrypt payload
    const decipher = createDecipheriv(
      'aes-256-gcm',
      key,
      Buffer.from(encryptedPayload.iv, 'base64')
    );

    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(encryptedPayload.data, 'base64')),
      decipher.final(),
    ]);

    return JSON.parse(decryptedData.toString());
  }

  private async validateParticipants(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    const [sender, receiver] = await Promise.all([
      AIModel.findByPk(senderId),
      AIModel.findByPk(receiverId),
    ]);

    if (!sender || !receiver) {
      throw new ValidationError('Invalid participants');
    }

    // Check rate limits
    await this.rateLimiter.checkLimit(senderId);
  }

  private async validateCapabilities(
    aiId: string,
    requiredCapabilities: string[]
  ): Promise<void> {
    const aiCapabilities = this.capabilities.get(aiId) || new Set();
    
    const missingCapabilities = requiredCapabilities.filter(
      cap => !aiCapabilities.has(cap)
    );

    if (missingCapabilities.length > 0) {
      throw new ValidationError(
        `Missing required capabilities: ${missingCapabilities.join(', ')}`
      );
    }
  }

  private async validateTrustScore(
    aiId: string,
    minimumScore: number
  ): Promise<void> {
    const trustScore = this.trustScores.get(aiId) || 0;
    
    if (trustScore < minimumScore) {
      throw new ValidationError(
        `Trust score too low. Required: ${minimumScore}, Current: ${trustScore}`
      );
    }
  }

  private async handleProtocolRequest(message: ProtocolMessage): Promise<void> {
    try {
      // Validate protocol version
      if (message.metadata.protocolVersion !== this.protocolVersion) {
        throw new ValidationError('Incompatible protocol version');
      }

      // Update trust scores based on interaction
      await this.trustService.recordInteraction(
        message.metadata.sender,
        message.metadata.receiver,
        'request'
      );

      // Emit event for specific protocol type
      this.events.emit(`protocol:${message.action}`, message);
    } catch (error) {
      this.events.emit('protocolError', {
        error,
        message,
      });
    }
  }

  private async handleProtocolResponse(message: ProtocolMessage): Promise<void> {
    try {
      const protocol = this.activeProtocols.get(message.metadata.sender);
      
      if (!protocol) {
        throw new ValidationError('Protocol not found');
      }

      // Update protocol state
      await this.updateProtocolState(protocol.id, message);

      // Update trust scores based on response
      await this.trustService.recordInteraction(
        message.metadata.sender,
        message.metadata.receiver,
        'response'
      );

      // Emit completion event
      this.events.emit(`protocol:${protocol.id}:complete`, message);
    } catch (error) {
      this.events.emit('protocolError', {
        error,
        message,
      });
    }
  }

  private async handleProtocolError(error: any): Promise<void> {
    // Log error
    console.error('Protocol error:', error);

    // Update trust scores negatively
    if (error.message?.metadata) {
      await this.trustService.recordInteraction(
        error.message.metadata.sender,
        error.message.metadata.receiver,
        'error'
      );
    }

    // Emit error event
    this.events.emit('error', error);
  }

  private async handleTrustUpdate(update: {
    aiId: string;
    newScore: number;
  }): Promise<void> {
    this.trustScores.set(update.aiId, update.newScore);
    
    // Notify relevant AIs about trust score update
    const activeProtocols = Array.from(this.activeProtocols.values())
      .filter(p => p.sender === update.aiId || p.receiver === update.aiId);

    for (const protocol of activeProtocols) {
      this.events.emit(`protocol:${protocol.id}:trustUpdate`, update);
    }
  }
}
