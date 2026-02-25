/**
 * Design Controller
 * Handles: product/design CRUD operations
 */

const prisma = require('../config/database');

/**
 * GET /api/designs
 * Public - List all published designs
 */
async function getDesigns(req, res) {
    try {
        const { category, wilaya, page = 1, limit = 12 } = req.query;
        const skip = (page - 1) * limit;

        const where = { status: 'PUBLISHED' };
        if (category) where.category = category;

        // If filtering by wilaya, join with workshop
        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: [
                    { featuredUntil: 'desc' },
                    { createdAt: 'desc' }
                ],
                include: {
                    workshop: {
                        select: { id: true, name: true, location: true }
                    }
                }
            }),
            prisma.product.count({ where })
        ]);

        // Filter by wilaya after fetch if needed
        const filtered = wilaya
            ? products.filter(p => p.workshop.location === wilaya)
            : products;

        // Manual sort to ensure products with active featuredUntil are at the top
        // because Prisma's `desc` sorting puts null values first in Postgres (sometimes).
        const now = new Date();
        const sortedProducts = filtered.sort((a, b) => {
            const aFeatured = a.featuredUntil && new Date(a.featuredUntil) > now;
            const bFeatured = b.featuredUntil && new Date(b.featuredUntil) > now;
            if (aFeatured && !bFeatured) return -1;
            if (!aFeatured && bFeatured) return 1;
            // If both or neither are featured, sort by createdAt descending
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        res.json({
            products: sortedProducts,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('GetDesigns error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * GET /api/designs/:id
 * Public - Get design details
 */
async function getDesign(req, res) {
    try {
        const product = await prisma.product.findUnique({
            where: { id: parseInt(req.params.id) },
            include: {
                workshop: {
                    select: { id: true, name: true, location: true, phone: true }
                }
            }
        });

        if (!product || product.status !== 'PUBLISHED') {
            return res.status(404).json({ message: 'التصميم غير موجود' });
        }

        res.json(product);
    } catch (error) {
        console.error('GetDesign error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * GET /api/workshop/products
 * Workshop - Get own products
 */
async function getMyDesigns(req, res) {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const skip = (page - 1) * limit;

        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) {
            return res.status(404).json({ message: 'الورشة غير موجودة' });
        }

        const where = { workshopId: workshop.id };
        if (status) where.status = status;

        const [products, total] = await Promise.all([
            prisma.product.findMany({ where, skip, take: parseInt(limit), orderBy: { createdAt: 'desc' } }),
            prisma.product.count({ where })
        ]);

        res.json({
            products,
            total,
            pages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error('GetMyDesigns error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/workshop/products
 * Workshop - Create new product
 */
async function createDesign(req, res) {
    try {
        const { title, category, description, price } = req.body;
        const images = req.files ? req.files.map(f => f.filename) : [];

        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) {
            return res.status(404).json({ message: 'الورشة غير موجودة' });
        }

        if (workshop.status !== 'APPROVED') {
            return res.status(403).json({ message: 'حساب الورشة غير مفعل، لا يمكنك إضافة منتجات' });
        }

        const product = await prisma.product.create({
            data: {
                workshopId: workshop.id,
                title,
                category,
                description,
                price: parseFloat(price),
                images: JSON.stringify(images)
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('CreateDesign error:', error);
        res.status(500).json({ message: 'حدث خطأ في إنشاء التصميم' });
    }
}

/**
 * PUT /api/workshop/products/:id
 * Workshop - Update product
 */
async function updateDesign(req, res) {
    try {
        const productId = parseInt(req.params.id);
        const { title, category, description, price, existingImages } = req.body;
        const newImages = req.files ? req.files.map(f => f.filename) : [];

        const workshop = await prisma.workshop.findUnique({
            where: { ownerId: req.user.id }
        });

        if (!workshop) {
            return res.status(404).json({ message: 'الورشة غير موجودة' });
        }

        if (workshop.status !== 'APPROVED') {
            return res.status(403).json({ message: 'حساب الورشة غير مفعل، لا يمكنك تعديل منتجات' });
        }

        // Merge existing and new images
        let existing = [];
        try {
            existing = existingImages ? JSON.parse(existingImages) : [];
        } catch (e) { }

        const images = [...existing, ...newImages];

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                title,
                category,
                description,
                price: parseFloat(price),
                images: JSON.stringify(images)
            }
        });

        res.json(product);
    } catch (error) {
        console.error('UpdateDesign error:', error);
        res.status(500).json({ message: 'حدث خطأ في تحديث التصميم' });
    }
}

/**
 * DELETE /api/workshop/products/:id
 * Workshop - Soft delete product
 */
async function deleteDesign(req, res) {
    try {
        const productId = parseInt(req.params.id);

        await prisma.product.update({
            where: { id: productId },
            data: { status: 'ARCHIVED' }
        });

        res.json({ success: true });
    } catch (error) {
        console.error('DeleteDesign error:', error);
        res.status(500).json({ message: 'حدث خطأ في حذف التصميم' });
    }
}

module.exports = {
    getDesigns,
    getDesign,
    getMyDesigns,
    createDesign,
    updateDesign,
    deleteDesign
};
