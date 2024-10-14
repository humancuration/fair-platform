import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Survey } from './Survey';
import { User } from './User';

@Table({
  tableName: 'survey_responses',
  timestamps: false,
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
  respondentId!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  answers!: any;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date;

  @BelongsTo(() => Survey)
  survey!: Survey;

  @BelongsTo(() => User)
  respondent!: User;
}

export default SurveyResponse;
