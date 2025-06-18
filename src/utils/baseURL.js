const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    
    if (isDevelopment) {
        return 'http://localhost:5000';
    }
    
    // In production, use the Vercel deployment URL
    return 'https://feb-backend.vercel.app';
};

export const baseURL = getBaseUrl();