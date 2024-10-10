import mongoose, { Document, Schema } from 'mongoose';

export interface RewardDocument extends Document {
  campaign: mongoose.Types.ObjectId;
  title: string;
  description: string;
  amount: number;
}

const RewardSchema: Schema = new Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    title: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<RewardDocument>('Reward', RewardSchema);