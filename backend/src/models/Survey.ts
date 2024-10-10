import mongoose, { Schema, Document } from 'mongoose';
import { LinkedContent } from '../interfaces/LinkedContent';

export interface ISurvey extends Document {
  title: string;
  description: string;
  questions: Array<any>;
  creator: mongoose.Types.ObjectId;
  collaborators: mongoose.Types.ObjectId[];
  linkedContent: LinkedContent[];
}

const SurveySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  questions: { type: [Schema.Types.Mixed], required: true },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  linkedContent: [{
    type: { type: String, enum: ['discussion', 'learningModule', 'survey'], required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    title: { type: String, required: true }
  }]
});

export default mongoose.model<ISurvey>('Survey', SurveySchema);