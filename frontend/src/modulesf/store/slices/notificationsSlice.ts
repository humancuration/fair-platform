import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: number;
  message: string;
  read: boolean;
  timestamp: string;
}

interface NotificationsState {
  notifications: Notification[];
}

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
    },
    markAsRead(state, action: PayloadAction<number>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification) {
        notification.read = true;
      }
    },
    // Add other reducers as needed
  },
});

export const { addNotification, markAsRead } = notificationsSlice.actions;
export default notificationsSlice.reducer;