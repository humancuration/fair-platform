import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';
import { SurveyResponse } from './SurveyResponse';

@Table({
  tableName: 'surveys',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['groupId'],
    },
    {
      fields: ['createdBy'],
    },
  ],
})
export class Survey extends Model<Survey> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  groupId?: number;

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
    allowNull: false,
  })
  questions!: Array<{
    id: string;
    type: 'text' | 'multipleChoice' | 'checkbox' | 'rating';
    question: string;
    options?: string[];
    required: boolean;
  }>;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @Column({
    type: DataType.ENUM('draft', 'active', 'closed'),
    defaultValue: 'draft',
  })
  status!: 'draft' | 'active' | 'closed';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  closingDate?: Date;

  @BelongsTo(() => Group)
  group?: Group;

  @BelongsTo(() => User)
  creator!: User;

  @HasMany(() => SurveyResponse)
  responses!: SurveyResponse[];
}

export default Survey;
