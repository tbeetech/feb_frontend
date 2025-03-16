import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const BillingDetails = ({ isPreOrder = false, cartItems, total }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    address: '',
    city: '',
    state: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
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
      navigate('/checkout', { 
        state: { 
          billingDetails: formData,
          cartItems,
          total,
          isPreOrder,
          orderDate: formatDate(orderDate),
          deliveryDate: formatDate(deliveryDate)
        } 
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl font-serif">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-10 rounded-lg shadow-xl border border-gray-200"
      >
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 tracking-wide">Billing Information</h1>
        
        <div className="w-full max-w-md mx-auto mb-8">
          <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                First Name*
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.firstName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                Last Name*
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.lastName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number*
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address*
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City*
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                State*
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-md focus:ring-1 focus:ring-gold focus:outline-none transition-all duration-200 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state}</p>}
            </div>
          </div>
          
          <div className="w-full max-w-md mx-auto mt-8 mb-4">
            <div className="h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent"></div>
          </div>
          
          <div className="mt-8">
            <button
              type="submit"
              className="w-full py-4 bg-gold text-white rounded-md hover:bg-gold/90 transition-colors duration-300 font-medium tracking-wide shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              {isPreOrder ? 'Continue with Pre-Order' : 'Proceed to Checkout'}
            </button>
          </div>
          
          <div className="text-center mt-4 text-sm text-gray-500">
            <p>Your information is secure and will only be used for this order</p>
            {isPreOrder && (
              <p className="mt-2 text-primary font-medium">
                Pre-order items will be delivered within 14 days
              </p>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default BillingDetails; 