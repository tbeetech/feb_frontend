import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useUpdateProductMutation, 
  useDeleteProductMutation,
  useFetchProductByIdQuery 
} from '../../redux/features/products/productsApi';
import { CATEGORIES } from '../../constants/categoryConstants';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const { data, isLoading: isFetching, error } = useFetchProductByIdQuery(id);
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  
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
    orderType: 'regular'
  };
  
  const [formData, setFormData] = useState(initialState);
  
  // Get subcategories based on selected category
  const subcategories = selectedCategory && CATEGORIES[selectedCategory.toUpperCase()]?.subcategories || [];
  
  // Load product data when available
  useEffect(() => {
    if (data?.product) {
      const product = data.product;
      setFormData({
        name: product.name || '',
        category: product.category || '',
        subcategory: product.subcategory || '',
        description: product.description || '',
        price: product.price || '',
        oldPrice: product.oldPrice || '',
        image: product.image || '',
        rating: product.rating || 0,
        orderType: product.orderType || 'regular'
      });
      
      if (product.category) {
        setSelectedCategory(product.category);
      }
    }
  }, [data]);
  
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
    } else {
      setFormData({
        ...formData,
        [name]: name === 'price' || name === 'oldPrice' || name === 'rating' 
          ? Number(value) 
          : value
      });
    }
  };
  
  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      console.log('Submitting update with data:', { id, ...formData });
      const resultAction = await updateProduct({ 
        id,
        ...formData
      }).unwrap();
      
      if (resultAction.success || resultAction.message === 'Product updated successfully') {
        toast.success('Product updated successfully!');
        navigate('/admin/manage-products');
      } else {
        toast.error(resultAction.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Update failed:', error);
      toast.error(`Update failed: ${error.data?.message || error.message || 'Unknown error'}`);
    }
  };
  
  const handleDelete = async () => {
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }
    
    try {
      const resultAction = await deleteProduct(id).unwrap();
      
      if (resultAction.success) {
        toast.success('Product deleted successfully!');
        navigate('/admin/manage-products');
      } else {
        toast.error(resultAction.message || 'Failed to delete product');
      }
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.data?.message || 'Failed to delete product');
    }
  };
  
  const cancelDelete = () => {
    setDeleteConfirmation(false);
  };
  
  if (isFetching) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading product data...</div>;
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-red-600">
        Error loading product data. Please try again.
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Edit Product</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name*
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a category</option>
                {Object.keys(CATEGORIES).map((category) => (
                  <option key={category} value={category.toLowerCase()}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                id="subcategory"
                name="subcategory"
                value={formData.subcategory}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!selectedCategory || !subcategories.length}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((subcat) => (
                  <option key={subcat.value} value={subcat.value}>
                    {subcat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (₦)*
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                required
              />
            </div>
            
            <div>
              <label htmlFor="oldPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Old Price (₦) - Optional
              </label>
              <input
                type="number"
                id="oldPrice"
                name="oldPrice"
                value={formData.oldPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
          </div>
          
          {/* Image URL */}
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
              Image URL*
            </label>
            <input
              type="text"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description*
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          
          {/* Order Type */}
          <div>
            <label htmlFor="orderType" className="block text-sm font-medium text-gray-700 mb-1">
              Order Type
            </label>
            <select
              id="orderType"
              name="orderType"
              value={formData.orderType}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="regular">Regular</option>
              <option value="preorder">Pre-Order</option>
            </select>
          </div>
          
          {/* Preview Toggle */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={togglePreview}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-all"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
            
            {/* Delete Button */}
            {!deleteConfirmation ? (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                disabled={isDeleting}
              >
                Delete Product
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-all"
                  disabled={isDeleting}
                >
                  Confirm Delete
                </button>
              </div>
            )}
          </div>
          
          {/* Product Preview */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-50 p-6 rounded-lg shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-4">Product Preview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  {formData.image ? (
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full h-64 object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500">No image provided</span>
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-xl font-semibold">{formData.name || 'Product Name'}</h4>
                  <div className="mt-2">
                    {formData.oldPrice > 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="font-bold">₦{formData.price.toLocaleString()}</span>
                        <span className="text-gray-500 line-through text-sm">
                          ₦{formData.oldPrice.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <div className="font-bold">
                        ₦{formData.price ? formData.price.toLocaleString() : '0'}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-sm text-gray-700">
                    <p>{formData.description || 'No description provided'}</p>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm font-medium text-gray-700">Category: </span>
                    <span className="text-sm text-gray-600">
                      {formData.category ? formData.category.charAt(0).toUpperCase() + formData.category.slice(1) : 'None'}
                    </span>
                  </div>
                  {formData.subcategory && (
                    <div className="mt-1">
                      <span className="text-sm font-medium text-gray-700">Subcategory: </span>
                      <span className="text-sm text-gray-600">{formData.subcategory}</span>
                    </div>
                  )}
                  <div className="mt-1">
                    <span className="text-sm font-medium text-gray-700">Order Type: </span>
                    <span className="text-sm text-gray-600">
                      {formData.orderType === 'preorder' ? 'Pre-Order' : 'Regular'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-all"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct; 