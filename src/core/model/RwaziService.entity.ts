import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UUID } from 'crypto';
import {
  AllowNull,
  Column,
  Model,
  NotNull,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

type RwaziServiceAttrs = {
  id: UUID;
  name: string;
  type: string;
  lat: number;
  lon: number;
  hexId0: string;
  hexId1: string;
  hexId2: string;
  hexId3: string;
  hexId4: string;
  hexId5: string;
  hexId6: string;
  hexId7: string;
  hexId8: string;
  hexId9: string;
  hexId10: string;
  hexId11: string;
  hexId12: string;
  hexId13: string;
  hexId14: string;
  hexId15: string;
};

type RwaziServiceCreateAttrs = RwaziServiceAttrs;

@Exclude()
@Table({
  tableName: 'rwazi_service',
  timestamps: false,
  underscored: true,
  defaultScope: { attributes: ['id', 'name', 'type', 'lat', 'lon'] },
})
export class RwaziService extends Model<
  RwaziServiceAttrs,
  RwaziServiceCreateAttrs
> {
  @PrimaryKey
  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare id: UUID;

  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare name: string;

  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare type: string;

  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare lat: number;

  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare lon: number;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId0: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId1: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId2: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId3: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId4: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId5: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId6: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId7: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId8: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId9: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId10: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId11: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId12: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId13: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId14: string;

  @Exclude()
  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare hexId15: string;
}
