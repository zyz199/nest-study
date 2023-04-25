import { Module } from '@nestjs/common';
import { BaiduFaceService } from './face.service';

@Module({
  providers: [BaiduFaceService],
  exports: [BaiduFaceService],
})
export class BaiduFaceModule {}
