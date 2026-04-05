import { OnModuleInit } from '@nestjs/common';
import { DuctapeService } from '../config/ductape.config';
export declare class DatabaseSetupService implements OnModuleInit {
    private readonly ductape;
    private readonly logger;
    constructor(ductape: DuctapeService);
    onModuleInit(): Promise<void>;
    private setupCollections;
    private setupIndexes;
}
