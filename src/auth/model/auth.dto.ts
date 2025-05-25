import { ApiPropertyOptional } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';
import { User } from './User.entity';

export class RegisterUserSuccess {
  user: User;

  constructor(user: User) {
    this.user = user;
  }
}

export const PASSWORD_MAX_LENGTH = 72;
export const PASSWORD_MIN_LENGTH = 8;
export const USERNAME_REGEX = /^([a-zA-Z0-9]|-|_){3,32}$/;

const loginReqSchema = z.object({
  username: z.string(),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});
export class LoginReqData extends createZodDto(loginReqSchema) {}

export class LoginWithPasswordSuccess {
  public success: boolean = true;
  public sessionId: UUID;
  @ApiPropertyOptional()
  public token: string | null;

  constructor(sessionId: UUID, token: string | null) {
    this.sessionId = sessionId;
    this.token = token;
  }
}

export const createUserSchema = z.object({
  username: z.string().regex(USERNAME_REGEX),
  password: z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH),
});
export class CreateUserData extends createZodDto(createUserSchema) {}
