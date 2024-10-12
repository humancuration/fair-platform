import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Group from './group.model';
import User from './User';
import Petition from './petition.model';

class Vote extends Model {
  public id!: number;
  public groupId!: number;
  public userId!: number;
  public petitionId?: number;
  public voteType!: 'Upvote' | 'Downvote';
}

Vote.init(
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
    petitionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'petitions',
        key: 'id',
      },
    },
    voteType: {
      type: DataTypes.ENUM,
      values: ['Upvote', 'Downvote'],
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'votes',
  }
);

// Associations
User.hasMany(Vote, { foreignKey: 'userId', as: 'votes' });
Vote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Group.hasMany(Vote, { foreignKey: 'groupId', as: 'votes' });
Vote.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
Petition.hasMany(Vote, { foreignKey: 'petitionId', as: 'votes' });
Vote.belongsTo(Petition, { foreignKey: 'petitionId', as: 'petition' });

export default Vote;