import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import User from './User';
import Group from './Group';

class GroupMember extends Model {
  public userId!: number;
  public groupId!: number;
  public role!: 'Observer' | 'Contributor' | 'CoreMember' | 'Delegate';
}

GroupMember.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: {
        model: 'groups',
        key: 'id',
      },
    },
    role: {
      type: DataTypes.ENUM,
      values: ['Observer', 'Contributor', 'CoreMember', 'Delegate'],
      allowNull: false,
      defaultValue: 'Observer',
    },
  },
  {
    sequelize,
    tableName: 'group_members',
    timestamps: true,
  }
);

// Associations
User.belongsToMany(Group, { through: GroupMember, as: 'joinedGroups', foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, as: 'members', foreignKey: 'groupId' });

export default GroupMember;