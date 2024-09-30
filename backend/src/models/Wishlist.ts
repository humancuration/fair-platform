import { Model, DataTypes, Sequelize } from 'sequelize';

export interface IWishlistItem {
  name: string;
  description: string;
  link?: string;
  price?: number;
  imageUrl?: string;
}

export class PrivateWishlist extends Model<PrivateWishlist> {
  public id!: number;
  public userId!: number;
  public items!: IWishlistItem[];

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
        },
        items: {
          type: DataTypes.JSON,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'PrivateWishlist',
      }
    );
  }
}

export class PublicWishlist extends Model<PublicWishlist> {
  public id!: number;
  public userId!: number;
  public items!: IWishlistItem[];
  public fediverseProfile?: string;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
        },
        items: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        fediverseProfile: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'PublicWishlist',
      }
    );
  }
}

export class CommunityWishlistItem extends Model<CommunityWishlistItem> {
  public id!: number;
  public userId!: number;
  public item!: IWishlistItem;
  public contributors!: number[];
  public totalContributions!: number;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
        },
        item: {
          type: DataTypes.JSON,
          allowNull: false,
        },
        contributors: {
          type: DataTypes.JSON,
          allowNull: false,
          defaultValue: [],
        },
        totalContributions: {
          type: DataTypes.FLOAT,
          allowNull: false,
          defaultValue: 0,
        },
      },
      {
        sequelize,
        modelName: 'CommunityWishlistItem',
      }
    );
  }
}

export const initWishlistModels = (sequelize: Sequelize) => {
  PrivateWishlist.initialize(sequelize);
  PublicWishlist.initialize(sequelize);
  CommunityWishlistItem.initialize(sequelize);
};