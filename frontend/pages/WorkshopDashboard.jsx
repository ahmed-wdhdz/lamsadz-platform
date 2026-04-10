const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Input from '../components/Input';
import Button from '../components/Button';

const WorkshopDashboard = () => {
    const { token, user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '', description: '', location: '', phone: '', skills: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API_URL}/workshops/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProfile(data);

                // Redirect if pending payment/verification
                if (data.status === 'PENDING_PAYMENT' || data.status === 'WAITING_APPROVAL' || data.status === 'REJECTED') {
                    window.location.href = '/dashboard/workshop/subscribe';
                    return;
                }

                if (data) {
                    setFormData({
                        name: data.name,
                        description: data.description,
                        location: data.location,
                        phone: data.phone,
                        skills: data.skills
                    });
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_URL}/workshops`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                // Redirect newly created workshop to subscription
                window.location.href = '/dashboard/workshop/subscribe';
            } else {
                alert('Error saving profile');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="loading-screen">Loading...</div>;

    return (
        <div className="dashboard-container" style={{ padding: '8rem 1rem' }}>
            <h1 className="page-title">لوحة تحكم الورشة</h1>
            <p className="page-subtitle">مرحباً بك، {user.name}</p>

            <div className="dashboard-card">
                {profile ? (
                    <div className="status-widget">
                        <div className="status-header">
                            <h2>حالة الاشتراك</h2>
                            <span className={`status-pill ${profile.status}`}>
                                {profile.status === 'APPROVED' ? 'نشط' : (profile.status === 'REJECTED' ? 'مرفوض' : 'قيد المراجعة')}
                            </span>
                        </div>

                        <div className="status-stats">
                            <div className="stat-box">
                                <p className="stat-label">الخطة الحالية</p>
                                <p className="stat-value">
                                    {profile.payments && profile.payments[0] ? (profile.payments[0].plan === 'MONTHLY' ? 'اشتراك شهري' : 'اشتراك سنوي') : 'غير مشترك'}
                                </p>
                            </div>
                            <div className="stat-box">
                                <p className="stat-label">تاريخ الانضمام</p>
                                <p className="stat-value">{new Date(profile.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {profile.status !== 'APPROVED' && (
                            <div className="status-footer">
                                <p className="status-message">
                                    {profile.status === 'REJECTED' ? 'تم رفض طلبك الأخير. يرجى مراجعة السبب وإعادة المحاولة.' : 'اشتراكك في انتظار التفعيل من قبل الإدارة.'}
                                </p>
                                <button
                                    onClick={() => window.location.href = '/dashboard/workshop/subscribe'}
                                    className="btn-link"
                                >
                                    {profile.status === 'REJECTED' ? 'إعادة رفع الإيصال' : 'عرض تفاصيل الاشتراك'}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="alert-warning">
                        يرجى إكمال ملفك الشخصي لتفعيل حساب الورشة.
                    </div>
                )}

                <h2 className="section-title">{profile ? 'تعديل الملف الشخصي' : 'إنشاء ملف الورشة'}</h2>
                <form onSubmit={handleSubmit} className="form-grid">
                    <Input placeholder="اسم الورشة" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <textarea
                        className="input-textarea"
                        placeholder="وصف الورشة والخدمات"
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        required
                    />
                    <div className="form-row">
                        <Input placeholder="المدينة / الولاية" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} required />
                        <Input placeholder="رقم الهاتف" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} required />
                    </div>
                    <Input placeholder="المهارات (مثال: نجارة، تنجيد، صباغة)" value={formData.skills} onChange={e => setFormData({ ...formData, skills: e.target.value })} required />

                    <Button variant="primary" type="submit">حفظ التغييرات</Button>
                </form>
            </div>
        </div>
    );
};

export default WorkshopDashboard;
