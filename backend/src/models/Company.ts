import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'companies',
  timestamps: true,
})
export class Company extends Model<Company> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  industry!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  referralTerms!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: true,
    defaultValue: 0,
  })
  generosityScore!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  website?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  logo?: string;
}
