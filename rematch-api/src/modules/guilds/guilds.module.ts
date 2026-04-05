import { Module } from '@nestjs/common';
import { GuildsController } from './guilds.controller';
import { GuildsService } from './guilds.service';
import { SocialModule } from '../social/social.module';
import { DatabaseModule } from '../../database/database.module';
import { GraphSetupService } from '../../database/graph-setup.service';

@Module({
  imports: [SocialModule, DatabaseModule],
  controllers: [GuildsController],
  providers: [GuildsService, GraphSetupService],
  exports: [GuildsService],
})
export class GuildsModule {}
