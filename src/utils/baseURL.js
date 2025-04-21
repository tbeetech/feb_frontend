const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    const hostname = window.location.hostname;
    
    if (isDevelopment) {
        return import.meta.env.VITE_API_URL || 'http://localhost:5000';
    }
    
    // In production, use the same hostname as the frontend
    return `https://${hostname}`;
};

export const baseURL = getBaseUrl();