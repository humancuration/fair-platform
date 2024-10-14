// backend/src/models/Grant.ts
import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'grants',
  timestamps: true,
})
export class Grant extends Model<Grant> {
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
  applicantName!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  projectDescription!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  amountRequested!: number;

  @Column({
    type: DataType.FLOAT,
    defaultValue: 0,
  })
  amountGranted!: number;
}

export default Grant;
