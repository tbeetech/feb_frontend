import { useState } from 'react';
import { useAddProductMutation } from '../../redux/features/products/productsApi';
import { CATEGORIES } from '../../constants/categoryConstants';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import ProductSizeInput from '../../components/ProductSizeInput';

const ProductUpload = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  
  // Get the current user from Redux store
  const { user } = useSelector((state) => state.auth);
  
  // Form initial state
  const initialState = {
    name: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    oldPrice: '',
    image: '',
    rating: 0,
    orderType: 'regular',
    sizeType: 'none',
    sizes: [],
    stockStatus: 'In Stock',
    stockQuantity: 0
  };
  
  const [formData, setFormData] = useState(initialState);
  
  // Get subcategories based on selected category
  const subcategories = selectedCategory && CATEGORIES[selectedCategory.toUpperCase()]?.subcategories || [];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      setSelectedCategory(value);
      // Reset subcategory when category changes
      setFormData({
        ...formData,
        [name]: value,
        subcategory: ''
      });
    } else if (name === 'sizeType') {
      // Reset sizes when size type changes
      const updatedFormData = {
        ...formData,
        [name]: value,
        sizes: [] // Clear sizes when changing size type
      };
      setFormData(updatedFormData);
    } else {
      setFormData({
        ...formData,
        [name]: name === 'price' || name === 'oldPrice' || name === 'rating' 
          ? Number(value) 
          : value
      });
    }
  };
  
  const handleSizesChange = (sizes) => {
    // Just update the form data
    setFormData({
      ...formData,
      sizes
    });
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!user || !user._id) {
        toast.error('You must be logged in to upload products');
        return;
      }
      
      // Format product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        rating: Number(formData.rating) || 0,
        author: user._id,  // Add the author ID from the current user
        sizeType: formData.sizeType || 'none',
        sizes: formData.sizes || []
      };
      
      // Remove empty fields
      Object.keys(productData).forEach(key => {
        if (productData[key] === '' || productData[key] === undefined) {
          delete productData[key];
        }
      });
      
      console.log('Submitting product with data:', productData);
      
      // Submit product to API
      const response = await addProduct(productData).unwrap();
      
      if (response) {
        toast.success('Product uploaded successfully!');
        alert("Product uploaded");
        setFormData(initialState);
        setSelectedCategory('');
      }
    } catch (error) {
      console.error('Error uploading product:', error);
      toast.error(error?.data?.message || 'Failed to upload product');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Upload New Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div className="form-group">
            <label htmlFor="name" className="block mb-2 font-medium">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="Enter product name"
            />
          </div>
          
          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="category" className="block mb-2 font-medium">
                Category *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Category</option>
                {Object.values(CATEGORIES).map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="subcategory" className="block mb-2 font-medium">
                Subcategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={!selectedCategory || subcategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.value} value={subcategory.value}>
                    {subcategory.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Description */}
          <div className="form-group">
            <label htmlFor="description" className="block mb-2 font-medium">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              rows="4"
              placeholder="Enter product description"
            ></textarea>
          </div>
          
          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="price" className="block mb-2 font-medium">
                Price (₦) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
                min="0"
                placeholder="Enter price"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="oldPrice" className="block mb-2 font-medium">
                Old Price (₦)
              </label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                placeholder="Enter old price (if applicable)"
              />
            </div>
          </div>
          
          {/* Image URL */}
          <div className="form-group">
            <label htmlFor="image" className="block mb-2 font-medium">
              Image URL *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="Enter image URL"
            />
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Stock Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="stockStatus" className="block mb-2 font-medium">
                Stock Status
              </label>
              <select
                id="stockStatus"
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre Order">Pre Order</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="stockQuantity" className="block mb-2 font-medium">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                placeholder="Enter stock quantity"
              />
            </div>
          </div>
          
          {/* Rating and Order Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-group">
              <label htmlFor="rating" className="block mb-2 font-medium">
                Initial Rating (0-5)
              </label>
              <input
                type="number"
                id="rating"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                min="0"
                max="5"
                step="0.1"
                placeholder="Enter initial rating"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="orderType" className="block mb-2 font-medium">
                Order Type
              </label>
              <select
                id="orderType"
                name="orderType"
                value={formData.orderType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="regular">Regular</option>
                <option value="contact-to-order">Contact to Order</option>
              </select>
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="form-group mt-6">
            <label htmlFor="sizeType" className="block mb-2 font-medium">
              Size Type
            </label>
            <select
              id="sizeType"
              name="sizeType"
              value={formData.sizeType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="none">No Size (Not Applicable)</option>
              <option value="roman">Roman (XS, S, M, L, XL)</option>
              <option value="numeric">Numeric (1-20)</option>
            </select>
            
            {formData.sizeType !== 'none' && (
              <ProductSizeInput 
                sizeType={formData.sizeType} 
                sizes={formData.sizes} 
                onChange={handleSizesChange} 
              />
            )}
          </div>
          
          {/* Preview Button */}
          <div className="flex justify-center space-x-4">
            <button
              type="button"
              onClick={togglePreview}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              {showPreview ? "Hide Preview" : "Show Preview"}
            </button>
            
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors disabled:bg-gray-400"
            >
              {isLoading ? "Uploading..." : "Upload Product"}
            </button>
          </div>
        </form>
        
        {/* Product Preview */}
        {showPreview && (
          <div className="mt-10 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Product Preview</h2>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="product__card relative group">
                <div className="relative aspect-square overflow-hidden w-full max-w-xs mx-auto">
                  {formData.image ? (
                    <img 
                      src={formData.image} 
                      alt={formData.name || "Product preview"} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/300?text=Invalid+URL";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                      No image provided
                    </div>
                  )}
                  
                  {formData.orderType !== 'contact-to-order' ? (
                    <button className="absolute left-1/2 -translate-x-1/2 bottom-4 
                                      px-6 py-2 bg-black/70 text-white
                                      transition-colors duration-300 
                                      hover:bg-gold rounded-md
                                      whitespace-nowrap
                                      border-2 border-gold">
                      Add to Cart
                    </button>
                  ) : (
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-4 
                                   px-6 py-2 bg-primary text-white rounded-md
                                   whitespace-nowrap text-center">
                      Contact to Order
                    </div>
                  )}
                </div>
                
                <div className="product__card__content mt-4">
                  <h4 className="text-lg font-semibold truncate">
                    {formData.name || "Product Name"}
                  </h4>
                  <p className="text-primary font-medium">
                    {formData.orderType === 'contact-to-order' ? (
                      'Price on Request'
                    ) : (
                      <>
                        ₦{Number(formData.price || 0).toLocaleString()} 
                        {formData.oldPrice && Number(formData.oldPrice) > 0 && (
                          <s className="ml-2 text-gray-500">
                            ₦{Number(formData.oldPrice).toLocaleString()}
                          </s>
                        )}
                      </>
                    )}
                  </p>
                  <div className="text-yellow-400">
                    {'★'.repeat(Math.floor(formData.rating || 0))}
                    {'☆'.repeat(5 - Math.floor(formData.rating || 0))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-sm border-t pt-4">
                <p><strong>Category:</strong> {formData.category || "Not selected"}</p>
                <p><strong>Subcategory:</strong> {formData.subcategory || "Not selected"}</p>
                <p className="mt-2"><strong>Description:</strong></p>
                <p className="text-gray-600">{formData.description || "No description provided"}</p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ProductUpload; 