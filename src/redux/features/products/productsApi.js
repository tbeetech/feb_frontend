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
            query: ({ category, subcategory, minPrice, maxPrice, page = 1, limit = 10 }) => {
                let queryParams = new URLSearchParams();
                
                // Normalize category and subcategory
                if (category) {
                    queryParams.append('category', category.toLowerCase());
                }
                
                if (subcategory) {
                    // Convert url-friendly format to database format
                    const normalizedSubcategory = subcategory
                        .toLowerCase()
                        .replace(/\s+/g, '-');
                    queryParams.append('subcategory', normalizedSubcategory);
                }
                
                // Handle price filtering
                if (minPrice) queryParams.append('minPrice', minPrice);
                if (maxPrice) queryParams.append('maxPrice', maxPrice);
                
                // Handle pagination
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());
                
                console.log('API Query:', `/?${queryParams.toString()}`); // Debug log
                return `/?${queryParams.toString()}`;
            },
            transformResponse: (response) => {
                console.log('API Response:', response); // Debug log
                return response;
            },
            providesTags: ["Products"],
        }),
        fetchProductById: builder.query({
            query: (id) => `/${id}`,
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),
        AddProduct: builder.mutation({
            query: (newProduct) => ({
                url: '/create-product',
                method: 'POST',
                body: newProduct,
                credentials: "include"
            }),
            invalidatesTags: ["Products"]
        }),
        updateProduct: builder.mutation({
            query: ({ id, ...rest }) => ({
                url: `update-product/${id}`,
                method: "PATCH",
                body: rest,
                credentials: "include",
            }),
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
    }),
});
export const { useFetchAllProductsQuery, useFetchProductByIdQuery, useAddProductMutation,
    useUpdateProductMutation, useDeleteProductMutation } = productsApi;

export default productsApi;