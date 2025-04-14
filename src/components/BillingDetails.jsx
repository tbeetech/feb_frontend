import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const BillingDetails = ({ isPreOrder = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { products, total, deliveryFee, grandTotal } = useSelector((state) => state.cart);
  
  // Get cart items and total from location state or Redux store
  const cartItems = location.state?.cartItems || products || [];
  
  // Use grandTotal from Redux for consistency across all components
  const cartTotal = isPreOrder ? location.state?.total || total : grandTotal;

  // For debugging
  useEffect(() => {
    console.log("BillingDetails - Location state:", location.state);
    console.log("BillingDetails - Cart items:", cartItems);
    console.log("BillingDetails - Cart total:", cartTotal);
    console.log('Cart state in BillingDetails:', { products, total, deliveryFee, grandTotal });
  }, [location.state, cartItems, cartTotal, products, total, deliveryFee, grandTotal]);
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Nigeria',
    paymentMethod: 'transfer',
    saveInfo: true,
    notes: ''
  });
  
  // Validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Prefill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prevState => ({
        ...prevState,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
      }));
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Mark field as touched on blur
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };
  
  // Validate a single field
  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) error = 'This field is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = 'Email is invalid';
        }
        break;
      case 'phone':
        if (!value.trim()) {
          error = 'Phone number is required';
        } else if (!/^\+?[0-9]{10,15}$/.test(value.replace(/\s/g, ''))) {
          error = 'Phone number is invalid';
        }
        break;
      case 'address':
        if (!value.trim()) error = 'Address is required';
        break;
      case 'city':
        if (!value.trim()) error = 'City is required';
        break;
      case 'state':
        if (!value.trim()) error = 'State is required';
        break;
      case 'zipCode':
        if (!value.trim()) error = 'Zip code is required';
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };
  
  // Validate all fields
  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'state', 'zipCode'];
    let isValid = true;
    let newErrors = {};
    let newTouched = {};
    
    // Mark all fields as touched
    requiredFields.forEach(field => {
      newTouched[field] = true;
      const fieldIsValid = validateField(field, formData[field]);
      if (!fieldIsValid) {
        isValid = false;
        newErrors[field] = errors[field] || `${field} is required`;
      }
    });
    
    setTouched(prev => ({ ...prev, ...newTouched }));
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (validateForm()) {
      // Calculate delivery date based on whether it's a pre-order or regular order
      const orderDate = new Date();
      let deliveryDate;
      
      if (isPreOrder) {
        // 14 days for pre-order
        deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 14);
      } else {
        // 72 hours (3 days) for regular order
        deliveryDate = new Date(orderDate);
        deliveryDate.setDate(deliveryDate.getDate() + 3);
      }
      
      // Format dates as mm/dd/yyyy
      const formatDate = (date) => {
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const year = date.getFullYear();
        return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}`;
      };
      
      // Navigate to checkout with billing details and delivery dates
      setTimeout(() => {
        navigate('/checkout', { 
          state: { 
            billingDetails: formData,
            cartItems: cartItems,
            total: cartTotal,
            isPreOrder,
            orderDate: formatDate(orderDate),
            deliveryDate: formatDate(deliveryDate)
          } 
        });
      }, 800); // Small delay for better UX
    } else {
      setIsSubmitting(false);
      // Scroll to the first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };
  
  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl font-serif">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 md:p-10 rounded-lg shadow-luxury border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-6 text-center font-display text-gray-800 tracking-wide">
          {isPreOrder ? 'Pre-Order Information' : 'Billing Information'}
        </h1>
        
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>
        
        {isPreOrder && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 p-4 bg-gold/10 rounded-md border border-gold/20 text-center"
          >
            <p className="text-sm text-gray-700">
              <span className="font-medium">Pre-Order Notice:</span> Items will be delivered within 14 days from the order date.
            </p>
          </motion.div>
        )}
        
        <motion.form 
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Personal Information */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 font-display text-gray-800 flex items-center">
              <span className="material-icons mr-2 text-gold">person</span>
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.firstName && errors.firstName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="John"
                />
                {touched.firstName && errors.firstName && (
                  <p className="error-message text-red-500 text-xs mt-1">{errors.firstName}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="lastName" className="form-label">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.lastName && errors.lastName ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="Doe"
                />
                {touched.lastName && errors.lastName && (
                  <p className="error-message text-red-500 text-xs mt-1">{errors.lastName}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.email && errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="john.doe@example.com"
                />
                {touched.email && errors.email && (
                  <p className="error-message text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.phone && errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="+234 800 000 0000"
                />
                {touched.phone && errors.phone && (
                  <p className="error-message text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Shipping Address */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 font-display text-gray-800 flex items-center">
              <span className="material-icons mr-2 text-gold">location_on</span>
              Shipping Address
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div className="form-group">
                <label htmlFor="address" className="form-label">Street Address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${touched.address && errors.address ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                  placeholder="123 Main Street"
                />
                {touched.address && errors.address && (
                  <p className="error-message text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="city" className="form-label">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${touched.city && errors.city ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Lagos"
                  />
                  {touched.city && errors.city && (
                    <p className="error-message text-red-500 text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="state" className="form-label">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${touched.state && errors.state ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="Lagos State"
                  />
                  {touched.state && errors.state && (
                    <p className="error-message text-red-500 text-xs mt-1">{errors.state}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="zipCode" className="form-label">Zip/Postal Code</label>
                  <input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`form-input ${touched.zipCode && errors.zipCode ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                    placeholder="100001"
                  />
                  {touched.zipCode && errors.zipCode && (
                    <p className="error-message text-red-500 text-xs mt-1">{errors.zipCode}</p>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="country" className="form-label">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="form-input"
                  >
                    <option value="Nigeria">Nigeria</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Kenya">Kenya</option>
                    <option value="South Africa">South Africa</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Payment Method */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 font-display text-gray-800 flex items-center">
              <span className="material-icons mr-2 text-gold">payment</span>
              Payment Method
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`relative flex flex-col items-center p-4 border rounded-lg cursor-not-allowed opacity-70 transition-all duration-200`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  disabled
                  className="sr-only"
                />
                <span className="material-icons text-2xl mb-2 text-gold">credit_card</span>
                <span className="text-sm font-medium">Credit/Debit Card</span>
                <span className="text-xs text-burgundy mt-1 font-medium">Coming Soon</span>
              </label>
              
              <label className={`relative flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${formData.paymentMethod === 'transfer' ? 'border-gold bg-gold/5' : 'border-gray-200 hover:border-gold/50'}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="transfer"
                  checked={formData.paymentMethod === 'transfer'}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="material-icons text-2xl mb-2 text-gold">account_balance</span>
                <span className="text-sm font-medium">Bank Transfer</span>
                {formData.paymentMethod === 'transfer' && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 bg-gold text-white rounded-full p-1"
                  >
                    <span className="material-icons text-sm">check</span>
                  </motion.div>
                )}
              </label>
            </div>
          </motion.div>
          
          {/* Additional Information */}
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-xl font-semibold mb-4 font-display text-gray-800 flex items-center">
              <span className="material-icons mr-2 text-gold">note_add</span>
              Additional Information
            </h2>
            <div className="form-group">
              <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="form-input"
                placeholder="Special instructions for delivery or any other notes..."
              ></textarea>
            </div>
            
            <div className="mt-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="saveInfo"
                  checked={formData.saveInfo}
                  onChange={handleChange}
                  className="w-4 h-4 text-gold focus:ring-gold rounded"
                />
                <span className="text-sm text-gray-700">Save my information for faster checkout next time</span>
              </label>
            </div>
          </motion.div>
          
          {/* Order Summary */}
          <motion.div variants={itemVariants} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 font-display text-gray-800 flex items-center">
              <span className="material-icons mr-2 text-gold">receipt</span>
              Order Summary
            </h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({cartItems.length}):</span>
                <span className="font-medium">₦{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-medium">₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold text-lg text-gold">₦{cartTotal.toLocaleString()}</span>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {isPreOrder ? (
                <p>By proceeding, you agree to our pre-order terms. Items will be delivered within 14 days.</p>
              ) : (
                <p>Standard delivery within 3 business days. Express delivery options available at checkout.</p>
              )}
            </div>
          </motion.div>
          
          {/* Submit Button */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              variants={buttonVariants}
              initial="idle"
              whileHover="hover"
              whileTap="tap"
              className="w-full md:w-auto px-8 py-3 bg-black text-white font-medium rounded-md shadow-md hover:bg-gray-800 transition-colors duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Checkout
                  <span className="material-icons ml-2">arrow_forward</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default BillingDetails; 