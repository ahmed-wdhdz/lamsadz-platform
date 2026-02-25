/**
 * Auth Routes
 * POST /api/auth/register
 * POST /api/auth/login
 * GET /api/me
 */

const express = require('express');
const router = express.Router();
const { authController } = require('../controllers');
const { authenticate } = require('../middleware');

// Public routes
// Public routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.post('/auth/verify-email', authController.verifyEmail);
router.post('/auth/resend-otp', authController.resendOtp);
router.post('/auth/google', authController.googleLogin);

// Protected routes
router.get('/me', authenticate, authController.getMe);
router.put('/me', authenticate, authController.updateProfile);

module.exports = router;
