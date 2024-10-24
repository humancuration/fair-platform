import {
  Table,
  Column,
  Model,
  DataType,
  BelongsTo,
  ForeignKey,
  HasMany
} from 'sequelize-typescript';
import { User } from './User';
import { Group } from './Group';
import { UserEmoji } from './UserEmoji';

@Table
export class Emoji extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  url!: string;

  @ForeignKey(() => User)
  @Column
  createdById!: number;

  @BelongsTo(() => User)
  createdBy!: User;

  @ForeignKey(() => Group)
  @Column
  groupId!: string;

  @BelongsTo(() => Group)
  group!: Group;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0
  })
  price!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true
  })
  isPublic!: boolean;

  @HasMany(() => UserEmoji)
  userEmojis!: UserEmoji[];
}
