import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { BaseController } from './base.controller';
import { BaseService } from './base.service';
import { diskStorage } from 'multer';
import { checkDirAndCreate } from 'src/common/utils';
import { webcrypto } from 'crypto';
import { AliOssModule } from 'src/common/ALI/oss.module';
import { BaiduFaceModule } from 'src/common/BAIDU/face.module';
@Module({
  imports: [
    AliOssModule,
    BaiduFaceModule,
    MulterModule.register({
      // storage: diskStorage({
      //   destination(req, file, callback) {
      //     const filePath = `public/uploads/${file.mimetype.split('/')[0]}/`;
      //     checkDirAndCreate(filePath);
      //     return callback(null, `./${filePath}`);
      //   },
      //   filename(req, file, callback) {
      //     console.log(req.file);
      //     const suffix = file.originalname.substring(
      //       file.originalname.lastIndexOf('.'),
      //     );
      //     const fileName = Date.now() + '-' + webcrypto.randomUUID() + suffix;
      //     callback(null, fileName);
      //   },
      // }),
      fileFilter(req, file, callback) {
        return callback(null, true);
      },
    }),
  ],
  controllers: [BaseController],
  providers: [BaseService],
})
export class BaseModule {}
