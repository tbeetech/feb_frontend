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
import ProductSizeInput from '../../components/ProductSizeInput';

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
    sizeType: 'none',
    sizes: [],
    stockStatus: 'In Stock',
    stockQuantity: 0
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
        sizeType: product.sizeType || 'none',
        sizes: product.sizes || [],
        stockStatus: product.stockStatus || 'In Stock',
        stockQuantity: product.stockQuantity || 0
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
    
    // Basic validation
    if (!formData.name || !formData.price || !formData.category || !formData.image) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      // Format product data
      const productData = {
        ...formData,
        price: Number(formData.price),
        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : undefined,
        rating: Number(formData.rating) || 0,
        sizeType: formData.sizeType || 'none',
        sizes: formData.sizes || []
      };
      
      // Remove empty fields
      Object.keys(productData).forEach(key => {
        if (productData[key] === '' || productData[key] === undefined) {
          delete productData[key];
        }
      });
      
      console.log('Updating product with data:', productData, 'Product ID:', id);
      
      // Show immediate feedback to user
      alert("Product updated");
      
      // The RTK Query hook expects { id, ...productData } where productData goes in the body
      // and id is used to construct the URL
      const response = await updateProduct({ 
        id, 
        productData // This will be spread into the body parameter
      }).unwrap();
      
      if (response) {
        toast.success('Product updated successfully!');
        navigate('/admin/manage-products');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error?.data?.message || 'Failed to update product');
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
          
          {/* Size Selection */}
          <div className="form-group mb-4">
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
          
          {/* Stock Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label htmlFor="stockStatus" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Status
              </label>
              <select
                id="stockStatus"
                name="stockStatus"
                value={formData.stockStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre Order">Pre Order</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
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
                  <div className="mt-2">
                    <span className="text-sm font-medium text-gray-700">Available Sizes: </span>
                    <span className="text-sm text-gray-600">
                      {formData.sizes.map(size => (
                        <span key={size} className="px-2 py-1 bg-gray-200 rounded-full text-sm">
                          {size}
                        </span>
                      ))}
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