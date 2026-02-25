const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Create a new public review
// @route   POST /api/reviews
// @access  Public
exports.createReview = async (req, res) => {
    try {
        const { rating, comment, reviewerName, reviewerEmail, workshopId } = req.body;

        // 1. Validate inputs
        if (!rating || rating < 1 || rating > 5 || !reviewerName) {
            return res.status(400).json({ success: false, message: 'الاسم والتقييم (1-5) مطلوبان.' });
        }
        if (!workshopId) {
            return res.status(400).json({ success: false, message: 'معرف الورشة مطلوب.' });
        }

        // 2. Verify workshop exists
        const workshop = await prisma.workshop.findUnique({
            where: { id: parseInt(workshopId) }
        });

        if (!workshop) {
            return res.status(404).json({ success: false, message: 'الورشة غير موجودة.' });
        }

        // 3. Create review
        const review = await prisma.review.create({
            data: {
                rating: parseInt(rating),
                comment,
                reviewerName,
                reviewerEmail: reviewerEmail || null,
                workshopId: parseInt(workshopId)
            }
        });

        res.status(201).json({ success: true, review });
    } catch (error) {
        console.error('Create Public Review Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ في السيرفر أثناء إضافة التقييم.' });
    }
};

// @desc    Get all reviews for a specific workshop
// @route   GET /api/reviews/workshop/:workshopId
// @access  Public
exports.getWorkshopReviews = async (req, res) => {
    try {
        const { workshopId } = req.params;
        const reviews = await prisma.review.findMany({
            where: { workshopId: parseInt(workshopId) },
            orderBy: { createdAt: 'desc' }
        });

        res.status(200).json({ success: true, count: reviews.length, reviews });
    } catch (error) {
        console.error('Get Reviews Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء جلب التقييمات.' });
    }
}

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin only)
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await prisma.review.findUnique({ where: { id: parseInt(id) } });

        if (!review) {
            return res.status(404).json({ success: false, message: 'التقييم غير موجود.' });
        }

        await prisma.review.delete({ where: { id: parseInt(id) } });
        res.status(200).json({ success: true, message: 'تم حذف التقييم بنجاح.' });
    } catch (error) {
        console.error('Delete Review Error:', error);
        res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف التقييم.' });
    }
}
