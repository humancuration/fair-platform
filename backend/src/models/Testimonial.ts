import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'testimonials',
  timestamps: true,
  indexes: [
    {
      fields: ['userId'],
    },
    {
      fields: ['status'],
    },
  ],
})
export class Testimonial extends Model<Testimonial> {
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
    type: DataType.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  content!: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  fediversePostUrl?: string;

  @Column({
    type: DataType.ENUM('draft', 'pending', 'approved', 'rejected'),
    defaultValue: 'pending',
  })
  status!: 'draft' | 'pending' | 'approved' | 'rejected';

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  date!: Date;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  imageUrl?: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  rating!: number;

  @BelongsTo(() => User)
  user!: User;
}

export default Testimonial;
