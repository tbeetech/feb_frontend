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
  const { data: product, error, isFetching } = useFetchProductByIdQuery(id);
  
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
    stockQuantity: 0,
    deliveryTimeFrame: {
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
    }
  };
  
  const [formData, setFormData] = useState(initialState);
  
  // Get subcategories based on the selected category
  const getSubcategories = () => {
    if (!formData.category) return [];
    
    const categoryData = CATEGORIES[formData.category.toUpperCase()];
    if (!categoryData || !categoryData.subcategories) return [];
    
    return categoryData.subcategories.map(sub => {
      if (typeof sub === 'string') {
        return {
          value: sub,
          label: sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        };
      }
      return sub; // If it's already an object with value/label
    });
  };
  
  const subcategories = getSubcategories();
  
  // Load product data when available
  useEffect(() => {
    if (product?.product) {
      const productData = product.product;
      setFormData({
        name: productData.name || '',
        category: productData.category || '',
        subcategory: productData.subcategory || '',
        description: productData.description || '',
        price: productData.price || '',
        oldPrice: productData.oldPrice || '',
        image: productData.image || '',
        rating: productData.rating || 0,
        sizeType: productData.sizeType || 'none',
        sizes: productData.sizes || [],
        stockStatus: productData.stockStatus || 'In Stock',
        stockQuantity: productData.stockQuantity || 0,
        deliveryTimeFrame: {
          startDate: productData.deliveryTimeFrame?.startDate 
            ? new Date(productData.deliveryTimeFrame.startDate).toISOString().split('T')[0] 
            : new Date().toISOString().split('T')[0],
          endDate: productData.deliveryTimeFrame?.endDate 
            ? new Date(productData.deliveryTimeFrame.endDate).toISOString().split('T')[0]
            : new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
        }
      });
    }
  }, [product]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
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
        sizes: formData.sizes || [],
      };
      
      // Set delivery time frame based on stock status
      if (formData.stockStatus === 'In Stock') {
        // For In Stock items: Delivery in 74 hours (3 days)
        const startDate = new Date();
        const endDate = new Date();
        endDate.setHours(endDate.getHours() + 74);
        
        productData.deliveryTimeFrame = {
          startDate: startDate,
          endDate: endDate
        };
      } else if (formData.stockStatus === 'Pre Order') {
        // For Pre Order items: Delivery in 14 working days
        const startDate = new Date();
        const endDate = new Date();
        
        // Add 14 working days (excluding weekends)
        let workingDaysAdded = 0;
        while (workingDaysAdded < 14) {
          endDate.setDate(endDate.getDate() + 1);
          // Skip weekends (0 = Sunday, 6 = Saturday)
          if (endDate.getDay() !== 0 && endDate.getDay() !== 6) {
            workingDaysAdded++;
          }
        }
        
        productData.deliveryTimeFrame = {
          startDate: startDate,
          endDate: endDate
        };
      } else {
        // For Out of Stock or any other status, use the form's delivery time frame
        productData.deliveryTimeFrame = {
          startDate: new Date(formData.deliveryTimeFrame.startDate),
          endDate: new Date(formData.deliveryTimeFrame.endDate)
        };
      }
      
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
                {Object.values(CATEGORIES).map((category) => (
                  <option key={category.name} value={category.name}>
                    {category.name.charAt(0).toUpperCase() + category.name.slice(1)}
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
                disabled={!formData.category || subcategories.length === 0}
              >
                <option value="">Select a subcategory</option>
                {subcategories.map((subcategory) => (
                  <option key={subcategory.value} value={subcategory.value}>
                    {subcategory.label}
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
          
          {/* Add Delivery Time Frame fields - Only show for Out of Stock */}
          {formData.stockStatus === 'Out of Stock' && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Delivery Time Frame</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    name="deliveryTimeFrame.startDate"
                    value={formData.deliveryTimeFrame.startDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        deliveryTimeFrame: {
                          ...formData.deliveryTimeFrame,
                          startDate: e.target.value
                        }
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    name="deliveryTimeFrame.endDate"
                    value={formData.deliveryTimeFrame.endDate}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        deliveryTimeFrame: {
                          ...formData.deliveryTimeFrame,
                          endDate: e.target.value
                        }
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={formData.deliveryTimeFrame.startDate}
                  />
                </div>
              </div>
              
              {formData.stockStatus !== 'Out of Stock' && (
                <p className="mt-2 text-sm text-gray-500 italic">
                  {formData.stockStatus === 'In Stock' 
                    ? 'In Stock products will be delivered within 74 hours (3 days).' 
                    : 'Pre Order products will be delivered within 14 working days.'}
                </p>
              )}
            </div>
          )}
          
          {(formData.stockStatus === 'In Stock' || formData.stockStatus === 'Pre Order') && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-sm text-gray-600">
                {formData.stockStatus === 'In Stock' 
                  ? 'In Stock products will be delivered within 74 hours (3 days).' 
                  : 'Pre Order products will be delivered within 14 working days.'}
              </p>
            </div>
          )}
          
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