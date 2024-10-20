import { Model, Column, Table, DataType, HasMany } from 'sequelize-typescript';
import { User } from '../user/userModel';

@Table
export class Group extends Model<Group> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

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

  @HasMany(() => User)
  members!: User[];
}
