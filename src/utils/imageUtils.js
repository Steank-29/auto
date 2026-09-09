// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    
    // If it's already a full URL, return it
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
        return imagePath;
    }
    
    // In production, images are served from the same domain
    if (import.meta.env.PROD) {
        // Make sure the path has a leading slash
        const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
        return cleanPath;
    }
    
    // Development - use localhost
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    return `${API_URL}${cleanPath}`;
};