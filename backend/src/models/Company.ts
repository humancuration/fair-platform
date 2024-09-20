// backend/src/models/Company.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Company extends Model {
  public id!: number;
  public name!: string;
  public industry!: string;
  public description!: string;
  public referralTerms!: string;
  public generosityScore!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referralTerms: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    generosityScore: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'companies',
  }
);

export default Company;
