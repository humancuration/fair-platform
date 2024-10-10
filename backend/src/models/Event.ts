import mongoose, { Document, Schema } from 'mongoose';

export interface EventDocument extends Document {
  group: mongoose.Types.ObjectId;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    group: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

export default mongoose.model<EventDocument>('Event', EventSchema);