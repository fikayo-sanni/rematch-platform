import { Module } from '@nestjs/common';
import { DatabaseSetupService } from './database-setup.service';
import { GraphSetupService } from './graph-setup.service';
import { SeedService } from './seed.service';

@Module({
  providers: [DatabaseSetupService, GraphSetupService, SeedService],
  exports: [DatabaseSetupService, GraphSetupService, SeedService],
})
export class DatabaseModule {}
