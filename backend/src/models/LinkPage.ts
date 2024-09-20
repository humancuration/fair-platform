// models/LinkPage.ts

import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

class LinkPage extends Model {
  public id!: number;
  public userId!: number;
  public title!: string;
  public theme!: string;
  // Other attributes
}

LinkPage.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    theme: {
      type: DataTypes.STRING,
      defaultValue: 'default',
    },
    // Additional fields
  },
  {
    sequelize,
    modelName: 'LinkPage',
    tableName: 'link_pages',
  }
);

export default LinkPage;
