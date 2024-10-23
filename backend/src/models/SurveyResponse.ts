import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Survey } from './Survey';

@Table({
  tableName: 'survey_responses',
  timestamps: true,
  indexes: [
    {
      fields: ['surveyId'],
    },
    {
      fields: ['userId'],
    },
  ],
})
export class SurveyResponse extends Model<SurveyResponse> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Survey)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  surveyId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  answers!: Array<{
    questionId: string;
    answer: string | string[] | number;
  }>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isComplete!: boolean;

  @BelongsTo(() => Survey)
  survey!: Survey;

  @BelongsTo(() => User)
  user!: User;
}

export default SurveyResponse;
