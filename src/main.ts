import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

import SwaggerAdapter from './common/adapters/swagger-adapter';
import { readFileSync } from 'fs';
import { SwaggerModule } from '@nestjs/swagger';

function initializeSwagger(app: NestExpressApplication): void {
  const swaggerAdapter = new SwaggerAdapter();
  const cssTheme = readFileSync('./src/swaggerTheme.css', {
    encoding: 'utf-8',
  });
  swaggerAdapter.init();
  const document = SwaggerModule.createDocument(
    app,
    swaggerAdapter.swaggerConfig,
  );
  SwaggerModule.setup('docs', app, document, {
    customCss: cssTheme,
  });
}
// }

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  const config = app.get(ConfigService);

  initializeSwagger(app);

  app.use(express.json({ limit: '10mb' }));

  await app.listen(config.get<string>('PORT'), '0.0.0.0').then((server) => {
    console.log(
      `Nice start. We are flying 🚀 Server listening  info : [Env: ${config.get<string>('NODE_ENV')}] [Port: ${config.get<string>('PORT')}]`,
    );
    server.keepAliveTimeout = 60 * 1000; // 60s

    return server;
  });
}
bootstrap();
