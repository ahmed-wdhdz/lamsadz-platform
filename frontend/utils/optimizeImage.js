const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

/**
 * Optimizes Cloudinary image URLs to reduce file size drastically.
 * @param {string} url - The original image URL.
 * @param {number} width - The target width (e.g., 300 for thumbnails).
 * @param {number} height - The target height (optional).
 * @returns {string} The optimized image URL.
 */
export const getOptimizedImage = (url, width = 400, height = null) => {
    if (!url) return `https://placehold.co/${width}x${height || width}?text=No+Image`;
    
    const urlStr = String(url);
    
    // If it's a Cloudinary URL, inject transformations
    if (urlStr.includes('cloudinary.com') && urlStr.includes('/upload/')) {
        const dimensions = height ? `w_${width},h_${height},c_fill` : `w_${width},c_limit`;
        return urlStr.replace('/upload/', `/upload/${dimensions},q_auto,f_auto/`);
    }
    
    // Fallback for other external HTTP URLs
    if (urlStr.startsWith('http')) return urlStr;
    
    // Fallback for local uploads
    return `${API_URL.replace('/api', '')}/uploads/${urlStr}`;
};
