import { configureStore }  from '@reduxjs/toolkit'
import cartReducer from './features/cart/cartSlice'
import authApi from './features/auth/authApi'
import authReducer from './features/auth/authSlice'
import productsApi from './features/products/productsApi';
import reviewApi from './features/reviews/reviewsApi';
import favoritesReducer from './features/favorites/favoritesSlice';

export const store = configureStore({
    reducer:{
        cart: cartReducer,
        [authApi.reducerPath]: authApi.reducer,
        auth: authReducer,
        [productsApi.reducerPath] : productsApi.reducer,
        [reviewApi.reducerPath]: reviewApi.reducer,
        favorites: favoritesReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware().concat(
            authApi.middleware, 
            productsApi.middleware, 
            reviewApi.middleware
        ),
});