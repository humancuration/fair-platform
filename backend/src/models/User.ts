import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  BelongsToMany
} from 'sequelize-typescript';
import { Group } from './Group';
import { GroupMember } from './GroupMember';
import { UserEmoji } from './UserEmoji';
import { Emoji } from './Emoji';

@Table({
  tableName: 'users'
})
export class User extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  username!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  password!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true
  })
  avatar?: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isAdmin!: boolean;

  @BelongsToMany(() => Group, () => GroupMember)
  groups!: Group[];

  @HasMany(() => Emoji)
  createdEmojis!: Emoji[];

  @BelongsToMany(() => Emoji, () => UserEmoji)
  purchasedEmojis!: Emoji[];
}
