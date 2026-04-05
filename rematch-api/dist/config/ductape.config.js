"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var DuctapeService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuctapeService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sdk_1 = __importDefault(require("@ductape/sdk"));
let DuctapeService = DuctapeService_1 = class DuctapeService {
    configService;
    logger = new common_1.Logger(DuctapeService_1.name);
    ductape;
    product;
    env;
    database;
    graph;
    storage;
    isConnected = false;
    constructor(configService) {
        this.configService = configService;
    }
    async onModuleInit() {
        this.product = this.configService.get('DUCTAPE_PRODUCT_TAG', 'ductape:rematch');
        this.env = this.configService.get('DUCTAPE_ENV', 'prd');
        this.database = this.configService.get('DUCTAPE_DATABASE', 'mongo-db');
        this.graph = this.configService.get('DUCTAPE_GRAPH', 'rematch-graph');
        this.storage = this.configService.get('DUCTAPE_STORAGE', 'rematch-assets');
        const accessKey = this.configService.get('DUCTAPE_ACCESS_KEY');
        if (!accessKey) {
            this.logger.warn('DUCTAPE_ACCESS_KEY not set - SDK operations may fail');
        }
        this.ductape = new sdk_1.default({
            accessKey: accessKey || '',
        });
        try {
            await this.connectDatabase();
            this.logger.log(`Ductape initialized for product: ${this.product}, env: ${this.env}`);
        }
        catch (error) {
            this.logger.error('Failed to connect to Ductape database', error);
        }
    }
    async connectDatabase() {
        await this.ductape.databases.connect({
            env: this.env,
            product: this.product,
            database: this.database,
        });
        this.isConnected = true;
        this.logger.log(`Connected to database: ${this.database}`);
    }
    get client() {
        return this.ductape;
    }
    get productTag() {
        return this.product;
    }
    get environment() {
        return this.env;
    }
    async createCollection(collection, schema, options) {
        const finalSchema = options?.timestamps
            ? {
                ...schema,
                createdAt: { type: 'Date', default: 'now' },
                updatedAt: { type: 'Date', default: 'now' },
            }
            : schema;
        await this.ductape.databases.schema.create(collection, finalSchema);
        this.logger.log(`Collection '${collection}' created`);
    }
    async createIndex(collection, fields, options) {
        await this.ductape.databases.schema.createIndex(collection, fields, options);
        this.logger.debug(`Index created on '${collection}' for fields: ${fields.join(', ')}`);
    }
    async listCollections() {
        return this.ductape.databases.schema.list();
    }
    async dropCollection(collection) {
        await this.ductape.databases.schema.drop(collection);
        this.logger.log(`Collection '${collection}' dropped`);
    }
    async dbInsert(collection, data) {
        return this.ductape.databases.insert({
            table: collection,
            data,
            returning: true,
        });
    }
    async dbFindOne(collection, query) {
        const result = await this.ductape.databases.query({
            table: collection,
            where: query,
            limit: 1,
        });
        return result.data?.[0] || null;
    }
    async dbFindMany(collection, query, options) {
        const orderBy = options?.sort
            ? Object.entries(options.sort).map(([column, order]) => ({
                column,
                order: order === 1 ? 'ASC' : 'DESC',
            }))
            : undefined;
        const result = await this.ductape.databases.query({
            table: collection,
            where: query,
            orderBy: orderBy,
            limit: options?.limit,
            offset: options?.skip,
        });
        return result.data || [];
    }
    async dbUpdate(collection, query, update) {
        let data;
        if (update.$set) {
            data = update.$set;
        }
        else if (update.$inc) {
            data = {};
            for (const [field, value] of Object.entries(update.$inc)) {
                data[field] = { $INC: value };
            }
        }
        else if (update.$push) {
            data = {};
            for (const [field, value] of Object.entries(update.$push)) {
                data[field] = { $PUSH: value };
            }
        }
        else {
            data = update;
        }
        return this.ductape.databases.update({
            table: collection,
            where: query,
            data,
        });
    }
    async dbDelete(collection, query) {
        return this.ductape.databases.delete({
            table: collection,
            where: query,
        });
    }
    async dbAggregate(collection, pipeline) {
        const result = await this.ductape.databases.query({
            table: collection,
        });
        return result.data || [];
    }
    async dbCount(collection, query = {}) {
        return this.ductape.databases.count({
            table: collection,
            where: Object.keys(query).length > 0 ? query : undefined,
        });
    }
    async graphConnect() {
        await this.ductape.graph.connect({
            env: this.env,
            product: this.product,
            database: this.graph,
        });
    }
    async graphQuery(query, params) {
        return this.ductape.graph.query(query, params);
    }
    async graphCreateNode(labels, properties) {
        return this.ductape.graph.createNode({ labels, properties });
    }
    async graphFindNodes(labels, where) {
        return this.ductape.graph.findNodes({ labels, where });
    }
    async graphUpdateNode(id, properties) {
        return this.ductape.graph.updateNode({ id, properties });
    }
    async graphDeleteNode(id) {
        return this.ductape.graph.deleteNode({ id });
    }
    async graphCreateRelationship(type, startNodeId, endNodeId, properties) {
        return this.ductape.graph.createRelationship({
            type,
            startNodeId,
            endNodeId,
            properties,
        });
    }
    async createSession(data) {
        const result = await this.ductape.sessions.start({
            product: this.product,
            env: this.env,
            tag: 'user-session',
            data,
        });
        return {
            token: result.token,
            refreshToken: result.refreshToken,
        };
    }
    async getSession(token) {
        try {
            const result = await this.ductape.sessions.verify({
                product: this.product,
                env: this.env,
                tag: 'user-session',
                token,
            });
            return result.data ?? null;
        }
        catch {
            return null;
        }
    }
    async destroySession(sessionId, identifier) {
        await this.ductape.sessions.revoke({
            product: this.product,
            env: this.env,
            tag: 'user-session',
            sessionId,
            identifier,
        });
    }
    async refreshSession(refreshToken) {
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
    async uploadFile(fileName, buffer, mimeType) {
        return this.ductape.storage.upload({
            product: this.product,
            env: this.env,
            storage: this.storage,
            fileName,
            buffer,
            mimeType,
        });
    }
    async downloadFile(fileName) {
        return this.ductape.storage.download({
            product: this.product,
            env: this.env,
            storage: this.storage,
            fileName,
        });
    }
    async getSignedUrl(fileName, expiresIn = 3600, action = 'read') {
        return this.ductape.storage.getSignedUrl({
            product: this.product,
            env: this.env,
            storage: this.storage,
            fileName,
            expiresIn,
            action,
        });
    }
    async deleteFile(fileName) {
        await this.ductape.storage.remove({
            product: this.product,
            env: this.env,
            storage: this.storage,
            fileName,
        });
    }
    async listFiles(prefix, limit) {
        return this.ductape.storage.listFiles({
            product: this.product,
            env: this.env,
            storage: this.storage,
            prefix,
            limit,
        });
    }
    async sendEmail(event, recipients, subject, template) {
        return this.ductape.notifications.send({
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
    async sendPushNotification(event, deviceTokens, body, title) {
        return this.ductape.notifications.send({
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
    async sendNotification(event, input) {
        return this.ductape.notifications.send({
            product: this.product,
            env: this.env,
            event,
            input,
        });
    }
};
exports.DuctapeService = DuctapeService;
exports.DuctapeService = DuctapeService = DuctapeService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DuctapeService);
//# sourceMappingURL=ductape.config.js.map