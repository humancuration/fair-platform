import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';

class Group extends Model {
  public id!: number;
  public name!: string;
  public type!: string;
  public description!: string;
  public createdBy!: number; // User ID
  public motto!: string;
  public vision!: string;
  public profilePicture!: string;
  public coverPhoto!: string;
  public pinnedAnnouncement!: string;
  public location!: string;
  public tags!: string[];
  public resourceCredits!: number;
}

Group.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Affinity Group', 'Team', 'Cooperative', 'Solidarity Circle', 'Ad Hoc Committee'],
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    motto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    vision: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    coverPhoto: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinnedAnnouncement: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: true,
    },
    resourceCredits: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'groups',
  }
);

// Associations
Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
User.hasMany(Group, { foreignKey: 'createdBy', as: 'groupsCreated' });

// Additional associations (to be implemented)
// Group.belongsToMany(User, { through: 'GroupMembers', as: 'members' });
// User.belongsToMany(Group, { through: 'GroupMembers', as: 'joinedGroups' });

export default Group;