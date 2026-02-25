const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get all reviews for a workshop
 */
export async function getWorkshopReviews(workshopId) {
    const res = await fetch(`${API_URL}/reviews/workshop/${workshopId}`);
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Submit a review for a workshop
 */
export async function submitReview(data) {
    const res = await fetch(`${API_URL}/reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
}

/**
 * Delete a review (Admin only)
 */
export async function deleteReview(token, id) {
    const res = await fetch(`${API_URL}/reviews/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!res.ok) throw await res.json();
    return res.json();
}
