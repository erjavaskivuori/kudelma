import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import {
  createCard,
  type bookForCard,
  type artworkForCard,
  type recipeForCard
} from './cardService';

type FavoriteSelectionState = {
  selecting: boolean;
  book: bookForCard | null;
  artwork: artworkForCard | null;
  recipe: recipeForCard | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: FavoriteSelectionState = {
  selecting: false,
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
    setSelecting(state, action: PayloadAction<boolean>) {
      state.selecting = action.payload;
      if (!action.payload) { // Clear selection when exiting selecting mode
        state.book = null;
        state.artwork = null;
        state.recipe = null;
      }
    },
    setBook(state, action: PayloadAction<bookForCard>) {
      state.book = action.payload;
    },
    setArtwork(state, action: PayloadAction<artworkForCard>) {
      state.artwork = action.payload;
    },
    setRecipe(state, action: PayloadAction<recipeForCard>) {
      state.recipe = action.payload;
    },
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

export const { setSelecting, setBook, setArtwork, setRecipe } = favoriteSelectionSlice.actions;
export default favoriteSelectionSlice.reducer;
