import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { User } from '../modulesb/user/User';

@Table({
  tableName: 'minsites',
  timestamps: true,
})
export class Minsite extends Model<Minsite> {
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
  content!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isIn: [['blank', 'blog', 'portfolio', 'landing']],
    },
  })
  template!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
    validate: {
      len: [0, 10000],
    },
  })
  customCSS?: string;

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  seoMetadata?: object;

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    defaultValue: [],
  })
  components!: string[];

  @Column({
    type: DataType.ARRAY(DataType.JSON),
    defaultValue: [],
  })
  versions!: object[];

  @BelongsTo(() => User)
  user!: User;
}

export default Minsite;
