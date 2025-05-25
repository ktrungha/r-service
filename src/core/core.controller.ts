import {
  Controller,
  Delete,
  Get,
  Session as NestJsSession,
  Param,
  ParseArrayPipe,
  ParseFloatPipe,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { UUID } from 'crypto';
import { RwaziAuthenGuard } from '../auth/authen.guard';
import { Session } from '../auth/model/Session.entity';
import { CoreService } from './core.service';
import { SimpleSuccessResponse } from './model/core.dto';
import { RwaziService } from './model/RwaziService.entity';
import { UserFavoriteRwaziService } from './model/UserFavoriteRwaziService.entity';

@Controller('rwazi-service')
@UseGuards(RwaziAuthenGuard)
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Post('seed')
  @ApiOkResponse({ type: SimpleSuccessResponse })
  async seedData() {
    await this.coreService.seedData();
    return new SimpleSuccessResponse(true);
  }

  @Get('search')
  @ApiOkResponse({ type: RwaziService, isArray: true })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'types', isArray: false, type: String, required: false })
  async searchRwaziService(
    @Query('lat', new ParseFloatPipe()) lat: number,
    @Query('lon', new ParseFloatPipe()) lon: number,
    @Query('search-radius', new ParseFloatPipe()) searchRadius: number,
    @Query('name') name?: string,
    @Query(
      'types',
      new ParseArrayPipe({ items: String, separator: ',', optional: true }),
    )
    types?: string[],
  ) {
    return await this.coreService.search(lat, lon, searchRadius, types, name);
  }

  @Get('favorite')
  @ApiOkResponse({ type: UserFavoriteRwaziService, isArray: true })
  async getFavoriteServices(@NestJsSession() session: Session) {
    return await this.coreService.getFavoriteServices(session.ownerId);
  }

  @Put('favorite/:id')
  @ApiOkResponse({ type: SimpleSuccessResponse })
  async createFavoriteService(
    @NestJsSession() session: Session,
    @Param('id', new ParseUUIDPipe()) id: UUID,
  ) {
    await this.coreService.createFavoriteService(session.ownerId, id);
    return new SimpleSuccessResponse(true);
  }

  @Delete('favorite/:id')
  @ApiOkResponse({ type: SimpleSuccessResponse })
  async deleteFavoriteService(
    @NestJsSession() session: Session,
    @Param('id', new ParseUUIDPipe()) id: UUID,
  ) {
    const count = await this.coreService.deleteFavoriteService(
      session.ownerId,
      id,
    );
    return new SimpleSuccessResponse(count > 0);
  }
}
