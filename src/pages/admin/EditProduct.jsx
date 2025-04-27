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
import ColorPalette from '../../components/ColorPalette';
import { PRODUCT_COLORS } from '../../constants/colorConstants';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const { data: product, error, isFetching } = useFetchProductByIdQuery(id, {
    skip: !id // Skip fetching if no ID is provided
  });
  
  // If no ID is provided, redirect to manage products page
  useEffect(() => {
    if (!id) {
      navigate('/admin/manage-products');
      toast.info('Please select a product to edit');
    }
  }, [id, navigate]);
  
  const [showPreview, setShowPreview] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [colors, setColors] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [currentGalleryUrl, setCurrentGalleryUrl] = useState('');
  
  // Form initial state
  const initialState = {
    name: '',
    category: '',
    subcategory: '',
    description: '',
    price: '',
    oldPrice: '',
    image: '',
    gallery: [],
    rating: 0,
    sizeType: 'none',
    sizes: [],
    stockStatus: 'In Stock',
    stockQuantity: 0,
    colors: [],
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
      return sub;
    });
  };
  
  const subcategories = getSubcategories();
  
  // Load product data when available
  useEffect(() => {
    if (product?.product) {
      const productData = product.product;
      setFormData({
        ...initialState,
        ...productData,
        price: productData.price || '',
        oldPrice: productData.oldPrice || '',
        rating: productData.rating || 0,
        sizeType: productData.sizeType || 'none',
        sizes: productData.sizes || [],
        stockStatus: productData.stockStatus || 'In Stock',
        stockQuantity: productData.stockQuantity || 0,
        colors: productData.colors || [],
        gallery: productData.gallery || [],
        deliveryTimeFrame: productData.deliveryTimeFrame || initialState.deliveryTimeFrame
      });
      
      // Set initial colors
      if (productData.colors?.length > 0) {
        setColors(productData.colors.map(c => c.hexCode));
      }
      
      // Set initial gallery
      if (productData.gallery?.length > 0) {
        setGallery(productData.gallery);
      }
    }
  }, [product]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Set appropriate size type based on category
      let newSizeType = 'none';
      
      // If shoes category is selected, set size type to footwear
      if (value.toLowerCase() === 'shoes') {
        newSizeType = 'footwear';
      }
      
      setFormData({
        ...formData,
        [name]: value,
        subcategory: '',
        sizeType: newSizeType // Auto-set size type based on category
      });
    } else if (name === 'sizeType') {
      // Reset sizes when size type changes
      setFormData({
        ...formData,
        [name]: value,
        sizes: []
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
  
  const handleSizesChange = (sizes) => {
    setFormData({
      ...formData,
      sizes
    });
  };
  
  const handleColorSelect = (color) => {
    setColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      }
      return [...prev, color];
    });
  };
  
  const togglePreview = (e) => {
    if (e) e.preventDefault();
    setShowPreview(!showPreview);
  };
  
  const handleGalleryUrlChange = (e) => {
    setCurrentGalleryUrl(e.target.value);
  };
  
  const addImageToGallery = (e) => {
    if (e) e.preventDefault();
    if (!currentGalleryUrl.trim()) return;
    
    setGallery([...gallery, currentGalleryUrl]);
    setCurrentGalleryUrl('');
  };
  
  const removeImageFromGallery = (indexToRemove, e) => {
    if (e) e.preventDefault();
    setGallery(gallery.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.price) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Format colors for submission
    const formattedColors = colors.map(color => ({
      name: color,
      hexCode: color,
      imageUrl: '' // You can add image upload for each color variant if needed
    }));

    try {
      // Create the formatted product data
      const productData = {
        ...formData,
        colors: formattedColors,
        gallery: gallery,
        images: gallery, // Add compatibility for both fields
      };
      
      const result = await updateProduct({ 
        id: id,
        productData
      }).unwrap();
      
      toast.success('Product updated successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { 
          backgroundColor: '#3f8e47', 
          color: 'white',
          padding: '16px',
          borderRadius: '8px'
        },
        icon: '✅'
      });
      
      // Add slight delay to ensure toast is visible before navigation
      setTimeout(() => {
        navigate('/admin/manage-products');
      }, 1000);
    } catch (error) {
      console.error('Failed to update product:', error);
      toast.error('Failed to update product');
    }
  };
  
  const handleDelete = async (e) => {
    if (e) e.preventDefault();
    
    if (!deleteConfirmation) {
      setDeleteConfirmation(true);
      return;
    }
    
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted successfully!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: { 
          backgroundColor: '#e74c3c', 
          color: 'white',
          padding: '16px',
          borderRadius: '8px'
        },
        icon: '🗑️'
      });
      setTimeout(() => {
      navigate('/admin/manage-products');
      }, 1500);
    } catch (error) {
      console.error('Delete failed:', error);
      toast.error(error.data?.message || 'Failed to delete product', {
        position: "top-center",
        autoClose: 5000,
      });
    }
  };
  
  const cancelDelete = (e) => {
    if (e) e.preventDefault();
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-morphism p-8 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-semibold mb-6 text-center">Edit Product</h1>
        
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
              <option value="footwear">Footwear (30-50)</option>
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
              Main Image URL*
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
            {formData.image && (
              <div className="mt-2">
                <img 
                  src={formData.image} 
                  alt="Main product image" 
                  className="w-32 h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                  }}
                />
              </div>
            )}
          </div>
          
          {/* Gallery Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gallery Images
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                id="galleryImage"
                value={currentGalleryUrl}
                onChange={handleGalleryUrlChange}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter gallery image URL"
              />
              <button
                type="button"
                onClick={(e) => addImageToGallery(e)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {gallery.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Gallery Images:</h3>
                <div className="flex flex-wrap gap-2">
                  {gallery.map((imageUrl, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={imageUrl} 
                        alt={`Gallery ${index + 1}`} 
                        className="w-20 h-20 object-cover rounded-md border"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                        }}
                      />
                      <button
                        type="button"
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => removeImageFromGallery(index, e)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                    min={formData.deliveryTimeFrame.startDate}
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Show delivery time info for In Stock and Pre Order */}
          {(formData.stockStatus === 'In Stock' || formData.stockStatus === 'Pre Order') && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-full ${formData.stockStatus === 'In Stock' ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${formData.stockStatus === 'In Stock' ? 'text-green-600' : 'text-blue-600'}`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className={`font-medium ${formData.stockStatus === 'In Stock' ? 'text-green-800' : 'text-blue-800'}`}>
                    Delivery Information
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {formData.stockStatus === 'In Stock' 
                      ? 'In Stock products will be delivered within 3 business days.' 
                      : 'Pre Order products will be delivered within 14 working days.'}
                  </p>
                </div>
              </div>
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
          
          {/* Color Selection */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Available Colors
            </label>
            <div className="flex flex-col space-y-2">
              <ColorPalette
                colors={PRODUCT_COLORS}
                onColorSelect={handleColorSelect}
                selectedColor={colors[colors.length - 1]}
              />
              {colors.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Selected Colors</h4>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-md border border-gray-300 cursor-pointer"
                        style={{ backgroundColor: color }}
                        onClick={(e) => {
                          e.preventDefault(); // Prevent form submission
                          handleColorSelect(color);
                        }}
                        title="Click to remove"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Preview Toggle */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={(e) => togglePreview(e)}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-all"
            >
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
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
                    <div className="relative">
                    <img
                      src={formData.image}
                      alt={formData.name}
                      className="w-full h-64 object-cover rounded"
                    />
                      {/* Show gallery indicator if gallery images exist */}
                      {gallery.length > 0 && (
                        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          +{gallery.length} more
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded">
                      <span className="text-gray-500">No image provided</span>
                    </div>
                  )}
                  
                  {/* Show gallery thumbnails in preview */}
                  {gallery.length > 0 && (
                    <div className="mt-4 flex overflow-x-auto space-x-2 py-2">
                      {gallery.map((imageUrl, index) => (
                        <img 
                          key={index}
                          src={imageUrl} 
                          alt={`Thumbnail ${index + 1}`} 
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0 border border-gray-200"
                        />
                      ))}
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
          
          {/* Submit Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-all"
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update Product'}
            </button>
            
            {!deleteConfirmation ? (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-all"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            ) : (
              <div className="flex flex-col md:flex-row gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-600 text-white px-8 py-3 rounded-md hover:bg-red-700 transition-all"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
                <button
                  type="button"
                  onClick={cancelDelete}
                  className="bg-gray-300 text-gray-800 px-8 py-3 rounded-md hover:bg-gray-400 transition-all"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditProduct;