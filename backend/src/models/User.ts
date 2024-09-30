import mongoose, { Document, Schema } from 'mongoose';
import { IWishlistItem } from './WishlistItem';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  wishlist: mongoose.Types.ObjectId[] | IWishlistItem[];
  fediverseProfile?: string;
  // ... other fields
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  wishlist: [{ type: Schema.Types.ObjectId, ref: 'WishlistItem' }],
  fediverseProfile: { type: String, default: '' },
  // ... other fields
});

export default mongoose.model<IUser>('User', UserSchema);
