import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Group } from './Group';
import { User } from './User';

@Table({
  tableName: 'petitions',
  timestamps: true,
})
export class Petition extends Model<Petition> {
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
  title!: string;

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
    type: DataType.ENUM('Open', 'Closed'),
    allowNull: false,
    defaultValue: 'Open',
  })
  status!: 'Open' | 'Closed';

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User)
  creator!: User;
}

export default Petition;
