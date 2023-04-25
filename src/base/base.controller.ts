import {
  Body,
  CACHE_MANAGER,
  Controller,
  Get,
  Headers,
  Inject,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { isPublic } from 'src/auth/constants';
import { getFileSuffix } from '../common/utils/index';
import { AliOssService } from '../common/ALI/oss.service';
import { BaiduFaceService } from '../common/BAIDU/face.service';
import { CustomException } from 'src/common/exceptions/custom.exception';
import { Cache } from 'cache-manager';
import * as jsBase64 from 'js-base64';
import { webcrypto } from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const svgCaptcha = require('svg-captcha');

@ApiTags('公共模块')
@Controller('base')
export class BaseController {
  constructor(
    private readonly aliOssService: AliOssService,
    private readonly baiduFaceService: BaiduFaceService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  @ApiOperation({
    summary: '上传本地',
  })
  @isPublic()
  @Post('/uploadLocal')
  @UseInterceptors(FileInterceptor('file'))
  uploadLocal(
    @UploadedFile() file: Express.Multer.File,
    @Headers('host') host: string,
  ) {
    console.log(host, file);

    // 如果是 localhost 就加上http://
    if (!host.includes('://')) {
      host = `http://${host}`;
    }
    return `${host}/${file.path}`;
  }

  @ApiOperation({
    summary: '上传阿里OSS',
  })
  @isPublic()
  @Post('/uploadOSS')
  @UseInterceptors(FileInterceptor('file'))
  async uploadOSS(@UploadedFile() file: Express.Multer.File) {
    // oss文件上传
    const { url, name } = await this.aliOssService.putBuffer(
      file.buffer,
      getFileSuffix(file.originalname),
    );

    // 执行人脸识别函数
    const faceInfo = await this.baiduFaceService.getFaceInfo(url);
    // 如果人脸识别失败，删除阿里云存储的图片
    if (faceInfo.error_code !== 0) {
      await this.aliOssService.deleteFile(name);
      // 返回人脸识别错误提示
      throw new CustomException(faceInfo.error_msg);
    }
    // 返回阿里oss图片地址和人脸识别信息
    return { url, ...faceInfo };
  }

  @ApiOperation({
    summary: '获取验证码',
  })
  @isPublic()
  @Get('captcha')
  captcha() {
    const { text, data } = svgCaptcha.create({
      color: true,
    });
    // 数据缓存，过期时间五分钟
    this.cacheManager.set(
      'img_' + text.toLocaleLowerCase(),
      webcrypto.randomUUID(),
      1000 * 60 * 5,
    );
    const base64Img = `data:image/svg+xml;base64,${jsBase64.encode(data)}`;
    return base64Img;
  }
}
