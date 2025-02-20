import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../redux/features/auth/authApi';
import authReducer from '../redux/features/auth/authSlice';
import cartReducer from '../redux/features/cart/cartSlice';

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        cart: cartReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});
