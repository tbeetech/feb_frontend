import { createSlice } from "@reduxjs/toolkit";
import authApi from "./authApi";

const savedToken = localStorage.getItem('token');
const savedUser = localStorage.getItem('user');

const initialState = {
    user: savedUser ? JSON.parse(savedUser) : null,
    token: savedToken || null,
    isAuthenticated: !!savedToken,
    loading: false
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setCredentials: (state, { payload }) => {
            state.user = payload.user;
            state.token = payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', payload.token);
            localStorage.setItem('user', JSON.stringify(payload.user));
        },
        checkAuth: (state) => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            state.token = token;
            state.user = user ? JSON.parse(user) : null;
            state.isAuthenticated = !!token;
        }
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(
                authApi.endpoints.loginUser.matchFulfilled,
                (state, { payload }) => {
                    if (payload.token && payload.user) {
                        state.token = payload.token;
                        state.user = payload.user;
                        state.isAuthenticated = true;
                        localStorage.setItem('token', payload.token);
                        localStorage.setItem('user', JSON.stringify(payload.user));
                    }
                }
            )
            .addMatcher(
                authApi.endpoints.registerUser.matchFulfilled,
                (state, { payload }) => {
                    if (payload.token && payload.user) {
                        state.token = payload.token;
                        state.user = payload.user;
                        state.isAuthenticated = true;
                        localStorage.setItem('token', payload.token);
                        localStorage.setItem('user', JSON.stringify(payload.user));
                    }
                }
            );
    }
});

export const { logout, setCredentials, checkAuth } = authSlice.actions;
export default authSlice.reducer;