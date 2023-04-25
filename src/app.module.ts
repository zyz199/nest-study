import {
  CacheModule,
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

import { BaseExceptionFilter } from './common/exceptions/base.exception.filter';
import { HttpExceptionFilter } from './common/exceptions/http.exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { getConfig } from './common/utils/ymlConfig';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { EmployeeModule } from './employee/employee.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { BaseModule } from './base/base.module';
import { DepartmentModule } from './department/department.module';
import { OrganizationModule } from './organization/organization.module';
import { TrackLogModule } from './track-log/track-log.module';
import { TestModule } from './test/test.module';
@Module({
  imports: [
    // 高速缓存
    CacheModule.register({
      isGlobal: true,
    }),
    // 配置
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: true,
      load: [getConfig],
    }),
    // open telemetry 链路追踪
    // alinode 性能平台
    // 数据库
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          ...getConfig('MYSQL_CONFIG'),
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    EmployeeModule,
    AuthModule,
    BaseModule,
    DepartmentModule,
    OrganizationModule,
    TrackLogModule,
    TestModule,
  ],
  controllers: [],
  providers: [
    {
      // 管道 - 验证
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          transform: true, // 属性转换
        });
      },
    },
    {
      // 守卫 jwt认证
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      // 序列化器 - 转换和净化数据
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      // 全局拦截器
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      // 全局异常
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
    {
      // Http异常
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
