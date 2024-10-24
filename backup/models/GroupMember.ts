import {
  Table,
  Column,
  Model,
  ForeignKey,
  DataType
} from 'sequelize-typescript';
import { User } from './User';
import { Group } from './Group';

@Table({
  tableName: 'group_members'
})
export class GroupMember extends Model {
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  userId!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
  })
  groupId!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false
  })
  isAdmin!: boolean;
}
