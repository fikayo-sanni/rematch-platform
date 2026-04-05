import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Ductape from '@ductape/sdk';
export declare class DuctapeService implements OnModuleInit {
    private configService;
    private readonly logger;
    private ductape;
    private product;
    private env;
    private database;
    private graph;
    private storage;
    private isConnected;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    private connectDatabase;
    get client(): Ductape;
    get productTag(): string;
    get environment(): string;
    createCollection(collection: string, schema: Record<string, any>, options?: {
        timestamps?: boolean;
        indexes?: any[];
    }): Promise<void>;
    createIndex(collection: string, fields: string[], options?: {
        unique?: boolean;
        name?: string;
        expireAfterSeconds?: number;
    }): Promise<void>;
    listCollections(): Promise<string[]>;
    dropCollection(collection: string): Promise<void>;
    dbInsert(collection: string, data: Record<string, any> | Record<string, any>[]): Promise<import("@ductape/sdk/dist/database").IInsertResult<any>>;
    dbFindOne(collection: string, query: Record<string, any>): Promise<any | null>;
    dbFindMany(collection: string, query: Record<string, any>, options?: {
        sort?: Record<string, 1 | -1>;
        limit?: number;
        skip?: number;
    }): Promise<any[]>;
    dbUpdate(collection: string, query: Record<string, any>, update: Record<string, any>): Promise<import("@ductape/sdk/dist/database").IUpdateResult<any>>;
    dbDelete(collection: string, query: Record<string, any>): Promise<import("@ductape/sdk/dist/database").IDeleteResult>;
    dbAggregate(collection: string, pipeline: any[]): Promise<any[]>;
    dbCount(collection: string, query?: Record<string, any>): Promise<number>;
    graphConnect(): Promise<void>;
    graphQuery(query: string, params?: Record<string, any>): Promise<any>;
    graphCreateNode(labels: string[], properties: Record<string, any>): Promise<any>;
    graphFindNodes(labels: string[], where?: Record<string, any>): Promise<any>;
    graphUpdateNode(id: string | number, properties: Record<string, any>): Promise<any>;
    graphDeleteNode(id: string | number): Promise<any>;
    graphCreateRelationship(type: string, startNodeId: string | number, endNodeId: string | number, properties?: Record<string, any>): Promise<any>;
    createSession(data: Record<string, any>): Promise<{
        token: string;
        refreshToken: string;
    }>;
    getSession(token: string): Promise<Record<string, any> | null>;
    destroySession(sessionId?: string, identifier?: string): Promise<void>;
    refreshSession(refreshToken: string): Promise<{
        token: string;
        refreshToken: string;
    }>;
    uploadFile(fileName: string, buffer: Buffer, mimeType?: string): Promise<import("@ductape/sdk").IStorageResult>;
    downloadFile(fileName: string): Promise<import("@ductape/sdk").IDownloadResult>;
    getSignedUrl(fileName: string, expiresIn?: number, action?: 'read' | 'write'): Promise<import("@ductape/sdk").ISignedUrlResult>;
    deleteFile(fileName: string): Promise<void>;
    listFiles(prefix?: string, limit?: number): Promise<import("@ductape/sdk").IListFilesResult>;
    sendEmail(event: string, recipients: string[], subject: Record<string, any>, template: Record<string, any>): Promise<{
        process_id: string;
    }>;
    sendPushNotification(event: string, deviceTokens: string[], body: Record<string, any>, title?: Record<string, any>): Promise<{
        process_id: string;
    }>;
    sendNotification(event: string, input: Record<string, any>): Promise<{
        process_id: string;
    }>;
}
