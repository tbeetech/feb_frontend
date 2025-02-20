import { configureStore } from '@reduxjs/toolkit';
import { authApi } from '../redux/features/auth/authApi';
// ...other imports...

export const store = configureStore({
    reducer: {
        [authApi.reducerPath]: authApi.reducer,
        // ...other reducers...
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware),
});
