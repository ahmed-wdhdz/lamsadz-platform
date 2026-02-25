import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, DollarSign, Ruler, Palette, FileText, Send } from 'lucide-react';
import { wilayas } from '../utils/wilayas';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const CustomRequest = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({
        type: 'Custom',
        length: '',
        width: '',
        height: '',
        description: '',
        budgetMax: '',
        wilaya: '',
        clientName: '',
        clientPhone: '',
        image: null // For file upload
    });
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    const categories = ['أريكة (Sofa)', 'طاولة (Table)', 'كرسي (Chair)', 'خزانة (Wardrobe)', 'سرير (Bed)', 'مطبخ (Kitchen)', 'أخرى (Other)'];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, image: file }));
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();
            data.append('type', formData.type);
            // Combine dimensions: Length x Width x Height cm
            const dimensionsStr = `${formData.length} × ${formData.width} × ${formData.height} سم`;
            data.append('dimensions', dimensionsStr);
            data.append('description', formData.description);
            data.append('budgetMax', formData.budgetMax);
            data.append('wilaya', formData.wilaya);
            data.append('clientName', formData.clientName || (user ? user.name : ''));
            data.append('clientPhone', formData.clientPhone || (user?.phone ? user.phone : ''));
            data.append('isCustom', 'true'); // Flag for backend

            if (formData.image) {
                // Determine category from type or add separate field, here we map type to category for filtering
                data.append('category', formData.type.split(' ')[0]);
                // We need to handle image upload differently if using the same API as leads
                // The 'leads' API might expect 'images' as a key for multer
                data.append('images', formData.image);
            }

            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}/leads`, { // Using same endpoint
                method: 'POST',
                headers,
                body: data
            });

            if (response.ok) {
                alert('تم إرسال طلبك بنجاح! سيتم إخطار الورشات في ولايتك.');
                navigate('/');
            } else {
                const errorData = await response.json();
                alert(`حدث خطأ: ${errorData.message || 'فشل الإرسال'}`);
            }
        } catch (error) {
            console.error('Error submitting request:', error);
            alert('حدث خطأ في الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '4rem 1.5rem', background: '#f8fafc', minHeight: '100vh', direction: 'rtl' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e293b', marginBottom: '1rem' }}>طلبية خاصة</h1>
                    <p style={{ color: '#64748b', fontSize: '1.1rem' }}>صف قطعة الأثاث التي تحلم بها، وسيقوم الحرفيون في ولايتك بتقديم عروضهم.</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2rem' }}>

                    {/* Category */}
                    <div>
                        <label style={labelStyle}>نوع الأثاث</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {categories.map(cat => (
                                <button
                                    type="button"
                                    key={cat}
                                    onClick={() => setFormData(p => ({ ...p, type: cat }))}
                                    style={{
                                        padding: '0.75rem 1.5rem',
                                        borderRadius: '12px',
                                        border: formData.type === cat ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                        background: formData.type === cat ? '#eff6ff' : 'white',
                                        color: formData.type === cat ? '#3b82f6' : '#64748b',
                                        fontWeight: '600',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        {/* Dimensions */}
                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}><Ruler size={18} /> الأبعاد (سم)</label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <input
                                        type="number"
                                        name="length"
                                        value={formData.length}
                                        onChange={handleInputChange}
                                        placeholder="الطول"
                                        style={inputStyle}
                                        required
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>الطول</span>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="width"
                                        value={formData.width}
                                        onChange={handleInputChange}
                                        placeholder="العرض"
                                        style={inputStyle}
                                        required
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>العرض</span>
                                </div>
                                <div>
                                    <input
                                        type="number"
                                        name="height"
                                        value={formData.height}
                                        onChange={handleInputChange}
                                        placeholder="الارتفاع"
                                        style={inputStyle}
                                        required
                                    />
                                    <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>الارتفاع</span>
                                </div>
                            </div>
                        </div>

                        {/* Budget */}
                        <div>
                            <label style={labelStyle}><DollarSign size={18} /> الميزانية التقديرية (د.ج)</label>
                            <input
                                type="number"
                                name="budgetMax"
                                value={formData.budgetMax}
                                onChange={handleInputChange}
                                placeholder="مثلاً: 50000"
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* Wilaya Selection - CRITICAL */}
                    <div>
                        <label style={labelStyle}><MapPin size={18} /> الولاية (مهم جداً للوصول للورشات القريبة)</label>
                        <select
                            name="wilaya"
                            value={formData.wilaya}
                            onChange={handleInputChange}
                            style={inputStyle}
                            required
                        >
                            <option value="">اختر ولايتك...</option>
                            {wilayas.map(w => (
                                <option key={w} value={w}>{w}</option>
                            ))}
                        </select>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={labelStyle}><FileText size={18} /> تفاصيل إضافية</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="وصف دقيق للتصميم، المواد المفضلة، الألوان، وأي تفاصيل أخرى..."
                            style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                            required
                        />
                    </div>

                    {/* Image Upload */}
                    <div>
                        <label style={labelStyle}><Upload size={18} /> صورة توضيحية (اختياري)</label>
                        <div
                            onClick={() => document.getElementById('file-upload').click()}
                            style={{
                                border: '2px dashed #cbd5e1',
                                borderRadius: '16px',
                                padding: '2rem',
                                textAlign: 'center',
                                cursor: 'pointer',
                                background: previewUrl ? `url(${previewUrl}) center/cover no-repeat` : '#f8fafc',
                                height: '200px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'column',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => e.target.style.borderColor = '#3b82f6'}
                            onMouseLeave={(e) => e.target.style.borderColor = '#cbd5e1'}
                        >
                            {!previewUrl && (
                                <>
                                    <Upload size={32} color="#94a3b8" style={{ marginBottom: '1rem' }} />
                                    <span style={{ color: '#64748b', fontWeight: '500' }}>اضغط لرفع صورة مشابهة للتصميم</span>
                                </>
                            )}
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        {previewUrl && (
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setPreviewUrl(null); setFormData(p => ({ ...p, image: null })); }}
                                style={{ marginTop: '0.5rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}
                            >
                                إزالة الصورة
                            </button>
                        )}
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', margin: '1rem 0' }}></div>

                    {/* Contact Info */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                        <div>
                            <label style={labelStyle}>الاسم الكامل</label>
                            <input
                                type="text"
                                name="clientName"
                                value={formData.clientName}
                                onChange={handleInputChange}
                                placeholder="اسمك"
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>رقم الهاتف</label>
                            <input
                                type="tel"
                                name="clientPhone"
                                value={formData.clientPhone}
                                onChange={handleInputChange}
                                placeholder="0550..."
                                style={inputStyle}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            padding: '1rem',
                            borderRadius: '12px',
                            border: 'none',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            marginTop: '1rem',
                            boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)'
                        }}
                    >
                        {loading ? 'جاري الإرسال...' : (
                            <>
                                إرسال الطلب للورشات <Send size={20} style={{ transform: 'rotate(180deg)' }} />
                            </>
                        )}
                    </button>

                </form>
            </div>
        </div>
    );
};

const labelStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '700',
    color: '#334155',
    marginBottom: '0.5rem'
};

const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '12px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '1rem',
    transition: 'border 0.2s',
    backgroundColor: '#fff'
};

export default CustomRequest;
