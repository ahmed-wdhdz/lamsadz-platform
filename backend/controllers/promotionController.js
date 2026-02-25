const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

/**
 * @desc    Request a promotion for a product
 * @route   POST /api/promotions
 * @access  Private (Workshop only)
 */
exports.requestPromotion = async (req, res) => {
    try {
        const { productId, durationDays } = req.body;
        const ownerId = req.user.id;

        if (!productId || !durationDays || !req.file) {
            return res.status(400).json({ success: false, message: 'يرجى تقديم التصميم، المدة، وصورة إثبات الدفع.' });
        }

        const parsedDuration = parseInt(durationDays);
        if (parsedDuration <= 0) {
            return res.status(400).json({ success: false, message: 'مدة الترويج غير صالحة.' });
        }

        // Verify workshop ownership
        const workshop = await prisma.workshop.findUnique({
            where: { ownerId }
        });

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'الورشة غير موجودة.' });
        }

        // Verify product ownership
        const product = await prisma.product.findUnique({
            where: { id: parseInt(productId) }
        });

        if (!product || product.workshopId !== workshop.id) {
            return res.status(404).json({ success: false, message: 'التصميم غير موجود أو لا تملكه.' });
        }

        // Calculate amount (e.g., 1000 DZD per 7 days - simplified pricing logic for now)
        // Adjust pricing as needed. For now let's set a fixed rate: 1000 DZD per 7 days.
        const ratePerWeek = 1000;
        const weeks = Math.ceil(parsedDuration / 7);
        const amount = weeks * ratePerWeek;

        const promotionRequest = await prisma.promotionRequest.create({
            data: {
                workshopId: workshop.id,
                productId: product.id,
                amount: amount,
                durationDays: parsedDuration,
                proofUrl: req.file.filename,
                status: 'PENDING'
            }
        });

        res.status(201).json({ success: true, promotionRequest });
    } catch (error) {
        console.error('Request Promotion Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء طلب الترويج.' });
    }
};

/**
 * @desc    Get all promotion requests (for Admin)
 * @route   GET /api/promotions/admin
 * @access  Private (Admin only)
 */
exports.getAdminPromotions = async (req, res) => {
    try {
        const promotions = await prisma.promotionRequest.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                workshop: {
                    select: { name: true, phone: true }
                },
                product: {
                    select: { title: true, images: true }
                }
            }
        });

        res.status(200).json({ success: true, promotions });
    } catch (error) {
        console.error('Get Promotions Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب الطلبات.' });
    }
};

/**
 * @desc    Get workshop's own promotion requests
 * @route   GET /api/promotions/my
 * @access  Private (Workshop only)
 */
exports.getMyPromotions = async (req, res) => {
    try {
        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'الورشة غير موجودة.' });
        }

        const promotions = await prisma.promotionRequest.findMany({
            where: { workshopId: workshop.id },
            orderBy: { createdAt: 'desc' },
            include: {
                product: {
                    select: { title: true }
                }
            }
        });

        res.status(200).json({ success: true, promotions });
    } catch (error) {
        console.error('Get My Promotions Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب طلباتك.' });
    }
};

/**
 * @desc    Update promotion request status (Admin)
 * @route   PUT /api/promotions/:id/status
 * @access  Private (Admin only)
 */
exports.updatePromotionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminNote } = req.body;

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return res.status(400).json({ success: false, message: 'حالة غير صالحة.' });
        }

        const request = await prisma.promotionRequest.findUnique({
            where: { id: parseInt(id) }
        });

        if (!request) {
            return res.status(404).json({ success: false, message: 'الطلب غير موجود.' });
        }

        if (request.status !== 'PENDING' && status === 'APPROVED') {
            return res.status(400).json({ success: false, message: 'لا يمكن تفعيل طلب تمت معالجته مسبقاً.' });
        }

        // Update request status
        const updatedRequest = await prisma.promotionRequest.update({
            where: { id: parseInt(id) },
            data: {
                status,
                adminNote,
                updatedAt: new Date()
            }
        });

        // If approved, update the product's featuredUntil date
        if (status === 'APPROVED') {
            const product = await prisma.product.findUnique({
                where: { id: request.productId }
            });

            // Calculate new featuredUntil date
            let startDate = new Date();
            if (product.featuredUntil && product.featuredUntil > new Date()) {
                startDate = product.featuredUntil; // Extend if already featured
            }

            const newFeaturedUntil = new Date(startDate);
            newFeaturedUntil.setDate(newFeaturedUntil.getDate() + request.durationDays);

            await prisma.product.update({
                where: { id: request.productId },
                data: { featuredUntil: newFeaturedUntil }
            });
        }

        res.status(200).json({ success: true, promotion: updatedRequest });
    } catch (error) {
        console.error('Update Promotion Status Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء تحديث حالة الطلب.' });
    }
};
