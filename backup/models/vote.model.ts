import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Petition } from './petition.model';

@Table({
  tableName: 'votes',
  timestamps: true,
  indexes: [
    {
      fields: ['userId', 'petitionId'],
      unique: true,
    },
    {
      fields: ['voteType'],
    },
  ],
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
    type: DataType.ENUM('For', 'Against', 'Abstain'),
    allowNull: false,
  })
  voteType!: 'For' | 'Against' | 'Abstain';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  comment?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 100,
    },
  })
  weight!: number;

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => Petition)
  petition!: Petition;
}

export default Vote;
