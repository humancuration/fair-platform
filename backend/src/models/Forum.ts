// backend/src/models/Forum.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'forums',
  timestamps: true,
})
export class Forum extends Model<Forum> {
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
    allowNull: false,
  })
  description!: string;
}

export default Forum;
