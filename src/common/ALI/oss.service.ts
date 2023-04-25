/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { getConfig } from '../utils/ymlConfig';
import { CustomException } from 'src/common/exceptions/custom.exception';

import { webcrypto } from 'crypto';
import * as path from 'path';
import type { PutObjectResult } from 'ali-oss';
const OSS = require('ali-oss');
const moment = require('moment');

/**
 * 阿里  oss  服务
 */
@Injectable()
export class AliOssService {
  // 通过静态方法获取app实例
  static getOssClient() {
    const { accessKeyId, accessKeySecret, oss } = getConfig('ALI');
    return new OSS({
      ...oss,
      accessKeyId,
      accessKeySecret,
    });
  }

  //   获取oss路径
  static getOssPath(suffix: string) {
    const ymd: string = moment().format('YYYY/MM/DD');
    //   格式  2023/01/17/uuid
    return `${ymd}/${webcrypto.randomUUID()}${suffix}`;
  }

  /**
   *
   * @param url
   * @param suffix
   * @returns 上传buffer 到 oss
   */
  async putLocal(url: string, suffix: string) {
    try {
      return AliOssService.getOssClient().put(
        AliOssService.getOssPath(suffix),
        path.normalize(url),
      );
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /**
   *
   * @param buffer
   * @param suffix
   * @returns 上传buffer 到 oss
   */
  async putBuffer(buffer: Buffer, suffix: string): Promise<PutObjectResult> {
    try {
      return await AliOssService.getOssClient().put(
        AliOssService.getOssPath(suffix),
        buffer,
      );
    } catch (error) {
      throw new CustomException(error);
    }
  }

  /**
   * 删除资源
   * @param path 资源文件路径
   */
  async deleteFile(path: string) {
    try {
      await AliOssService.getOssClient().delete(path);
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
