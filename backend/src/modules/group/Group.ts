import { Table, Column, Model, DataType, ForeignKey, BelongsTo, HasMany, BelongsToMany } from 'sequelize-typescript';
import { User } from '../user/User';
import { Event } from '../../models/Event';
import { GroupMember } from './GroupMember';
import { GroupType } from './GroupType';

@Table({
  tableName: 'groups',
  timestamps: true,
})
export class Group extends Model<Group> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string;

  @ForeignKey(() => GroupType)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  groupTypeId!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  motto?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  vision?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  profilePicture?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  coverPhoto?: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  pinnedAnnouncement?: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location?: string;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  tags?: string[];

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  resourceCredits!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  categoryBadge!: string;

  @BelongsTo(() => GroupType)
  groupType!: GroupType;

  @BelongsTo(() => User, 'createdBy')
  creator!: User;

  @HasMany(() => Event)
  events!: Event[];

  @BelongsToMany(() => User, () => GroupMember)
  members!: User[];

  @BelongsToMany(() => User, () => GroupMember)
  delegates!: User[];

  @Column({
    type: DataType.ENUM('Public', 'Private', 'Secret'),
    allowNull: false,
    defaultValue: 'Public',
  })
  visibility!: 'Public' | 'Private' | 'Secret';

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isVerified!: boolean;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  reputationScore!: number;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  customEmojis?: { [key: string]: string };

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  socialLinks?: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  achievements?: {
    id: string;
    name: string;
    description: string;
    dateEarned: Date;
  }[];

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: true,
  })
  guidelines?: string[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  allowsPolls!: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  allowsComments!: boolean;
}

export default Group;
