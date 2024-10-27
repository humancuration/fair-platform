export interface Event {
  _id: string;
  title: string;
  description: string;
  start: string;
  end?: string;
  location: string;
  color?: string;
  category?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: string;
  };
  attendees?: string[];
  createdBy: {
    username: string;
    avatar?: string;
  };
  reminders?: {
    type: 'email' | 'notification';
    time: number;
  }[];
}

export interface EventFormData {
  title: string;
  description?: string;
  start: Date;
  end?: Date;
  location?: string;
  category?: string;
  color?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number;
    endDate?: Date;
  };
  attendees?: string[];
  reminders?: {
    type: 'email' | 'notification';
    time: number;
  }[];
}
