// backend/src/models/Dividend.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../user/User';

@Table({
  tableName: 'dividends',
  timestamps: true,
})
export class Dividend extends Model<Dividend> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amount!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  recipientId!: number;

  @BelongsTo(() => User)
  recipient!: User;
}

export default Dividend;
