import mongoose, { Document, Schema } from 'mongoose';

export interface Reward {
  title: string;
  description: string;
  amount: number;
}

export interface CampaignDocument extends Document {
  title: string;
  description: string;
  goal: number;
  amountRaised: number;
  deadline: Date;
  creator: mongoose.Types.ObjectId;
  rewards: Reward[];
  category: string;
  image: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RewardSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
});

const CampaignSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    goal: { type: Number, required: true },
    amountRaised: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rewards: [RewardSchema],
    category: { type: String, required: true },
    image: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<CampaignDocument>('Campaign', CampaignSchema);