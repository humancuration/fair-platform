// backend/src/models/Dividend.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from './index';

class Dividend extends Model {
  public id!: number;
  public amount!: number;
  public recipientId!: number;
  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Dividend.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    recipientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'dividends',
  }
);

export default Dividend;
