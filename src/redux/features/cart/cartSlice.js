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
            // Check if product with same ID and size exists
            const existingProductIndex = state.products.findIndex(
                (product) => 
                    product._id === action.payload._id && 
                    product.selectedSize === action.payload.selectedSize
            );
            
            if (existingProductIndex >= 0) {
                // If product exists, increment quantity
                state.products[existingProductIndex].quantity += 1;
            } else {
                // Otherwise add new product
                state.products.push({ ...action.payload, quantity: 1 });
            }
            
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },
        decrementQuantity: (state, action) => {
            // Find product with same ID and size
            const existingProductIndex = state.products.findIndex(
                (product) => 
                    product._id === action.payload._id && 
                    product.selectedSize === action.payload.selectedSize
            );
            
            if (existingProductIndex >= 0) {
                if (state.products[existingProductIndex].quantity === 1) {
                    // Remove if quantity is 1
                    state.products = state.products.filter(
                        (_, index) => index !== existingProductIndex
                    );
                } else {
                    // Otherwise decrement quantity
                    state.products[existingProductIndex].quantity -= 1;
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