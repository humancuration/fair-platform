import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../backend/src/config/database';
import { User } from '../../backend/src/modules/user/User';

export class Achievement extends Model {
  public id!: string;
  public userId!: string;
  public name!: string;
  public description!: string;
  public unlockedAt!: Date;
  public icon!: string;
}

Achievement.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    unlockedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Achievement',
    tableName: 'achievements',
  }
);

Achievement.belongsTo(User, { foreignKey: 'userId' });
