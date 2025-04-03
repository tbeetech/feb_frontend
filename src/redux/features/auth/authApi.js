import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { baseURL } from "../../../utils/baseURL"

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${baseURL}/api/auth`,
        credentials: 'include',
        prepareHeaders: (headers, { getState }) => {
            // Get token from localStorage
            const token = localStorage.getItem('token');
            
            // If we have a token, add it to the Authorization header
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            return headers;
        }
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (newUser)=> ({
                url: "/register",
                method: "POST",
                body: newUser
            })
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            }),
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    const result = await queryFulfilled;
                    // Save token to localStorage if it exists in the response
                    if (result.data?.token) {
                        localStorage.setItem('token', result.data.token);
                    }
                } catch (error) {
                    console.error('Login failed:', error);
                }
            }
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: "/logout",
                method: "POST"
            }),
            onQueryStarted: async (arg, { queryFulfilled }) => {
                try {
                    await queryFulfilled;
                    // Remove token from localStorage
                    localStorage.removeItem('token');
                } catch (error) {
                    console.error('Logout failed:', error);
                }
            }
        }),
        getUser: builder.query({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            refetchOnMount: true,
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        updateUserRole: builder.mutation({
            query: ({userId, role}) => ({
                url: `/users/${userId}`,
                method: "PUT",
                body: {role}
            }),
            refetchOnMount: true,
            invalidatesTags: ["User"],
        }),
        editProfile: builder.mutation({
            query: (profileData) => ({
                url: `/edit-profile`,
                method: "PATCH",
                body: profileData
            }),
        })
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetUserQuery,
    useDeleteUserMutation,
    useUpdateUseRoleMutation,
    useEditProfileMutation
} = authApi;

export default authApi;