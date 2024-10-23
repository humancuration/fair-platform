import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { AIModel } from './AIModel';
import { User } from '../modules/user/User';

@Table({
  tableName: 'ai_jobs',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['priority'],
    },
    {
      fields: ['userId'],
    },
    {
      fields: ['modelId'],
    },
  ],
})
export class AIJob extends Model<AIJob> {
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

  @ForeignKey(() => AIModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  modelId!: number;

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
    type: DataType.ENUM('pending', 'processing', 'completed', 'failed'),
    defaultValue: 'pending',
  })
  status!: 'pending' | 'processing' | 'completed' | 'failed';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
      max: 10,
    },
  })
  priority!: number;

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  config!: {
    inputData: any;
    parameters: Record<string, any>;
    outputFormat?: string;
  };

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  result?: {
    output: any;
    metrics: {
      processingTime: number;
      resourceUsage: Record<string, number>;
    };
  };

  @BelongsTo(() => User)
  user!: User;

  @BelongsTo(() => AIModel)
  model!: AIModel;
}

export default AIJob;
