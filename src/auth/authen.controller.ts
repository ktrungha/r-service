import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { RWAZI_TOKEN_COOKIE } from '../common/constants';
import { AuthenService } from './authen.service';
import {
  CreateUserData,
  LoginReqData,
  LoginWithPasswordSuccess,
  RegisterUserSuccess,
} from './model/auth.dto';
import { SimpleSuccessResponse } from '../core/model/core.dto';

@Controller('authen')
export class AuthenController {
  constructor(private readonly authenService: AuthenService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: LoginWithPasswordSuccess })
  async loginWithPassword(
    @Body() loginReq: LoginReqData,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { session, token } = await this.authenService.login(
      loginReq.username.toLocaleLowerCase(),
      loginReq.password,
    );
    response.cookie(RWAZI_TOKEN_COOKIE, token, {
      secure: true,
      sameSite: 'strict',
      httpOnly: true,
      expires: session.expiredAt,
    });

    return new LoginWithPasswordSuccess(session.id, token);
  }

  @Post('create-user')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ type: RegisterUserSuccess })
  async createUser(@Body() createUserBody: CreateUserData) {
    return await this.authenService.registerUser(createUserBody);
  }

  @Post('seed-users')
  @ApiOkResponse({ type: SimpleSuccessResponse })
  async seedUsers() {
    await this.authenService.seedUsers();
    return new SimpleSuccessResponse(true);
  }
}
