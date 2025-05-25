import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { Request, Response } from 'express';
import { JwtPayload, verify } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { Session } from './model/Session.entity';
import { RWAZI_TOKEN_COOKIE } from '../common/constants';

@Injectable()
export class RwaziAuthenGuard implements CanActivate {
  private logger = new Logger(RwaziAuthenGuard.name);
  constructor(
    @InjectModel(Session) private sessionModel: typeof Session,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const request = http.getRequest<SessionalRequest>();
    const token = request.cookies?.[RWAZI_TOKEN_COOKIE];

    if (!token) {
      throw new UnauthorizedException({ code: 'NO_TOKEN' });
    }

    const jwtKey = this.configService.get('authen.jwtKey');
    try {
      const claims = verify(token, jwtKey) as JwtPayload;

      const session = await this.sessionModel.findByPk(claims.sessionId);
      if (session) {
        const sessionExpiredAt = DateTime.fromJSDate(session.expiredAt);
        const durationTillExpiration = sessionExpiredAt.diffNow('milliseconds');
        if (durationTillExpiration.milliseconds <= 0) {
          throw new UnauthorizedException({ code: 'SESSION_EXPIRED' });
        }

        const tokenNearExpirationWindow = this.configService.get(
          'authen.tokenNearExpirationWindow',
        );
        if (durationTillExpiration.milliseconds <= tokenNearExpirationWindow) {
          const sessionDurationInMonths = this.configService.get(
            'authen.sessionDurationInMonths',
          );
          const expiredAt = DateTime.now()
            .plus({ months: sessionDurationInMonths })
            .toJSDate();
          await session.update({ expiredAt });

          http.getResponse<Response>().cookie(RWAZI_TOKEN_COOKIE, token, {
            secure: true,
            sameSite: 'strict',
            httpOnly: true,
            expires: expiredAt,
          });
        }

        request.session = session;
        return true;
      }
      throw new UnauthorizedException({ code: 'SESSION_NOT_FOUND' });
    } catch (error) {
      if (!(error instanceof UnauthorizedException)) {
        this.logger.debug(error);
      }
      throw error;
    }
  }
}

export interface SessionalRequest extends Request {
  session: Session;
}
