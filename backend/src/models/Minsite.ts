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
  public template!: string;
  public customCSS!: string;
  public seoMetadata!: object;
  public components!: string[];
  public versions!: object[];
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
    template: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['blank', 'blog', 'portfolio', 'landing']],
      },
    },
    customCSS: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 10000], // Limit CSS length
      },
    },
    seoMetadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    components: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      allowNull: false,
      defaultValue: [],
    },
    versions: {
      type: DataTypes.ARRAY(DataTypes.JSON),
      allowNull: false,
      defaultValue: [],
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
