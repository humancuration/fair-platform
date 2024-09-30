import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  read: boolean;
  date: Date;
}

const NotificationSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
});

export default mongoose.model<INotification>('Notification', NotificationSchema);