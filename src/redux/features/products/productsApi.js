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
        }),
        fetchProductById: builder.query({
            query: (id) => `/single/${id}`, // Update the endpoint to match backend
            providesTags: (result, error, id) => [{ type: "Products", id }],
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
            invalidatesTags: ["Products"]
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
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: (result, error, id) => [{ type: "Products", id }],
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
        }),
    }),
});
export const { useFetchAllProductsQuery, useFetchProductByIdQuery, useAddProductMutation,
    useUpdateProductMutation, useDeleteProductMutation, useSearchProductsQuery } = productsApi;

export default productsApi;