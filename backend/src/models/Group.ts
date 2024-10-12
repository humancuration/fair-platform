import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import GroupType from './GroupType';
import User from './User';
import Event from './Event';

class Group extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public groupTypeId!: number;
  public profilePicture!: string;
  public categoryBadge!: string;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly groupType?: GroupType;
  public readonly members?: User[];
  public readonly delegates?: User[];
  public readonly events?: Event[];
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
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    groupTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'GroupTypes',
        key: 'id',
      },
    },
    profilePicture: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    categoryBadge: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'groups',
    timestamps: true,
  }
);

Group.belongsTo(GroupType, { foreignKey: 'groupTypeId' });
Group.belongsToMany(User, { through: 'GroupMembers', as: 'members' });
Group.belongsToMany(User, { through: 'GroupDelegates', as: 'delegates' });
Group.hasMany(Event, { foreignKey: 'groupId' });

export default Group;
