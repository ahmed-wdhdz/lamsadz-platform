/**
 * Lead Controller
 * Handles: lead submission and workshop lead management
 */

const prisma = require('../config/database');
const jwt = require('jsonwebtoken');
const { config } = require('../config/env');

/**
 * POST /api/leads
 * Public - Submit a new lead/request
 */
async function submitLead(req, res) {
    try {
        const {
            clientName,
            clientPhone,
            designId,
            type,
            description,
            wilaya,
            budgetMin,
            budgetMax,
            dimensions
        } = req.body;

        const images = req.files ? req.files.map(f => f.path) : [];

        // Get category and workshop from design if linked
        let category = null;
        let targetWorkshopId = null;

        if (designId) {
            const design = await prisma.product.findUnique({
                where: { id: parseInt(designId) }
            });
            if (design) {
                category = design.category;
                targetWorkshopId = design.workshopId;
            }
        }

        // Optional Authentication check to link lead to a client account
        let clientId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            try {
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, config.jwtSecret);
                clientId = decoded.id;
            } catch (err) {
                console.error("Optional auth verification failed:", err.message);
            }
        }

        const lead = await prisma.lead.create({
            data: {
                clientId,
                clientName,
                clientPhone,
                designId: designId ? parseInt(designId) : null,
                category,
                type,
                description,
                wilaya,
                dimensions,
                budgetMin: budgetMin ? parseFloat(budgetMin) : null,
                budgetMax: budgetMax ? parseFloat(budgetMax) : null,
                images: JSON.stringify(images),
                status: targetWorkshopId ? 'SENT' : 'NEW'
            }
        });

        // Automatically deliver to the workshop if it's a specific design request
        if (targetWorkshopId) {
            await prisma.leadDelivery.create({
                data: {
                    leadId: lead.id,
                    workshopId: targetWorkshopId,
                    viewStatus: false
                }
            });
        } else {
            // Auto-distribute Custom Requests to all APPROVED workshops in the same Wilaya
            const localWorkshops = await prisma.workshop.findMany({
                where: {
                    location: wilaya,
                    status: 'APPROVED'
                }
            });

            if (localWorkshops.length > 0) {
                const deliveries = localWorkshops.map(ws => ({
                    leadId: lead.id,
                    workshopId: ws.id,
                    viewStatus: false
                }));

                await prisma.leadDelivery.createMany({
                    data: deliveries
                });

                                // Keep status as NEW

            }
        }

        res.status(201).json({
            success: true,
            leadId: lead.id,
            distributedTo: targetWorkshopId ? '1' : '0',
            message: 'تم إرسال طلبك بنجاح'
        });
    } catch (error) {
        console.error('SubmitLead error:', error);
        res.status(500).json({ message: 'حدث خطأ في إرسال الطلب' });
    }
}

/**
 * GET /api/workshop/leads
 * Workshop - Get delivered leads
 */
async function getWorkshopLeads(req, res) {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) {
            return res.status(404).json({ message: 'الورشة غير موجودة' });
        }

        // Handle Custom Requests (Filtered by Wilaya)
        if (req.query.type === 'custom') {
            const whereCustom = {
                designId: null,
                wilaya: workshop.location,
                // Optional: Filter by status if needed
            };

            const [leads, total] = await Promise.all([
                prisma.lead.findMany({
                    where: whereCustom,
                    skip,
                    take: parseInt(limit),
                    orderBy: { createdAt: 'desc' },
                    include: {
                        // Include any relations if needed
                    }
                }),
                prisma.lead.count({ where: whereCustom })
            ]);

            return res.json({
                leads: leads.map(l => ({
                    ...l,
                    // Map to expected format if needed, or frontend handles it
                    lead: l // For consistency with LeadDelivery structure if frontend expects it, or just return lead
                })),
                // Actually, frontend likely expects structure { lead: { ... } } if reusing components.
                // But let's check Requests.jsx later. For now, let's return clean leads and handle in frontend.
                // Re-reading Requests.jsx code (from memory/previous views), it maps `delivery.lead`.
                // So if we return raw leads, we might need to adjust frontend or map here.
                // Let's return a structure mimicking LeadDelivery for easier frontend reuse:
                leads: leads.map(l => ({
                    id: l.id, // Fake Delivery ID (or use lead id)
                    lead: l,
                    status: l.status, // Lead status
                    isCustom: true
                })),
                total,
                pages: Math.ceil(total / limit)
            });
        }

        const where = { workshopId: workshop.id };

        const [deliveries, total] = await Promise.all([
            prisma.leadDelivery.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: { deliveredAt: 'desc' },
                include: {
                    lead: {
                        include: {
                            design: true // Include design validation
                        }
                    },
                    offers: true
                }
            }),
            prisma.leadDelivery.count({ where })
        ]);

        res.json({
            leads: deliveries,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('GetWorkshopLeads error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/workshop/leads/:id/view
 * Workshop - Mark lead as viewed
 */
async function markLeadViewed(req, res) {
    try {
        const leadDeliveryId = parseInt(req.params.id);

        await prisma.leadDelivery.update({
            where: { id: leadDeliveryId },
            data: { viewStatus: true }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('MarkLeadViewed error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/workshop/leads/:id/offer
 * Workshop - Submit offer for a lead
 */
async function submitOffer(req, res) {
    try {
        const leadDeliveryId = parseInt(req.params.id);
        const { price, leadTimeDays, message } = req.body;

        const offer = await prisma.offer.create({
            data: {
                leadDeliveryId,
                price: parseFloat(price),
                leadTimeDays: parseInt(leadTimeDays),
                message
            }
        });

        res.status(201).json(offer);
    } catch (error) {
        console.error('SubmitOffer error:', error);
        res.status(500).json({ message: 'حدث خطأ في إرسال العرض' });
    }
}



/**
 * POST /api/workshop/custom-leads/:id/offer
 * Workshop - Submit offer for a CUSTOM lead (creates delivery if needed)
 */
async function submitCustomOffer(req, res) {
    try {
        const leadId = parseInt(req.params.id);
        const { price, leadTimeDays, message } = req.body;

        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

        // Verify lead exists and is valid for this workshop
        const lead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        if (!lead || lead.designId !== null || lead.wilaya !== workshop.location) {
            return res.status(403).json({ message: 'Invalid lead for this workshop' });
        }

        // Find or Create LeadDelivery
        let delivery = await prisma.leadDelivery.findFirst({
            where: {
                leadId: leadId,
                workshopId: workshop.id
            }
        });

        if (!delivery) {
            delivery = await prisma.leadDelivery.create({
                data: {
                    leadId: leadId,
                    workshopId: workshop.id,
                    viewStatus: true // Mark as viewed since they are making an offer
                }
            });
        }

        const offer = await prisma.offer.create({
            data: {
                leadDeliveryId: delivery.id,
                price: parseFloat(price),
                leadTimeDays: parseInt(leadTimeDays),
                message
            }
        });

        // Update lead status to RESPONDED if it was NEW
        if (lead.status === 'NEW') {
            await prisma.lead.update({
                where: { id: leadId },
                data: { status: 'RESPONDED' }
            });
        }

        res.status(201).json(offer);
    } catch (error) {
        console.error('SubmitCustomOffer error:', error);
        res.status(500).json({ message: 'Error submitting offer' });
    }
}

/**
 * PUT /api/workshop/custom-leads/:id/status
 * Workshop - Update status of a CUSTOM lead (Confirmed, No Response, Cancelled)
 */
async function updateCustomLeadStatus(req, res) {
    try {
        const leadId = parseInt(req.params.id);
        const { status } = req.body; // 'CONFIRMED', 'NO_RESPONSE', 'CANCELLED'

        if (!['_CONFIRMED', 'CONFIRMED', 'NO_RESPONSE', 'CANCELLED', 'SOLD'].includes(status) && status !== 'CONFIRMED') {
            // Note: 'SOLD' might be used for 'Confirmed' alias if needed, but let's stick to user request.
            // User asked for "mouakada" (Confirmed), "maradch" (No Response), "moulghate" (Cancelled).
        }

        // Allow standardized statuses
        const validStatuses = ['CONFIRMED', 'NO_RESPONSE', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) return res.status(404).json({ message: 'Workshop not found' });

        const lead = await prisma.lead.findUnique({
            where: { id: leadId }
        });

        if (!lead || lead.designId !== null || lead.wilaya !== workshop.location) {
            return res.status(403).json({ message: 'Invalid lead for this workshop' });
        }

        const updatedLead = await prisma.lead.update({
            where: { id: leadId },
            data: { status }
        });

        res.json(updatedLead);
    } catch (error) {
        console.error('UpdateStatus error:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
}

/**
 * GET /api/client/leads
 * Client - Get their own leads
 */
async function getClientLeads(req, res) {
    try {
        const clientId = req.user.id;
        const leads = await prisma.lead.findMany({
            where: { clientId },
            orderBy: { createdAt: 'desc' },
            include: {
                design: true,
                deliveries: {
                    include: {
                        workshop: {
                            select: { name: true, phone: true }
                        }
                    }
                }
            }
        });

        res.json({ success: true, leads });
    } catch (error) {
        console.error('GetClientLeads Error:', error);
        res.status(500).json({ message: 'حدث خطأ في جلب الطلبات' });
    }
}

module.exports = {
    submitLead,
    getWorkshopLeads,
    markLeadViewed,
    submitOffer,
    submitCustomOffer,
    updateCustomLeadStatus,
    getClientLeads
};
