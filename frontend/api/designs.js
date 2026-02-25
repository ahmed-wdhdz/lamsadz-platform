/**
 * Designs API Service
 * Handles: getDesigns, getDesign, createDesign, updateDesign, deleteDesign
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get all published designs (public)
 * @param {Object} filters - { category, wilaya, page, limit }
 * @returns {Promise<{products, total, pages}>}
 */
export async function getDesigns(filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/designs?${params}`);
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get single design by ID (public)
 * @param {number} id - Design ID
 * @returns {Promise<Product>}
 */
export async function getDesign(id) {
    const res = await fetch(`${API_URL}/designs/${id}`);
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get workshop's own designs (authenticated)
 * @param {string} token - JWT token
 * @param {Object} filters - { page, limit, status }
 * @returns {Promise<{products, total, pages}>}
 */
export async function getMyDesigns(token, filters = {}) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`${API_URL}/workshop/products?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Create new design (workshop only)
 * @param {string} token - JWT token
 * @param {FormData} formData - { title, category, description, price, images[] }
 * @returns {Promise<Product>}
 */
export async function createDesign(token, formData) {
    const res = await fetch(`${API_URL}/workshop/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Update existing design (workshop only)
 * @param {string} token - JWT token
 * @param {number} id - Design ID
 * @param {FormData} formData - Updated fields
 * @returns {Promise<Product>}
 */
export async function updateDesign(token, id, formData) {
    const res = await fetch(`${API_URL}/workshop/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Delete design (soft delete, workshop only)
 * @param {string} token - JWT token
 * @param {number} id - Design ID
 * @returns {Promise<{success: boolean}>}
 */
export async function deleteDesign(token, id) {
    const res = await fetch(`${API_URL}/workshop/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
