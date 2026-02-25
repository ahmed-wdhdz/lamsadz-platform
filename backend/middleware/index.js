/**
 * Middleware Module Index
 * Export all middleware
 */

const authenticate = require('./auth');
const { requireRole, requireAdmin, requireWorkshop, requireClient } = require('./roleGuard');

module.exports = {
    authenticate,
    requireRole,
    requireAdmin,
    requireWorkshop,
    requireClient
};
