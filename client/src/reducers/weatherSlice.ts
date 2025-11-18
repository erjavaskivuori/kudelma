import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { WeatherData, Coordinates } from '../../../shared/types/weather';
import axios from '../utils/apiClient';
import type { AxiosResponse } from 'axios';

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
}

interface WeatherApiResponse {
  weather: WeatherData;
}

const initialState: WeatherState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchWeatherData = createAsyncThunk(
  'weather/fetchWeatherData',
  async (coords: Coordinates, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<WeatherApiResponse> = await axios.get('/weather', {
        params: { latitude: coords.lat, longitude: coords.lon }
      });
      return { weather: response.data.weather, coords };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch weather data'
      );
    }
  }
);

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    clearWeatherData: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.weather;
        state.error = null;
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWeatherData } = weatherSlice.actions;

export const selectWeatherData = (state: RootState) => state.weather.data;
export const selectWeatherLoading = (state: RootState) => state.weather.loading;
export const selectWeatherError = (state: RootState) => state.weather.error;

export default weatherSlice.reducer;