import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Group from './group.model';
import User from './user.model';

class Resource extends Model {
  public id!: number;
  public groupId!: number;
  public userId!: number;
  public type!: 'Skill' | 'Resource' | 'Time' | 'Tool';
  public description!: string;
  public available!: boolean;
}

Resource.init(
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
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Skill', 'Resource', 'Time', 'Tool'],
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'resources',
  }
);

// Associations
Group.hasMany(Resource, { foreignKey: 'groupId', as: 'resources' });
Resource.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
User.hasMany(Resource, { foreignKey: 'userId', as: 'offeredResources' });
Resource.belongsTo(User, { foreignKey: 'userId', as: 'user' });

export default Resource;