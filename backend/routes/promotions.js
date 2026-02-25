const express = require('express');
const { authenticate, requireAdmin, requireWorkshop } = require('../middleware');
const { upload } = require('../config');
const {
    requestPromotion,
    getAdminPromotions,
    getMyPromotions,
    updatePromotionStatus
} = require('../controllers/promotionController');

const router = express.Router();

// Admin routes
router.get('/admin', authenticate, requireAdmin, getAdminPromotions);
router.put('/:id/status', authenticate, requireAdmin, updatePromotionStatus);

// Workshop routes
router.post('/', authenticate, requireWorkshop, upload.single('proofImage'), requestPromotion);
router.get('/my', authenticate, requireWorkshop, getMyPromotions);

module.exports = router;
