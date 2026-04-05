/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Ductape from '@ductape/sdk';

interface QueryResult {
  data: unknown[];
  count?: number;
}

/**
 * DuctapeService - Unified interface for Ductape SDK operations
 *
 * Provides:
 * - Database operations (MongoDB via Ductape)
 * - Graph operations (Neo4j via Ductape)
 * - Session management (Ductape Sessions — JWT-based)
 * - Storage operations (S3/GCP/Azure via Ductape)
 * - Notifications (Push, Email, SMS via Ductape)
 * - Caching (Ductape Cache)
 */
@Injectable()
export class DuctapeService implements OnModuleInit {
  private readonly logger = new Logger(DuctapeService.name);
  private ductape: Ductape;
  private product: string;
  private env: string;
  private database: string;
  private graph: string;
  private storage: string;
  private cache: string;
  private isConnected = false;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.product = this.configService.get<string>(
      'DUCTAPE_PRODUCT_TAG',
      'ductape:rematch',
    );
    this.env = this.configService.get<string>('DUCTAPE_ENV', 'prd');
    this.database = this.configService.get<string>(
      'DUCTAPE_DATABASE',
      'mongo-db',
    );
    this.graph = this.configService.get<string>(
      'DUCTAPE_GRAPH',
      'rematch-graph',
    );
    this.storage = this.configService.get<string>(
      'DUCTAPE_STORAGE',
      'rematch-assets',
    );
    this.cache = this.configService.get<string>(
      'DUCTAPE_CACHE',
      'rematch-cache',
    );

    const accessKey = this.configService.get<string>('DUCTAPE_ACCESS_KEY');
    if (!accessKey) {
      this.logger.warn('DUCTAPE_ACCESS_KEY not set - SDK operations may fail');
    }

    // Initialize Ductape SDK
    this.ductape = new Ductape({
      accessKey: accessKey || '',
    });

    // Connect to database and graph
    try {
      await this.connectDatabase();
      await this.graphConnect();
      this.isConnected = true;
      this.logger.log(
        `Ductape initialized for product: ${this.product}, env: ${this.env}`,
      );
    } catch (error) {
      this.logger.error('Failed to connect to Ductape services', error);
    }
  }

  private async connectDatabase(): Promise<void> {
    await this.ductape.databases.connect({
      env: this.env,
      product: this.product,
      database: this.database,
    });
    this.logger.log(`Connected to database: ${this.database}`);
  }

  get client(): Ductape {
    return this.ductape;
  }

  get productTag(): string {
    return this.product;
  }

  get environment(): string {
    return this.env;
  }

  // ==================== SCHEMA MANAGEMENT ====================

  async createCollection(
    collection: string,
    schema: Record<string, unknown>,
    options?: { timestamps?: boolean; indexes?: unknown[] },
  ): Promise<void> {
    const finalSchema = options?.timestamps
      ? {
          ...schema,
          createdAt: { type: 'Date', default: 'now' },
          updatedAt: { type: 'Date', default: 'now' },
        }
      : schema;

    await this.ductape.databases.schema.create(collection, finalSchema as any);
    this.logger.log(`Collection '${collection}' created`);
  }

  async createIndex(
    collection: string,
    fields: string[],
    options?: { unique?: boolean; name?: string; expireAfterSeconds?: number },
  ): Promise<void> {
    await this.ductape.databases.schema.createIndex(
      collection,
      fields,
      options,
    );
    this.logger.debug(
      `Index created on '${collection}' for fields: ${fields.join(', ')}`,
    );
  }

  async listCollections(): Promise<string[]> {
    return await this.ductape.databases.schema.list();
  }

  async dropCollection(collection: string): Promise<void> {
    await this.ductape.databases.schema.drop(collection);
    this.logger.log(`Collection '${collection}' dropped`);
  }

  // ==================== DATABASE OPERATIONS ====================

  async dbInsert(
    collection: string,
    data: Record<string, unknown> | Record<string, unknown>[],
  ): Promise<unknown> {
    return await this.ductape.databases.insert({
      table: collection,
      data,
      returning: true,
    });
  }

  async dbFindOne(
    collection: string,
    query: Record<string, unknown>,
  ): Promise<unknown> {
    const result = (await this.ductape.databases.query({
      table: collection,
      where: query,
      limit: 1,
    })) as QueryResult;
    return result.data?.[0] || null;
  }

  async dbFindMany(
    collection: string,
    query: Record<string, unknown>,
    options?: {
      sort?: Record<string, 1 | -1>;
      limit?: number;
      skip?: number;
    },
  ): Promise<unknown[]> {
    const orderBy = options?.sort
      ? Object.entries(options.sort).map(([column, order]) => ({
          column,
          order: order === 1 ? 'ASC' : 'DESC',
        }))
      : undefined;

    const result = (await this.ductape.databases.query({
      table: collection,
      where: Object.keys(query).length > 0 ? query : undefined,
      orderBy: orderBy as unknown as {
        column: string;
        order: 'ASC' | 'DESC';
      }[],
      limit: options?.limit,
      offset: options?.skip,
    })) as QueryResult;
    return result.data || [];
  }

  async dbUpdate(
    collection: string,
    query: Record<string, unknown>,
    update: Record<string, unknown>,
  ): Promise<unknown> {
    let data: Record<string, unknown>;
    const updateObj = update as Record<string, Record<string, unknown>>;

    if (updateObj.$set) {
      data = updateObj.$set;
    } else if (updateObj.$inc) {
      data = {};
      for (const [field, value] of Object.entries(updateObj.$inc)) {
        data[field] = { $INC: value };
      }
    } else if (updateObj.$push) {
      data = {};
      for (const [field, value] of Object.entries(updateObj.$push)) {
        data[field] = { $PUSH: value };
      }
    } else if (updateObj.$pull) {
      data = {};
      for (const [field, value] of Object.entries(updateObj.$pull)) {
        data[field] = { $PULL: value };
      }
    } else {
      data = update;
    }

    return await this.ductape.databases.update({
      table: collection,
      where: query,
      data,
    });
  }

  async dbDelete(
    collection: string,
    query: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.databases.delete({
      table: collection,
      where: query,
    });
  }

  async dbCount(
    collection: string,
    query: Record<string, unknown> = {},
  ): Promise<number> {
    return await this.ductape.databases.count({
      table: collection,
      where: Object.keys(query).length > 0 ? query : undefined,
    });
  }

  // ==================== SESSION OPERATIONS (Ductape Sessions API) ====================

  /**
   * Start a new user session using Ductape Sessions API.
   * Returns a JWT-based token pair for client authentication.
   */
  async createSession(
    userId: string,
    details: Record<string, unknown> = {},
  ): Promise<{ token: string; refreshToken: string; sessionId?: string }> {
    const result = await this.ductape.sessions.start({
      product: this.product,
      env: this.env,
      tag: 'user-session',
      data: {
        userId,
        details,
      },
    });
    return {
      token: result.token,
      refreshToken: result.refreshToken,
      sessionId: result.sessionId,
    };
  }

  /**
   * Verify a session token and return the session data (userId, details).
   * Returns null if the token is invalid or expired.
   */
  async verifySession(
    token: string,
  ): Promise<{ userId: string; details: Record<string, unknown> } | null> {
    try {
      const result = await this.ductape.sessions.verify({
        product: this.product,
        env: this.env,
        tag: 'user-session',
        token,
      });
      const data = result.data as {
        userId: string;
        details: Record<string, unknown>;
      };
      return data ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Revoke a user session (logout).
   */
  async revokeSession(options: {
    sessionId?: string;
    identifier?: string;
  }): Promise<void> {
    await this.ductape.sessions.revoke({
      product: this.product,
      env: this.env,
      tag: 'user-session',
      ...options,
    });
  }

  /**
   * Refresh an expired access token using a refresh token.
   */
  async refreshSession(
    refreshToken: string,
  ): Promise<{ token: string; refreshToken: string }> {
    const result = await this.ductape.sessions.refresh({
      product: this.product,
      env: this.env,
      tag: 'user-session',
      refreshToken,
    });
    return {
      token: result.token,
      refreshToken: result.refreshToken,
    };
  }

  // ==================== GRAPH OPERATIONS ====================

  async graphConnect(): Promise<void> {
    await this.ductape.graph.connect({
      env: this.env,
      product: this.product,
      graph: this.graph,
    });
  }

  async graphQuery(
    query: string,
    params?: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.graph.query(query, params);
  }

  async graphCreateNode(
    labels: string[],
    properties: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.graph.createNode({ labels, properties });
  }

  async graphFindNodes(
    labels: string[],
    where?: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.graph.findNodes({ labels, where });
  }

  async graphUpdateNode(
    id: string | number,
    properties: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.graph.updateNode({ id, properties });
  }

  async graphDeleteNode(id: string | number): Promise<unknown> {
    return await this.ductape.graph.deleteNode({ id });
  }

  async graphCreateRelationship(
    type: string,
    startNodeId: string | number,
    endNodeId: string | number,
    properties?: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.graph.createRelationship({
      type,
      startNodeId,
      endNodeId,
      properties,
    });
  }

  async graphFindRelationships(params: {
    types?: string[];
    startNodeId?: string | number;
    endNodeId?: string | number;
    limit?: number;
  }): Promise<unknown> {
    return await this.ductape.graph.findRelationships(params);
  }

  async graphDeleteRelationship(id: string | number): Promise<unknown> {
    return await this.ductape.graph.deleteRelationship({ id });
  }

  async graphUpdateRelationship(
    id: string | number,
    properties: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.graph.updateRelationship({ id, properties });
  }

  async graphTraverse(params: {
    startNodeId: string | number;
    direction: 'outgoing' | 'incoming' | 'both';
    relationshipTypes?: string[];
    maxDepth?: number;
  }): Promise<unknown> {
    return await this.ductape.graph.traverse(params);
  }

  // ==================== STORAGE OPERATIONS ====================

  async uploadFile(
    fileName: string,
    buffer: Buffer,
    mimeType?: string,
  ): Promise<unknown> {
    return await this.ductape.storage.upload({
      product: this.product,
      env: this.env,
      storage: this.storage,
      fileName,
      buffer,
      mimeType,
    });
  }

  async downloadFile(fileName: string): Promise<unknown> {
    return await this.ductape.storage.download({
      product: this.product,
      env: this.env,
      storage: this.storage,
      fileName,
    });
  }

  async getSignedUrl(
    fileName: string,
    expiresIn = 3600,
    action: 'read' | 'write' = 'read',
  ): Promise<unknown> {
    return await this.ductape.storage.getSignedUrl({
      product: this.product,
      env: this.env,
      storage: this.storage,
      fileName,
      expiresIn,
      action,
    });
  }

  async deleteFile(fileName: string): Promise<void> {
    await this.ductape.storage.remove({
      product: this.product,
      env: this.env,
      storage: this.storage,
      fileName,
    });
  }

  async listFiles(prefix?: string, limit?: number): Promise<unknown> {
    return await this.ductape.storage.listFiles({
      product: this.product,
      env: this.env,
      storage: this.storage,
      prefix,
      limit,
    });
  }

  // ==================== NOTIFICATION OPERATIONS ====================

  async sendNotification(
    event: string,
    input: Record<string, unknown>,
  ): Promise<{ process_id: string }> {
    return await this.ductape.notifications.send({
      product: this.product,
      env: this.env,
      event,
      input,
    });
  }

  async sendEmail(
    event: string,
    recipients: string[],
    subject: Record<string, unknown>,
    template: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.notifications.send({
      product: this.product,
      env: this.env,
      event,
      input: {
        email: {
          recipients,
          subject,
          template,
        },
      },
    });
  }

  async sendPushNotification(
    event: string,
    deviceTokens: string[],
    body: Record<string, unknown>,
    title?: Record<string, unknown>,
  ): Promise<unknown> {
    return await this.ductape.notifications.send({
      product: this.product,
      env: this.env,
      event,
      input: {
        push_notification: {
          device_tokens: deviceTokens,
          body,
          title,
        },
      },
    });
  }


  // ==================== CACHE OPERATIONS (Ductape Cache) ====================

  async cacheGet(key: string): Promise<unknown> {
    try {
      const result = (await this.ductape.caches.get({
        product: this.product,
        env: this.env,
        cache: this.cache,
        key,
      } as any)) as any;
      return result.value || result.data;
    } catch (error) {
      this.logger.error(`Failed to get from cache: ${key}`, error);
      return null;
    }
  }

  async cacheSet(
    key: string,
    value: unknown,
    ttlSeconds?: number,
  ): Promise<void> {
    try {
      await this.ductape.caches.set({
        product: this.product,
        env: this.env,
        cache: this.cache,
        key,
        value,
        ttl: ttlSeconds,
      } as any);
    } catch (error) {
      this.logger.error(`Failed to set cache: ${key}`, error);
    }
  }

  async cacheDelete(key: string): Promise<void> {
    try {
      await (this.ductape.caches as any).delete({
        product: this.product,
        env: this.env,
        cache: this.cache,
        key,
      });
    } catch (error) {
      this.logger.error(`Failed to delete cache: ${key}`, error);
    }
  }

}

