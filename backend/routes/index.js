/**
 * Routes Index
 * Aggregates all route modules
 */

const authRoutes = require('./auth');
const designRoutes = require('./designs');
const leadRoutes = require('./leads');
const workshopRoutes = require('./workshops');
const adminRoutes = require('./admin');
const deliveryRoutes = require('./deliveries');
const reviewRoutes = require('./reviews');
const promotionRoutes = require('./promotions');

function setupRoutes(app) {
    // All routes prefixed with /api
    app.use('/api', authRoutes);
    app.use('/api', designRoutes);
    app.use('/api', leadRoutes);
    app.use('/api', workshopRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api', deliveryRoutes);
    app.use('/api/reviews', reviewRoutes);
    app.use('/api/promotions', promotionRoutes);
}

module.exports = setupRoutes;

