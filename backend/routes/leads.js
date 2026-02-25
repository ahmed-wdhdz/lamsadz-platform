/**
 * Lead Routes
 * POST /api/leads - Submit lead (public)
 * GET /api/workshop/leads - Workshop's leads
 * POST /api/workshop/leads/:id/view - Mark as viewed
 * POST /api/workshop/leads/:id/offer - Submit offer
 */

const express = require('express');
const router = express.Router();
const { leadController } = require('../controllers');
const { authenticate, requireWorkshop, requireClient } = require('../middleware');
const { upload } = require('../config');

// Public routes
router.post('/leads', upload.array('images', 5), leadController.submitLead);

// Client routes (protected)
router.get('/client/leads', authenticate, requireClient, leadController.getClientLeads);

// Workshop routes (protected)
router.get('/workshop/leads', authenticate, requireWorkshop, leadController.getWorkshopLeads);
router.post('/workshop/leads/:id/view', authenticate, requireWorkshop, leadController.markLeadViewed);
router.post('/workshop/leads/:id/offer', authenticate, requireWorkshop, leadController.submitOffer);
router.post('/workshop/custom-leads/:id/offer', authenticate, requireWorkshop, leadController.submitCustomOffer);
router.put('/workshop/custom-leads/:id/status', authenticate, requireWorkshop, leadController.updateCustomLeadStatus);

module.exports = router;
