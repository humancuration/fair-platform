import { Model, DataTypes, Sequelize } from 'sequelize';

export interface CommunityWishlistAttributes {
  id: number;
  productId: string;
  name: string;
  image: string;
  price: number;
  highlighted: boolean;
  date: Date;
}

export class CommunityWishlist extends Model<CommunityWishlistAttributes> implements CommunityWishlistAttributes {
  public id!: number;
  public productId!: string;
  public name!: string;
  public image!: string;
  public price!: number;
  public highlighted!: boolean;
  public date!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        productId: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        image: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        price: {
          type: DataTypes.FLOAT,
          allowNull: false,
        },
        highlighted: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        date: {
          type: DataTypes.DATE,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'CommunityWishlist',
      }
    );
  }
}

export default CommunityWishlist;