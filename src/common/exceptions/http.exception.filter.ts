import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { CustomException, TBusinessError } from './custom.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();

    // 管道验证器异常
    if (exception.name === 'BadRequestException') {
      response.status(HttpStatus.OK).send({
        data: null,
        status: exception.getStatus(),
        extra: {},
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        message: exception.getResponse().message
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            exception.getResponse().message.toString()
          : exception.getResponse(),
        success: false,
      });
      return;
    }

    // 自定义异常走这个
    if (exception instanceof CustomException) {
      const { code, message } = exception.getResponse() as TBusinessError;
      response.status(HttpStatus.OK).send({
        data: null,
        status: code,
        extra: {},
        message,
        success: false,
      });
      return;
    }
    // http异常
    response.status(HttpStatus.NOT_FOUND).send({
      statusCode: HttpStatus.NOT_FOUND,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.getResponse(),
    });
  }
}
