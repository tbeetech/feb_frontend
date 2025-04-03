import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getBaseUrl } from '../../../utils/baseURL'

const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/products`,
        credentials: 'include'
    }),
    tagTypes: ["Products"],
    endpoints: (builder) => ({
        fetchAllProducts: builder.query({
            query: (params = {}) => {
                // Debug log
                console.log('API Query Params:', params);
                
                return {
                    url: '/',
                    method: 'GET',
                    params: {
                        limit: params.limit || 10,
                        page: params.page || 1,
                        sort: params.sort || '-createdAt',
                        category: params.category,
                        subcategory: params.subcategory,
                        minPrice: params.minPrice,
                        maxPrice: params.maxPrice
                    }
                };
            },
            transformResponse: (response) => {
                console.log('API Response:', response);
                return response;
            },
            transformErrorResponse: (error) => {
                console.error('API Error:', error);
                return {
                    status: error.status,
                    message: error.data?.message || 'Failed to fetch products',
                    details: error.data?.details || {}
                };
            }
        }),
        fetchProductById: builder.query({
            query: (id) => `/single/${id}`, // Update the endpoint to match backend
            providesTags: (result, error, id) => [{ type: "Products", id }],
            transformErrorResponse: (error) => {
                console.error('API Error when fetching product:', error);
                return {
                    status: error.status,
                    message: error.data?.message || 'Failed to fetch product',
                    details: error.data?.details || {}
                };
            }
        }),
        addProduct: builder.mutation({
            query: (newProduct) => {
                // Ensure data consistency
                const formattedData = {
                    ...newProduct,
                    category: newProduct.category || '', // Ensure category is not undefined
                    deliveryTimeFrame: {
                        startDate: newProduct.deliveryTimeFrame?.startDate || new Date().toISOString().split('T')[0],
                        endDate: newProduct.deliveryTimeFrame?.endDate || new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
                    }
                };
                
                console.log('Creating product with data:', formattedData);
                
                return {
                    url: '/create-product',
                    method: 'POST',
                    body: formattedData,
                    credentials: "include"
                };
            },
            invalidatesTags: ["Products"],
            transformErrorResponse: (error) => {
                console.error('API Error when creating product:', error);
                
                // Format validation errors for user-friendly display
                let errorMessage = error.data?.message || 'Failed to create product';
                let errorDetails = {};
                
                // Process validation errors if available
                if (error.data?.details) {
                    Object.keys(error.data.details).forEach(field => {
                        errorDetails[field] = error.data.details[field];
                    });
                    
                    // Special handling for common errors
                    if (error.data.details.sizeType) {
                        errorMessage = `Size type error: ${error.data.details.sizeType}`;
                    } else if (error.data.details.subcategory) {
                        errorMessage = `Subcategory error: ${error.data.details.subcategory}`;
                    }
                }
                
                return {
                    status: error.status,
                    message: errorMessage,
                    details: errorDetails
                };
            }
        }),
        updateProduct: builder.mutation({
            query: ({ id, productData }) => {
                // Ensure data consistency
                const formattedData = {
                    ...productData,
                    category: productData.category || '', // Ensure category is not undefined
                    deliveryTimeFrame: {
                        startDate: productData.deliveryTimeFrame?.startDate || new Date().toISOString().split('T')[0],
                        endDate: productData.deliveryTimeFrame?.endDate || new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]
                    }
                };
                
                console.log('Updating product with data:', formattedData);
                
                return {
                    url: `update-product/${id}`,
                    method: "PATCH",
                    body: formattedData,
                    credentials: "include",
                    headers: {
                        'Content-Type': 'application/json',
                    }
                };
            },
            invalidatesTags: ["Products"],
            transformErrorResponse: (error) => {
                console.error('API Error when updating product:', error);
                
                // Format validation errors for user-friendly display
                let errorMessage = error.data?.message || 'Failed to update product';
                let errorDetails = {};
                
                // Process validation errors if available
                if (error.data?.details) {
                    Object.keys(error.data.details).forEach(field => {
                        errorDetails[field] = error.data.details[field];
                    });
                    
                    // Special handling for common errors
                    if (error.data.details.sizeType) {
                        errorMessage = `Size type error: ${error.data.details.sizeType}`;
                    } else if (error.data.details.subcategory) {
                        errorMessage = `Subcategory error: ${error.data.details.subcategory}`;
                    }
                }
                
                return {
                    status: error.status,
                    message: errorMessage,
                    details: errorDetails
                };
            }
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Products", id }],
            transformErrorResponse: (error) => {
                console.error('API Error when deleting product:', error);
                return {
                    status: error.status,
                    message: error.data?.message || 'Failed to delete product',
                    details: error.data?.details || {}
                };
            }
        }),
        searchProducts: builder.query({
            query: (searchQuery = '') => ({
                url: '/search',
                method: 'GET',
                params: {
                    query: searchQuery
                }
            }),
            transformResponse: (response) => {
                console.log('Search Response:', response);
                return response;
            },
            transformErrorResponse: (error) => {
                console.error('API Error during search:', error);
                return {
                    status: error.status,
                    message: error.data?.message || 'Failed to search products',
                    details: error.data?.details || {}
                };
            }
        }),
        updateProductRating: builder.mutation({
            query: ({ productId, rating }) => ({
                url: `update-rating/${productId}`,
                method: 'PATCH',
                body: { rating },
                credentials: 'include'
            }),
            invalidatesTags: (result, error, { productId }) => [{ type: "Products", id: productId }],
            transformErrorResponse: (error) => {
                console.error('API Error when updating product rating:', error);
                return {
                    status: error.status,
                    message: error.data?.message || 'Failed to update product rating',
                    details: error.data?.details || {}
                };
            }
        }),
        fetchSimilarProducts: builder.query({
            query: ({ id, category, limit = 8 }) => ({
                url: `/products/similar?productId=${id}&category=${category}&limit=${limit}`,
                method: 'GET',
            }),
            transformResponse: (response) => {
                return {
                    products: response.data,
                    success: response.success,
                    message: response.message,
                };
            },
            providesTags: ['Products'],
        }),
    }),
});
export const { useFetchAllProductsQuery, useFetchProductByIdQuery, useAddProductMutation,
    useUpdateProductMutation, useDeleteProductMutation, useSearchProductsQuery, useUpdateProductRatingMutation } = productsApi;

export default productsApi;