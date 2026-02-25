import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [requireOtp, setRequireOtp] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // --- Added for Google Signup Role Selection ---
    const [requireGoogleRole, setRequireGoogleRole] = useState(false);
    const [googleToken, setGoogleToken] = useState('');
    const [role, setRole] = useState('CLIENT');
    // ----------------------------------------------

    const { login, verifyEmail, resendOtp, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleRedirect = (user) => {
        if (user.role === 'ADMIN') navigate('/dashboard/admin');
        else if (user.role === 'WORKSHOP') navigate('/dashboard/workshop');
        else navigate('/');
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await login(email, password);
            if (data?.requireOtp) {
                setRequireOtp(true);
                setSuccessMessage('يرجى التحقق من بريدك الإلكتروني وإدخال رمز التفعيل المعطى.');
            } else if (data?.user?.id) {
                handleRedirect(data.user);
            } else {
                setError('حدث خطأ غير متوقع أثناء تسجيل الدخول.');
            }
        } catch (err) {
            setError(err.message || 'فشل تسجيل الدخول');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await verifyEmail(email, otp);
            handleRedirect(data.user);
        } catch (err) {
            setError(err.message || 'فشل التحقق');
        }
    };

    const handleResendOtp = async () => {
        setError('');
        setSuccessMessage('');
        try {
            await resendOtp(email);
            setSuccessMessage('تم إعادة إرسال الرمز بنجاح.');
        } catch (err) {
            setError(err.message || 'فشل إعادة الإرسال');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError('');
        try {
            const data = await googleLogin(credentialResponse.credential);
            handleRedirect(data.user);
        } catch (err) {
            if (err.requireRole) {
                setGoogleToken(err.token);
                setRequireGoogleRole(true);
            } else {
                setError(err.message || 'فشل الدخول بحساب جوجل');
            }
        }
    };

    const handleCompleteGoogleSignup = async (e) => {
        e.preventDefault();
        try {
            const data = await googleLogin(googleToken, role);
            handleRedirect(data.user);
        } catch (err) {
            setError(err.message || 'فشل استكمال التسجيل بحساب جوجل');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{
                background: 'url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=1000) center/cover',
                position: 'relative'
            }} className="hidden-mobile">
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }}></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
                <div style={{ width: '100%', maxWidth: '400px' }} className="animate-slide-up">
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', display: 'block', marginBottom: '3rem', textAlign: 'center' }}>
                        Lamsadz
                    </Link>

                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{requireOtp ? 'تأكيد الحساب' : 'مرحباً بعودتك'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{requireOtp ? 'أدخل رمز التحقق المرسل لبريدك' : 'الرجاء إدخال بياناتك لتسجيل الدخول'}</p>

                    {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
                    {successMessage && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{successMessage}</div>}

                    {requireGoogleRole ? (
                        <form onSubmit={handleCompleteGoogleSignup}>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'right' }}>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>نوع الحساب:</label>
                                <select
                                    style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '2px solid var(--gray-200)' }}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="CLIENT">عميل (Client)</option>
                                    <option value="WORKSHOP">ورشة (Workshop)</option>
                                </select>
                            </div>
                            <Button variant="primary" style={{ width: '100%' }}>استكمال التسجيل</Button>
                        </form>
                    ) : !requireOtp ? (
                        <>
                            <form onSubmit={handleLoginSubmit}>
                                <Input
                                    type="email"
                                    placeholder="البريد الإلكتروني"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Input
                                    type="password"
                                    placeholder="كلمة المرور"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />

                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '0.9rem' }}>
                                    <label style={{ display: 'flex', gap: '0.5rem', cursor: 'pointer' }}>
                                        <input type="checkbox" /> تذكرني
                                    </label>
                                    <Link to="/forgot-password" style={{ color: 'var(--primary)', textDecoration: 'none' }}>نسيت كلمة المرور؟</Link>
                                </div>

                                <Button variant="primary" style={{ width: '100%' }}>تسجيل الدخول</Button>
                            </form>

                            <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                                <span style={{ background: 'var(--bg-primary)', padding: '0 1rem', position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>أو استخدم</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('حدث خطأ أثناء الاتصال بجوجل')}
                                />
                            </div>

                            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                                ليس لديك حساب؟ <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>سجل الآن</Link>
                            </p>
                        </>
                    ) : (
                        <form onSubmit={handleVerifyOtp}>
                            <Input
                                type="text"
                                placeholder="رمز التحقق (OTP)"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                required
                            />
                            <Button variant="primary" style={{ width: '100%', marginBottom: '1rem' }}>تأكيد الرمز</Button>
                            <Button type="button" variant="outline" style={{ width: '100%' }} onClick={handleResendOtp}>إعادة إرسال الرمز</Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Login;
