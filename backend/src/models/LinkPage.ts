// models/LinkPage.ts

import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';

@Table({
  tableName: 'link_pages',
  timestamps: true,
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
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    defaultValue: 'default',
  })
  theme!: string;

  @BelongsTo(() => User)
  user!: User;
}

export default LinkPage;
