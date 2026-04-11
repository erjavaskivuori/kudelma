import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type NotificationAction = {
  label: string;
  to?: string;
};

export type NotificationModal = {
  title: string;
  message: string;
  primaryAction?: NotificationAction;
  secondaryAction?: NotificationAction;
};

type NotificationState = {
  modal: NotificationModal | null;
};

const initialState: NotificationState = {
  modal: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    showModal(state, action: PayloadAction<NotificationModal>) {
      state.modal = action.payload;
    },
    closeModal(state) {
      state.modal = null;
    },
  },
});

export const { showModal, closeModal } = notificationSlice.actions;
export default notificationSlice.reducer;
