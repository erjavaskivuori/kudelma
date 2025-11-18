import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './reducers/weatherSlice';
import keywordReducer from './reducers/keywordSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    keywords: keywordReducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
