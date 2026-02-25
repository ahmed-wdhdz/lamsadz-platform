import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const FurnitureCard = ({ id, image, title, price, category, workshop, featuredUntil }) => {
    const { t, isArabic } = useLanguage();
    const [liked, setLiked] = React.useState(false);

    const isFeatured = featuredUntil && new Date(featuredUntil) > new Date();

    return (
        <div
            style={{
                backgroundColor: 'var(--bg-card)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: isFeatured ? '2px solid #fbbf24' : '1px solid var(--border)', // amber-400
                boxShadow: isFeatured ? '0 4px 15px rgba(251, 191, 36, 0.2)' : 'none',
                transition: 'all var(--transition-base)',
            }}
            className={isFeatured ? 'furniture-card featured-card' : 'furniture-card'}
        >
            {/* Image Container */}
            <Link to={`/designs/${id}`} style={{ display: 'block', position: 'relative' }}>
                <div
                    style={{
                        position: 'relative',
                        overflow: 'hidden',
                        height: '280px',
                    }}
                >
                    <img
                        src={image}
                        alt={title}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.5s ease',
                        }}
                        className="card-image"
                    />

                    {/* Category Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '1rem',
                            right: isArabic ? '1rem' : 'auto',
                            left: isArabic ? 'auto' : '1rem',
                            padding: '6px 12px',
                            backgroundColor: 'white',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: '#4b5563',
                            boxShadow: 'var(--shadow-sm)',
                        }}
                    >
                        {category}
                    </div>

                    {/* Featured Badge */}
                    {isFeatured && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                left: isArabic ? 'auto' : '1rem',
                                right: isArabic ? '1rem' : 'auto',
                                padding: '6px 16px',
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // amber
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.8rem',
                                fontWeight: '700',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                boxShadow: '0 4px 10px rgba(245, 158, 11, 0.4)',
                                zIndex: 10
                            }}
                        >
                            <Star size={14} fill="white" /> مميز
                        </div>
                    )}
                </div>
            </Link>

            {/* Like Button */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setLiked(!liked);
                }}
                style={{
                    position: 'absolute',
                    top: '1rem',
                    left: isArabic ? '1rem' : 'auto',
                    right: isArabic ? 'auto' : '1rem',
                    width: '36px',
                    height: '36px',
                    backgroundColor: liked ? 'var(--error)' : 'var(--bg-card)',
                    color: liked ? 'white' : 'var(--text-muted)',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all var(--transition-fast)',
                }}
            >
                <Heart size={18} fill={liked ? 'currentColor' : 'none'} />
            </button>

            {/* Content */}
            <div style={{ padding: '1.25rem' }}>
                {workshop && (
                    <p
                        style={{
                            fontSize: '0.8rem',
                            color: 'var(--accent-dark)',
                            marginBottom: '0.5rem',
                            fontWeight: '500',
                        }}
                    >
                        {workshop}
                    </p>
                )}

                <Link to={`/designs/${id}`}>
                    <h3
                        style={{
                            fontSize: '1.1rem',
                            fontWeight: '700',
                            marginBottom: '0.75rem',
                            color: 'var(--text-primary)',
                            lineHeight: '1.4',
                        }}
                    >
                        {title}
                    </h3>
                </Link>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                    }}
                >
                    <div
                        style={{
                            fontWeight: '800',
                            fontSize: '1.25rem',
                            color: 'var(--primary)',
                        }}
                    >
                        {price?.toLocaleString()} <span style={{ fontSize: '0.9rem' }}>{t('products.currency')}</span>
                    </div>

                    <Link
                        to={`/designs/${id}`}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            padding: '12px 16px',
                            backgroundColor: 'var(--primary)',
                            color: 'var(--text-inverse)',
                            borderRadius: 'var(--radius-md)',
                            fontWeight: '700',
                            fontSize: '0.95rem',
                            width: '100%',
                            transition: 'all var(--transition-fast)',
                            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)',
                        }}
                    >
                        {t('products.requestQuote')}
                        <ArrowLeft size={16} style={{ transform: isArabic ? 'none' : 'rotate(180deg)' }} />
                    </Link>
                </div>
            </div>

            <style>{`
                .furniture-card {
                    position: relative;
                }
                .furniture-card:hover {
                    box-shadow: var(--shadow-lg);
                    border-color: transparent;
                }
                .furniture-card:hover .card-image {
                    transform: scale(1.05);
                }
            `}</style>
        </div>
    );
};

export default FurnitureCard;
