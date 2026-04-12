const bcrypt = require('bcryptjs');
const prisma = require('./config/database');

async function resetAdminPassword() {
    const newPassword = '12345azert';
    const hashed = await bcrypt.hash(newPassword, 10);
    
    const result = await prisma.user.updateMany({
        where: { role: 'ADMIN' },
        data: { password: hashed }
    });

    console.log(`✅ Admin password updated for ${result.count} account(s)`);
    console.log(`📧 Login with your admin email + password: ${newPassword}`);
}

resetAdminPassword()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
