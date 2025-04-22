const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    
    if (isDevelopment) {
        return 'http://localhost:5000';
    }
    
    // In production, use the current window location origin
    return window.location.origin;
};

export const baseURL = getBaseUrl();