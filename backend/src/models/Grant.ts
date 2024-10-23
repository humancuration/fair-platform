// backend/src/models/Grant.ts
import { Table, Column, Model, DataType, ForeignKey, BelongsTo, Index } from 'sequelize-typescript';
import { User } from '../modules/user/User';
import { Group } from '../modules/group/Group';

@Table({
  tableName: 'grants',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['applicantId'],
    },
  ],
})
export class Grant extends Model<Grant> {
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
  applicantId!: number;

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
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  projectDescription!: string;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0,
    },
  })
  amountRequested!: number;

  @Column({
    type: DataType.DECIMAL(10, 2),
    defaultValue: 0,
    validate: {
      min: 0,
    },
  })
  amountGranted!: number;

  @Column({
    type: DataType.ENUM('pending', 'approved', 'rejected', 'completed'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'approved' | 'rejected' | 'completed';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  completionDate?: Date;

  @BelongsTo(() => User, 'applicantId')
  applicant!: User;

  @BelongsTo(() => Group)
  group?: Group;
}

export default Grant;
