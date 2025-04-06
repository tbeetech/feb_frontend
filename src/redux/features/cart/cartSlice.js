import { createSlice } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'

const initialState = {
    products: [],
    total: 0,
}

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            // Check if product with same ID, size, and color exists
            const existingProductIndex = state.products.findIndex(
                (product) => 
                    product._id === action.payload._id && 
                    product.selectedSize === action.payload.selectedSize &&
                    product.selectedColor === action.payload.selectedColor
            );
            
            if (existingProductIndex >= 0) {
                // If product exists, increment quantity
                state.products[existingProductIndex].quantity += 1;
                // Show a toast
                toast.success('Product quantity increased');
            } else {
                // Otherwise add new product
                state.products.push({ ...action.payload, quantity: 1 });
                // Show a toast
                toast.success('Added to cart');
            }
            
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },
        decrementQuantity: (state, action) => {
            // Find product with same ID, size, and color
            const existingProductIndex = state.products.findIndex(
                (product) => 
                    product._id === action.payload._id && 
                    product.selectedSize === action.payload.selectedSize &&
                    product.selectedColor === action.payload.selectedColor
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
                
                // Recalculate total
                state.total = state.products.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
            }
        },
        removeFromCart: (state, action) => {
            state.products = state.products.filter(
                (product) => 
                    !(product._id === action.payload._id && 
                      product.selectedSize === action.payload.selectedSize &&
                      product.selectedColor === action.payload.selectedColor)
            );
            
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
        },
        clearCart: (state) => {
            state.products = [];
            state.total = 0;
        }
    }
});

export const { addToCart, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;