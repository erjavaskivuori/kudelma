import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import type { Artwork } from '../../../shared/types/art';
import axios from '../utils/apiClient';
import type { AxiosResponse } from 'axios';

interface ArtworksState {
  artworks: Artwork[] | null;
  loading: boolean;
  error: string | null;
}

interface ArtApiResponse {
  artworks: Artwork[];
}

const initialState: ArtworksState = {
  artworks: null,
  loading: false,
  error: null,
};

export const fetchArtworks = createAsyncThunk(
  'artworks/fetchArtworks',
  async (keywords: string[], { rejectWithValue }) => {
    try {
      const response: AxiosResponse<ArtApiResponse> = await axios.get('/art', {
        params: { keywords: keywords.join(',')}
      });
      return { artworks: response.data.artworks };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch artworks'
      );
    }
  }
);

export const artworkSlice = createSlice({
  name: 'artworks',
  initialState,
  reducers: {
    clearArtworks: (state) => {
      state.artworks = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload.artworks;
        state.error = null;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearArtworks } = artworkSlice.actions;

export const selectArtworks = (state: RootState) => state.artworks.artworks;
export const selectArtworksLoading = (state: RootState) => state.artworks.loading;
export const selectArtworksError = (state: RootState) => state.artworks.error;
export default artworkSlice.reducer;
