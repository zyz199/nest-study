import { Module } from '@nestjs/common';
import { TrackLogService } from './track-log.service';
import { TrackLogController } from './track-log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackLog } from './entities/track-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TrackLog])],
  controllers: [TrackLogController],
  providers: [TrackLogService],
})
export class TrackLogModule {}
