const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER || 'test@gmail.com',
        pass: process.env.EMAIL_PASS || 'testpassword'
    },
    // Force Node.js to use IPv4 (family: 4) instead of IPv6 to prevent ENETUNREACH in Render
    family: 4,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Lamsadz Auth" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });
        console.log("Message sent: %s", info.messageId);
        return { success: true };
    } catch (error) {
        console.error("Error sending email: ", error);
        return { success: false, error: error.message || 'Unknown SMTP error' };
    }
};

module.exports = sendEmail;
