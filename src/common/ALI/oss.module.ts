import { Module } from '@nestjs/common';
import { AliOssService } from './oss.service';

@Module({
  providers: [AliOssService],
  exports: [AliOssService],
})
export class AliOssModule {}
