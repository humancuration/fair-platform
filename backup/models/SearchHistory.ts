import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'search_history',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['query'],
    },
  ],
})
export class SearchHistory extends Model<SearchHistory> {
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
  query!: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  resultCount!: number;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  filters?: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  hasResults!: boolean;

  @BelongsTo(() => User)
  user!: User;
}
