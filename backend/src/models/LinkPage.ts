// models/LinkPage.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'link_pages',
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
export class LinkPage extends Model<LinkPage> {
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
    validate: {
      notEmpty: true,
    },
  })
  title!: string;

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
    defaultValue: 'default',
  })
  theme!: string;

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  customization!: Record<string, any>;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isPublic!: boolean;

  @BelongsTo(() => User)
  user!: User;

  // You might want to add a HasMany relationship to a Links model if you have one
  // @HasMany(() => Link)
  // links!: Link[];
}

export default LinkPage;
