import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Group from './Group';
import User from './User';

class Petition extends Model {
  public id!: number;
  public groupId!: number;
  public title!: string;
  public description!: string;
  public createdBy!: number;
  public status!: 'Open' | 'Closed';
}

Petition.init(
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
    title: {
      type: DataTypes.STRING,
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
    status: {
      type: DataTypes.ENUM,
      values: ['Open', 'Closed'],
      allowNull: false,
      defaultValue: 'Open',
    },
  },
  {
    sequelize,
    tableName: 'petitions',
  }
);

// Associations
Group.hasMany(Petition, { foreignKey: 'groupId', as: 'petitions' });
Petition.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });
User.hasMany(Petition, { foreignKey: 'createdBy', as: 'createdPetitions' });
Petition.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

export default Petition;