import {
  Table,
  Column,
  Model,
  ForeignKey,
  BelongsTo
} from 'sequelize-typescript';
import { User } from './User';
import { Emoji } from './Emoji';

@Table
export class UserEmoji extends Model {
  @ForeignKey(() => User)
  @Column
  userId!: number;

  @BelongsTo(() => User)
  user!: User;

  @ForeignKey(() => Emoji)
  @Column
  emojiId!: number;

  @BelongsTo(() => Emoji)
  emoji!: Emoji;
}
