/**
 * Admin Controller
 * Handles: admin dashboard, user/workshop/lead management
 */

const prisma = require('../config/database');

// ==================== DASHBOARD ====================

/**
 * GET /api/admin/overview
 * Admin dashboard stats
 */
async function getOverview(req, res) {
    try {
        const [
            totalUsers,
            totalWorkshops,
            pendingWorkshops,
            totalLeads,
            pendingPayments
        ] = await Promise.all([
            prisma.user.count(),
            prisma.workshop.count({ where: { status: 'APPROVED' } }),
            prisma.workshop.count({ where: { status: 'WAITING_APPROVAL' } }),
            prisma.lead.count(),
            prisma.workshopPayment.count({ where: { status: 'UPLOADED' } })
        ]);

        res.json({
            stats: {
                totalUsers,
                totalWorkshops,
                pendingWorkshops,
                totalLeads,
                pendingPayments
            }
        });
    } catch (error) {
        console.error('GetOverview error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

// ==================== USERS ====================

/**
 * GET /api/admin/users
 * List all users
 */
async function getUsers(req, res) {
    try {
        const { page = 1, limit = 20, role } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (role) where.role = role;

        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: parseInt(limit),
                select: { id: true, name: true, email: true, role: true, blocked: true, createdAt: true }
            }),
            prisma.user.count({ where })
        ]);

        res.json({ users, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('GetUsers error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * PUT /api/admin/users/:id/block
 * Block/unblock user
 */
async function toggleUserBlock(req, res) {
    try {
        const userId = parseInt(req.params.id);
        const { blocked } = req.body;

        const user = await prisma.user.update({
            where: { id: userId },
            data: { blocked }
        });

        res.json(user);
    } catch (error) {
        console.error('ToggleUserBlock error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

// ==================== WORKSHOPS ====================

/**
 * GET /api/admin/workshops
 * List all workshops (any status)
 */
async function getWorkshops(req, res) {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;

        const [workshops, total] = await Promise.all([
            prisma.workshop.findMany({
                where,
                skip,
                take: parseInt(limit),
                include: {
                    owner: { select: { name: true, email: true } },
                    _count: { select: { products: true, leadDeliveries: true } }
                }
            }),
            prisma.workshop.count({ where })
        ]);

        res.json({ workshops, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('GetWorkshops error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * PUT /api/admin/workshops/:id/status
 * Approve or reject workshop
 */
async function updateWorkshopStatus(req, res) {
    try {
        const workshopId = parseInt(req.params.id);
        const { status, note } = req.body;

        const dataToUpdate = { status };

        // If manually approved, give them a default 30-day subscription
        if (status === 'APPROVED') {
            const currentWorkshop = await prisma.workshop.findUnique({ where: { id: workshopId } });
            if (!currentWorkshop.subscriptionEndsAt || new Date(currentWorkshop.subscriptionEndsAt) < new Date()) {
                const endsAt = new Date();
                endsAt.setDate(endsAt.getDate() + 30);
                dataToUpdate.subscriptionEndsAt = endsAt;
            }
        }

        const workshop = await prisma.workshop.update({
            where: { id: workshopId },
            data: dataToUpdate
        });

        res.json(workshop);
    } catch (error) {
        console.error('UpdateWorkshopStatus error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

// ==================== LEADS ====================

/**
 * GET /api/admin/leads
 * List all leads
 */
async function getLeads(req, res) {
    try {
        const { page = 1, limit = 20, status } = req.query;
        const skip = (page - 1) * limit;

        const where = {};
        if (status) where.status = status;

        const [leads, total] = await Promise.all([
            prisma.lead.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { createdAt: 'desc' },
                include: {
                    deliveries: { include: { workshop: true } },
                    design: {
                        select: {
                            title: true,
                            images: true,
                            price: true,
                            workshop: { select: { name: true } }
                        }
                    }
                }
            }),
            prisma.lead.count({ where })
        ]);

        res.json({ leads, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('GetLeads error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/admin/leads/:id/distribute
 * Distribute lead to workshops
 */
async function distributeLead(req, res) {
    try {
        const leadId = parseInt(req.params.id);
        const { workshopIds } = req.body;

        // Create deliveries
        const deliveries = await Promise.all(
            workshopIds.map(workshopId =>
                prisma.leadDelivery.create({
                    data: { leadId, workshopId: parseInt(workshopId) }
                })
            )
        );

        // Update lead status
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: 'SENT' }
        });

        res.json({ success: true, deliveries: deliveries.length });
    } catch (error) {
        console.error('DistributeLead error:', error);
        res.status(500).json({ message: 'حدث خطأ في توزيع الطلب' });
    }
}

// ==================== SUBSCRIPTIONS ====================

/**
 * GET /api/admin/subscriptions/pending
 * Get pending payments
 */
async function getPendingPayments(req, res) {
    try {
        const payments = await prisma.workshopPayment.findMany({
            where: { status: 'UPLOADED' },
            include: { workshop: { include: { owner: { select: { name: true, email: true } } } } }
        });

        res.json({ payments });
    } catch (error) {
        console.error('GetPendingPayments error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * PUT /api/admin/subscriptions/:id/validate
 * Validate or reject payment
 */
async function validatePayment(req, res) {
    try {
        const paymentId = parseInt(req.params.id);
        const { status, note } = req.body;

        const payment = await prisma.workshopPayment.update({
            where: { id: paymentId },
            data: {
                status,
                adminId: req.user.id,
                adminNote: note,
                validatedAt: status === 'VALIDATED' ? new Date() : null
            }
        });

        // If validated, approve workshop and set subscription end date
        if (status === 'VALIDATED') {
            const now = new Date();
            let subscriptionEndsAt = new Date();

            if (payment.plan === 'YEARLY') {
                subscriptionEndsAt.setFullYear(now.getFullYear() + 1);
            } else {
                // Default to monthly
                subscriptionEndsAt.setMonth(now.getMonth() + 1);
            }

            await prisma.workshop.update({
                where: { id: payment.workshopId },
                data: {
                    status: 'APPROVED',
                    subscriptionEndsAt: subscriptionEndsAt
                }
            });
        }

        res.json(payment);
    } catch (error) {
        console.error('ValidatePayment error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

// ==================== PRODUCTS ====================

/**
 * GET /api/admin/products
 * List all products
 */
async function getProducts(req, res) {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (page - 1) * limit;
        const where = { status: { not: 'ARCHIVED' } };

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: parseInt(limit),
                include: { workshop: { select: { name: true } } },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.product.count({ where })
        ]);
        
        res.json({ products, total, pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error('GetProducts error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * DELETE /api/admin/products/:id
 * Delete a product
 */
async function deleteProduct(req, res) {
    try {
        const productId = parseInt(req.params.id);
        
        // Soft delete (Archive) to prevent Foreign Key constraints from failing
        await prisma.product.update({ 
            where: { id: productId },
            data: { status: 'ARCHIVED' }
        });
        
        res.json({ success: true });
    } catch (error) {
        console.error('DeleteProduct error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * GET /api/admin/payments
 * List all payments
 */
async function getPayments(req, res) {
    try {
        const payments = await prisma.workshopPayment.findMany({
            include: { workshop: { include: { owner: { select: { name: true, email: true } } } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(payments);
    } catch (error) {
        console.error('GetPayments error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/admin/payments/:id/approve
 * Approve a payment
 */
async function approvePayment(req, res) {
    try {
        const paymentId = parseInt(req.params.id);
        const { adminNote } = req.body;

        const payment = await prisma.workshopPayment.update({
            where: { id: paymentId },
            data: {
                status: 'VALIDATED',
                adminId: req.user.id,
                adminNote,
                validatedAt: new Date()
            }
        });

        // Approve workshop
        await prisma.workshop.update({
            where: { id: payment.workshopId },
            data: { status: 'APPROVED' }
        });

        res.json(payment);
    } catch (error) {
        console.error('ApprovePayment error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/admin/payments/:id/reject
 * Reject a payment
 */
async function rejectPayment(req, res) {
    try {
        const paymentId = parseInt(req.params.id);
        const { adminNote } = req.body;

        const payment = await prisma.workshopPayment.update({
            where: { id: paymentId },
            data: {
                status: 'REJECTED',
                adminId: req.user.id,
                adminNote
            }
        });

        // Reject workshop
        await prisma.workshop.update({
            where: { id: payment.workshopId },
            data: { status: 'REJECTED' }
        });

        res.json(payment);
    } catch (error) {
        console.error('RejectPayment error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

module.exports = {
    getOverview,
    getUsers,
    toggleUserBlock,
    getWorkshops,
    updateWorkshopStatus,
    getLeads,
    distributeLead,
    getPendingPayments,
    validatePayment,
    getProducts,
    deleteProduct,
    getPayments,
    approvePayment,
    rejectPayment
};
