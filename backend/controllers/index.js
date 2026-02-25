/**
 * Controllers Module Index
 * Export all controllers
 */

const authController = require('./authController');
const workshopController = require('./workshopController');
const designController = require('./designController');
const leadController = require('./leadController');
const adminController = require('./adminController');

module.exports = {
    authController,
    workshopController,
    designController,
    leadController,
    adminController
};
