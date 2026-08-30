// src/utils/imageUtils.js
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '/placeholder.png';
    
    // In production, images are served from the same domain
    // In development, they come from localhost:5000
    if (import.meta.env.PROD) {
        return imagePath; // Just the path, Nginx will serve it
    }
    
    // Development - use localhost
    return `http://localhost:5000${imagePath}`;
};