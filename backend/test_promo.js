const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function run() {
    try {
        require('dotenv').config();
        // Fallback for native fetch in Node 18, or we can use axios if not present, but Node >=18 has fetch globally
        const workshopUser = await prisma.user.findFirst({
            where: {
                role: 'WORKSHOP',
                workshop: { products: { some: {} } }
            },
            include: { workshop: { include: { products: true } } }
        });
        const adminUser = await prisma.user.findFirst({ where: { role: 'ADMIN' } });

        if (!adminUser || !workshopUser || !workshopUser.workshop || workshopUser.workshop.products.length === 0) {
            console.log('Seed data missing.');
            return;
        }

        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash('password123', 10);
        await prisma.user.update({ where: { id: workshopUser.id }, data: { password: hash } });
        await prisma.user.update({ where: { id: adminUser.id }, data: { password: hash } });

        // Login Workshop
        const wLoginres = await axios.post('http://localhost:3000/api/auth/login', {
            email: workshopUser.email, password: 'password123'
        });
        const workshopToken = wLoginres.data.token;

        // Login Admin
        const aLoginres = await axios.post('http://localhost:3000/api/auth/login', {
            email: adminUser.email, password: 'password123'
        });
        const adminToken = aLoginres.data.token;

        const product = workshopUser.workshop.products[0];
        console.log(`1. Target Product: ${product.id} - ${product.title}`);

        // 2. Request Promotion
        const formData = new FormData();
        formData.append('productId', product.id);
        formData.append('durationDays', 7);
        fs.writeFileSync('test_receipt.jpg', 'binary content of receipt');
        formData.append('proofImage', fs.createReadStream('test_receipt.jpg'));

        console.log('2. Workshop requesting promotion...');
        const reqPromoRes = await axios.post('http://localhost:3000/api/promotions', formData, {
            headers: {
                'Authorization': `Bearer ${workshopToken}`,
                ...formData.getHeaders()
            }
        });

        const promoId = reqPromoRes.data.promotionRequest.id;
        console.log(`✅ Promotion Requested. Request ID: ${promoId}`);

        // 3. Admin Approves Promotion
        console.log('3. Admin approving promotion...');
        await axios.put(`http://localhost:3000/api/promotions/${promoId}/status`, {
            status: 'APPROVED', adminNote: 'Verified test payment'
        }, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        console.log(`✅ Promotion Approved.`);

        // 4. Check Products list sorting
        console.log('4. Checking public products list...');
        const productsRes = await axios.get('http://localhost:3000/api/products');

        const firstProduct = productsRes.data.products[0];
        console.log(`Top Product ID: ${firstProduct.id} | Title: ${firstProduct.title} | FeaturedUntil: ${firstProduct.featuredUntil}`);

        if (firstProduct.id === product.id && firstProduct.featuredUntil) {
            console.log('🌟 SUCCESS! 100% verified.');
        } else {
            console.log('❌ FAILED! The product is not at the top or not featured.');
        }

    } catch (e) {
        console.error('Test Execution Error:', e.response ? e.response.data : e.message);
    } finally {
        await prisma.$disconnect();
        if (fs.existsSync('test_receipt.jpg')) fs.unlinkSync('test_receipt.jpg');
    }
}
run();
