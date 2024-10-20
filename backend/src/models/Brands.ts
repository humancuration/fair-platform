import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';
import { AffiliateProgram } from './AffiliateProgram';

@Table({
  tableName: 'brands',
  timestamps: true,
})
export class Brand extends Model<Brand> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

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

  @BelongsTo(() => User)
  user!: User;

  @HasMany(() => AffiliateProgram)
  affiliatePrograms!: AffiliateProgram[];
}

export default Brand;
