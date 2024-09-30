import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityWishlistItem extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  description: string;
  image: string;
  targetAmount: number;
  currentAmount: number;
  date: Date;
}

const CommunityWishlistItemSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  targetAmount: { type: Number, required: true },
  currentAmount: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<ICommunityWishlistItem>('CommunityWishlistItem', CommunityWishlistItemSchema);