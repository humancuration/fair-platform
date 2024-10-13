import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'campaigns',
  timestamps: true, // if you want createdAt and updatedAt fields
})
export class Campaign extends Model<Campaign> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number; // Added id field

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string; // Changed from name to title

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  description!: string; // Added description field

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  goalAmount!: number; // Added goalAmount field

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  currentAmount!: number; // Added currentAmount field

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  creatorId!: number; // Added creatorId field

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt!: Date; // Added createdAt field

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  updatedAt!: Date; // Added updatedAt field

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  isActive!: boolean; // Merged isActive field
}