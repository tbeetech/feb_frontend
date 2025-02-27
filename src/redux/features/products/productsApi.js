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