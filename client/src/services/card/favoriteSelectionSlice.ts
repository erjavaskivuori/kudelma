import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  createCard,
  type bookForCard,
  type artworkForCard,
  type recipeForCard
} from './cardService';

type FavoriteSelectionState = {
  book: bookForCard | null;
  artwork: artworkForCard | null;
  recipe: recipeForCard | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: FavoriteSelectionState = {
  book: null,
  artwork: null,
  recipe: null,
  status: 'idle',
  error: null,
};

export const createCardAsync = createAsyncThunk(
  'cards/create',
  async (
    selection: { book: bookForCard; artwork: artworkForCard; recipe: recipeForCard },
    { rejectWithValue }
  ) => {
    try {
      await createCard(selection);
    } catch (error: unknown) {
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as { response?: { data?: { error?: string } } };
        return rejectWithValue(axiosError.response?.data?.error ?? 'Failed to create card');
      }
      return rejectWithValue('Failed to create card');
    }
  }
);

const favoriteSelectionSlice = createSlice({
  name: 'favoriteSelection',
  initialState,
  reducers: {
    setBook(state, action: PayloadAction<bookForCard>) {
      state.book = action.payload;
    },
    unsetBook(state) {
      state.book = null;
    },
    setArtwork(state, action: PayloadAction<artworkForCard>) {
      state.artwork = action.payload;
    },
    unsetArtwork(state) {
      state.artwork = null;
    },
    setRecipe(state, action: PayloadAction<recipeForCard>) {
      state.recipe = action.payload;
    },
    unsetRecipe(state) {
      state.recipe = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCardAsync.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createCardAsync.fulfilled, (state) => {
        state.status = 'succeeded';
        state.book = null;
        state.artwork = null;
        state.recipe = null;
      })
      .addCase(createCardAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = (action.payload as string) ?? 'Failed to create card';
      });
  },
});

export const {
  setBook,
  unsetBook,
  setArtwork,
  unsetArtwork,
  setRecipe,
  unsetRecipe
} = favoriteSelectionSlice.actions;
export default favoriteSelectionSlice.reducer;
