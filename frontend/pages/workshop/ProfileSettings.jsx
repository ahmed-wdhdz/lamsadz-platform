import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { wilayas } from '../../utils/wilayas';
import { User, MapPin, Phone, Briefcase, FileText, Save, CheckCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const ProfileSettings = () => {
    const navigate = useNavigate();
    const { token, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
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
                if (data) {
                    setFormData({
                        name: data.name || '',
                        description: data.description || '',
                        location: data.location || '',
                        phone: data.phone || '',
                        skills: data.skills || ''
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
        setSaving(true);
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
                setSaved(true);
                setTimeout(() => {
                    setSaved(false);
                    // Redirect to subscription if query param exists or by default
                    // Or just give a choice. For now, let's redirect to subscription as it's the main blocker.
                    navigate('/dashboard/workshop/subscribe');
                }, 1500);
            } else {
                const err = await res.json();
                alert(err.message || 'حدث خطأ أثناء حفظ الملف الشخصي');
            }
        } catch (error) {
            console.error(error);
            alert('حدث خطأ في الاتصال بالسيرفر');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                color: 'var(--text-muted)'
            }}>
                جاري التحميل...
            </div>
        );
    }

    const inputStyle = {
        width: '100%',
        padding: '1rem 1rem 1rem 3rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        background: '#f9fafb',
        outline: 'none'
    };

    const labelStyle = {
        display: 'block',
        marginBottom: '0.5rem',
        fontWeight: '600',
        color: '#374151',
        fontSize: '0.95rem'
    };

    const iconStyle = {
        position: 'absolute',
        right: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#9ca3af'
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                }}>
                    إعدادات الملف الشخصي
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    اضبط معلومات ورشتك لتظهر بشكل احترافي للزبائن
                </p>
            </div>

            {/* Success Message */}
            {saved && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    color: '#166534',
                    fontWeight: '600'
                }}>
                    <CheckCircle size={20} />
                    تم حفظ التغييرات بنجاح!
                </div>
            )}

            {/* Form Card */}
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                border: '1px solid #e5e7eb'
            }}>
                <form onSubmit={handleSubmit}>
                    {/* Workshop Name */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>
                            <User size={16} style={{ display: 'inline', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                            اسم الورشة
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="text"
                                placeholder="مثال: ورشة الحرفي الماهر"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                required
                                style={inputStyle}
                                onFocus={e => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.background = 'white';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.background = '#f9fafb';
                                }}
                            />
                        </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>
                            <Mail size={16} style={{ display: 'inline', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                            البريد الإلكتروني (غير قابل للتعديل)
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                style={{
                                    ...inputStyle,
                                    background: '#f3f4f6',
                                    color: '#6b7280',
                                    cursor: 'not-allowed',
                                    borderColor: '#e5e7eb'
                                }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={labelStyle}>
                            <FileText size={16} style={{ display: 'inline', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                            نبذة عن الورشة
                        </label>
                        <textarea
                            placeholder="صف ورشتك وخدماتك... مثال: ورشة متخصصة في صناعة الأثاث العصري والكلاسيكي بخبرة 15 سنة"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            required
                            style={{
                                ...inputStyle,
                                padding: '1rem',
                                minHeight: '120px',
                                resize: 'vertical'
                            }}
                            onFocus={e => {
                                e.target.style.borderColor = '#3b82f6';
                                e.target.style.background = 'white';
                            }}
                            onBlur={e => {
                                e.target.style.borderColor = '#e5e7eb';
                                e.target.style.background = '#f9fafb';
                            }}
                        />
                        <p style={{
                            fontSize: '0.8rem',
                            color: '#9ca3af',
                            marginTop: '0.5rem'
                        }}>
                            وصف جيد يساعد الزبائن على فهم تخصصك
                        </p>
                    </div>

                    {/* Location & Phone - Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '1.5rem'
                    }}>
                        <div>
                            <label style={labelStyle}>
                                <MapPin size={16} style={{ display: 'inline', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                                المدينة / الولاية
                            </label>
                            <div style={{ position: 'relative' }}>
                                <select
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                    style={{
                                        ...inputStyle,
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        appearance: 'none'
                                    }}
                                    onFocus={e => {
                                        e.target.style.borderColor = '#3b82f6';
                                        e.target.style.background = 'white';
                                    }}
                                    onBlur={e => {
                                        e.target.style.borderColor = '#e5e7eb';
                                        e.target.style.background = '#f9fafb';
                                    }}
                                >
                                    <option value="">اختر الولاية</option>
                                    {wilayas.map((w) => (
                                        <option key={w} value={w}>{w}</option>
                                    ))}
                                </select>
                                <div style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    pointerEvents: 'none'
                                }}>
                                    ▼
                                </div>
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>
                                <Phone size={16} style={{ display: 'inline', marginLeft: '0.5rem', verticalAlign: 'middle' }} />
                                رقم الهاتف
                            </label>
                            <input
                                type="tel"
                                placeholder="0555 00 00 00"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                                style={inputStyle}
                                onFocus={e => {
                                    e.target.style.borderColor = '#3b82f6';
                                    e.target.style.background = 'white';
                                }}
                                onBlur={e => {
                                    e.target.style.borderColor = '#e5e7eb';
                                    e.target.style.background = '#f9fafb';
                                }}
                            />
                        </div>
                    </div>



                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            padding: '1rem 2rem',
                            background: saving ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '700',
                            cursor: saving ? 'not-allowed' : 'pointer',
                            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Save size={20} />
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
