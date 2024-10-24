import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AffiliateLink } from './AffiliateLink';

@Table({
  tableName: 'affiliate_programs',
  timestamps: true,
})
export class AffiliateProgram extends Model<AffiliateProgram> {
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
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.DECIMAL(5, 2),
    allowNull: false,
  })
  commissionRate!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @HasMany(() => AffiliateLink)
  affiliateLinks!: AffiliateLink[];
}
