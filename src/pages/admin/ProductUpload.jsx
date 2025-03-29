import { useState } from 'react';
import { useAddProductMutation } from '../../redux/features/products/productsApi';
import { CATEGORIES } from '../../constants/categoryConstants';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import ProductSizeInput from '../../components/ProductSizeInput';
import ColorPalette from '../../components/ColorPalette';
import { PRODUCT_COLORS } from '../../constants/colorConstants';

const ProductUpload = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showPreview, setShowPreview] = useState(false);
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
    orderType: 'regular',
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
  
  // Get subcategories based on selected category
  const subcategories = selectedCategory && CATEGORIES[selectedCategory.toUpperCase()]?.subcategories || [];
  
  // Format subcategories for display
  const formattedSubcategories = subcategories.map(sub => {
    if (typeof sub === 'string') {
      return {
        value: sub,
        label: sub.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      };
    }
    return sub;
  });
  
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
  
  const handleColorSelect = (color) => {
    setColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      }
      return [...prev, color];
    });
  };
  
  const handleGalleryUrlChange = (e) => {
    setCurrentGalleryUrl(e.target.value);
  };
  
  const addImageToGallery = () => {
    if (!currentGalleryUrl.trim()) return;
    
    setGallery([...gallery, currentGalleryUrl]);
    setCurrentGalleryUrl('');
  };
  
  const removeImageFromGallery = (indexToRemove) => {
    setGallery(gallery.filter((_, index) => index !== indexToRemove));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.subcategory || !formData.price) {
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
      await addProduct({
        ...formData,
        colors: formattedColors,
        gallery: gallery // Add gallery to product submission
      }).unwrap();
      
      toast.success('Product added successfully');
      setFormData(initialState);
      setColors([]);
      setGallery([]);
    } catch (error) {
      toast.error(error.data?.message || 'Failed to add product');
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
                disabled={!selectedCategory || formattedSubcategories.length === 0}
              >
                <option value="">Select Subcategory</option>
                {formattedSubcategories.map((subcategory) => (
                  <option 
                    key={subcategory.value} 
                    value={subcategory.value}
                  >
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
          
          {/* Main Image URL */}
          <div className="form-group">
            <label htmlFor="image" className="block mb-2 font-medium">
              Main Image URL *
            </label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
              placeholder="Enter main image URL"
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
          
          {/* Gallery Images */}
          <div className="form-group">
            <label className="block mb-2 font-medium">
              Gallery Images
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="url"
                id="galleryImage"
                value={currentGalleryUrl}
                onChange={handleGalleryUrlChange}
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter gallery image URL"
              />
              <button
                type="button"
                onClick={addImageToGallery}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
            
            {gallery.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Gallery Preview:</h3>
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
                        onClick={() => removeImageFromGallery(index)}
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
          
          {/* Add Delivery Time Frame fields - Only show for Out of Stock */}
          {formData.stockStatus === 'Out of Stock' && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Delivery Time Frame</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="startDate" className="block mb-2 font-medium">
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
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="endDate" className="block mb-2 font-medium">
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
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
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
                        onClick={() => handleColorSelect(color)}
                        title="Click to remove"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
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
                  
                  {/* Show gallery indicator if gallery images exist */}
                  {gallery.length > 0 && (
                    <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                      +{gallery.length} more
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