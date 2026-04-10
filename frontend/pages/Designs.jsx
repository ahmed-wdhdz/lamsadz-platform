const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import FurnitureCard from '../components/FurnitureCard';
import { categories } from '../utils/categories';
import { useLanguage } from '../context/LanguageContext';
import { getOptimizedImage } from '../utils/optimizeImage';

const Designs = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();
    const { isArabic } = useLanguage();

    // Get filter from URL
    const queryParams = new URLSearchParams(location.search);
    const activeCategory = queryParams.get('category') || 'ALL';

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let url = `${API_URL}/products`;

                const res = await fetch(url);
                const data = await res.json();
                if (res.ok) {
                    const productsReceived = data.products || data || [];
                    let mappedProducts = productsReceived.map(p => ({
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

                    if (activeCategory !== 'ALL') {
                        mappedProducts = mappedProducts.filter(p => p.category === activeCategory);
                    }

                    setProducts(mappedProducts);
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [activeCategory]);

    const handleCategoryClick = (categoryVal) => {
        if (categoryVal === 'ALL') {
            navigate('/designs');
        } else {
            navigate(`/designs?category=${categoryVal}`);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
                    {activeCategory === 'ALL' ? (isArabic ? 'كل المنتجات' : 'All Products') :
                        categories.find(c => c.value === activeCategory)?.label || activeCategory}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '1.1rem' }}>
                    {isArabic ? 'تصفح أحدث المنتجات من ورشاتنا المميزة' : 'Explore the latest products from our finest workshops'}
                </p>
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1.5rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                    onClick={() => handleCategoryClick('ALL')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        borderRadius: '99px',
                        border: activeCategory === 'ALL' ? 'none' : '1px solid #e5e7eb',
                        background: activeCategory === 'ALL' ? '#3b82f6' : 'white',
                        color: activeCategory === 'ALL' ? 'white' : '#4b5563',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'all 0.2s',
                        boxShadow: activeCategory === 'ALL' ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                    }}
                >
                    {isArabic ? 'الكل' : 'All'}
                </button>
                {categories.map(cat => (
                    <button
                        key={cat.value}
                        onClick={() => handleCategoryClick(cat.value)}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '99px',
                            border: activeCategory === cat.value ? 'none' : '1px solid #e5e7eb',
                            background: activeCategory === cat.value ? '#3b82f6' : 'white',
                            color: activeCategory === cat.value ? 'white' : '#4b5563',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            boxShadow: activeCategory === cat.value ? '0 4px 12px rgba(59, 130, 246, 0.3)' : 'none'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <img
                                src={cat.image}
                                alt=""
                                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                        </span> <span>{isArabic ? cat.label : cat.labelEn}</span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280' }}>جاري التحميل...</div>
            ) : products.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                    {products.map(product => (
                        <FurnitureCard key={product.id} {...product} />
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '6rem', background: '#f9fafb', borderRadius: '24px' }}>
                    <p style={{ color: '#6b7280', fontSize: '1.2rem', fontWeight: '600' }}>
                        {isArabic ? 'لا توجد منتجات متاحة حالياً في هذا التصنيف.' : 'No products available in this category yet.'}
                    </p>
                    {activeCategory !== 'ALL' && (
                        <button
                            onClick={() => handleCategoryClick('ALL')}
                            style={{ marginTop: '1rem', color: '#3b82f6', background: 'none', border: 'none', fontWeight: '700', cursor: 'pointer', fontSize: '1rem' }}
                        >
                            {isArabic ? 'عرض كل المنتجات' : 'View all products'}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Designs;
