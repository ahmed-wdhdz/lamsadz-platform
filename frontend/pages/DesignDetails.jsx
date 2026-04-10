import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, Info, CheckCircle, ShieldCheck, ArrowRight, User, Star } from 'lucide-react';
import Button from '../components/Button';
import ReviewList from '../components/ReviewList';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const DesignDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [design, setDesign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [images, setImages] = useState([]);
    const [activeImage, setActiveImage] = useState(0);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        clientName: '',
        clientPhone: '',
        description: '',
        dimensions: '',
        budgetMin: '',
        budgetMax: '',
        wilaya: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState(null);

    useEffect(() => {
        fetchDesign();
    }, [id]);

    const fetchDesign = async () => {
        try {
            const res = await fetch(`${API_URL}/designs/${id}`);
            if (res.ok) {
                const data = await res.json();
                setDesign(data);

                // Parse images
                let imgs = [];
                try {
                    imgs = data.images && data.images !== '[]' ? JSON.parse(data.images) : [];
                } catch (e) {
                    imgs = [];
                }
                setImages(imgs);

                // Prefill form
                setFormData(prev => ({
                    ...prev,
                    description: `أنا مهتم بتصميم "${data.title}" وأرغب في معرفة المزيد من التفاصيل والسعر النهائي.`,
                    wilaya: data.workshop?.location || ''
                }));
            } else {
                setDesign(null);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const formDataObj = new FormData();
            formDataObj.append('clientName', formData.clientName || (user ? user.name : ''));
            formDataObj.append('clientPhone', formData.clientPhone || (user?.phone ? user.phone : ''));
            formDataObj.append('designId', design.id);
            formDataObj.append('type', design.category);
            formDataObj.append('description', formData.description);
            formDataObj.append('wilaya', formData.wilaya);
            formDataObj.append('dimensions', formData.dimensions);

            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const res = await fetch(`${API_URL}/leads`, {
                method: 'POST',
                headers,
                body: formDataObj
            });

            const data = await res.json();
            if (res.ok) {
                setSubmitResult(data);
            } else {
                alert(data.message || 'Error submitting lead');
            }
        } catch (error) {
            console.error(error);
            alert('Failed to submit');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="spinner"></div>
        </div>
    );

    if (!design) return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h2>التصميم غير موجود</h2>
            <Button onClick={() => navigate('/designs')} variant="outline">العودة للتصاميم</Button>
        </div>
    );

    const mainImagePath = images.length > 0 ? (String(images[activeImage]).startsWith('http') ? images[activeImage] : `${API_URL.replace('/api', '')}/uploads/${images[activeImage]}`) : 'https://placehold.co/800x600';

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '4rem' }}>
            {/* Breadcrumb / Back */}
            <div className="container" style={{ paddingTop: '2rem', paddingBottom: '1rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: '500'
                    }}
                >
                    <ArrowRight size={18} /> العودة للمعرض
                </button>
            </div>

            <div className="container">
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '2.5rem',
                    alignItems: 'start'
                }}>

                    {/* LEFT COLUMN: Gallery & Details */}
                    <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
                        {/* Main Image */}
                        <div style={{
                            position: 'relative',
                            borderRadius: '24px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                            background: 'white',
                            marginBottom: '1.5rem',
                            aspectRatio: '4/3'
                        }}>
                            <img
                                src={mainImagePath}
                                alt={design.title}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute', top: '20px', right: '20px',
                                background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)',
                                padding: '0.5rem 1rem', borderRadius: '100px',
                                fontWeight: '700', color: '#0f172a',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                                {design.category}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                                {images.map((img, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        style={{
                                            width: '80px', height: '80px', flexShrink: 0,
                                            borderRadius: '12px', overflow: 'hidden', cursor: 'pointer',
                                            border: activeImage === i ? '2px solid #3b82f6' : '2px solid transparent',
                                            opacity: activeImage === i ? 1 : 0.7,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <img
                                            src={(String(img).startsWith('http') ? img : `${API_URL.replace('/api', '')}/uploads/${img}`)}
                                            alt="thumbnail"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Details Card */}
                        <div style={{ background: 'white', borderRadius: '20px', padding: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', marginBottom: '1rem' }}>
                                {design.title}
                            </h1>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem', color: '#64748b' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={18} /> {design.workshop?.location || 'الجزائر'}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShieldCheck size={18} color="#3b82f6" /> ورشة موثوقة
                                </div>
                            </div>

                            <div style={{ height: '1px', background: '#f1f5f9', marginBottom: '2rem' }}></div>

                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>وصف التصميم</h3>
                            <p style={{ lineHeight: '1.8', color: '#475569', fontSize: '1.05rem', whiteSpace: 'pre-line' }}>
                                {design.description || 'لا يوجد وصف متاح.'}
                            </p>

                            <div style={{ height: '1px', background: '#f1f5f9', marginTop: '3rem', marginBottom: '1rem' }}></div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>التقييمات والمراجعات</h3>
                                {!showReviewForm && (
                                    <button
                                        onClick={() => setShowReviewForm(true)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                                            fontSize: '0.9rem', fontWeight: '700', color: '#10b981', // Changed from indigo to green for success/positive vibe
                                            background: '#d1fae5', border: 'none', padding: '0.5rem 1rem',
                                            borderRadius: '50px', cursor: 'pointer', transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#a7f3d0'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = '#d1fae5'; e.currentTarget.style.transform = 'translateY(0)'; }}
                                    >
                                        <Star size={16} /> أضف تقييمك
                                    </button>
                                )}
                            </div>

                            {showReviewForm ? (
                                <ReviewForm
                                    workshopId={design.workshopId}
                                    onSuccess={() => {
                                        alert('تم إضافة تقييمك بنجاح! شكراً لك.');
                                        setShowReviewForm(false);
                                        // A real app would refresh the review list here.
                                    }}
                                    onCancel={() => setShowReviewForm(false)}
                                />
                            ) : (
                                <ReviewList workshopId={design.workshopId} />
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Sticky Order Form */}
                    <div style={{ flex: '1 1 350px', position: 'sticky', top: '2rem', minWidth: '300px' }}>

                        {submitResult ? (
                            <div style={{
                                background: 'white', borderRadius: '24px', padding: '3rem 2rem',
                                textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                                    <CheckCircle size={32} />
                                </div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>تم استلام الطلب!</h3>
                                <p style={{ color: '#64748b', marginBottom: '2rem' }}>تم إرسال طلبك للورش المختصة بنجاح.</p>
                                <Button onClick={() => setSubmitResult(null)} variant="outline" style={{ width: '100%' }}>طلب آخر</Button>
                            </div>
                        ) : (
                            <div style={{
                                background: 'white', borderRadius: '24px', padding: '2rem',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>السعر</p>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: '#0f172a' }}>{parseInt(design.price).toLocaleString()}</span>
                                        <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#64748b' }}>د.ج</span>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>الاسم الكامل</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                name="clientName"
                                                value={formData.clientName}
                                                onChange={handleInputChange}
                                                placeholder="الاسم اللقب"
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s', fontSize: '1rem' }}
                                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                            />
                                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>رقم الهاتف <span style={{ color: '#ef4444' }}>*</span></label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                required
                                                type="tel"
                                                name="clientPhone"
                                                value={formData.clientPhone}
                                                onChange={handleInputChange}
                                                placeholder="0550 00 00 00"
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s', fontSize: '1rem' }}
                                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                                onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                            />
                                            <Phone size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', marginBottom: '0.5rem', color: '#334155' }}>الولاية</label>
                                        <div style={{ position: 'relative' }}>
                                            <select
                                                name="wilaya"
                                                value={formData.wilaya}
                                                onChange={handleInputChange}
                                                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', transition: 'border 0.2s', fontSize: '1rem', background: 'white', appearance: 'none' }}
                                            >
                                                <option value="">اختر الولاية...</option>
                                                <option value="الجزائر">الجزائر</option>
                                                <option value="وهران">وهران</option>
                                                <option value="قسنطينة">قسنطينة</option>
                                                <option value="سطيف">سطيف</option>
                                                <option value="باتنة">باتنة</option>
                                                {/* Add more common wilayas */}
                                            </select>
                                            <MapPin size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                        </div>
                                    </div>

                                    {/* Description field removed as per user request */}

                                    <Button
                                        disabled={submitting}
                                        type="submit"
                                        variant="primary"
                                        style={{
                                            width: '100%',
                                            padding: '1rem',
                                            marginTop: '0.5rem',
                                            borderRadius: '12px',
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                                        }}
                                    >
                                        {submitting ? 'جاري الإرسال...' : 'اطلب هذا التصميم الآن'}
                                    </Button>

                                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '1rem', opacity: 0.7 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                            <CheckCircle size={14} color="#16a34a" /> ضمان الجودة
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem' }}>
                                            <CheckCircle size={14} color="#16a34a" /> دفع آمن
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Trust Badge */}
                        <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '16px', marginTop: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <ShieldCheck size={20} color="#0ea5e9" />
                            </div>
                            <p style={{ fontSize: '0.85rem', color: '#0369a1', lineHeight: '1.4' }}>
                                يتم تنفيذ هذا العمل بواسطة حرفيين محترفين تم التحقق من هويتهم وجودة أعمالهم.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DesignDetails;
