/**
 * Environment Configuration
 * Validates required environment variables
 */

const requiredEnvVars = [
    'DATABASE_URL',
    'JWT_SECRET'
];

const optionalEnvVars = {
    PORT: '3000',
    NODE_ENV: 'development',
    UPLOAD_DIR: './uploads',
    MAX_FILE_SIZE: '5242880' // 5MB
};

// Check required variables
function validateEnv() {
    const missing = requiredEnvVars.filter(key => !process.env[key]);
    if (missing.length > 0) {
        console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
        console.error('   Create a .env file based on .env.example');
        process.exit(1);
    }
}

// Set defaults for optional variables
function setDefaults() {
    Object.entries(optionalEnvVars).forEach(([key, defaultValue]) => {
        if (!process.env[key]) {
            process.env[key] = defaultValue;
        }
    });
}

// Export config object
const config = {
    port: parseInt(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    uploadDir: process.env.UPLOAD_DIR || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880,
    databaseUrl: process.env.DATABASE_URL
};

module.exports = { validateEnv, setDefaults, config };
