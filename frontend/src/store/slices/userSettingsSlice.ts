import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserSettingsState {
  notificationsEnabled: boolean;
  theme: string;
  // Add other settings as needed
}

const initialState: UserSettingsState = {
  notificationsEnabled: true,
  theme: 'light',
};

const userSettingsSlice = createSlice({
  name: 'userSettings',
  initialState,
  reducers: {
    toggleNotifications(state) {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload;
    },
    // Add other reducers as needed
  },
});

export const { toggleNotifications, setTheme } = userSettingsSlice.actions;
export default userSettingsSlice.reducer;