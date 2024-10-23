import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'minsites',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['slug'],
      unique: true,
    },
  ],
})
export class Minsite extends Model<Minsite> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  })
  slug!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  theme!: {
    colors: Record<string, string>;
    fonts: Record<string, string>;
    layout: string;
  };

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  sections!: Array<{
    type: string;
    content: Record<string, any>;
    order: number;
  }>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isPublished!: boolean;

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  seo!: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };

  @BelongsTo(() => User)
  user!: User;
}

export default Minsite;
