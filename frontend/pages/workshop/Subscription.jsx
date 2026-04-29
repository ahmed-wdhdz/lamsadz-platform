import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Check, Upload, Clock, AlertCircle, CreditCard, ShieldCheck, Star } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Subscription = () => {
    const { token } = useAuth();
    const { isArabic, t } = useLanguage();
    const [workshop, setWorkshop] = useState(null);
    const [step, setStep] = useState(1); // 1: Plans, 2: Payment, 3: Status
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showRenew, setShowRenew] = useState(false);

    useEffect(() => {
        fetchWorkshop();
    }, []);

    const fetchWorkshop = async () => {
        try {
            const res = await fetch(`${API_URL}/workshops/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                if (!data) {
                    // No workshop exists yet
                    setWorkshop({ status: 'NEW' });
                    setShowRenew(true);
                    setStep(1);
                    return;
                }
                setWorkshop(data);

                // Initial State Logic
                if (data.status === 'APPROVED') {
                    // Show Status View by default
                    setShowRenew(false);
                } else if (data.status === 'WAITING_APPROVAL') {
                    setStep(3);
                    setShowRenew(true);
                } else if (data.status === 'REJECTED') {
                    setStep(1);
                    setShowRenew(true);
                    setMessage(`${isArabic ? 'ملاحظة الإدارة:' : 'Admin Note:'} ${data.payments?.[0]?.adminNote || (isArabic ? 'تم رفض الإيصال' : 'Receipt rejected')}`);
                } else {
                    // PENDING_PAYMENT or New
                    setShowRenew(true);
                    setStep(1);
                    // Always show plans first, even if pending payment exists
                    // User can re-select plan which updates the pending payment on backend
                }
            } else {
                // API error, show new workshop state
                setWorkshop({ status: 'NEW' });
                setShowRenew(true);
                setStep(1);
            }
        } catch (err) {
            console.error(err);
            setWorkshop({ status: 'NEW' });
            setShowRenew(true);
            setStep(1);
        }
    };

    const handleSelectPlan = async (plan) => {
        if (!workshop.id) {
            setMessage(isArabic ? 'يجب إعداد ملف الورشة أولاً قبل الاشتراك' : 'You must set up your workshop profile first before subscribing');
            return;
        }

        setSelectedPlan(plan);
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/workshops/${workshop.id}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ plan })
            });

            if (res.ok) {
                setStep(2);
            } else {
                setMessage(isArabic ? 'حدث خطأ في اختيار الخطة' : 'Error selecting plan');
            }
        } catch (err) {
            console.error(err);
            setMessage(isArabic ? 'حدث خطأ في الاتصال' : 'Connection error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('proof', file);

            const res = await fetch(`${API_URL}/workshops/${workshop.id}/payment-proof`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setStep(3);
                fetchWorkshop();
            } else {
                const errorData = await res.json();
                setMessage(errorData.message || (isArabic ? 'فشل عملية الرفع، يرجى المحاولة مرة أخرى.' : 'Upload failed, please try again.'));
            }
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!workshop) return <div className="text-center p-8">{t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')}</div>;

    // View: New Workshop (No Profile)
    if (workshop.status === 'NEW') {
        return (
            <div style={{
                maxWidth: '600px',
                margin: '4rem auto',
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'white',
                borderRadius: '24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
                <div style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: '#3b82f6'
                }}>
                    <ShieldCheck size={40} />
                </div>
                <h1 style={{
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    color: '#1f2937'
                }}>
                    {isArabic ? 'أكمل إعداد ورشتك أولاً' : 'Complete your workshop setup first'}
                </h1>
                <p style={{
                    color: '#6b7280',
                    marginBottom: '2rem',
                    fontSize: '1.1rem',
                    lineHeight: '1.6'
                }}>
                    {isArabic ? 'للبدء في استقبال الطلبات والاشتراك في الباقات، يرجى إكمال إعداد ملف الورشة الخاص بك (الاسم، الموقع، وأرقام التواصل).' : 'To start receiving orders and subscribe to plans, please complete your workshop profile (Name, Location, and Contact).'}
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => window.location.href = '/dashboard/workshop/profile'}
                        style={{
                            padding: '1rem 2rem',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            borderRadius: '12px',
                            fontWeight: '700',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {isArabic ? 'إعداد الملف الشخصي ←' : 'Setup Profile →'}
                    </button>
                </div>
            </div>
        );
    }

    // View: Active Subscription Status
    if (!showRenew && workshop.status === 'APPROVED') {
        const payment = workshop.payments?.[0];
        return (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    padding: '3rem',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e5e7eb',
                    textAlign: 'center'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 20px rgba(22, 163, 74, 0.2)'
                    }}>
                        <ShieldCheck size={50} style={{ color: '#166534' }} />
                    </div>

                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                    }}>
                        {isArabic ? 'اشتراكك نشط ومفعل' : 'Your subscription is active'}
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: '#6b7280',
                        marginBottom: '2.5rem'
                    }}>
                        {isArabic ? 'استمتع بكافة مميزات المنصة وتواصل مع زبائنك بكل حرية' : 'Enjoy all platform features and communicate with your clients freely'}
                    </p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        <div style={{
                            background: '#f9fafb',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #f3f4f6'
                        }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{isArabic ? 'الباقة الحالية' : 'Current Plan'}</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>
                                {payment?.plan === 'MONTHLY' ? (isArabic ? 'الباقة الشهرية' : 'Monthly Plan') : (isArabic ? 'الباقة السنوية (Premium)' : 'Annual Plan (Premium)')}
                            </p>
                        </div>
                        <div style={{
                            background: '#f9fafb',
                            padding: '1.5rem',
                            borderRadius: '16px',
                            border: '1px solid #f3f4f6'
                        }}>
                            <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{isArabic ? 'تاريخ التفعيل' : 'Activation Date'}</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: '700', color: '#1f2937' }}>
                                {payment?.validatedAt
                                    ? new Date(payment.validatedAt).toLocaleDateString(
                                        isArabic ? 'ar-DZ' : 'en-GB',
                                        { day: 'numeric', month: 'long', year: 'numeric' }
                                    )
                                    : '-'}
                            </p>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <button
                            onClick={() => { setShowRenew(true); setStep(1); }}
                            style={{
                                padding: '1rem 2rem',
                                background: 'white',
                                color: '#3b82f6',
                                border: '2px solid #3b82f6',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseOver={e => {
                                e.currentTarget.style.background = '#eff6ff';
                            }}
                            onMouseOut={e => {
                                e.currentTarget.style.background = 'white';
                            }}
                        >
                            {isArabic ? 'تغيير أو تجديد الاشتراك' : 'Change or Renew Subscription'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // View: Subscription Flow (Plans -> Payment -> Wait)
    return (
        <div className="max-w-5xl mx-auto" dir="rtl">
            {workshop.status === 'APPROVED' && (
                <button onClick={() => setShowRenew(false)} className="mb-4 text-gray-500 hover:text-gray-900">
                    &larr; {isArabic ? 'العودة' : 'Back'}
                </button>
            )}

            {step === 1 && (
                <div>
                    {/* Header */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h1 style={{
                            fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                            fontWeight: '800',
                            color: 'var(--text-primary)',
                            marginBottom: '0.75rem'
                        }}>
                            {isArabic ? 'اختر خطة الاشتراك المناسبة لك' : 'Choose the subscription plan that suits you'}
                        </h1>
                        <p style={{
                            color: 'var(--text-muted)',
                            fontSize: '1.1rem',
                            maxWidth: '500px',
                            margin: '0 auto'
                        }}>
                            {isArabic ? 'ابدأ بعرض خدماتك وحرفتك للآلاف من الزبائن المحتملين.' : 'Start offering your services and crafts to thousands of potential customers.'}
                        </p>
                    </div>

                    {message && (
                        <div style={{
                            background: '#fef2f2',
                            color: '#991b1b',
                            padding: '1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            marginBottom: '2rem',
                            maxWidth: '600px',
                            margin: '0 auto 2rem'
                        }}>
                            <AlertCircle size={20} /> {message}
                        </div>
                    )}

                    {/* Pricing Cards */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>

                        {/* Yearly Plan - Featured */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4f9cf9 0%, #3b82f6 100%)',
                            borderRadius: '24px',
                            padding: '2rem',
                            color: 'white',
                            position: 'relative',
                            boxShadow: '0 20px 60px rgba(79, 156, 249, 0.3)',
                            order: 1
                        }}>
                            {/* Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '-12px',
                                right: '50%',
                                transform: 'translateX(50%)',
                                background: '#f97316',
                                color: 'white',
                                padding: '0.5rem 1.25rem',
                                borderRadius: '999px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.4)'
                            }}>
                                {isArabic ? 'الأفضل قيمة (توفير شهرين)' : 'Best Value (Save 2 months)'}
                            </div>

                            <h3 style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                textAlign: 'center',
                                marginTop: '1rem',
                                marginBottom: '1.5rem'
                            }}>{isArabic ? 'سنوي' : 'Yearly'}</h3>

                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '900',
                                    lineHeight: '1'
                                }}>18,000</div>
                                <div style={{
                                    fontSize: '1rem',
                                    opacity: '0.9',
                                    marginTop: '0.5rem'
                                }}>{t('products.currency') || 'د.ج'} / {isArabic ? 'سنة' : 'Year'}</div>
                            </div>

                            <p style={{
                                textAlign: 'center',
                                fontSize: '0.95rem',
                                opacity: '0.9',
                                marginBottom: '2rem'
                            }}>
                                {isArabic ? 'للورش المحترفة التي تبحث عن الاستمرارية.' : 'For professional workshops seeking continuity.'}
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 2rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Star fill="currentColor" size={20} style={{ color: '#fbbf24' }} />
                                    <span style={{ fontWeight: '600' }}>{isArabic ? 'كل مميزات الباقة الشهرية' : 'All Monthly Plan features'}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Star fill="currentColor" size={20} style={{ color: '#fbbf24' }} />
                                    <span style={{ fontWeight: '600' }}>{isArabic ? 'أولوية في نتائج البحث' : 'Priority in search results'}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Star fill="currentColor" size={20} style={{ color: '#fbbf24' }} />
                                    <span style={{ fontWeight: '600' }}>{isArabic ? 'معرض أعمال غير محدود' : 'Unlimited Portfolio'}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <Star fill="currentColor" size={20} style={{ color: '#fbbf24' }} />
                                    <span style={{ fontWeight: '600' }}>{isArabic ? 'شارة "ورشة موثوقة"' : '"Trusted Workshop" Badge'}</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleSelectPlan('yearly')}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'white',
                                    color: '#3b82f6',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {loading ? (t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')) : (isArabic ? 'اختيار الباقة السنوية' : 'Choose Yearly Plan')}
                            </button>
                        </div>

                        {/* Monthly Plan */}
                        <div style={{
                            background: 'white',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '2px solid #e5e7eb',
                            position: 'relative',
                            order: 2
                        }}>
                            <h3 style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                textAlign: 'center',
                                color: '#3b82f6',
                                marginBottom: '1.5rem'
                            }}>{isArabic ? 'شهري' : 'Monthly'}</h3>

                            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                                <div style={{
                                    fontSize: '3.5rem',
                                    fontWeight: '900',
                                    color: '#1f2937',
                                    lineHeight: '1'
                                }}>2,000</div>
                                <div style={{
                                    fontSize: '1rem',
                                    color: '#6b7280',
                                    marginTop: '0.5rem'
                                }}>{t('products.currency') || 'د.ج'} / {isArabic ? 'شهر' : 'Month'}</div>
                            </div>

                            <p style={{
                                textAlign: 'center',
                                fontSize: '0.95rem',
                                color: '#6b7280',
                                marginBottom: '2rem'
                            }}>
                                {isArabic ? 'مثالي لتجربة المنصة والبدء السريع.' : 'Perfect for testing the platform & quick start.'}
                            </p>

                            <ul style={{
                                listStyle: 'none',
                                padding: 0,
                                margin: '0 0 2rem 0',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                                    <Check size={20} style={{ color: '#3b82f6' }} />
                                    <span>{isArabic ? 'ظهور في البحث المتقدم' : 'Appearance in advanced search'}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                                    <Check size={20} style={{ color: '#3b82f6' }} />
                                    <span>{isArabic ? 'معرض أعمال (Portfolio) محدود' : 'Limited Portfolio'}</span>
                                </li>
                                <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#374151' }}>
                                    <Check size={20} style={{ color: '#3b82f6' }} />
                                    <span>{isArabic ? 'دعم فني عبر البريد' : 'Email support'}</span>
                                </li>
                            </ul>

                            <button
                                onClick={() => handleSelectPlan('monthly')}
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    background: 'white',
                                    color: '#3b82f6',
                                    border: '2px solid #3b82f6',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                            >
                                {loading ? (t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')) : (isArabic ? 'اختيار الباقة الشهرية' : 'Choose Monthly Plan')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem'
                    }}>
                        <div>
                            <h2 style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                marginBottom: '0.25rem'
                            }}>
                                {isArabic ? 'الدفع وتأكيد الاشتراك' : 'Payment & Subscription Confirmation'}
                            </h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                {isArabic ? 'أرسل إيصال الدفع لتفعيل اشتراكك' : 'Send the payment receipt to activate your subscription'}
                            </p>
                        </div>
                        <button
                            onClick={() => setStep(1)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: '#f3f4f6',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#3b82f6',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            {isArabic ? '← تغيير الخطة' : '← Change Plan'}
                        </button>
                    </div>

                    {/* Amount Card */}
                    <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        color: 'white',
                        marginBottom: '1.5rem',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <div>
                            <p style={{ opacity: 0.9, marginBottom: '0.25rem' }}>{isArabic ? 'الباقة المختارة' : 'Selected Plan'}</p>
                            <p style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                {selectedPlan === 'monthly' ? (isArabic ? '🗓️ الباقة الشهرية' : '🗓️ Monthly Plan') : (isArabic ? '⭐ الباقة السنوية' : '⭐ Yearly Plan')}
                            </p>
                        </div>
                        <div style={{ textAlign: 'left' }}>
                            <p style={{ opacity: 0.9, marginBottom: '0.25rem' }}>{isArabic ? 'المبلغ' : 'Amount'}</p>
                            <p style={{ fontSize: '2rem', fontWeight: '900' }}>
                                {selectedPlan === 'monthly' ? '2,000' : '18,000'}
                                <span style={{ fontSize: '1rem', opacity: 0.9 }}> {t('products.currency') || 'د.ج'}</span>
                            </p>
                        </div>
                    </div>

                    {/* Payment Methods */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        marginBottom: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{
                            fontWeight: '700',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {isArabic ? '💳 طرق الدفع المتاحة' : '💳 Available Payment Methods'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: '#f0fdf4',
                                borderRadius: '12px',
                                border: '2px solid #bbf7d0'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'white',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    📱
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '700', color: '#166534' }}>BaridiMob</p>
                                    <p style={{
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem',
                                        color: '#15803d',
                                        letterSpacing: '1px'
                                    }}>
                                        00799999 0000000000 00
                                    </p>
                                </div>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: '#fef3c7',
                                borderRadius: '12px',
                                border: '2px solid #fde68a'
                            }}>
                                <div style={{
                                    width: '48px',
                                    height: '48px',
                                    background: 'white',
                                    borderRadius: '10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    🏦
                                </div>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: '700', color: '#92400e' }}>CCP</p>
                                    <p style={{
                                        fontFamily: 'monospace',
                                        fontSize: '1.1rem',
                                        color: '#a16207',
                                        letterSpacing: '1px'
                                    }}>
                                        00000000 00
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upload Section */}
                    <div style={{
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                        border: '1px solid #e5e7eb'
                    }}>
                        <h3 style={{
                            fontWeight: '700',
                            marginBottom: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            {isArabic ? '📤 رفع إيصال الدفع' : '📤 Upload Payment Receipt'}
                        </h3>

                        <div style={{
                            border: '2px dashed #e5e7eb',
                            borderRadius: '12px',
                            padding: '2rem',
                            textAlign: 'center',
                            background: '#f9fafb',
                            cursor: 'pointer',
                            marginBottom: '1rem'
                        }}>
                            <input
                                type="file"
                                onChange={(e) => {
                                    setFile(e.target.files[0]);
                                    if (e.target.files[0]) setPreviewUrl(URL.createObjectURL(e.target.files[0]));
                                }}
                                style={{ display: 'none' }}
                                id="receipt-upload"
                                accept="image/*"
                            />
                            <label htmlFor="receipt-upload" style={{ cursor: 'pointer' }}>
                                <Upload size={40} style={{ color: '#9ca3af', margin: '0 auto 0.75rem' }} />
                                <p style={{ color: '#6b7280', fontWeight: '600', marginBottom: '0.25rem' }}>
                                    {isArabic ? 'اضغط لرفع صورة الإيصال' : 'Click to upload receipt image'}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
                                    {isArabic ? 'PNG, JPG (حد أقصى 5MB)' : 'PNG, JPG (Max 5MB)'}
                                </p>
                            </label>
                        </div>

                        {previewUrl && (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: '#f0fdf4',
                                borderRadius: '12px',
                                marginBottom: '1rem'
                            }}>
                                <img
                                    src={previewUrl}
                                    alt="Receipt"
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        objectFit: 'cover',
                                        borderRadius: '8px',
                                        border: '2px solid #bbf7d0'
                                    }}
                                />
                                <div>
                                    <p style={{ fontWeight: '600', color: '#166534' }}>{isArabic ? '✅ تم اختيار الصورة' : '✅ Image selected'}</p>
                                    <p style={{ fontSize: '0.85rem', color: '#16a34a' }}>{file?.name}</p>
                                </div>
                            </div>
                        )}

                        <button
                            onClick={handleUpload}
                            disabled={!file || loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: !file || loading
                                    ? '#9ca3af'
                                    : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '700',
                                cursor: !file || loading ? 'not-allowed' : 'pointer',
                                boxShadow: file && !loading ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {loading ? (
                                <>{t('form.loading') || (isArabic ? 'جاري الرفع...' : 'Uploading...')}</>
                            ) : (
                                <>
                                    <ShieldCheck size={20} />
                                    {isArabic ? 'تأكيد الدفع' : 'Confirm Payment'}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div style={{
                    maxWidth: '500px',
                    margin: '0 auto',
                    textAlign: 'center',
                    padding: '3rem 2rem'
                }}>
                    <div style={{
                        width: '100px',
                        height: '100px',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 1.5rem',
                        boxShadow: '0 10px 30px rgba(217, 119, 6, 0.2)'
                    }}>
                        <Clock size={50} style={{ color: '#d97706' }} />
                    </div>
                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '0.75rem'
                    }}>
                        {isArabic ? 'جاري المراجعة ⏳' : 'Under Review ⏳'}
                    </h2>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        lineHeight: '1.7',
                        marginBottom: '2rem'
                    }}>
                        {isArabic ? 'تم استلام إيصال الدفع بنجاح!' : 'Payment receipt received successfully!'}
                        <br />
                        {isArabic ? 'سنقوم بتفعيل اشتراكك فور التحقق من العملية.' : 'We will activate your subscription upon verification.'}
                    </p>
                    <div style={{
                        background: '#f0f9ff',
                        padding: '1rem',
                        borderRadius: '12px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        color: '#0369a1'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>💡</span>
                        <span style={{ fontWeight: '600' }}>
                            {isArabic ? 'عادةً ما يتم التفعيل خلال 24 ساعة' : 'Activation usually takes up to 24 hours'}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscription;
