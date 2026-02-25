/**
 * Authentication Middleware
 * Verifies JWT token and attaches user to request
 */

const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

/**
 * Authenticate request
 * Expects: Authorization: Bearer <token>
 * Sets: req.user = { id, email, role }
 */
function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'يرجى تسجيل الدخول' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'جلسة منتهية، يرجى تسجيل الدخول مجدداً' });
    }
}

module.exports = authenticate;
