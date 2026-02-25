/**
 * Config Module Index
 * Export all configuration modules
 */

const prisma = require('./database');
const { validateEnv, setDefaults, config } = require('./env');
const upload = require('./multer');

module.exports = {
    prisma,
    validateEnv,
    setDefaults,
    config,
    upload
};
