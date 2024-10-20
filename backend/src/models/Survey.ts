import { Table, Column, Model, DataType, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';
import { LinkedContent } from './LinkedContent';

@Table({
  tableName: 'surveys',
  timestamps: true,
})
export class Survey extends Model<Survey> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
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
  questions!: any[];

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creatorId!: number;

  @BelongsTo(() => User)
  creator!: User;

  @BelongsToMany(() => User, 'SurveyCollaborators')
  collaborators!: User[];

  @BelongsToMany(() => LinkedContent, 'SurveyLinkedContents')
  linkedContent!: LinkedContent[];
}

export default Survey;
