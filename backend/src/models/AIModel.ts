import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { AIJob } from './AIJob';

@Table({
  tableName: 'ai_models',
  timestamps: true,
  indexes: [
    {
      fields: ['status'],
    },
    {
      fields: ['type'],
    },
  ],
})
export class AIModel extends Model<AIModel> {
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
    validate: {
      notEmpty: true,
    },
  })
  name!: string;

  @Column({
    type: DataType.ENUM('inference', 'training', 'general'),
    allowNull: false,
  })
  type!: 'inference' | 'training' | 'general';

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @Column({
    type: DataType.ENUM('active', 'maintenance', 'deprecated'),
    defaultValue: 'active',
  })
  status!: 'active' | 'maintenance' | 'deprecated';

  @Column({
    type: DataType.JSON,
    allowNull: false,
  })
  capabilities!: {
    maxBatchSize: number;
    supportedFormats: string[];
    requiredResources: {
      minMemory: number;
      minCPU: number;
      gpuRequired: boolean;
    };
  };

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  metrics!: {
    averageLatency: number;
    successRate: number;
    lastUpdated: Date;
  };

  @HasMany(() => AIJob)
  jobs!: AIJob[];
}

export default AIModel;
