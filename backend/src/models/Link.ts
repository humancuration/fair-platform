import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { LinkPage } from './LinkPage';

@Table({
  tableName: 'links',
  timestamps: true,
  indexes: [
    {
      fields: ['linkPageId'],
    },
    {
      fields: ['order'],
    },
  ],
})
export class Link extends Model<Link> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => LinkPage)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  linkPageId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      isUrl: true,
    },
  })
  url!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  order!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  icon?: string;

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  analytics!: {
    clicks: number;
    lastClicked?: Date;
  };

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @BelongsTo(() => LinkPage)
  linkPage!: LinkPage;
}

export default Link;
