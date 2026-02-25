/**
 * Delivery Routes
 * POST /api/deliveries/:id/view - Mark as viewed
 * POST /api/deliveries/:id/offer - Submit offer
 */

const express = require('express');
const router = express.Router();
const { authenticate, requireWorkshop } = require('../middleware');
const prisma = require('../config/database');

/**
 * POST /api/deliveries/:id/view
 * Mark a delivery as viewed
 */
router.post('/deliveries/:id/view', authenticate, async (req, res) => {
    try {
        const delivery = await prisma.leadDelivery.update({
            where: { id: parseInt(req.params.id) },
            data: { viewStatus: true }
        });
        res.json(delivery);
    } catch (error) {
        console.error('MarkViewed error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
});

/**
 * POST /api/deliveries/:id/offer
 * Submit an offer for a lead
 */
router.post('/deliveries/:id/offer', authenticate, async (req, res) => {
    try {
        const { price, leadTimeDays, message } = req.body;
        const offer = await prisma.offer.create({
            data: {
                leadDeliveryId: parseInt(req.params.id),
                price: parseFloat(price),
                leadTimeDays: parseInt(leadTimeDays),
                message
            }
        });
        res.json(offer);
    } catch (error) {
        console.error('SubmitOffer error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
});

module.exports = router;
