import { Table, Column, Model, DataType, BelongsToMany, HasMany } from 'sequelize-typescript';
import { Group } from '../group/Group';
import { User } from '../user/User';
import { MetricsTracking } from '../analytics/MetricsTracking';

@Table
export class DataCollective extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  dataSharingPolicies!: {
    purpose: string;
    retentionPeriod: number;
    environmentalImpact: {
      storageFootprint: number;
      processingEfficiency: number;
      bandwidthUsage: number;
    };
    ethicalGuidelines: string[];
    beneficiaries: string[];
    impactMetrics: string[];
  };

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  sustainabilityGoals!: string[];

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  resourceAllocation!: {
    computationalResources: {
      allocated: number;
      used: number;
      efficiency: number;
    };
    storageResources: {
      allocated: number;
      used: number;
      efficiency: number;
    };
    bandwidthResources: {
      allocated: number;
      used: number;
      efficiency: number;
    };
  };

  @BelongsToMany(() => Group, 'collective_groups')
  groups!: Group[];

  @BelongsToMany(() => User, 'collective_members')
  members!: User[];

  @HasMany(() => DataStream)
  dataStreams!: DataStream[];

  @HasMany(() => ImpactMetric)
  impactMetrics!: ImpactMetric[];
}

@Table
export class DataStream extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.ENUM('INBOUND', 'OUTBOUND', 'BIDIRECTIONAL'),
    allowNull: false,
  })
  direction!: 'INBOUND' | 'OUTBOUND' | 'BIDIRECTIONAL';

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  dataSchema!: {
    fields: {
      name: string;
      type: string;
      purpose: string;
      sensitivity: 'LOW' | 'MEDIUM' | 'HIGH';
    }[];
    validation: any;
  };

  @Column({
    type: DataType.JSONB,
    allowNull: false,
  })
  processingMetrics!: {
    energyUsage: number;
    processingTime: number;
    resourceEfficiency: number;
    environmentalImpact: number;
  };
}

@Table
export class ImpactMetric extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @Column({
    type: DataType.FLOAT,
    allowNull: false,
  })
  value!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  unit!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  category!: 'ENVIRONMENTAL' | 'SOCIAL' | 'EFFICIENCY';

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  context?: {
    methodology: string;
    assumptions: string[];
    limitations: string[];
    recommendations: string[];
  };
}
