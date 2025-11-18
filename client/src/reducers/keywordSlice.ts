import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Keywords } from '../../../shared/types/keywords';
import axios from '../utils/apiClient';
import type { AxiosResponse } from 'axios';

interface KeywordState {
  keywords: Keywords | null;
  loading: boolean;
  error: string | null;
}

interface KeywordsApiResponse {
  keywords: Keywords;
}

const initialState: KeywordState = {
  keywords: null,
  loading: false,
  error: null,
};

export const fetchKeywords = createAsyncThunk(
  'keywords/fetchKeywords',
  async (_, { rejectWithValue }) => {
    try {
      const response: AxiosResponse<KeywordsApiResponse> = await axios.get('/keywords');
      return { keywords: response.data.keywords };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch keywords'
      );
    }
  }
);

export const keywordSlice = createSlice({
  name: 'keywords',
  initialState,
  reducers: {
    clearKeywords: (state) => {
      state.keywords = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchKeywords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKeywords.fulfilled, (state, action) => {
        state.loading = false;
        state.keywords = action.payload.keywords;
        state.error = null;
      })
      .addCase(fetchKeywords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearKeywords } = keywordSlice.actions;

export const selectKeywords = (state: RootState) => state.keywords.keywords;
export const selectKeywordsLoading = (state: RootState) => state.keywords.loading;
export const selectKeywordsError = (state: RootState) => state.keywords.error;
export default keywordSlice.reducer;
