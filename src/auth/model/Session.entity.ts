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
} from 'sequelize-typescript';

type SessionAttributes = {
  id: UUID;
  ownerId: UUID;
  createdAt: Date;
  expiredAt: Date;
};

type CreateSessionAttributes = Omit<SessionAttributes, 'createdAt'>;

@Exclude()
@Table({ tableName: 'session', underscored: true, updatedAt: false })
export class Session extends Model<SessionAttributes, CreateSessionAttributes> {
  @Expose()
  @PrimaryKey
  @NotNull
  @AllowNull(false)
  @Column
  declare id: UUID;

  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare ownerId: UUID;

  @Expose()
  @CreatedAt
  declare createdAt: Date;

  @Expose()
  @NotNull
  @AllowNull(false)
  @Column
  declare expiredAt: Date;
}
