import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Petition } from './petition.model';

@Table({
  tableName: 'votes',
  timestamps: true,
})
export class Vote extends Model<Vote> {
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

  @ForeignKey(() => Petition)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  petitionId!: number;

  @Column({
    type: DataType.ENUM('For', 'Against'),
    allowNull: false,
  })
  voteType!: 'For' | 'Against';

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Petition)
  petition!: Petition;
}

export default Vote;
