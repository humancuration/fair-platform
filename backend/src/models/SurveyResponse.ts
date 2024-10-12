import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Survey from './Survey';
import User from './User';

class SurveyResponse extends Model {
  public id!: number;
  public surveyId!: number;
  public respondentId!: number;
  public answers!: any; // Adjust the type as needed
  public createdAt!: Date;

  // Associations
  public readonly survey?: Survey;
  public readonly respondent?: User;
}

SurveyResponse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    surveyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Surveys',
        key: 'id',
      },
    },
    respondentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    answers: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'survey_responses',
    timestamps: false,
  }
);

SurveyResponse.belongsTo(Survey, { foreignKey: 'surveyId' });
SurveyResponse.belongsTo(User, { foreignKey: 'respondentId' });

export default SurveyResponse;