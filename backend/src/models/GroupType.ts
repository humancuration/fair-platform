import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class GroupType extends Model {
  public id!: number;
  public name!: string;
  public description!: string;
  public levelOfFormality!: 'Informal' | 'Formal';
  public scope!: 'Local' | 'Regional' | 'Global';
}

GroupType.init(
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
    levelOfFormality: {
      type: DataTypes.ENUM('Informal', 'Formal'),
      allowNull: false,
    },
    scope: {
      type: DataTypes.ENUM('Local', 'Regional', 'Global'),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'group_types',
    timestamps: false,
  }
);

export default GroupType;
