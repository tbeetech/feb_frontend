import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
  loading: false,
  error: null
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const product = action.payload;
      if (!state.favorites.find(item => item._id === product._id)) {
        state.favorites.push(product);
      }
    },
    removeFromFavorites: (state, action) => {
      const productId = action.payload;
      state.favorites = state.favorites.filter(item => item._id !== productId);
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  addToFavorites,
  removeFromFavorites,
  clearFavorites,
  setLoading,
  setError
} = favoritesSlice.actions;

export default favoritesSlice.reducer; 