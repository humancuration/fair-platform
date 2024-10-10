import mongoose, { Schema, Document } from 'mongoose';

export interface ISurveyResponse extends Document {
  survey: mongoose.Types.ObjectId;
  respondent: mongoose.Types.ObjectId;
  answers: Array<{
    question: mongoose.Types.ObjectId;
    answer: string | string[];
  }>;
  createdAt: Date;
}

const SurveyResponseSchema: Schema = new Schema({
  survey: { type: Schema.Types.ObjectId, ref: 'Survey', required: true },
  respondent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{
    question: { type: Schema.Types.ObjectId, required: true },
    answer: { type: Schema.Types.Mixed, required: true }
  }]
}, { timestamps: true });

export default mongoose.model<ISurveyResponse>('SurveyResponse', SurveyResponseSchema);