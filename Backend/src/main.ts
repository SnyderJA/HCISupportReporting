import {
  ClassSerializerInterceptor,
  VersioningType,
  ValidationPipe,
  HttpStatus,
  HttpException,
  ValidationError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { FieldValidationCode } from './constants/exception.constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  const configService = app.get(ConfigService);

  app.enableShutdownHooks();
  app.setGlobalPrefix(configService.get('app.apiPrefix') || '', {
    exclude: ['/'],
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });

  const reflector = app.get(Reflector);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: { enableImplicitConversion: true },
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      // exceptionFactory: (errors: ValidationError[]) =>
      //   new HttpException(
      //     {
      //       status: HttpStatus.BAD_REQUEST,
      //       code: FieldValidationCode,
      //       errors: errors.reduce((accumulator, currentValue) => {
      //         const errorMessage = Object.values(
      //           currentValue.constraints || {},
      //         )[0];
      //         console.log(currentValue);
      //         return {
      //           ...accumulator,
      //           [currentValue.property]: errorMessage,
      //         };
      //       }, {}),
      //     },
      //     HttpStatus.BAD_REQUEST,
      //   ),
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  const config = new DocumentBuilder()
    .setTitle('Hcice')
    .setDescription('The Hcice API')
    .setVersion('1.0')
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('app.port') || 3000);
}
void bootstrap();
