import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Response } from 'express';
import { ValidationError } from 'sequelize';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      super.catch(exception, host);
    } else {
      const ctx = host.switchToHttp();
      const res = ctx.getResponse<Response>();
      this.logger.error(
        exception instanceof Error ? exception.stack : exception,
      );

      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
        errorType:
          exception instanceof ValidationError ? 'Database' : 'Unknown',
      });
    }
  }
}
