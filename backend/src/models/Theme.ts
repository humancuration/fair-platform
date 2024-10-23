import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modules/user/User';

@Table({
  tableName: 'themes',
  timestamps: true,
})
export class Theme extends Model<Theme> {
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
    defaultValue: 'light',
  })
  mode!: 'light' | 'dark' | 'system';

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  customColors!: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
  };

  @Column({
    type: DataType.JSON,
    defaultValue: {},
  })
  preferences!: {
    fontSize?: string;
    fontFamily?: string;
    borderRadius?: string;
    animations?: boolean;
  };

  @BelongsTo(() => User)
  user!: User;
}
