import { Controller, Get, Query, Req } from '@nestjs/common';
import { TestService } from './test.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Request } from 'express';
import { Logger } from '@/common/logger/log4js';
import { isPublic } from '@/auth/constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const opentracing = require('@alicloud/opentracing');
const tracer = new opentracing.Tracer('测试链路');

@ApiTags('测试模块')
@Controller('test')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @ApiOperation({
    summary: 'ali node 性能平台测试 慢 http 和 慢链路追踪',
  })
  @Get('1')
  @isPublic()
  test1(@Query('id') id: string, @Req() req: Request) {
    const child = tracer.startSpan('子模块 1: 随机并发延迟', {
      childOf: req.parentSpan,
    });
    child.setTag('timeout1', 1000);
    child.log({ state: 'timer1' });
    return new Promise((res) => {
      setTimeout(() => {
        child.finish(req);
        const child2 = tracer.startSpan('子模块 2: 随机并发延迟', {
          childOf: req.parentSpan,
        });
        child2.setTag('timeout2', 1000);
        child2.log({ state: 'timer2' });
        setTimeout(() => {
          res(true);
          child2.finish(req);
        }, 1000);
      }, 1000);
    });
  }

  @ApiOperation({
    summary: 'ali node 性能平台测试 异常日志',
  })
  @Get('2')
  @isPublic()
  test2() {
    const obj: any = {};
    try {
      //
      obj.b.c();
    } catch (error) {
      Logger.error(error.stack);
    }
    throw new Error('测试2错误');
  }
}
