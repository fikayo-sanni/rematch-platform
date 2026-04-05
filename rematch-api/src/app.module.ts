import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DuctapeModule } from './config/ductape.module';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { GuildsModule } from './modules/guilds/guilds.module';
import { MatchesModule } from './modules/matches/matches.module';
import { CompetitionsModule } from './modules/competitions/competitions.module';
import { SocialModule } from './modules/social/social.module';
import { LivekitModule } from './modules/livekit/livekit.module';

@Module({
  imports: [
    DuctapeModule,
    DatabaseModule,
    UsersModule,
    GuildsModule,
    MatchesModule,
    CompetitionsModule,
    SocialModule,
    LivekitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
