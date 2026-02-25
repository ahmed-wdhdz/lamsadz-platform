/**
 * Workshop Routes
 * GET /api/workshops - Public list
 * GET /api/workshops/:id - Public detail
 * GET /api/workshops/me - Own profile
 * POST /api/workshops - Create/update profile
 * GET /api/workshop/home - Dashboard stats
 * POST /api/workshops/:id/subscribe - Create subscription
 * POST /api/workshops/:id/payment-proof - Upload payment proof
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { workshopController } = require('../controllers');
const { authenticate, requireWorkshop } = require('../middleware');

// Multer config for payment proofs
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'payment-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Workshop owner routes (protected) - MUST be before /:id routes
router.get('/workshops/me', authenticate, requireWorkshop, workshopController.getMyWorkshop);
router.get('/workshops/leads', authenticate, requireWorkshop, workshopController.getLeads);
router.put('/workshops/deliveries/:id/status', authenticate, requireWorkshop, workshopController.updateDeliveryStatus);
router.post('/workshops', authenticate, requireWorkshop, workshopController.saveWorkshop);
router.get('/workshop/home', authenticate, requireWorkshop, workshopController.getDashboard);

// Public routes
router.get('/workshops', workshopController.getWorkshops);
router.get('/workshops/:id', workshopController.getWorkshop);

// Subscription routes
router.post('/workshops/:id/subscribe', authenticate, workshopController.subscribe);
router.post('/workshops/:id/payment-proof', authenticate, upload.single('proof'), workshopController.uploadPaymentProof);

module.exports = router;

