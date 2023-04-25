/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable } from '@nestjs/common';
import { CustomException } from '../exceptions/custom.exception';
import { getConfig } from '../utils/ymlConfig';
const AipFaceClient = require('baidu-aip-sdk').face;

export interface FaceInfo {
  error_code: number;
  error_msg: string;
  log_id: number;
  timestamp: number;
  cached: number;
  result: {
    face_num: number;
    face_list: {
      face_token: string;
      location: {
        left: number;
        top: number;
        width: number;
        height: number;
        rotation: number;
      };
      face_probability: number;
      angle: {
        yaw: number;
        pitch: number;
        roll: number;
      };
      age: number;
      gender: {
        type: 'male' | 'female';
        probability: number;
      };
    }[];
  };
}

/**
 * 百度人脸识别
 */
@Injectable()
export class BaiduFaceService {
  // 新建一个对象，建议只保存一个对象调用服务接口
  static getFaceClient() {
    const { appId, accessKey, secretKey } = getConfig('BAIDU');

    return new AipFaceClient(appId, accessKey, secretKey);
  }

  async getFaceInfo(
    imageUrl: string,
    imageType = 'URL',
    options = {
      face_field: 'age,gender',
    },
  ) {
    try {
      const faceInfo: FaceInfo = await BaiduFaceService.getFaceClient().detect(
        imageUrl,
        imageType,
        options,
      );
      return faceInfo;
    } catch (error) {
      throw new CustomException(error);
    }
  }
}
