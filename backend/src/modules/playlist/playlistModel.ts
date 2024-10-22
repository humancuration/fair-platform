import { Model, DataTypes } from 'sequelize';
import sequelize from '../../config/database';

interface MediaItem {
  id: string;
  type: 'music' | 'video' | 'social' | 'podcast';
  title: string;
  url: string;
}

class Playlist extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public mediaItems!: MediaItem[];
  public ownerId!: string;
  public groupId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Playlist.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    mediaItems: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: [],
    },
    ownerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'playlists',
  }
);

export default Playlist;
