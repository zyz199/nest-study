import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { knife4jSetup } from 'nestjs-knife4j';
// 文档
export const generateDocument = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('nest-study')
    .setDescription('The nest-study API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // doc.html
  knife4jSetup(app, {
    urls: [
      {
        name: '1.X版本',
        url: `/api-json`,
        swaggerVersion: '3.0',
        location: `/api-json`,
      },
    ],
  });
};
