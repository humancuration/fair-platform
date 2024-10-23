import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';

@Table({
  tableName: 'playlists',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['groupId'],
    },
  ],
})
export class Playlist extends Model<Playlist> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  groupId?: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  mediaItems!: Array<{
    id: string;
    type: 'music' | 'video' | 'social' | 'podcast';
    title: string;
    url: string;
    order: number;
  }>;

  @Column({
    type: DataType.ENUM('private', 'public', 'shared'),
    defaultValue: 'private',
  })
  visibility!: 'private' | 'public' | 'shared';

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Group)
  group?: Group;
}
