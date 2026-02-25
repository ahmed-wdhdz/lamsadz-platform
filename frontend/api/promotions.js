const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Request a promotion for a product
 */
export async function requestPromotion(token, formData) {
    const res = await fetch(`${API_URL}/promotions`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type, browser sets it for FormData automatically (includes boundary)
        },
        body: formData
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get workshop's own promotion requests
 */
export async function getMyPromotions(token) {
    const res = await fetch(`${API_URL}/promotions/my`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Get all promotion requests (Admin only)
 */
export async function getAdminPromotions(token) {
    const res = await fetch(`${API_URL}/promotions/admin`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Update promotion request status (Admin only)
 */
export async function updatePromotionStatus(token, id, status, adminNote = '') {
    const res = await fetch(`${API_URL}/promotions/${id}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, adminNote })
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
