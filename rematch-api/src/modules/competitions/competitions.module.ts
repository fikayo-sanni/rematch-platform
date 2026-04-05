import { Module } from '@nestjs/common';
import { CompetitionsController } from './competitions.controller';
import { CompetitionsService } from './competitions.service';
import { UsersModule } from '../users/users.module';

import { SocialModule } from '../social/social.module';
import { DatabaseModule } from '../../database/database.module';

@Module({
  imports: [SocialModule, DatabaseModule, UsersModule],
  controllers: [CompetitionsController],
  providers: [CompetitionsService],
  exports: [CompetitionsService],
})
export class CompetitionsModule {}
