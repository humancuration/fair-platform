import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { UserAchievement } from './UserAchievement';

@Table({
  tableName: 'achievements',
  timestamps: true,
})
export class Achievement extends Model<Achievement> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  description!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  icon!: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  points!: number;

  @HasMany(() => UserAchievement)
  userAchievements!: UserAchievement[];
}
