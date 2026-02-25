import React, { useState } from 'react';
import { Star, User, Mail } from 'lucide-react';
import Button from './Button';
import { submitReview } from '../api/reviews';

const ReviewForm = ({ workshopId, onSuccess, onCancel }) => {
    const [rating, setRating] = useState(5);
    const [reviewerName, setReviewerName] = useState('');
    const [reviewerEmail, setReviewerEmail] = useState('');
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await submitReview({
                rating,
                comment,
                reviewerName,
                reviewerEmail,
                workshopId
            });
            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء إرسال التقييم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
            border: '1px solid #f1f5f9',
            marginTop: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.5rem', color: '#0f172a' }}>تقييم الورشة</h3>

            {error && (
                <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* Rating Stars */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>التقييم</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                                    transition: 'transform 0.2s', outline: 'none'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <Star
                                    size={36}
                                    fill={rating >= star ? '#fbbf24' : 'none'}
                                    color={rating >= star ? '#fbbf24' : '#e2e8f0'}
                                />
                            </button>
                        ))}
                        <span style={{ marginRight: '1rem', fontSize: '0.9rem', color: '#94a3b8', fontWeight: '500' }}>
                            {rating === 5 ? 'ممتاز' : rating === 4 ? 'جيد جداً' : rating === 3 ? 'مقبول' : rating === 2 ? 'سيء' : 'سيء جداً'}
                        </span>
                    </div>
                </div>

                {/* Name & Email Fields */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>الاسم <span style={{ color: '#ef4444' }}>*</span></label>
                        <div style={{ position: 'relative' }}>
                            <input
                                required
                                type="text"
                                placeholder="اسمك الكامل"
                                value={reviewerName}
                                onChange={(e) => setReviewerName(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s', fontSize: '1rem', fontFamily: 'inherit' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <User size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>البريد الإلكتروني (اختياري)</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                placeholder="example@email.com"
                                value={reviewerEmail}
                                onChange={(e) => setReviewerEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s', fontSize: '1rem', fontFamily: 'inherit' }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                            />
                            <Mail size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                    </div>
                </div>

                {/* Comment Field */}
                <div>
                    <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>تعليق (اختياري)</label>
                    <textarea
                        rows="4"
                        placeholder="كيف كانت تجربتك مع هذه الورشة؟"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s', fontSize: '1rem', fontFamily: 'inherit', resize: 'vertical' }}
                        onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                        onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                    ></textarea>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                    <Button type="submit" variant="primary" loading={loading} style={{ flex: 1, padding: '0.8rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700' }}>
                        إرسال التقييم
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel} style={{ padding: '0.8rem 2rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '600' }}>
                        إلغاء
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ReviewForm;
