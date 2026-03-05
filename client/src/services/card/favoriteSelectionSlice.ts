import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { createCard } from './cardService';
import type { Book } from '../../../../shared/types/books';
import type { Artwork } from '../../../../shared/types/art';
import type { Recipe } from '../../../../shared/types/recipe';

type FavoriteSelectionState = {
  book: Book | null;
  artwork: Artwork | null;
  recipe: Recipe | null;
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
    selection: { book: Book; artwork: Artwork; recipe: Recipe },
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
    setBook(state, action: PayloadAction<Book>) {
      state.book = action.payload;
    },
    unsetBook(state) {
      state.book = null;
    },
    setArtwork(state, action: PayloadAction<Artwork>) {
      state.artwork = action.payload;
    },
    unsetArtwork(state) {
      state.artwork = null;
    },
    setRecipe(state, action: PayloadAction<Recipe>) {
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
