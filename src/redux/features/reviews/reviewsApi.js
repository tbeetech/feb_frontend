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
            query: (reviewData) => ({
                url: "/post-review",
                method: "POST",
                body: reviewData,
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
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
            query: (reviewId) => ({
                url: `/${reviewId}/like`,
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            }),
            invalidatesTags: (result, error, reviewId) => [
                { type: "ProductReviews" }
            ]
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
    useGetReviewsCountQuery, 
    useGetReviewsByUserIdQuery,
    useGetUserActivityQuery
} = reviewApi;

export default reviewApi;