import React, { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { wilayas } from '../utils/wilayas';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('CLIENT'); // Default role
    // Workshop specific fields
    const [workshopName, setWorkshopName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');

    // Auth state
    const [otp, setOtp] = useState('');
    const [requireOtp, setRequireOtp] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const { register, verifyEmail, resendOtp, googleLogin } = useAuth();
    const navigate = useNavigate();

    const handleRedirect = (user) => {
        if (user.role === 'ADMIN') navigate('/dashboard/admin');
        else if (user.role === 'WORKSHOP') navigate('/dashboard/workshop');
        else navigate('/');
    };

    const validatePassword = (pass) => {
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\W]{8,}$/;
        return strongPasswordRegex.test(pass);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('كلمات المرور غير متطابقة');
            return;
        }

        if (!validatePassword(password)) {
            setError('كلمة المرور ضعيفة. يجب أن تتكون من 8 أحرف على الأقل، تحتوي على حرف كبير، صغير، ورقم.');
            return;
        }

        try {
            const additionalData = role === 'WORKSHOP' ? { workshopName, phone, location } : {};
            const data = await register(name, email, password, role, additionalData);

            if (data?.requireOtp) {
                setRequireOtp(true);
                setSuccessMessage('تم التسجيل بنجاح. راجع بريدك الإلكتروني للحصول على رمز التفعيل.');
            } else if (data?.id) {
                handleRedirect(data);
            }
        } catch (err) {
            setError(err.message || 'فشل التسجيل. حاول مرة أخرى.');
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
            const data = await googleLogin(credentialResponse.credential, role);
            if (data?.user) {
                handleRedirect(data.user);
            }
        } catch (err) {
            setError(err.message || 'فشل التسجيل بحساب جوجل');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
            <div style={{
                background: 'url(https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=1000) center/cover',
                position: 'relative'
            }} className="hidden-mobile">
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }}></div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', height: '100vh', overflowY: 'auto' }}>
                <div style={{ width: '100%', maxWidth: '400px', margin: 'auto' }} className="animate-slide-up">
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', display: 'block', marginBottom: '2rem', textAlign: 'center' }}>
                        Lamsadz
                    </Link>

                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{requireOtp ? 'تأكيد الحساب' : 'إنشاء حساب جديد'}</h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{requireOtp ? 'أدخل رمز التحقق المرسل لبريدك' : 'انضم إلينا واستمتع بتجربة فريدة'}</p>

                    {error && <div style={{ background: '#fee2e2', color: '#dc2626', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
                    {successMessage && <div style={{ background: '#dcfce7', color: '#166534', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>{successMessage}</div>}

                    {!requireOtp ? (
                        <>
                            <form onSubmit={handleSubmit}>
                                <Input
                                    type="text"
                                    placeholder="الاسم الكامل"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
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
                                <Input
                                    type="password"
                                    placeholder="تأكيد كلمة المرور"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />

                                <div style={{ marginBottom: '1.5rem' }}>
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

                                {role === 'WORKSHOP' && (
                                    <div className="animate-fade-in" style={{ marginBottom: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', color: '#334155' }}>بيانات الورشة</h3>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <Input
                                                type="text"
                                                placeholder="اسم الورشة"
                                                value={workshopName}
                                                onChange={(e) => setWorkshopName(e.target.value)}
                                                required={role === 'WORKSHOP'}
                                            />
                                        </div>
                                        <div style={{ marginBottom: '1rem' }}>
                                            <Input
                                                type="tel"
                                                placeholder="رقم الهاتف"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                required={role === 'WORKSHOP'}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600' }}>الولاية</label>
                                            <select
                                                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                required={role === 'WORKSHOP'}
                                            >
                                                <option value="">اختر الولاية...</option>
                                                {wilayas.map(w => (
                                                    <option key={w} value={w}>{w}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <Button variant="primary" style={{ width: '100%', marginTop: '1rem' }}>إنشاء حساب</Button>
                            </form>

                            <div style={{ position: 'relative', margin: '2rem 0', textAlign: 'center' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
                                <span style={{ background: 'var(--bg-primary)', padding: '0 1rem', position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', color: 'var(--text-muted)', fontSize: '0.9rem' }}>أو استخدم</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError('حدث خطأ أثناء التسجيل بجوجل')}
                                    text="signup_with"
                                />
                            </div>

                            <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                                لديك حساب بالفعل؟ <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>تسجيل الدخول</Link>
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

export default Register;
