import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { UUID } from 'crypto';
import {
  AllowNull,
  Column,
  CreatedAt,
  Model,
  NotNull,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';

type UserAttrs = {
  id: UUID;
  password: string;
  username: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type UserCreateAttrs = Omit<UserAttrs, 'createdAt' | 'updatedAt'>;

@Exclude()
@Table({
  tableName: 'user',
  underscored: true,
  timestamps: true,
})
export class User extends Model<UserAttrs, UserCreateAttrs> {
  @PrimaryKey
  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare id: UUID;

  @ApiHideProperty()
  @NotNull
  @AllowNull(false)
  @Column
  declare password: string;

  @Expose()
  @AllowNull(false)
  @Column
  declare username: string;

  @Expose()
  @CreatedAt
  declare createdAt: Date;

  @Expose()
  @UpdatedAt
  declare updatedAt: Date;
}
