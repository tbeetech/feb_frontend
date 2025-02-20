import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    products: [],
    total: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const existingProduct = state.products.find(
                (product) => product._id === action.payload._id
            );
            
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.products.push({ ...action.payload, quantity: 1 });
            }
            
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },
        decrementQuantity: (state, action) => {
            const existingProduct = state.products.find(
                (product) => product._id === action.payload._id
            );
            
            if (existingProduct) {
                if (existingProduct.quantity === 1) {
                    state.products = state.products.filter(
                        (product) => product._id !== action.payload._id
                    );
                } else {
                    existingProduct.quantity -= 1;
                }
            }
            
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },
        removeFromCart: (state, action) => {
            state.products = state.products.filter(
                (product) => product._id !== action.payload._id
            );
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },
        clearCart: (state) => {
            state.products = [];
            state.total = 0;
        },
    }
});

export const { addToCart, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;