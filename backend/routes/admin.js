/**
 * Admin Routes
 * All routes require ADMIN role
 */

const express = require('express');
const router = express.Router();
const { adminController } = require('../controllers');
const { authenticate, requireAdmin } = require('../middleware');

// All admin routes are protected
router.use(authenticate, requireAdmin);

// Dashboard
router.get('/overview', adminController.getOverview);

// Users
router.get('/users', adminController.getUsers);
router.put('/users/:id/block', adminController.toggleUserBlock);

// Workshops
router.get('/workshops', adminController.getWorkshops);
router.put('/workshops/:id/status', adminController.updateWorkshopStatus);

// Leads
router.get('/leads', adminController.getLeads);
router.post('/leads/:id/distribute', adminController.distributeLead);

// Subscriptions
router.get('/subscriptions/pending', adminController.getPendingPayments);
router.put('/subscriptions/:id/validate', adminController.validatePayment);

// Products
router.get('/products', adminController.getProducts);
router.delete('/products/:id', adminController.deleteProduct);

// Payments
router.get('/payments', adminController.getPayments);
router.post('/payments/:id/approve', adminController.approvePayment);
router.post('/payments/:id/reject', adminController.rejectPayment);

module.exports = router;
