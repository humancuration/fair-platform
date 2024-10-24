import {
  Table,
  Column,
  Model,
  DataType,
  BelongsToMany,
  HasMany
} from 'sequelize-typescript';
import { User } from './User';
import { GroupMember } from './GroupMember';
import { Emoji } from './Emoji';

@Table({
  tableName: 'groups'
})
export class Group extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true
  })
  description?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  avatar?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isPrivate!: boolean;

  @BelongsToMany(() => User, () => GroupMember)
  members!: User[];

  @HasMany(() => Emoji)
  emojis!: Emoji[];
}
