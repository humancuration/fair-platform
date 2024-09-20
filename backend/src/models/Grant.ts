// backend/src/models/Grant.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Grant extends Model {
  public id!: number;
  public applicantName!: string;
  public projectDescription!: string;
  public amountRequested!: number;
  public amountGranted!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Grant.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    applicantName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    amountRequested: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    amountGranted: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'grants',
  }
);

export default Grant;
