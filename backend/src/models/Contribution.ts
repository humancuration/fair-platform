import mongoose, { Document, Schema } from 'mongoose';

export interface ContributionDocument extends Document {
  campaign: mongoose.Types.ObjectId;
  contributor: mongoose.Types.ObjectId;
  amount: number;
  reward?: string;
  paymentIntentId: string;
  createdAt: Date;
}

const ContributionSchema: Schema = new Schema(
  {
    campaign: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    contributor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    reward: { type: String },
    paymentIntentId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ContributionDocument>('Contribution', ContributionSchema);