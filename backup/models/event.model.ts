import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Group from '../../backend/src/modules/group/Group';

class Event extends Model {
  public id!: number;
  public groupId!: number;
  public name!: string;
  public description!: string;
  public date!: Date;
  public location!: string;
}

Event.init(
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'events',
  }
);

// Associations
Group.hasMany(Event, { foreignKey: 'groupId', as: 'events' });
Event.belongsTo(Group, { foreignKey: 'groupId', as: 'group' });

export default Event;