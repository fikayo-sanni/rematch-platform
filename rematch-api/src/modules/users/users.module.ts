import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GraphSetupService } from '../../database/graph-setup.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { DuctapeModule } from '../../config/ductape.module';

@Module({
  imports: [DuctapeModule],
  controllers: [UsersController],
  providers: [UsersService, GraphSetupService, AuthGuard],
  exports: [UsersService],
})
export class UsersModule {}
