import { createSlice } from '@reduxjs/toolkit'

// Load initial state from localStorage if available
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('cartState');
    if (serializedState === null) {
      return {
        products: [],
        total: 0,
        deliveryFee: 8800,
        grandTotal: 0,
      };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return {
      products: [],
      total: 0,
      deliveryFee: 8800,
      grandTotal: 0,
    };
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('cartState', serializedState);
  } catch (err) {
    // Handle write errors
    console.error('Error saving cart state:', err);
  }
};

const initialState = loadState();

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const itemToAdd = action.payload;
            
            // Validate payload
            if (!itemToAdd || !itemToAdd._id) {
                console.error('Invalid item to add to cart:', itemToAdd);
                return;
            }
            
            // Find existing product with same ID, size, and color
            const existingProductIndex = state.products.findIndex(
                (product) => 
                    product._id === itemToAdd._id && 
                    product.selectedSize === itemToAdd.selectedSize &&
                    product.selectedColor === itemToAdd.selectedColor
            );
            
            if (existingProductIndex >= 0) {
                // Check stock limit if it exists
                if (itemToAdd.stockQuantity && 
                    state.products[existingProductIndex].quantity >= itemToAdd.stockQuantity) {
                    return;
                }
                // Increment quantity if exists
                state.products[existingProductIndex].quantity += 1;
            } else {
                // Add new item with quantity 1
                state.products.unshift({ ...itemToAdd, quantity: 1 });
            }
            
            // Recalculate totals
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            state.grandTotal = state.total + state.deliveryFee;
            
            // Save state to localStorage
            saveState(state);
        },
        decrementQuantity: (state, action) => {
            const itemToDecrement = action.payload;
            
            // Find product with same ID, size, and color
            const existingProductIndex = state.products.findIndex(
                (product) => 
                    product._id === itemToDecrement._id && 
                    product.selectedSize === itemToDecrement.selectedSize &&
                    product.selectedColor === itemToDecrement.selectedColor
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
                
                // Recalculate totals
                state.total = state.products.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                );
                state.grandTotal = state.total + state.deliveryFee;
                
                // Save state to localStorage
                saveState(state);
            }
        },
        removeFromCart: (state, action) => {
            const itemToRemove = action.payload;
            if (!itemToRemove || !itemToRemove._id) {
                console.error('Invalid item to remove from cart:', itemToRemove);
                return;
            }
            
            // Remove product matching ID, size, and color
            state.products = state.products.filter(
                product => 
                    !(product._id === itemToRemove._id && 
                    product.selectedSize === itemToRemove.selectedSize &&
                    product.selectedColor === itemToRemove.selectedColor)
            );
            
            // Recalculate totals
            state.total = state.products.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            );
            state.grandTotal = state.total + state.deliveryFee;
            
            // Save state to localStorage
            saveState(state);
        },
        clearCart: (state) => {
            state.products = [];
            state.total = 0;
            state.grandTotal = state.deliveryFee;
            
            // Clear localStorage
            localStorage.removeItem('cartState');
        }
    }
});

export const { addToCart, decrementQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;