import { Model, DataTypes, Sequelize } from 'sequelize';

export class Testimonial extends Model<Testimonial> {
  public id!: number;
  public userId!: number;
  public content!: string;
  public fediversePostUrl?: string;
  public date!: Date;

  public static initialize(sequelize: Sequelize) {
    this.init(
      {
        userId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: { model: 'Users', key: 'id' },
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        fediversePostUrl: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
      },
      {
        sequelize,
        modelName: 'Testimonial',
      }
    );
  }
}

export const initTestimonialModel = (sequelize: Sequelize) => {
  Testimonial.initialize(sequelize);
};