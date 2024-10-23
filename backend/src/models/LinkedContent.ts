import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'linked_contents',
  timestamps: true,
  indexes: [
    {
      fields: ['type', 'relatedId'],
    },
  ],
})
export class LinkedContent extends Model<LinkedContent> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.ENUM('discussion', 'learningModule', 'survey', 'resource'),
    allowNull: false,
  })
  type!: 'discussion' | 'learningModule' | 'survey' | 'resource';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  relatedId!: number;

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdById!: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isActive!: boolean;

  @BelongsTo(() => User, 'createdById')
  createdBy!: User;
}

export default LinkedContent;
