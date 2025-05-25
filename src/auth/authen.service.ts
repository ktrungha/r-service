import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/sequelize';
import { compare, hash } from 'bcrypt';
import { randomUUID, UUID } from 'crypto';
import * as jwt from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { Op, Transaction } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { CreateUserData, RegisterUserSuccess } from './model/auth.dto';
import { Session } from './model/Session.entity';
import { User } from './model/User.entity';

const SALTING_ROUNDS = 9;
@Injectable()
export class AuthenService {
  private logger = new Logger(AuthenService.name);

  constructor(
    @InjectModel(User) public userModel: typeof User,
    @InjectModel(Session) public sessionModel: typeof Session,

    private readonly configService: ConfigService,
    public readonly sequelize: Sequelize,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async cleanupSession() {
    try {
      const now = new Date();
      const deletedSessions = await this.sessionModel.destroy({
        where: { expiredAt: { [Op.lt]: now } },
      });
      this.logger.debug(`Clean up ${deletedSessions} expired sessions`);
    } catch (e) {
      this.logger.debug(e);
    }
  }

  async registerUser(requestData: CreateUserData) {
    const { username, password: rawPassword } = requestData;

    const matchingUsername = await this.userModel.findOne({
      where: { username },
    });
    if (matchingUsername) {
      throw new ConflictException({ code: 'USERNAME_IN_USED' });
    }

    const password = await hash(rawPassword, SALTING_ROUNDS);

    const id = randomUUID();

    const user = await this.userModel.create({
      id,
      username: username.toLocaleLowerCase(),
      password,
    });

    return new RegisterUserSuccess(user);
  }

  async checkPassword(username: string, password: string) {
    try {
      const retval = await this.sequelize.transaction(
        {
          isolationLevel: Transaction.ISOLATION_LEVELS.REPEATABLE_READ,
          autocommit: true,
        },
        async (transaction) => {
          const user = await this.userModel.findOne({
            where: { username },
            transaction,
          });

          if (!user) {
            throw new BadRequestException({ code: 'USER_NOT_FOUND' });
          }
          const passwordMatches = await compare(password, user.password);
          if (passwordMatches) {
            return { user };
          }
          return null;
        },
      );

      return retval;
    } catch (error) {
      throw error;
    }
  }

  async login(username: string, password: string) {
    const checkPasswordResult = await this.checkPassword(username, password);
    if (!checkPasswordResult) {
      throw new UnauthorizedException();
    }

    const session = await this.createSession(checkPasswordResult.user.id);
    const jwtKey = this.configService.get('authen.jwtKey');

    const token = jwt.sign(
      { sessionId: session.id, userId: checkPasswordResult.user.id },
      jwtKey,
    );

    return {
      token,
      userId: checkPasswordResult.user.id,
      session: session,
    };
  }

  async createSession(ownerId: UUID) {
    const sessionDurationInMonths = this.configService.get(
      'authen.sessionDurationInMonths',
    );

    const user = await this.userModel.findByPk(ownerId);
    if (!user) {
      throw new NotFoundException();
    }

    const in6Months = DateTime.now()
      .plus({ months: sessionDurationInMonths })
      .toJSDate();
    const expiredAt = in6Months;

    const session = await this.sessionModel.create({
      id: randomUUID(),
      ownerId,
      expiredAt: expiredAt,
    });

    return session;
  }

  async destroySession(sessionId: UUID) {
    await this.sessionModel.destroy({ where: { id: sessionId } });
  }

  async seedUsers() {
    await this.registerUser({ username: 'test1', password: 'password1' });
    await this.registerUser({ username: 'test2', password: 'password2' });
    await this.registerUser({ username: 'test3', password: 'password3' });
  }
}
