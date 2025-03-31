import { getBaseUrl } from './baseURL';

export const getImageUrl = (imageUrl) => {
    if (!imageUrl) return 'https://via.placeholder.com/400x400?text=No+Image';
    
    // If it's already an absolute URL (starts with http:// or https://)
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // If it's a relative path, prepend the API base URL
    return `${getBaseUrl()}/${imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl}`;
}; 