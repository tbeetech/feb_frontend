const getBaseUrl = () => {
    const isDevelopment = import.meta.env.MODE === 'development';
    const hostname = window.location.hostname;
    
    if (isDevelopment) {
        return 'http://localhost:5000';
    }
    
    // In production, use the current domain
    const currentDomain = hostname.replace('www.', '');
    return `https://${currentDomain}`;
};

export const baseURL = getBaseUrl();