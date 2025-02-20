export const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    return isDevelopment 
        ? 'http://localhost:5000'
        : 'https://feb-luxury.vercel.app';
};