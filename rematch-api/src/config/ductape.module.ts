import { Global, Module } from '@nestjs/common';
import { DuctapeService } from './ductape.config';

@Global()
@Module({
  providers: [DuctapeService],
  exports: [DuctapeService],
})
export class DuctapeModule {}
