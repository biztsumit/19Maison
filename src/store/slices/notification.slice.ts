import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { apiClient } from '@/api/client';
import { Endpoints } from '@/constants/api';
import type { AppNotification, NotificationState, ApiResponse } from '@/types';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  pushToken: null,
  isLoading: false,
};

export const fetchNotificationsThunk = createAsyncThunk('notifications/fetch', async () => {
  const res = await apiClient.get<ApiResponse<AppNotification[]>>(Endpoints.notifications.list);
  return res.data.data;
});

export const markAsReadThunk = createAsyncThunk('notifications/read', async (id: string) => {
  await apiClient.put(Endpoints.notifications.read(id));
  return id;
});

export const markAllAsReadThunk = createAsyncThunk('notifications/readAll', async () => {
  await apiClient.put(Endpoints.notifications.readAll);
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setPushToken(state, action: PayloadAction<string>) {
      state.pushToken = action.payload;
    },
    addNotification(state, action: PayloadAction<AppNotification>) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchNotificationsThunk.fulfilled, (state, action) => {
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(markAsReadThunk.fulfilled, (state, action) => {
        const n = state.notifications.find(n => n.id === action.payload);
        if (n && !n.isRead) {
          n.isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      .addCase(markAllAsReadThunk.fulfilled, state => {
        state.notifications.forEach(n => { n.isRead = true; });
        state.unreadCount = 0;
      });
  },
});

export const { setPushToken, addNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
