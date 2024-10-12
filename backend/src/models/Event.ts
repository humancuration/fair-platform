import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';
import Group from './Group';
import User from './User';

class Event extends Model {
  public id!: number;
  public groupId!: number;
  public title!: string;
  public description?: string;
  public date!: Date;
  public location?: string;
  public createdById!: number;
  public createdAt!: Date;
  public updatedAt!: Date;

  // Associations
  public readonly group?: Group;
  public readonly createdBy?: User;
  public readonly attendees?: User[];
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
        model: 'Groups',
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
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdById: {
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
    tableName: 'events',
    timestamps: true,
  }
);

Event.belongsTo(Group, { foreignKey: 'groupId' });
Event.belongsTo(User, { foreignKey: 'createdById' });
// Assuming a many-to-many relationship for attendees
Event.belongsToMany(User, { through: 'EventAttendees', as: 'attendees' });

export default Event;
