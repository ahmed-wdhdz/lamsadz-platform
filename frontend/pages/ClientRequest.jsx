import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, DollarSign, PenTool, Layout } from 'lucide-react';

const algeriaWilayas = [
    "01 - أدرار", "02 - الشلف", "03 - الأغواط", "04 - أم البواقي", "05 - باتنة", "06 - بجاية", "07 - بسكرة", "08 - بشار", "09 - البليدة", "10 - البويرة",
    "11 - تمنراست", "12 - تبسة", "13 - تلمسان", "14 - تيارت", "15 - تيزي وزو", "16 - الجزائر العاصمة", "17 - الجلفة", "18 - جيجل", "19 - سطيف", "20 - سعيدة",
    "21 - سكيكدة", "22 - سيدي بلعباس", "23 - عنابة", "24 - قالمة", "25 - قسنطينة", "26 - المدية", "27 - مستغانم", "28 - المسيلة", "29 - معسكر", "30 - ورقلة",
    "31 - وهران", "32 - البيض", "33 - إليزي", "34 - برج بوعريريج", "35 - بومرداس", "36 - الطارف", "37 - تندوف", "38 - تسمسيلت", "39 - الوادي", "40 - خنشلة",
    "41 - سوق أهراس", "42 - تيبازة", "43 - ميلة", "44 - عين الدفلى", "45 - النعامة", "46 - عين تموشنت", "47 - غرداية", "48 - غليزان", "49 - تيميمون", "50 - برج باجي مختار",
    "51 - أولاد جلال", "52 - بني عباس", "53 - إن صالح", "54 - إن قزام", "55 - تقرت", "56 - جانت", "57 - المغير", "58 - المنيعة"
];

const API_URL = import.meta.env.VITE_API_URL || `${API_URL}';

const ClientRequest = () => {
    const { user, token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: '',
        description: '',
        wilaya: '',
        budget: ''
    });
    const [images, setImages] = useState([]);

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();
        data.append('type', formData.type);
        data.append('description', formData.description);
        data.append('wilaya', formData.wilaya);
        if (formData.budget) data.append('budgetMin', formData.budget);

        // Include user details implicitly if logged in
        if (user) {
            data.append('clientName', user.name);
            if (user.phone) data.append('clientPhone', user.phone);
        }

        images.forEach(image => {
            data.append('images', image);
        });

        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${API_URL}/leads`, {
                method: 'POST',
                headers,
                body: data
            });

            if (res.ok) {
                const result = await res.json();
                alert(`تم إرسال طلبك بنجاح! تم إشعار ${result.matchedCount} ورشة قريبة منك.`);
                navigate('/dashboard');
            } else {
                const err = await res.json();
                alert(err.message || 'حدث خطأ ما');
            }
        } catch (error) {
            console.error(error);
            alert('فشل الاتصال بالخادم');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '6rem 1rem 4rem', minHeight: '100vh', background: 'var(--bg-body)' }} dir="rtl">
            <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
                <div style={{ background: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                        <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-color)', marginBottom: '1rem' }}>اطلب أثاث بمواصفات خاصة</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', lineHeight: '1.6' }}>صف لنا ما تريد، وسنقوم بإيصال طلبك لأفضل الورش الحرفية في منطقتك لتقديم عروض أسعار.</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Furniture Type */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-color)' }}>
                                <Layout size={20} color="var(--primary)" /> نوع الأثاث
                            </label>
                            <select
                                required
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'all 0.3s' }}
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="">اختر النوع...</option>
                                <option value="kitchen">مطبخ (Kitchen)</option>
                                <option value="sofa">أريكة / صالون (Sofa)</option>
                                <option value="bedroom">غرفة نوم (Bedroom)</option>
                                <option value="table">طاولة / كراسي</option>
                                <option value="decoration">ديكور خشبي</option>
                                <option value="other">آخر</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-color)' }}>
                                <PenTool size={20} color="var(--primary)" /> التفاصيل والمواصفات
                            </label>
                            <textarea
                                required
                                rows="5"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
                                placeholder="اذكر الأبعاد، المواد المفضلة، الألوان، وأي تفاصيل أخرى تساعد الورشة على فهم طلبك..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Wilaya */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-color)' }}>
                                <MapPin size={20} color="var(--primary)" /> الولاية / المنطقة
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    required
                                    style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none', appearance: 'none' }}
                                    value={formData.wilaya}
                                    onChange={(e) => setFormData({ ...formData, wilaya: e.target.value })}
                                >
                                    <option value="" disabled>اختر ولايتك...</option>
                                    {algeriaWilayas.map((wilaya) => (
                                        <option key={wilaya} value={wilaya}>{wilaya}</option>
                                    ))}
                                </select>
                                <div style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#64748b' }}>
                                    ▼
                                </div>
                            </div>
                        </div>

                        {/* Estimated Budget */}
                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-color)' }}>
                                <DollarSign size={20} color="var(--primary)" /> الميزانية التقديرية (د.ج)
                            </label>
                            <input
                                type="number"
                                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontSize: '1rem', outline: 'none' }}
                                placeholder="اختياري (مثال: 50000)"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>

                        {/* Images Upload */}
                        <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', background: images.length > 0 ? '#f0fdf4' : '#f8fafc', cursor: 'pointer', transition: 'all 0.3s' }}>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                id="images-upload"
                                style={{ display: 'none' }}
                                onChange={handleImageChange}
                            />
                            <label htmlFor="images-upload" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Upload size={40} color={images.length > 0 ? "#22c55e" : "#94a3b8"} style={{ marginBottom: '1rem' }} />
                                <span style={{ fontSize: '1.1rem', fontWeight: '700', color: images.length > 0 ? '#15803d' : 'var(--text-color)', marginBottom: '0.5rem' }}>
                                    {images.length > 0 ? 'تم تحديد الصور بنجاح' : 'اضغط لرفع صور توضيحية'}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>يمكنك اختيار صور متعددة لمساعدة الورشة على الفهم الأفضل (اختياري)</span>
                            </label>
                            {images.length > 0 && (
                                <div style={{ marginTop: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                                    {images.map((file, idx) => (
                                        <span key={idx} style={{ background: '#dcfce7', color: '#16a34a', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700', border: '1px solid #bbf7d0' }}>
                                            {file.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                fontWeight: '800',
                                fontSize: '1.2rem',
                                color: 'white',
                                background: loading ? '#94a3b8' : 'var(--primary)',
                                border: 'none',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                boxShadow: '0 4px 15px rgba(217, 119, 6, 0.3)',
                                transition: 'all 0.3s',
                                marginTop: '1rem'
                            }}
                        >
                            {loading ? 'جاري الإرسال...' : 'إرسال الطلب الآن 🚀'}
                        </button>

                        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                            بإرسال الطلب، أنت توافق على مشاركة تفاصيله حصرياً مع الورشات الحرفية المعتمدة في منصتنا.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ClientRequest;
