import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { RwaziService } from './model/RwaziService.entity';
import { RwaziAuthenGuard } from '../auth/authen.guard';
import { Session } from '../auth/model/Session.entity';
import { UserFavoriteRwaziService } from './model/UserFavoriteRwaziService.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([
      RwaziService,
      Session,
      UserFavoriteRwaziService,
    ]),
  ],
  controllers: [CoreController],
  providers: [CoreService, RwaziAuthenGuard],
  exports: [],
})
export class CoreModule {}
