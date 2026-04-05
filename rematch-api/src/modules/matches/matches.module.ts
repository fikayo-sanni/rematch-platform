import { Module } from '@nestjs/common';
import { MatchesController } from './matches.controller';
import { MatchesService } from './matches.service';
import { GraphSetupService } from '../../database/graph-setup.service';
import { UsersModule } from '../users/users.module';

import { SocialModule } from '../social/social.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [SocialModule, DatabaseModule, UsersModule],
  controllers: [MatchesController],
  providers: [MatchesService, GraphSetupService],
  exports: [MatchesService],
})
export class MatchesModule {}
