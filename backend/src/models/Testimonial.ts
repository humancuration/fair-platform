import mongoose, { Document, Schema } from 'mongoose';

export interface ITestimonial extends Document {
  user: string;
  content: string;
  avatar: string;
  date: Date;
}

const TestimonialSchema: Schema = new Schema({
  user: { type: String, required: true },
  content: { type: String, required: true },
  avatar: { type: String, default: '' },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);