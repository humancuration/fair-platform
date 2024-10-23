import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Group } from '../modules/group/Group';
import { User } from '../modules/user/User';

@Table({
  tableName: 'resources',
  timestamps: true,
  indexes: [
    {
      fields: ['type'],
    },
    {
      fields: ['groupId'],
    },
    {
      fields: ['userId'],
    },
  ],
})
export class Resource extends Model<Resource> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  groupId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.ENUM('Skill', 'Resource', 'Time', 'Tool', 'Other'),
    allowNull: false,
  })
  type!: 'Skill' | 'Resource' | 'Time' | 'Tool' | 'Other';

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  available!: boolean;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  availableUntil?: Date;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  metadata?: Record<string, any>;

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User)
  user!: User;
}

export default Resource;

