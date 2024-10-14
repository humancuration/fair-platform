import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from './User';
import { Group } from './Group';

@Table({
  tableName: 'projects',
  timestamps: true,
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
    type: DataType.ENUM('Planning', 'InProgress', 'Completed'),
    allowNull: false,
    defaultValue: 'Planning',
  })
  status!: 'Planning' | 'InProgress' | 'Completed';

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User)
  creator!: User;
}

export default Project;
