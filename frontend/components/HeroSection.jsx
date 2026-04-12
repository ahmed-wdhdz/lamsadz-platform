import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star, ChevronLeft, Truck, ShieldCheck, PenTool, Palette, CreditCard } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const HeroSection = () => {
    const { t, isArabic } = useLanguage();

    return (
        <>
            <section
                style={{
                    minHeight: '90vh',
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'var(--bg-primary)',
                    paddingTop: '100px',
                    paddingBottom: '3rem',
                }}
            >
                {/* Background Pattern */}
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        opacity: 0.03,
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                />

                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: '0 1.5rem',
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '4rem',
                        alignItems: 'center',
                        position: 'relative',
                        zIndex: 1,
                        width: '100%',
                    }}
                    className="hero-grid"
                >
                    {/* Text Content */}
                    <div style={{ order: isArabic ? 1 : 2 }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '8px 16px',
                                backgroundColor: 'var(--accent-light)',
                                color: 'var(--accent-dark)',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                marginBottom: '1.5rem',
                            }}
                        >
                            <Star size={14} fill="currentColor" />
                            {isArabic ? 'حرفية جزائرية أصيلة' : 'Authentic Algerian Craftsmanship'}
                        </div>

                        <h1
                            style={{
                                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                                fontWeight: '800',
                                lineHeight: '1.5',
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {t('hero.title')}
                            <br />
                            <span style={{ color: 'var(--primary)' }}>
                                {t('hero.subtitle')}
                            </span>
                        </h1>

                        <p
                            style={{
                                fontSize: '1.1rem',
                                color: 'var(--text-muted)',
                                lineHeight: '1.8',
                                marginBottom: '2rem',
                                maxWidth: '500px',
                            }}
                        >
                            {t('hero.description')}
                        </p>

                        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                            <Link
                                to="/designs"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '0.875rem 1.75rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--text-inverse)',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '700',
                                    fontSize: '1rem',
                                    boxShadow: 'var(--shadow-md)',
                                }}
                            >
                                {t('hero.cta')}
                                <ChevronLeft size={18} style={{ transform: isArabic ? 'none' : 'rotate(180deg)' }} />
                            </Link>

                            <Link
                                to="/custom-request"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '0.875rem 1.75rem',
                                    backgroundColor: 'transparent',
                                    color: 'var(--text-primary)',
                                    border: '2px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                }}
                            >
                                {t('nav.customDesign')}
                                <PenTool size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Image */}
                    <div style={{ order: isArabic ? 2 : 1, position: 'relative' }}>
                        <div
                            style={{
                                position: 'relative',
                                borderRadius: 'var(--radius-lg)',
                                overflow: 'hidden',
                                boxShadow: 'var(--shadow-xl)',
                            }}
                        >
                            <img
                                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1000"
                                alt="Premium Furniture"
                                style={{
                                    width: '100%',
                                    height: '500px',
                                    objectFit: 'cover',
                                }}
                            />

                            {/* Floating Card */}
                            <div
                                style={{
                                    position: 'absolute',
                                    bottom: '1.5rem',
                                    left: isArabic ? 'auto' : '1.5rem',
                                    right: isArabic ? '1.5rem' : 'auto',
                                    backgroundColor: 'var(--bg-card)',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    boxShadow: 'var(--shadow-lg)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                }}
                            >
                                <div
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: 'var(--primary-light)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--primary)',
                                    }}
                                >
                                    <Truck size={20} />
                                </div>
                                <div>
                                    <div style={{ fontWeight: '700', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                        {isArabic ? 'توصيل متوفر' : 'Delivery Available'}
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                        {isArabic ? 'لجميع الولايات' : 'To all 58 states'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Bar - Separate Section */}
            <section
                style={{
                    backgroundColor: 'var(--bg-card)',
                    borderTop: '1px solid var(--border)',
                    borderBottom: '1px solid var(--border)',
                    padding: '1.5rem 0',
                }}
            >
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        padding: '0 1.5rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '1.5rem',
                    }}
                    className="features-bar"
                >
                    {[
                        { icon: Star, title: t('features.quality.title'), desc: t('features.quality.desc') },
                        { icon: Palette, title: t('features.custom.title'), desc: t('features.custom.desc') },
                        { icon: Truck, title: t('features.delivery.title'), desc: t('features.delivery.desc') },
                        { icon: CreditCard, title: t('features.payment.title'), desc: t('features.payment.desc') },
                    ].map((feature, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
                            <div
                                style={{
                                    width: '44px',
                                    height: '44px',
                                    flexShrink: 0,
                                    borderRadius: 'var(--radius-md)',
                                    backgroundColor: 'var(--primary-light)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--primary)',
                                }}
                            >
                                <feature.icon size={20} />
                            </div>
                            <div>
                                <div style={{
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.3',
                                }}>
                                    {feature.title}
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    lineHeight: '1.4',
                                }}>
                                    {feature.desc}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <style>{`
                @media (max-width: 968px) {
                    .hero-grid {
                        grid-template-columns: 1fr !important;
                        text-align: center;
                        gap: 2rem !important;
                    }
                    .hero-grid > div:first-child {
                        order: 2 !important;
                    }
                    .hero-grid > div:last-child {
                        order: 1 !important;
                    }
                    .features-bar {
                        grid-template-columns: repeat(2, 1fr) !important;
                    }
                }
                @media (max-width: 600px) {
                    .features-bar {
                        grid-template-columns: 1fr !important;
                        gap: 1rem !important;
                    }
                }
            `}</style>
        </>
    );
};

export default HeroSection;
