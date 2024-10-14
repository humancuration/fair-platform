import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'group_types',
  timestamps: false,
})
export class GroupType extends Model<GroupType> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.ENUM('Informal', 'Formal'),
    allowNull: false,
  })
  levelOfFormality!: 'Informal' | 'Formal';

  @Column({
    type: DataType.ENUM('Local', 'Regional', 'Global'),
    allowNull: false,
  })
  scope!: 'Local' | 'Regional' | 'Global';
}

export default GroupType;
