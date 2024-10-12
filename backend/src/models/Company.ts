import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '@config/database';

interface CompanyAttributes {
  id: number;
  name: string;
  industry: string;
  description: string;
  referralTerms: string;
  generosityScore: number;
  website: string;
  logo: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

class Company extends Model<CompanyAttributes, CompanyCreationAttributes> implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public industry!: string;
  public description!: string;
  public referralTerms!: string;
  public generosityScore!: number;
  public website!: string;
  public logo!: string;
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
      allowNull: true,
      defaultValue: 0,
    },
    website: {
      type: DataTypes.STRING,
    },
    logo: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    tableName: 'companies',
    modelName: 'Company',
  }
);

export default Company;
