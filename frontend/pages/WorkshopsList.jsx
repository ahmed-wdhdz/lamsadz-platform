import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/Button';
import { Phone, MapPin, X, Store } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const WorkshopsList = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);
    const { isArabic, t } = useLanguage();

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const res = await fetch(`${API_URL}/workshops`);
                const data = await res.json();
                setWorkshops(data.workshops || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    if (loading) return <div className="container" style={{ padding: '8rem 1rem' }}>{t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')}</div>;

    return (
        <div
            className="container"
            dir={isArabic ? 'rtl' : 'ltr'}
            style={{ padding: '8rem 1rem', textAlign: isArabic ? 'right' : 'left' }}
        >
            <h1 style={{ marginBottom: '2rem', fontWeight: '800' }}>
                {isArabic ? 'استكشف الورش المعتمدة' : 'Explore Certified Workshops'}
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>
                {isArabic
                    ? 'أفضل الحرفيين والخبراء المحليين لإنجاز مشاريع الأثاث الخاصة بك.'
                    : 'The best local artisans and experts to complete your custom furniture projects.'}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {workshops.map(workshop => (
                    <div key={workshop.id} style={{
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        padding: '1.5rem',
                        transition: 'var(--smooth)',
                        border: '1px solid var(--border)'
                    }} className="hover-lift">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{workshop.name}</h2>
                            <span style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>{workshop.location}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            {workshop.description ? workshop.description.substring(0, 100) + '...' : (isArabic ? 'لا يوجد وصف' : 'No description')}
                        </p>


                        <button
                            onClick={() => setSelectedWorkshop(workshop)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                border: '2px solid var(--primary)',
                                background: 'white',
                                color: 'var(--primary)',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontFamily: 'inherit',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseOver={e => { e.target.background = 'var(--primary)'; e.target.style.background = 'var(--primary)'; e.target.style.color = 'white'; }}
                            onMouseOut={e => { e.target.style.background = 'white'; e.target.style.color = 'var(--primary)'; }}
                        >
                            {isArabic ? 'عرض التفاصيل' : 'View Details'}
                        </button>
                    </div>
                ))}
            </div>

            {/* Workshop Detail Modal */}
            {selectedWorkshop && (
                <div
                    onClick={() => setSelectedWorkshop(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.55)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 200,
                        padding: '1rem'
                    }}
                >
                    <div
                        onClick={e => e.stopPropagation()}
                        style={{
                            background: 'white',
                            borderRadius: '20px',
                            width: '100%',
                            maxWidth: '480px',
                            overflow: 'hidden',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
                            animation: 'slideUp 0.25s ease'
                        }}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'linear-gradient(135deg, #1e3a5f 0%, #2d6a9f 100%)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '50%',
                                    width: '44px',
                                    height: '44px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Store size={22} color="white" />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, color: 'white', fontWeight: '800', fontSize: '1.1rem' }}>
                                        {selectedWorkshop.name}
                                    </h3>
                                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
                                        {isArabic ? 'تفاصيل الورشة' : 'Workshop Details'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedWorkshop(null)}
                                style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                            {/* Phone Number — highlighted */}
                            <div style={{
                                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                border: '2px solid #86efac',
                                borderRadius: '14px',
                                padding: '1.25rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    background: '#16a34a',
                                    borderRadius: '50%',
                                    width: '48px',
                                    height: '48px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Phone size={22} color="white" />
                                </div>
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#166534', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        {isArabic ? 'رقم الهاتف' : 'Phone Number'}
                                    </p>
                                    <p style={{ margin: 0, fontSize: '1.3rem', fontWeight: '800', color: '#15803d', direction: 'ltr' }}>
                                        {selectedWorkshop.phone || (isArabic ? 'غير متوفر' : 'Not available')}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px' }}>
                                <MapPin size={20} color="#0369a1" />
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.2rem' }}>
                                        {isArabic ? 'الولاية' : 'State / Region'}
                                    </p>
                                    <p style={{ margin: 0, fontWeight: '700', color: '#1f2937' }}>
                                        {selectedWorkshop.location}
                                    </p>
                                </div>
                            </div>



                            {/* Description */}
                            {selectedWorkshop.description && (
                                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', padding: '0 0.25rem' }}>
                                    {selectedWorkshop.description}
                                </p>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedWorkshop(null)}
                                style={{
                                    width: '100%',
                                    padding: '0.875rem',
                                    borderRadius: '12px',
                                    border: 'none',
                                    background: '#f3f4f6',
                                    color: '#374151',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    fontSize: '1rem',
                                    fontFamily: 'inherit'
                                }}
                            >
                                {isArabic ? 'إغلاق' : 'Close'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default WorkshopsList;

