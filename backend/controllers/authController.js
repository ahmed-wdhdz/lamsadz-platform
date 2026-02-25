/**
 * Auth Controller
 * Handles: register, login, getMe, verifyEmail, resendOtp, googleLogin
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const { config } = require('../config/env');
const sendEmail = require('../utils/sendEmail');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID);

/**
 * Generate JWT token
 */
function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        config.jwtSecret,
        { expiresIn: config.jwtExpiresIn }
    );
}

/**
 * POST /api/register
 */
async function register(req, res) {
    try {
        console.log('Register request body:', req.body);
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            console.log('Missing fields:', { name, email, password });
            return res.status(400).json({ message: 'الرجاء ملء جميع الحقول المطلوبة' });
        }

        // Strong password check
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            console.log('Weak password rejected');
            return res.status(400).json({ message: 'كلمة المرور ضعيفة. يجب أن تتكون من 8 أحرف على الأقل، تحتوي على حرف كبير، حرف صغير، ورقم.' });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            console.log('Email exists:', existingUser.email);
            return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        console.log('Generated OTP:', otp);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || 'CLIENT',
                isEmailVerified: false,
                emailVerificationOtp: otp,
                authProvider: 'LOCAL'
            }
        });

        // If role is WORKSHOP, create initial workshop profile
        if (role === 'WORKSHOP') {
            await prisma.workshop.create({
                data: {
                    name: req.body.workshopName || `${name} ورشة`,
                    description: 'ورشة جديدة',
                    location: req.body.location || 'Alger',
                    phone: req.body.phone || '',
                    skills: '',
                    ownerId: user.id
                }
            });
        }

        // Send OTP via Email
        const emailSent = await sendEmail(
            email,
            'تأكيد بريدك الإلكتروني - Lamsadz',
            `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2>مرحباً بك في Lamsadz!</h2>
                <p>شكراً لتسجيلك. لتفعيل حسابك، الرجاء إدخال رمز التحقق التالي:</p>
                <h1 style="color: #d97706; letter-spacing: 5px;">${otp}</h1>
                <p>هذا الرمز صالح لمدة محدودة.</p>
             </div>`
        );

        if (!emailSent) {
            console.error('Failed to send OTP to ' + email);
        }

        res.status(201).json({
            message: 'تم التسجيل بنجاح. يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.',
            requireOtp: true,
            email: user.email
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/verify-email
 */
async function verifyEmail(req, res) {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني ورمز التحقق' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'المستخدم غير موجود' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'هذا الحساب مفعل مسبقاً' });
        }

        if (user.emailVerificationOtp !== otp) {
            return res.status(400).json({ message: 'رمز التحقق غير صحيح' });
        }

        // Mark as verified
        await prisma.user.update({
            where: { email },
            data: { isEmailVerified: true, emailVerificationOtp: null }
        });

        const token = generateToken(user);

        res.json({
            message: 'تم تفعيل الحساب بنجاح',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error('Verify Email error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/resend-otp
 */
async function resendOtp(req, res) {
    try {
        const { email } = req.body;

        if (!email) return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });
        if (user.isEmailVerified) return res.status(400).json({ message: 'الحساب مفعل مسبقاً' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await prisma.user.update({
            where: { email },
            data: { emailVerificationOtp: otp }
        });

        await sendEmail(
            email,
            'رمز تحقق جديد - Lamsadz',
            `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2>مرحباً بك مجدداً في Lamsadz</h2>
                <p>لقد طلبت رمز تحقق جديد، إليك الرمز:</p>
                <h1 style="color: #d97706; letter-spacing: 5px;">${otp}</h1>
             </div>`
        );

        res.json({ message: 'تم إرسال رمز جديد إلى بريدك الإلكتروني' });
    } catch (error) {
        console.error('Resend OTP error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/login
 */
async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        if (user.authProvider === 'GOOGLE' && !user.password) {
            return res.status(400).json({ message: 'هذا الحساب تم تسجيله عبر جوجل. يرجى المتابعة باستخدام زر جوجل.' });
        }

        if (user.blocked) {
            return res.status(403).json({ message: 'الحساب محظور' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: 'يرجى تفعيل بريدك الإلكتروني أولاً', requireOtp: true, email: user.email });
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'بيانات الدخول غير صحيحة' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/google
 * Body: { token, role (optional for signup) }
 */
async function googleLogin(req, res) {
    try {
        const { token, role } = req.body;

        if (!token) {
            return res.status(400).json({ message: 'معرف جوجل مفقود' });
        }

        // Verify Google token
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload) {
            return res.status(400).json({ message: 'توثيق جوجل غير صالح' });
        }

        const { email, name, sub: googleId } = payload;

        // Check if user exists
        let user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            if (user.blocked) {
                return res.status(403).json({ message: 'الحساب محظور' });
            }
            // Update authProvider if necessary, mark verified if it wasn't
            if (!user.isEmailVerified || user.authProvider === 'LOCAL') {
                user = await prisma.user.update({
                    where: { email },
                    data: { isEmailVerified: true, googleId } // if they matched email with google, they are verified
                });
            }
        } else {
            // Register new user
            if (!role) {
                return res.status(400).json({
                    message: 'يرجى تحديد نوع الحساب أولاً',
                    requireRole: true,
                    token: token // send token back so frontend can retry
                });
            }

            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    role,
                    authProvider: 'GOOGLE',
                    googleId,
                    isEmailVerified: true // Google emails are already verified
                }
            });

            // If role is WORKSHOP, create initial workshop profile
            if (user.role === 'WORKSHOP') {
                await prisma.workshop.create({
                    data: {
                        name: `${name} ورشة`,
                        description: 'ورشة جديدة',
                        location: 'Alger',
                        phone: '',
                        skills: '',
                        ownerId: user.id
                    }
                });
            }
        }

        const jwtToken = generateToken(user);

        res.json({
            token: jwtToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });

    } catch (error) {
        console.error('Google Login error:', error);
        res.status(500).json({ message: 'حدث خطأ أثناء معالجة تسجيل الدخول عبر جوجل' });
    }
}

/**
 * GET /api/me
 */
async function getMe(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, name: true, email: true, role: true }
        });
        res.json(user);
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * PUT /api/me
 */
async function updateProfile(req, res) {
    try {
        const { name, password } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (password) {
            // check strong password here too
            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
            if (!strongPasswordRegex.test(password)) {
                return res.status(400).json({ message: 'كلمة المرور ضعيفة. يجب أن تتكون من 8 أحرف على الأقل، تحتوي على حرف كبير، حرف صغير، ورقم.' });
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        const user = await prisma.user.update({
            where: { id: req.user.id },
            data: updateData,
            select: { id: true, name: true, email: true, role: true }
        });

        res.json({ success: true, user, message: 'تم تحديث البيانات بنجاح' });
    } catch (error) {
        console.error('UpdateProfile error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

/**
 * POST /api/auth/forgot-password
 */
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني' });

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // We just return success even if not found to prevent email enumeration
            return res.json({ message: 'إذا كان البريد الإلكتروني مسجلاً، ستتلقى رمز استعادة المرور قريباً' });
        }

        // Generate 6 digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB (valid for 15 minutes)
        await prisma.user.update({
            where: { id: user.id },
            data: {
                resetPasswordOtp: otp,
                resetPasswordExpiresAt: new Date(Date.now() + 15 * 60 * 1000)
            }
        });

        // Send Email
        const emailSent = await sendEmail(
            email,
            'استعادة كلمة المرور - Lamsadz',
            `<div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
                <h2>طلب استعادة كلمة المرور</h2>
                <p>لقد طلبتم استعادة كلمة المرور لحسابكم. الرجاء استخدام الرمز التالي لإعادة تعيين كلمة المرور:</p>
                <h1 style="color: #d97706; letter-spacing: 5px;">${otp}</h1>
                <p>هذا الرمز صالح لمدة 15 دقيقة فقط. إذا لم تطلب هذا، يمكنك تجاهل هذه الرسالة.</p>
             </div>`
        );

        if (!emailSent) {
            return res.status(500).json({ message: 'تعذر إرسال البريد الإلكتروني. يرجى التأكد من إعدادات الخادم.' });
        }

        res.json({ message: 'تم إرسال رمز الاستعادة إلى بريدك الإلكتروني بنجاح' });
    } catch (error) {
        console.error('ForgotPassword error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم أثناء المحاولة: ' + (error.message || 'Unknown error') });
    }
}

/**
 * POST /api/auth/reset-password
 */
async function resetPassword(req, res) {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'الرجاء إدخال البريد الإلكتروني، رمز التفعيل، وكلمة المرور الجديدة' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'البريد الإلكتروني أو رمز التحقق غير صحيح' });
        }

        if (user.resetPasswordOtp !== otp || new Date() > new Date(user.resetPasswordExpiresAt)) {
            return res.status(400).json({ message: 'رمز التحقق غير صحيح أو انتهت صلاحيته' });
        }

        // Strong password check
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
        if (!strongPasswordRegex.test(newPassword)) {
            return res.status(400).json({ message: 'كلمة المرور ضعيفة. يجب أن تتكون من 8 أحرف على الأقل، تحتوي على حرف كبير، حرف صغير، ورقم.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordOtp: null,
                resetPasswordExpiresAt: null
            }
        });

        res.json({ message: 'تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول' });
    } catch (error) {
        console.error('ResetPassword error:', error);
        res.status(500).json({ message: 'حدث خطأ في الخادم' });
    }
}

module.exports = {
    register,
    login,
    verifyEmail,
    resendOtp,
    googleLogin,
    getMe,
    updateProfile,
    forgotPassword,
    resetPassword
};
