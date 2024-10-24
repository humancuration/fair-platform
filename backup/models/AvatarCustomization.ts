import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../../backend/src/modules/user/User';

@Table({
  tableName: 'avatar_customizations',
  timestamps: true,
})
export class AvatarCustomization extends Model<AvatarCustomization> {
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
  baseImage!: string;

  @Column({
    type: DataType.JSON,
    defaultValue: [],
  })
  accessories!: string[];

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  colors!: Record<string, string>;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  outfit?: string;

  @Column({
    type: DataType.ENUM('happy', 'sad', 'excited', 'angry', 'neutral'),
    defaultValue: 'neutral',
  })
  mood!: 'happy' | 'sad' | 'excited' | 'angry' | 'neutral';

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  xp!: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  level!: number;

  @BelongsTo(() => User)
  user!: User;
}
