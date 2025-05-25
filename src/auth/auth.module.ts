import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthenService } from './authen.service';
import { AuthenController } from './authen.controller';
import { Session } from './model/Session.entity';
import { User } from './model/User.entity';

@Module({
  imports: [SequelizeModule.forFeature([User, Session])],
  controllers: [AuthenController],
  providers: [AuthenService],
  exports: [],
})
export class AuthModule {}
