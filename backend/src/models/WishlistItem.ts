import mongoose, { Document, Schema } from 'mongoose';

export interface IWishlistItem extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  isPublic: boolean;
  createdAt: Date;
}

const WishlistItemSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  isPublic: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IWishlistItem>('WishlistItem', WishlistItemSchema);