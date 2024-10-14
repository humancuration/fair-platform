import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'linked_contents',
  timestamps: false,
})
export class LinkedContent extends Model<LinkedContent> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.ENUM('discussion', 'learningModule', 'survey'),
    allowNull: false,
  })
  type!: 'discussion' | 'learningModule' | 'survey';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  relatedId!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;
}

export default LinkedContent;
