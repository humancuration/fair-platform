import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import GroupType from './GroupType';
import User from './User';
import Event from './Event';
import GroupMember from './groupMember.model';

class Group extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public groupTypeId!: number;
  public createdBy!: number;
  public motto!: string;
  public vision!: string;
  public profilePicture!: string;
  public coverPhoto!: string;
  public pinnedAnnouncement!: string;
  public location!: string;
  public tags!: string[];
  public resourceCredits!: number;
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
        model: 'group_types',
        key: 'id',
      },
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
    categoryBadge: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'groups',
    timestamps: true,
  }
);

Group.belongsTo(GroupType, { foreignKey: 'groupTypeId' });
Group.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Group.belongsToMany(User, { through: GroupMember, as: 'members' });
Group.belongsToMany(User, { through: GroupMember, as: 'delegates' });
Group.hasMany(Event, { foreignKey: 'groupId' });

export default Group;
