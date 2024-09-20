import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';
import User from './User';

class Minsite extends Model {
  public id!: number;
  public title!: string;
  public content!: string;
  public userId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Minsite.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
  },
  {
    sequelize,
    modelName: 'Minsite',
    tableName: 'minsites',
  }
);

Minsite.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Minsite, { foreignKey: 'userId' });

export default Minsite;
