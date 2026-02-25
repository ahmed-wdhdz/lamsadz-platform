/**
 * Design Routes
 * GET /api/designs - Public list
 * GET /api/designs/:id - Public detail
 * GET /api/workshop/products - Workshop's own products
 * POST /api/workshop/products - Create product
 * PUT /api/workshop/products/:id - Update product
 * DELETE /api/workshop/products/:id - Delete product
 */

const express = require('express');
const router = express.Router();
const { designController } = require('../controllers');
const { authenticate, requireWorkshop } = require('../middleware');
const { upload } = require('../config');

// Public routes
router.get('/designs', designController.getDesigns);
router.get('/products', designController.getDesigns); // Alias for frontend compatibility
router.get('/designs/:id', designController.getDesign);
router.get('/products/:id', designController.getDesign); // Alias for frontend compatibility

// Workshop routes (protected)
router.get('/workshop/products', authenticate, requireWorkshop, designController.getMyDesigns);
router.post('/workshop/products', authenticate, requireWorkshop, upload.array('images', 5), designController.createDesign);
router.put('/workshop/products/:id', authenticate, requireWorkshop, upload.array('images', 5), designController.updateDesign);
router.delete('/workshop/products/:id', authenticate, requireWorkshop, designController.deleteDesign);

module.exports = router;
