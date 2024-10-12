import { Model, DataTypes } from 'sequelize';
import { sequelize } from '@config/database';

class LinkedContent extends Model {
  public id!: number;
  public type!: 'discussion' | 'learningModule' | 'survey';
  public relatedId!: number;
  public title!: string;
}

LinkedContent.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM('discussion', 'learningModule', 'survey'),
      allowNull: false,
    },
    relatedId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'linked_contents',
    timestamps: false,
  }
);

export default LinkedContent;