import { VersioningType, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './common/middleware/logger.middleware';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { getConfig } from './common/utils/ymlConfig';
import { generateDocument } from './doc';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

declare const module: any;

async function bootstrap() {
  // 开启事务
  initializeTransactionalContext();

  // 创建实例
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  // api多版本控制
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });

  // 开启静态文件预览
  app.useStaticAssets('public', {
    prefix: '/public/',
  });

  // 日志
  app.use(logger);

  // 文档支持
  generateDocument(app);

  // 启动项目
  await app.listen(getConfig('HTTP').port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
