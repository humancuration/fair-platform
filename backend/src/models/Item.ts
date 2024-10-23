import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Inventory } from './Inventory';

@Table({
  tableName: 'items',
  timestamps: true,
  indexes: [
    {
      fields: ['type'],
    },
    {
      fields: ['rarity'],
    },
  ],
})
export class Item extends Model<Item> {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  name!: string;

  @Column({
    type: DataType.ENUM('accessory', 'color', 'base'),
    allowNull: false,
  })
  type!: 'accessory' | 'color' | 'base';

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 100,
    },
  })
  rarity!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  image!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description?: string;

  @HasMany(() => Inventory)
  inventories!: Inventory[];
}

export default Item;
