import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Package, Inbox, AlertCircle, Clock, Plus, ArrowLeft, Settings, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button';

const WorkshopHome = () => {
    const { token, user } = useAuth();
    const { t, isArabic } = useLanguage();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setError(null);
        try {
            const res = await fetch(`${API_URL}/workshop/home`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else if (res.status === 404) {
                // User has no workshop profile yet - this is fine, show setup screen
                setData(null);
            } else {
                throw new Error('Failed to load dashboard data');
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };



    if (error) return (
        <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div style={{ color: '#ef4444', marginBottom: '1rem' }}><AlertCircle size={48} style={{ margin: '0 auto' }} /></div>
            <h2>حدث خطأ في تحميل البيانات</h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>يرجى التحقق من اتصالك بالخادم أو إعادة المحاولة.</p>
            <Button onClick={fetchStats} variant="outline">إعادة المحاولة</Button>
        </div>
    );

    if (loading) return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
                color: 'var(--text-muted)',
            }}
        >
            {t('form.loading')}
        </div>
    );

    // No workshop profile yet - show welcome/setup screen
    if (!data) return (
        <div
            style={{
                maxWidth: '500px',
                margin: '4rem auto',
                textAlign: 'center',
                padding: '3rem',
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
            }}
        >
            <div
                style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--primary-light)',
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    color: 'var(--primary)',
                }}
            >
                <Package size={40} />
            </div>
            <h1
                style={{
                    fontSize: '1.75rem',
                    fontWeight: '800',
                    marginBottom: '0.75rem',
                    color: 'var(--text-primary)',
                }}
            >
                {isArabic ? 'مرحباً بك في لوحة الورشة!' : 'Welcome to your Workshop!'}
            </h1>
            <p
                style={{
                    color: 'var(--text-muted)',
                    marginBottom: '2rem',
                    lineHeight: '1.8',
                }}
            >
                {isArabic
                    ? 'لم يتم إعداد ملف الورشة الخاص بك بعد. قم بإكمال إعداد ملفك الشخصي للبدء في عرض تصاميمك واستقبال الطلبات.'
                    : 'Your workshop profile is not set up yet. Complete your profile setup to start showcasing your designs and receiving orders.'}
            </p>
            <Link
                to="/dashboard/workshop/profile"
                style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '1rem 2rem',
                    backgroundColor: 'var(--primary)',
                    color: 'var(--text-inverse)',
                    borderRadius: 'var(--radius-md)',
                    fontWeight: '700',
                }}
            >
                {isArabic ? 'إعداد ملف الورشة' : 'Setup Workshop Profile'}
                <ArrowLeft size={18} style={{ transform: isArabic ? 'none' : 'rotate(180deg)' }} />
            </Link>
        </div>
    );

    const { stats, activity } = data;

    const statCards = [
        {
            label: t('workshop.totalDesigns') || 'إجمالي التصاميم',
            value: stats.totalDesigns,
            icon: Package,
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            shadow: '0 4px 20px rgba(59, 130, 246, 0.2)',
        },
        {
            label: t('workshop.totalRequests') || 'إجمالي الطلبات',
            value: stats.totalRequests,
            icon: Inbox,
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            shadow: '0 4px 20px rgba(16, 185, 129, 0.2)',
        },
        {
            label: t('workshop.unreadRequests') || 'طلبات جديدة',
            value: stats.unreadRequests,
            icon: AlertCircle,
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            shadow: '0 4px 20px rgba(245, 158, 11, 0.2)',
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2.5rem' }}>
                <h1
                    style={{
                        fontSize: '2.25rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}
                >
                    {t('workshop.welcome') || 'مرحباً'}، <span style={{ color: '#3b82f6' }}>{user?.name}</span> 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                    {t('workshop.overview') || 'إليك نظرة عامة على نشاط ورشتك اليوم.'}
                </p>
            </div>

            {/* Subscription Banner */}
            <div
                style={{
                    background: stats.status === 'APPROVED' ? 'linear-gradient(to right, #f0fdf4, #dcfce7)' : 'linear-gradient(to right, #fffbeb, #fef3c7)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    marginBottom: '2.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: stats.status === 'APPROVED' ? '1px solid #bbf7d0' : '1px solid #fcd34d',
                    boxShadow: stats.status === 'APPROVED' ? '0 4px 15px rgba(22, 163, 74, 0.1)' : '0 4px 15px rgba(251, 191, 36, 0.1)'
                }}
            >
                <div style={{
                    background: stats.status === 'APPROVED' ? '#16a34a' : '#f59e0b',
                    borderRadius: '12px',
                    padding: '1rem',
                    color: 'white',
                    boxShadow: stats.status === 'APPROVED' ? '0 4px 10px rgba(22, 163, 74, 0.2)' : '0 4px 10px rgba(245, 158, 11, 0.2)'
                }}>
                    {stats.status === 'APPROVED' ? <CheckCircle size={32} /> : <AlertCircle size={32} />}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontWeight: '800',
                        color: stats.status === 'APPROVED' ? '#166534' : '#92400e',
                        marginBottom: '0.5rem',
                        fontSize: '1.1rem'
                    }}>
                        {stats.status === 'APPROVED'
                            ? (isArabic ? 'الاشتراك مفعل' : 'Subscription Active')
                            : (isArabic ? 'تنبيه الاشتراك' : 'Subscription Alert')}
                    </h3>
                    <p style={{ color: stats.status === 'APPROVED' ? '#15803d' : '#b45309', marginBottom: '0.5rem' }}>
                        {isArabic
                            ? `حالة حسابك: ${stats.status === 'PENDING_PAYMENT' ? 'بانتظار الدفع' : stats.status === 'WAITING_APPROVAL' ? 'قيد المراجعة' : stats.status === 'REJECTED' ? 'مرفوض - يرجى مراجعة السبب' : stats.status}. `
                            : `Account Status: ${stats.status === 'WAITING_APPROVAL' ? 'Pending Approval' : stats.status === 'PENDING_PAYMENT' ? 'Pending Payment' : stats.status}. `}

                        {stats.subscriptionEndsAt && (
                            <span style={{ fontWeight: 'bold' }}>
                                {isArabic ? 'ينتهي في: ' : 'Expires on: '}
                                {new Date(stats.subscriptionEndsAt).toLocaleDateString(isArabic ? 'ar-DZ' : 'en-US')}
                            </span>
                        )}
                    </p>
                    {stats.status !== 'APPROVED' && (
                        <Link
                            to="/dashboard/workshop/subscribe"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: '#b45309',
                                fontWeight: '700',
                                textDecoration: 'none',
                                borderBottom: '2px solid #b45309'
                            }}
                        >
                            {isArabic ? 'تفعيــل الحساب الآن ←' : 'Activate Account Now →'}
                        </Link>
                    )}
                </div>
            </div>

            {/* Stats Grid - Gradient Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2.5rem',
                }}
            >
                {statCards.map((card, i) => (
                    <div
                        key={i}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            border: '1px solid #f3f4f6',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'transform 0.2s ease',
                            cursor: 'default'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div>
                            <p style={{ color: '#6b7280', fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {card.label}
                            </p>
                            <h3
                                style={{
                                    fontSize: '2.5rem',
                                    fontWeight: '800',
                                    color: '#1f2937', // Dark gray
                                    lineHeight: 1
                                }}
                            >
                                {card.value}
                            </h3>
                        </div>
                        <div
                            style={{
                                width: '64px',
                                height: '64px',
                                background: card.gradient,
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                boxShadow: card.shadow
                            }}
                        >
                            <card.icon size={32} />
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr',
                    gap: '2rem',
                }}
                className="dashboard-grid"
            >
                {/* Recent Activity */}
                <div
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '2rem',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid #e5e7eb',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontWeight: '800',
                                fontSize: '1.25rem',
                                color: '#1f2937',
                            }}
                        >
                            <div style={{ background: '#eff6ff', padding: '0.5rem', borderRadius: '8px', color: '#3b82f6' }}>
                                <Clock size={20} />
                            </div>
                            {t('workshop.recentActivity') || 'آخر النشاطات'}
                        </h3>
                        <Link to="/dashboard/workshop/requests" style={{ color: '#3b82f6', fontSize: '0.9rem', fontWeight: '600' }}>
                            {t('general.viewall') || 'عرض الكل'}
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                        {activity.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                background: '#f9fafb',
                                borderRadius: '16px',
                                border: '2px dashed #e5e7eb'
                            }}>
                                <p style={{ color: '#9ca3af', fontWeight: '600' }}>
                                    {t('workshop.noActivity') || 'لا يوجد نشاطات حديثة'}
                                </p>
                            </div>
                        ) : (
                            activity.map((act, index) => (
                                <div
                                    key={act.id}
                                    style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        padding: '1rem 0',
                                        borderBottom: index !== activity.length - 1 ? '1px solid #f3f4f6' : 'none',
                                    }}
                                >
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: '#f0fdf4',
                                        color: '#16a34a',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        flexShrink: 0
                                    }}>
                                        {isArabic ? 'طل' : 'Req'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '700', color: '#1f2937', marginBottom: '0.25rem' }}>
                                            {act.message}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                            {new Date(act.date).toLocaleDateString(isArabic ? 'ar-DZ' : 'en-US', {
                                                day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Primary Action */}
                    {/* Primary Action - Add Design */}
                    <Link
                        to="/dashboard/workshop/products"
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            color: '#1f2937',
                            textDecoration: 'none',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            transition: 'all 0.2s ease',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-3px)';
                            e.currentTarget.style.borderColor = '#3b82f6';
                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(59, 130, 246, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.borderColor = '#e5e7eb';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.03)';
                        }}
                    >
                        <div style={{ zIndex: 1 }}>
                            <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '0.25rem', color: '#1f2937' }}>
                                {t('workshop.addDesign') || 'إضافة تصميم جديد'}
                            </h4>
                            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                اعرض أعمالك للزبائن
                            </p>
                        </div>
                        <div style={{
                            background: '#eff6ff',
                            width: '48px',
                            height: '48px',
                            borderRadius: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#3b82f6',
                            zIndex: 1
                        }}>
                            <Plus size={24} strokeWidth={3} />
                        </div>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            width: '100%',
                            height: '100%',
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.03) 0%, rgba(255,255,255,0) 100%)',
                            zIndex: 0
                        }}></div>
                    </Link>

                    {/* Secondary List */}
                    <div
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            border: '1px solid #e5e7eb',
                        }}
                    >
                        <h3
                            style={{
                                fontWeight: '800',
                                marginBottom: '1rem',
                                color: '#374151',
                                fontSize: '1.1rem'
                            }}
                        >
                            {isArabic ? 'وصول سريع' : 'Quick Access'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            <Link
                                to="/dashboard/workshop/requests"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    color: '#4b5563',
                                    fontWeight: '600',
                                    background: '#f9fafb',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#1f2937'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#4b5563'; }}
                            >
                                <div style={{ background: 'white', padding: '6px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    <Inbox size={18} />
                                </div>
                                {t('workshop.viewRequests') || 'طلبات الزبائن'}
                            </Link>
                            <Link
                                to="/dashboard/workshop/profile"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    color: '#4b5563',
                                    fontWeight: '600',
                                    background: '#f9fafb',
                                    transition: 'background 0.2s'
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#1f2937'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.color = '#4b5563'; }}
                            >
                                <div style={{ background: 'white', padding: '6px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                                    <Settings size={18} />
                                </div>
                                {t('workshop.settings') || 'إعدادات الورشة'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                @media (max-width: 968px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};


export default WorkshopHome;
