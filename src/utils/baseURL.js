export const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    return isDevelopment 
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_PRODUCTION_API_URL;
};