import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvironmentVariables } from './config/env.validation';
import { QueryFailedFilter } from './database/query-failed.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );
  // Constraint violations become 400/409 instead of a bare 500.
  app.useGlobalFilters(new QueryFailedFilter(app.get(HttpAdapterHost).httpAdapter));

  const config = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);
  const port = config.get('PORT', { infer: true });

  await app.listen(port);
  console.log(`API listening on http://localhost:${port}/api`);
}

void bootstrap();
