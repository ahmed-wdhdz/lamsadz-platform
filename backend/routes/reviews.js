const express = require('express');
const { authenticate, requireAdmin } = require('../middleware');
const {
    createReview,
    getWorkshopReviews,
    deleteReview,
} = require('../controllers/reviewController');

const router = express.Router();

// Public routes (anyone can see reviews)
router.get('/workshop/:workshopId', getWorkshopReviews);

// Public route (anyone can leave a review)
router.post('/', createReview);
// Note: We could add update endpoint here later

// Admin routes
router.delete('/:id', authenticate, requireAdmin, deleteReview);

module.exports = router;
