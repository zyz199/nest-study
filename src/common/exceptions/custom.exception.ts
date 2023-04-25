import { HttpException, HttpStatus } from '@nestjs/common';
import { BUSINESS_ERROR_CODE } from './business.error.codes';

export type TBusinessError = {
  code: number;
  message: string;
};

/**
 * 自定义异常 - 用于主动抛出
 */
export class CustomException extends HttpException {
  constructor(error: TBusinessError | string) {
    if (typeof error === 'string') {
      error = {
        code: BUSINESS_ERROR_CODE.COMMON,
        message: error,
      };
    }
    super(error, HttpStatus.OK);
  }
  static throwForbidden() {
    throw new CustomException({
      code: BUSINESS_ERROR_CODE.ACCESS_FORBIDDEN,
      message: '抱歉哦，您无此权限！',
    });
  }
}
