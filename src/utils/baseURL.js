const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    
    if (isDevelopment) {
        return 'http://localhost:5000';
    }
    
    // In production, use relative URLs so requests go through Vercel rewrites
    // (configured in vercel.json) to avoid CORS issues
    return '';
};

// Full backend URL for non-fetch resources (e.g. images) that don't need CORS proxy
export const backendURL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : 'https://feb-backend.vercel.app';

export const baseURL = getBaseUrl();