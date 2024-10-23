import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { AffiliateProgram } from './AffiliateProgram';

@Table({
  tableName: 'affiliate_links',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['programId'],
    },
  ],
})
export class AffiliateLink extends Model<AffiliateLink> {
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

  @ForeignKey(() => AffiliateProgram)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  programId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  code!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  url!: string;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => AffiliateProgram)
  program!: AffiliateProgram;
}
