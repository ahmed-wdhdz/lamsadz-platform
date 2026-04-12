import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import FurnitureCard from '../components/FurnitureCard';
import { useLanguage } from '../context/LanguageContext';
import { categories } from '../utils/categories';
import { getOptimizedImage } from '../utils/optimizeImage';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Home = () => {
    const { t, isArabic } = useLanguage();

    const { data: products = [], isLoading: loading } = useQuery({
        queryKey: ['products', 'home'],
        queryFn: async () => {
            const res = await fetch(`${API_URL}/products?limit=8`);
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            const productsData = data.products || data || [];
            
            return productsData.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                image: p.images && p.images !== '[]'
                    ? getOptimizedImage(JSON.parse(p.images)[0], 400)
                    : 'https://placehold.co/600x400?text=No+Image',
                category: p.category,
                workshop: p.workshop?.name || 'ورشة',
                featuredUntil: p.featuredUntil
            }));
        }
    });

    return (
        <div>
            <HeroSection />

            {/* Categories Section */}
            <section style={{ padding: '4rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                        {isArabic ? 'تصفح حسب الفئة' : 'Browse by Category'}
                    </h2>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {isArabic ? 'اختر الغرفة أو الفئة التي تبحث عنها' : 'Find exactly what you need for your space'}
                    </p>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {categories.map((cat) => (
                        <Link
                            key={cat.value}
                            to={`/designs?category=${cat.value}`}
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'end',
                                padding: '1.5rem',
                                background: `linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%), url(${cat.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                borderRadius: '20px',
                                textDecoration: 'none',
                                color: 'white',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                border: '1px solid #f3f4f6',
                                transition: 'all 0.3s ease',
                                height: '200px',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            <span style={{ fontWeight: '700', fontSize: '1.25rem', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{isArabic ? cat.label : cat.labelEn}</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Products Section */}
            <section
                style={{
                    padding: '6rem 1.5rem',
                    maxWidth: '1280px',
                    margin: '0 auto',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '1.5rem',
                        justifyContent: 'space-between',
                        alignItems: 'flex-end',
                        marginBottom: '3rem',
                    }}
                >
                    <div>
                        <h2
                            style={{
                                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                fontWeight: '800',
                                marginBottom: '0.5rem',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {t('products.title')}
                        </h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                            {t('products.subtitle')}
                        </p>
                    </div>
                    <Link
                        to="/designs"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            fontSize: '1rem',
                        }}
                    >
                        {t('products.viewAll')}
                        <ArrowLeft size={18} style={{ transform: isArabic ? 'none' : 'rotate(180deg)' }} />
                    </Link>
                </div>

                {loading ? (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '4rem',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {t('form.loading')}
                    </div>
                ) : products.length > 0 ? (
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem',
                        }}
                    >
                        {products.map(product => (
                            <FurnitureCard key={product.id} {...product} />
                        ))}
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: 'center',
                            padding: '4rem',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-lg)',
                            color: 'var(--text-muted)',
                        }}
                    >
                        {t('general.noData')}
                    </div>
                )}
            </section>

            {/* About Section */}
            <section
                style={{
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '6rem 1.5rem',
                }}
            >
                <div
                    style={{
                        maxWidth: '1280px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '4rem',
                        alignItems: 'center',
                    }}
                    className="about-grid"
                >
                    <div style={{ order: isArabic ? 1 : 2 }}>
                        <span
                            style={{
                                color: 'var(--primary)',
                                fontWeight: '700',
                                fontSize: '0.9rem',
                                letterSpacing: '0.5px',
                                display: 'block',
                                marginBottom: '1rem',
                            }}
                        >
                            {isArabic ? 'لماذا Lamsadz؟' : 'Why Lamsadz?'}
                        </span>
                        <h2
                            style={{
                                fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
                                fontWeight: '800',
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                                lineHeight: '1.2',
                            }}
                        >
                            {isArabic
                                ? 'أناقة التفاصيل الصغيرة تصنع الفرق الكبير'
                                : 'The elegance of small details makes the big difference'}
                        </h2>
                        <p
                            style={{
                                color: 'var(--text-muted)',
                                fontSize: '1.1rem',
                                lineHeight: '1.9',
                                marginBottom: '2rem',
                            }}
                        >
                            {isArabic
                                ? 'نحن نؤمن بأن المنزل هو انعكاس لشخصيتك. لذلك نقدم لك قطع أثاث فريدة تم تصميمها بعناية من أمهر الحرفيين الجزائريين لتناسب ذوقك الرفيع وتضيف لمسة جمالية لكل زاوية.'
                                : 'We believe that home reflects your personality. That\'s why we offer unique furniture pieces carefully designed by Algeria\'s finest artisans to match your refined taste.'}
                        </p>
                        <Link
                            to="/designs"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '1rem 2rem',
                                backgroundColor: 'var(--primary)',
                                color: 'var(--text-inverse)',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: '700',
                                fontSize: '1rem',
                                boxShadow: 'var(--shadow-md)',
                            }}
                        >
                            {isArabic ? 'اكتشف المجموعة' : 'Explore Collection'}
                            <ArrowLeft size={18} style={{ transform: isArabic ? 'none' : 'rotate(180deg)' }} />
                        </Link>
                    </div>
                    <div style={{ order: isArabic ? 2 : 1 }}>
                        <img
                            src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=1000"
                            alt="Interior Design"
                            style={{
                                borderRadius: 'var(--radius-lg)',
                                boxShadow: 'var(--shadow-xl)',
                                width: '100%',
                                maxHeight: '500px',
                                objectFit: 'cover',
                            }}
                        />
                    </div>
                </div>
            </section>

            <style>{`
                @media (max-width: 968px) {
                    .about-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default Home;
