import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Group from './Group';
import User from './User';

class Project extends Model {
  public id!: number;
  public groupId!: number;
  public name!: string;
  public description!: string;
  public deadline!: Date;
  public createdBy!: number;
}

Project.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'projects',
  }
);

// Associations
Group.hasMany(Project, { foreignKey: 'groupId', as: 'projects' });
Project.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
User.hasMany(Project, { foreignKey: 'createdBy', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

export default Project;