import mongoose, { Document, Schema } from 'mongoose';

export interface UserSettings {
  allowSearchAnalytics: boolean;
  allowBehavioralTracking: boolean;
  dataRetentionPeriod: number;
  anonymizeData: boolean;
}

export interface UserDocument extends Document {
  email: string;
  password: string;
  role: string;
  settings: UserSettings;
  getPublicProfile: () => any;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
  settings: {
    allowSearchAnalytics: { type: Boolean, default: false },
    allowBehavioralTracking: { type: Boolean, default: false },
    dataRetentionPeriod: { type: Number, default: 365 },
    anonymizeData: { type: Boolean, default: false }
  }
});

UserSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

export default mongoose.model<UserDocument>('User', UserSchema);
