/**
 * Workshop Controller
 * Handles: workshop CRUD, dashboard stats
 */

const prisma = require('../config/database');

/**
 * GET /api/workshops
 * Public - List all approved workshops
 */
async function getWorkshops(req, res) {
    try {
        const { wilaya, page = 1, limit = 10 } = req.query;
        const skip = (page - 1) * limit;

        const where = { status: 'APPROVED' };
        if (wilaya) where.location = wilaya;

        const [workshops, total] = await Promise.all([
            prisma.workshop.findMany({
                where,
                skip,
                take: parseInt(limit),
                include: { portfolio: true }
            }),
            prisma.workshop.count({ where })
        ]);

        res.json({
            workshops,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('GetWorkshops error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * GET /api/workshops/:id
 * Public - Get workshop details
 */
async function getWorkshop(req, res) {
    try {
        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                portfolio: true,
                products: { where: { status: 'PUBLISHED' } }
            }
        });

        if (!workshop || workshop.status !== 'APPROVED') {
            return res.status(404).json({ message: 'الورشة غير موجودة' });
        }

        res.json(workshop);
    } catch (error) {
        console.error('GetWorkshop error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * GET /api/workshops/me
 * Workshop owner - Get own workshop profile
 */
async function getMyWorkshop(req, res) {
    try {
        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id },
            include: {
                portfolio: true,
                payments: { orderBy: { createdAt: 'desc' } }
            }
        });
        res.json(workshop);
    } catch (error) {
        console.error('GetMyWorkshop error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/workshops
 * Create or update workshop profile
 */
async function saveWorkshop(req, res) {
    try {
        const { name, description, location, phone, skills, portfolio } = req.body;

        const existing = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        let workshop;
        if (existing) {
            // Update
            workshop = await prisma.workshop.update({
                where: { id: existing.id },
                data: { name, description, location, phone, skills }
            });
        } else {
            // Create
            workshop = await prisma.workshop.create({
                data: {
                    name,
                    description,
                    location,
                    phone,
                    skills,
                    ownerId: req.user.id,
                    portfolio: {
                        create: portfolio ? portfolio.map(url => ({ url })) : []
                    }
                }
            });
        }

        res.json(workshop);
    } catch (error) {
        console.error('SaveWorkshop error:', error);
        res.status(500).json({ message: 'حدث خطأ في حفظ بيانات الورشة' });
    }
}

/**
 * GET /api/workshop/home
 * Workshop dashboard stats
 */
async function getDashboard(req, res) {
    try {
        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) return res.json(null);

        // Check for Subscription Expiration
        if (workshop.status === 'APPROVED' && workshop.subscriptionEndsAt) {
            const now = new Date();
            const expiryDate = new Date(workshop.subscriptionEndsAt);

            if (now > expiryDate) {
                // Subscription has expired
                await prisma.workshop.update({
                    where: { id: workshop.id },
                    data: { status: 'PENDING_PAYMENT' }
                });
                workshop.status = 'PENDING_PAYMENT'; // Update local variable
            }
        }

        const [totalDesigns, totalRequests, unreadRequests, recentDeliveries] = await Promise.all([
            prisma.product.count({ where: { workshopId: workshop.id, status: 'PUBLISHED' } }),
            prisma.leadDelivery.count({ where: { workshopId: workshop.id } }),
            prisma.leadDelivery.count({ where: { workshopId: workshop.id, viewStatus: false } }),
            prisma.leadDelivery.findMany({
                where: { workshopId: workshop.id },
                orderBy: { deliveredAt: 'desc' },
                take: 5,
                include: { lead: true }
            })
        ]);

        // Format activity for frontend
        const activity = recentDeliveries.map(d => ({
            id: d.id,
            message: d.lead?.type || 'طلب جديد',
            date: d.deliveredAt
        }));

        res.json({
            stats: {
                totalDesigns,
                totalRequests,
                unreadRequests,
                status: workshop.status,
                subscriptionEndsAt: workshop.subscriptionEndsAt
            },
            activity
        });
    } catch (error) {
        console.error('GetDashboard error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * GET /api/workshops/leads
 * Get leads delivered to workshop
 */
async function getLeads(req, res) {
    try {
        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) {
            return res.json([]);
        }

        const deliveries = await prisma.leadDelivery.findMany({
            where: { workshopId: workshop.id },
            include: {
                lead: {
                    include: {
                        design: true
                    }
                },
                offers: true
            },
            orderBy: { deliveredAt: 'desc' }
        });

        res.json(deliveries);
    } catch (error) {
        console.error('GetLeads error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/workshops/:id/subscribe
 * Create a new subscription payment record
 */
async function subscribe(req, res) {
    try {
        const { plan } = req.body;
        const workshopId = parseInt(req.params.id);

        // Get workshop to verify ownership
        const workshop = await prisma.workshop.findUnique({
            where: { id: workshopId }
        });

        if (!workshop || workshop.ownerId !== req.user.id) {
            return res.status(403).json({ message: 'غير مصرح' });
        }

        // Calculate amount based on plan
        const amount = plan === 'yearly' ? 18000 : 2000;

        // Create payment record
        const payment = await prisma.workshopPayment.create({
            data: {
                workshopId,
                plan: plan.toUpperCase(),
                amount,
                status: 'PENDING'
            }
        });

        res.json(payment);
    } catch (error) {
        console.error('Subscribe error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}


/**
 * POST /api/workshops/:id/payment-proof
 * Upload payment proof image
 */
async function uploadPaymentProof(req, res) {
    console.log('UploadPaymentProof called for workshop:', req.params.id);
    try {
        const workshopId = parseInt(req.params.id);
        console.log('Workshop ID parsed:', workshopId);

        // Get workshop to verify ownership
        const workshop = await prisma.workshop.findUnique({
            where: { id: workshopId }
        });
        console.log('Workshop found:', workshop ? workshop.id : 'null');

        if (!workshop || workshop.ownerId !== req.user.id) {
            console.log('Authorization failed. Owner:', workshop?.ownerId, 'User:', req.user.id);
            return res.status(403).json({ message: 'غير مصرح' });
        }

        // Get the uploaded file
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'يرجى رفع ملف الإيصال' });
        }
        console.log('File uploaded:', req.file.filename);

        const proofUrl = req.file.filename;

        // Find the pending payment and update it
        const pendingPayment = await prisma.workshopPayment.findFirst({
            where: { workshopId, status: 'PENDING' },
            orderBy: { createdAt: 'desc' }
        });
        console.log('Pending payment found:', pendingPayment ? pendingPayment.id : 'null');

        if (!pendingPayment) {
            return res.status(404).json({ message: 'لا يوجد اشتراك قيد الانتظار' });
        }

        // Update payment with proof
        const payment = await prisma.workshopPayment.update({
            where: { id: pendingPayment.id },
            data: {
                proofUrl,
                uploadedAt: new Date(),
                status: 'UPLOADED'
            }
        });
        console.log('Payment updated:', payment.id);

        // Update workshop status
        await prisma.workshop.update({
            where: { id: workshopId },
            data: { status: 'WAITING_APPROVAL' }
        });
        console.log('Workshop status updated to WAITING_APPROVAL');

        res.json(payment);
    } catch (error) {
        console.error('UploadPaymentProof error:', error);
        res.status(500).json({ message: 'حدث خطأ في رفع الإيصال' });
    }
}



/**
 * PUT /api/workshops/deliveries/:id/status
 * Update delivery status (Order Tracking)
 */
async function updateDeliveryStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        const validStatuses = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'NO_RESPONSE', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'حالة غير صالحة' });
        }

        const workshopId = (await prisma.workshop.findUnique({ where: { ownerId: req.user.id } }))?.id;

        if (!workshopId) {
            return res.status(404).json({ message: 'الورشة غير موجودة' });
        }

        // Verify ownership and update
        const delivery = await prisma.leadDelivery.findUnique({
            where: { id: parseInt(id) }
        });

        if (!delivery || delivery.workshopId !== workshopId) {
            return res.status(403).json({ message: 'غير مصرح' });
        }

        const updated = await prisma.leadDelivery.update({
            where: { id: parseInt(id) },
            data: {
                status,
                // If delivered, update deliveredAt? No, that's creation time. Maybe add completedAt?
                // For now just status.
            },
            include: { lead: { include: { design: true } } }
        });

        // Create notification for user (Optional for now)

        res.json(updated);
    } catch (error) {
        console.error('UpdateDeliveryStatus error:', error);
        res.status(500).json({ message: 'حدث خطأ في تحديث الحالة' });
    }
}

module.exports = {
    getWorkshops,
    getWorkshop,
    getMyWorkshop,
    saveWorkshop,
    getDashboard,
    getLeads,
    subscribe,
    uploadPaymentProof,
    updateDeliveryStatus
};
