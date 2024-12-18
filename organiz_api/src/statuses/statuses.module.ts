import { Module } from '@nestjs/common';
import { StatusesService } from './services/statuses.service';
import { StatusesController } from './controllers/statuses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Status])],
  controllers: [StatusesController],
  providers: [StatusesService],
  exports: [StatusesService],
})
export class StatusesModule {}
