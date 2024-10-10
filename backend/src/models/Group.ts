import mongoose, { Document, Schema } from 'mongoose';
import { GroupTypeDocument } from './GroupType';

export interface GroupDocument extends Document {
  name: string;
  description: string;
  groupType: GroupTypeDocument['_id'];
  profilePicture: string;
  categoryBadge: string;
  members: mongoose.Types.ObjectId[];
  delegates: mongoose.Types.ObjectId[];
  events: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    groupType: { type: Schema.Types.ObjectId, ref: 'GroupType', required: true },
    profilePicture: { type: String, default: '' },
    categoryBadge: { type: String, required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    delegates: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
  },
  { timestamps: true }
);

export default mongoose.model<GroupDocument>('Group', GroupSchema);