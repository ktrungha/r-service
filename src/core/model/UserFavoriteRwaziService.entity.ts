import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UUID } from 'crypto';
import {
  AllowNull,
  BelongsTo,
  Column,
  CreatedAt,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RwaziService } from './RwaziService.entity';

type UserFavoriteRwaziServiceAttrs = {
  userId: UUID;
  rwaziServiceId: UUID;
  createdAt: Date;
};

type UserFavoriteRwaziServiceCreateAttrs = Omit<
  UserFavoriteRwaziServiceAttrs,
  'createdAt'
>;

@Exclude()
@Table({
  tableName: 'user_favorite_rwazi_service',
  underscored: true,
  createdAt: true,
  updatedAt: false,
  defaultScope: { include: [{ model: RwaziService, as: 'rwaziService' }] },
})
export class UserFavoriteRwaziService extends Model<
  UserFavoriteRwaziServiceAttrs,
  UserFavoriteRwaziServiceCreateAttrs
> {
  @PrimaryKey
  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare userId: UUID;

  @PrimaryKey
  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare rwaziServiceId: UUID;

  @Expose()
  @CreatedAt
  declare createdAt: Date;

  @Expose()
  @BelongsTo(() => RwaziService, 'rwazi_service_id')
  declare rwaziService: RwaziService;
}
