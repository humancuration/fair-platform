import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Group } from './Group';

@Table({
  tableName: 'group_members',
  timestamps: true,
})
export class GroupMember extends Model<GroupMember> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  userId!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  groupId!: number;

  @Column({
    type: DataType.ENUM('Observer', 'Contributor', 'CoreMember', 'Delegate'),
    allowNull: false,
    defaultValue: 'Observer',
  })
  role!: 'Observer' | 'Contributor' | 'CoreMember' | 'Delegate';

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Group)
  group!: Group;
}

export default GroupMember;
