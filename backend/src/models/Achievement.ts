import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/database';

export class Achievement extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public icon!: string;
}

Achievement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Achievement',
  }
);
