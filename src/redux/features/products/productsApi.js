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
                
                // Only add category if it's not 'all'
                if (category && category !== 'all') {
                    queryParams.append('category', category);
                }
                
                // Only add subcategory if it exists
                if (subcategory) {
                    queryParams.append('subcategory', subcategory);
                }
                
                if (minPrice) queryParams.append('minPrice', minPrice);
                if (maxPrice) queryParams.append('maxPrice', maxPrice);
                queryParams.append('page', page.toString());
                queryParams.append('limit', limit.toString());
                
                return `/?${queryParams.toString()}`;
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
    useUpdateProductMutation, useDeleteProductMutation, useFetchRelatedProductsQuery } = productsApi;

export default productsApi;