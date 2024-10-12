import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';
import LinkedContent from './LinkedContent'; // Assuming LinkedContent is another Sequelize model

class Survey extends Model {
  public id!: number;
  public title!: string;
  public description?: string;
  public questions!: any[]; // Adjust the type as needed
  public creatorId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly creator?: User;
  public readonly collaborators?: User[];
  public readonly linkedContent?: LinkedContent[];
}

Survey.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    questions: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    creatorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'surveys',
    timestamps: true,
  }
);

Survey.belongsTo(User, { foreignKey: 'creatorId' });
Survey.belongsToMany(User, { through: 'SurveyCollaborators', as: 'collaborators' });
// Assuming linkedContent is a polymorphic association
Survey.belongsToMany(LinkedContent, { through: 'SurveyLinkedContents', as: 'linkedContent' });

export default Survey;
