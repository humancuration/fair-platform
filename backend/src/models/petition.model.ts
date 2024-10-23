import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, Index } from 'sequelize-typescript';
import { Group } from '../modules/group/Group';
import { User } from '../modules/user/User';
import { Vote } from './vote.model';

@Table({
  tableName: 'petitions',
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
export class Petition extends Model<Petition> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Group)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  groupId!: number;

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
  createdBy!: number;

  @Column({
    type: DataType.ENUM('Open', 'Closed', 'Approved', 'Rejected'),
    allowNull: false,
    defaultValue: 'Open',
  })
  status!: 'Open' | 'Closed' | 'Approved' | 'Rejected';

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  closingDate?: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  requiredVotes!: number;

  @BelongsTo(() => Group)
  group!: Group;

  @BelongsTo(() => User)
  creator!: User;

  @HasMany(() => Vote)
  votes!: Vote[];
}

export default Petition;
