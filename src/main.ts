import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule, utilities } from 'nest-winston';
import { patchNestJsSwagger } from 'nestjs-zod';
import { createLogger, format, transports } from 'winston';
import { AppModule } from './app.module';
import { addUsage } from './setupUtils';

patchNestJsSwagger();

async function bootstrap() {
  const instance = createLogger({
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.ms(),
          utilities.format.nestLike('Rwazi', {
            colors: true,
            prettyPrint: true,
            processId: true,
            appName: true,
          }),
        ),
      }),
    ],
  });
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });

  const config = new DocumentBuilder()
    .setTitle('Rwazi backend')
    .setDescription('Rwazi API description')
    .setVersion('1.0.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  addUsage(app);

  await app.listen(process.env.PORT ?? 3300);
}
bootstrap().catch((e) => console.error(e));
