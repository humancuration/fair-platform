import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';

@Table({
  tableName: 'projects',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['groupId'],
    },
    {
      fields: ['createdBy'],
    },
  ],
})
export class Project extends Model<Project> {
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
    allowNull: true,
  })
  description?: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @Column({
    type: DataType.ENUM('Planning', 'InProgress', 'OnHold', 'Completed', 'Cancelled'),
    allowNull: false,
    defaultValue: 'Planning',
  })
  status!: 'Planning' | 'InProgress' | 'OnHold' | 'Completed' | 'Cancelled';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  startDate?: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dueDate?: Date;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  priority!: number;

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User)
  creator!: User;
}

export default Project;
