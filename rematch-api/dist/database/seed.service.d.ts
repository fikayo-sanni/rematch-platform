import { OnModuleInit } from '@nestjs/common';
import { DuctapeService } from '../config/ductape.config';
import { GraphSetupService } from './graph-setup.service';
export declare class SeedService implements OnModuleInit {
    private readonly ductape;
    private readonly graphService;
    private readonly logger;
    constructor(ductape: DuctapeService, graphService: GraphSetupService);
    onModuleInit(): Promise<void>;
    seed(): Promise<void>;
    private seedUsers;
    private seedEditions;
    private seedGuilds;
    private seedUserGuilds;
    private seedPulls;
    private seedCalls;
    private seedMatches;
    private seedRuns;
    private seedLeagues;
    private seedCrews;
    private seedNoisePosts;
    private seedNotifications;
    private seedSpotchecks;
    private seedRankboard;
    private seedActivities;
}
