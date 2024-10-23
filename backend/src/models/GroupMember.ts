import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';

@Table({
  tableName: 'group_members',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'groupId'],
      unique: true,
    },
  ],
})
export class GroupMember extends Model<GroupMember> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  groupId!: number;

  @Column({
    type: DataType.ENUM('member', 'moderator', 'admin'),
    defaultValue: 'member',
  })
  role!: 'member' | 'moderator' | 'admin';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  joinedAt!: Date;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Group)
  group!: Group;
}
