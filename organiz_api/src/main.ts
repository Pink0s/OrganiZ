import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { HttpStatus, Logger, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/HttpExceptionFilter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');
  const configService = app.get(ConfigService);


  const options = new DocumentBuilder()
    .setTitle('OrganiZ API')
    .setDescription('The OrganiZ api')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app,
    options);

  SwaggerModule.setup('api/swagger', app, document);

  // Configure logging level
  const loggingLevel = configService.get<string>('LOGGING_LEVEL');
  const logger = new Logger('SERVER');

  if (loggingLevel === 'DEBUG') {
    app.useLogger(['debug', 'log', 'warn', 'error']);
    logger.debug('Logging level set to DEBUG');
  } else {
    app.useLogger(['log', 'warn', 'error']);
    logger.log('Logging level set to default (LOG)');
  }

  // Configure CORS
  app.enableCors();

  // configure exception filter and validation pipe
  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    }),
  );
  const PORT = configService.get<number>('HTTP_LISTENING_PORT');

  await app.listen(PORT);
  logger.log('Server listening on port ' + PORT);
}

bootstrap();
