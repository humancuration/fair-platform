import mongoose, { Document, Schema } from 'mongoose';

export interface GroupTypeDocument extends Document {
  name: string;
  description: string;
  levelOfFormality: 'Informal' | 'Formal';
  scope: 'Local' | 'Regional' | 'Global';
}

const GroupTypeSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  levelOfFormality: { type: String, enum: ['Informal', 'Formal'], required: true },
  scope: { type: String, enum: ['Local', 'Regional', 'Global'], required: true },
});

export default mongoose.model<GroupTypeDocument>('GroupType', GroupTypeSchema);