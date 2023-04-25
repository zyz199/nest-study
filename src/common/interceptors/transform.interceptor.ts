import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response as ResponseExpress } from 'express';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const opentracing = require('@alicloud/opentracing');
const tracer = new opentracing.Tracer('链路追踪');

interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<ResponseExpress>();
    // 性能监控
    req.parentSpan = tracer.startSpan('根模块');
    req.parentSpan.setTag(opentracing.Tags.PEER_HOSTNAME, req.hostname);
    req.parentSpan.setTag(
      opentracing.Tags.HTTP_METHOD,
      req.method.toUpperCase(),
    );
    req.parentSpan.setTag(opentracing.Tags.HTTP_URL, req.url);
    return next.handle().pipe(
      tap(() => {
        res.once('finish', () => {
          req.parentSpan.setTag(
            opentracing.Tags.HTTP_STATUS_CODE,
            res.statusCode,
          );
          req.parentSpan.finish(req);
        });
      }),
      map((data) => ({
        data,
        status: 0,
        extra: {},
        message: 'success',
        success: true,
      })),
    );
  }
}
