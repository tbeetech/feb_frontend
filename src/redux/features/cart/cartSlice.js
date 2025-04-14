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
            // Log the item being removed and the current state
            console.log('Cart State Before Removal:', {
                productsCount: state.products.length,
                firstProduct: state.products[0],
                actionPayload: action.payload
            });
            
            // Add more robust checks for the item to remove
            const itemToRemove = action.payload;
            if (!itemToRemove || !itemToRemove._id) {
                console.error('Invalid item to remove from cart:', itemToRemove);
                return;
            }
            
            // Check if the item actually exists in the cart before attempting removal
            const existingItemIndex = state.products.findIndex(product => 
                product._id === itemToRemove._id && 
                product.selectedSize === itemToRemove.selectedSize &&
                product.selectedColor === itemToRemove.selectedColor
            );
            
            if (existingItemIndex === -1) {
                console.warn('Item not found in cart, cannot remove:', itemToRemove);
                return;
            }
            
            // Create a new array without the item to ensure state updates properly
            state.products = state.products.filter(
                (product, index) => index !== existingItemIndex
            );
            
            // Log the updated state
            console.log('Cart State After Removal:', {
                productsCount: state.products.length,
                removedItem: itemToRemove
            });
            
            // Recalculate total
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