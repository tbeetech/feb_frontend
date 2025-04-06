import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseURL } from '../../../utils/baseURL'

export const reviewApi = createApi({
    reducerPath: 'reviewApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/reviews`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            // If token exists, add to headers
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            return headers;
        }
    }),
    tagTypes: ["Reviews", "ProductReviews"],
    endpoints: (builder) => ({
        postReview: builder.mutation({
            query: (reviewData) => {
                // Get fresh token from localStorage to ensure it's the latest
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Authentication required');
                }
                
                return {
                    url: "/post-review",
                    method: "POST",
                    body: reviewData,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
            // Transform response to handle errors consistently
            transformResponse: (response) => {
                return response;
            },
            // Transform error for better error handling
            transformErrorResponse: (response) => {
                return {
                    status: response.status,
                    data: response.data || { message: 'An error occurred' }
                };
            },
            invalidatesTags: (result, error, { productId }) => [
                { type: "Reviews" },
                { type: "ProductReviews", id: productId }
            ]
        }),
        getProductReviews: builder.query({
            query: (productId) => ({
                url: `/product/${productId}`,
                method: "GET"
            }),
            transformResponse: (response) => {
                console.log('Product reviews response:', response);
                return response.reviews || [];
            },
            providesTags: (result, error, productId) => [
                { type: "ProductReviews", id: productId }
            ]
        }),
        likeReview: builder.mutation({
            query: (reviewId) => {
                const token = localStorage.getItem('token');
                
                if (!token) {
                    throw new Error('Authentication required');
                }
                
                return {
                    url: `/${reviewId}/like`,
                    method: "POST",
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
            invalidatesTags: (result, error, reviewId) => [
                { type: "Reviews" },
                { type: "ProductReviews" }
            ]
        }),
        getUserReviews: builder.query({
            query: (userId) => ({
                url: `/${userId}`,
                method: "GET"
            }),
            transformResponse: (response) => {
                return response || [];
            }
        }),
        getReviewsCount: builder.query({
            query: () => ({
                url: "/total-reviews"
            })
        }),
        getReviewsByUserId: builder.query({
            query: (userId) => ({
                url: `/${userId}`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
            providesTags: (result) => result ? [{ type: "Reviews", id: result[0]?.email }] : []
        }),
        getUserActivity: builder.query({
            query: (userId) => ({
                url: `/user/${userId}/activity`,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
            providesTags: ["Reviews"]
        })
    })
})

export const { 
    usePostReviewMutation, 
    useGetProductReviewsQuery,
    useLikeReviewMutation,
    useGetUserReviewsQuery,
    useGetReviewsCountQuery, 
    useGetReviewsByUserIdQuery,
    useGetUserActivityQuery
} = reviewApi;

export default reviewApi;