/**
 * Role Guard Middleware
 * Restricts access based on user role
 */

/**
 * Require specific role(s)
 * @param {...string} roles - Allowed roles (ADMIN, WORKSHOP, CLIENT)
 * @returns {Function} Middleware function
 * 
 * Usage:
 *   router.get('/admin', authenticate, requireRole('ADMIN'), handler)
 *   router.get('/manage', authenticate, requireRole('ADMIN', 'WORKSHOP'), handler)
 */
function requireRole(...roles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'غير مسموح - يرجى تسجيل الدخول' });
        }

        if (!roles.includes(req.user.role)) {
            console.log('RoleGuard failed! Expected:', roles, 'Actual:', req.user.role, 'Decoded user:', req.user);
            return res.status(403).json({ message: 'غير مسموح - صلاحيات غير كافية' });
        }

        next();
    };
}

// Convenience exports for common role guards
const requireAdmin = requireRole('ADMIN');
const requireWorkshop = requireRole('WORKSHOP');
const requireClient = requireRole('CLIENT');

module.exports = {
    requireRole,
    requireAdmin,
    requireWorkshop,
    requireClient
};
