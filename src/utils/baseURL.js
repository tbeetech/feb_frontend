const isDevelopment = import.meta.env.MODE === 'development';
export const baseURL = isDevelopment 
    ? import.meta.env.VITE_API_URL
    : import.meta.env.VITE_PRODUCTION_API_URL;