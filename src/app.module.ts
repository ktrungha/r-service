import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ZodValidationPipe } from 'nestjs-zod';
import { AuthModule } from './auth/auth.module';
import configurationFn from '../config/configuration';
import { CoreModule } from './core/core.module';

const configuration = configurationFn();

@Module({
  imports: [
    AuthModule,
    CoreModule,

    ConfigModule.forRoot({ load: [configurationFn], isGlobal: true }),
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: configuration.mysql.host,
      port: configuration.mysql.port,
      username: configuration.mysql.username,
      password: configuration.mysql.password,
      database: configuration.mysql.dbName,
      autoLoadModels: true,
      synchronize: false,
      logging: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 1000,
        limit: 1800,
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
