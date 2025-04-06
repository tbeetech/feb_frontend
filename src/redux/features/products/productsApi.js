import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from '../../../utils/baseURL'

export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({
        baseUrl: baseURL,
        credentials: 'include'
    }),
    tagTypes: ["Products", "Product"],
    endpoints: (builder) => ({
        fetchAllProducts: builder.query({
            query: ({
                page = 1,
                limit = 10,
                category = '',
                subcategory = '',
                minPrice,
                maxPrice,
                sort = '-createdAt',
                query = ''
            } = {}) => {
                // Build the query parameters
                let queryParams = new URLSearchParams();
                
                if (page) queryParams.append('page', page);
                if (limit) queryParams.append('limit', limit);
                if (category) queryParams.append('category', category);
                if (subcategory) queryParams.append('subcategory', subcategory);
                if (minPrice !== undefined) queryParams.append('minPrice', minPrice);
                if (maxPrice !== undefined) queryParams.append('maxPrice', maxPrice);
                if (sort) queryParams.append('sort', sort);
                if (query) queryParams.append('query', query);
                
                return {
                    url: `/api/products?${queryParams}`,
                    method: 'GET',
                };
            },
            transformResponse: (response) => {
                return {
                    products: response.products || [],
                    totalPages: response.totalPages || 0,
                    totalProducts: response.totalProducts || 0,
                    currentPage: response.currentPage || 1
                };
            },
            transformErrorResponse: (error) => {
                return {
                    status: error.status,
                    message: error.data?.message || 'An error occurred',
                    details: error.data?.details || {}
                };
            },
            providesTags: ['Products'],
        }),
        fetchProductById: builder.query({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: 'GET',
            }),
            providesTags: ['Product'],
        }),
        addProduct: builder.mutation({
            query: (data) => ({
                url: '/api/products',
                method: 'POST',
                body: data,
            }),
            invalidatesTags: ['Products'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/api/products/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: ['Products', 'Product'],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/api/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products'],
        }),
        searchProducts: builder.query({
            query: (searchQuery = '') => ({
                url: '/api/products/search',
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
            query: ({ id, rating }) => ({
                url: `/api/products/${id}/rate`,
                method: 'PATCH',
                body: { rating },
            }),
            invalidatesTags: ['Product'],
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

export const {
    useFetchAllProductsQuery,
    useFetchProductByIdQuery,
    useAddProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    useSearchProductsQuery,
    useUpdateProductRatingMutation,
} = productsApi;

export default productsApi;