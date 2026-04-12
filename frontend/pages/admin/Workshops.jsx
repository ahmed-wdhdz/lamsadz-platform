import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, Check, X, Ban, Eye } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Workshops = () => {
    const { token } = useAuth();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedWorkshop, setSelectedWorkshop] = useState(null);

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/workshops`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setWorkshops(data.workshops || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id, status) => {
        if (!confirm(`هل أنت متأكد من تغيير الحالة إلى ${status}؟`)) return;

        try {
            const res = await fetch(`${API_URL}/admin/workshops/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setWorkshops(workshops.map(w => w.id === id ? { ...w, status } : w));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>إدارة الورش</h1>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>اسم الورشة</th>
                            <th style={{ padding: '1rem' }}>المالك</th>
                            <th style={{ padding: '1rem' }}>الولاية</th>
                            <th style={{ padding: '1rem' }}>انتهاء الاشتراك</th>
                            <th style={{ padding: '1rem' }}>إحصائيات</th>
                            <th style={{ padding: '1rem' }}>الحالة</th>
                            <th style={{ padding: '1rem' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {workshops.map(workshop => (
                            <tr key={workshop.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{workshop.name}</td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.9rem' }}>{workshop.owner.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{workshop.owner.email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{workshop.location}</td>
                                <td style={{ padding: '1rem' }}>
                                    {workshop.subscriptionEndsAt ? (
                                        <div style={{
                                            fontSize: '0.85rem',
                                            color: new Date(workshop.subscriptionEndsAt) < new Date() ? 'red' : 'green',
                                            fontWeight: '600'
                                        }}>
                                            {new Date(workshop.subscriptionEndsAt).toLocaleDateString('ar-DZ')}
                                        </div>
                                    ) : (
                                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>-</span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem' }}>تصاميم: {workshop._count.products}</div>
                                    <div style={{ fontSize: '0.85rem' }}>طلبات: {workshop._count.leadDeliveries}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.85rem',
                                        background: workshop.status === 'APPROVED' ? '#dcfce7' : workshop.status === 'REJECTED' || workshop.status === 'SUSPENDED' ? '#fee2e2' : '#fef9c3',
                                        color: workshop.status === 'APPROVED' ? '#15803d' : workshop.status === 'REJECTED' || workshop.status === 'SUSPENDED' ? '#991b1b' : '#a16207'
                                    }}>
                                        {workshop.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={() => setSelectedWorkshop(workshop)}
                                        style={{ color: '#3b82f6', background: '#eff6ff', padding: '0.4rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                        title="معاينة التفاصيل"
                                    >
                                        <Eye size={16} />
                                    </button>
                                    {workshop.status !== 'APPROVED' && (
                                        <button
                                            onClick={() => updateStatus(workshop.id, 'APPROVED')}
                                            style={{ color: 'green', background: '#dcfce7', padding: '0.4rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                            title="قبول"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                    {workshop.status !== 'SUSPENDED' && (
                                        <button
                                            onClick={() => updateStatus(workshop.id, 'SUSPENDED')}
                                            style={{ color: 'orange', background: '#ffedd5', padding: '0.4rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                            title="تجميد"
                                        >
                                            <Ban size={16} />
                                        </button>
                                    )}
                                    {workshop.status !== 'REJECTED' && (
                                        <button
                                            onClick={() => updateStatus(workshop.id, 'REJECTED')}
                                            style={{ color: 'red', background: '#fee2e2', padding: '0.4rem', borderRadius: '4px', border: 'none', cursor: 'pointer' }}
                                            title="رفض"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedWorkshop && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Store size={20} />
                                تفاصيل الورشة - {selectedWorkshop.name}
                            </h3>
                            <button onClick={() => setSelectedWorkshop(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>اسم المالك</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedWorkshop.owner?.name}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>البريد الإلكتروني</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedWorkshop.owner?.email}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>رقم الهاتف</label>
                                    <div style={{ fontWeight: 'bold', direction: 'ltr', textAlign: 'right' }}>{selectedWorkshop.phone || 'غير متوفر'}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>الولاية</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedWorkshop.location}</div>
                                </div>
                            </div>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>وصف الورشة</label>
                                <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                                    {selectedWorkshop.description || 'لا يوجد وصف مقدّم.'}
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem' }}>
                                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>المهارات والاختصاصات</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {selectedWorkshop.skills ? selectedWorkshop.skills.split(',').map(s => (
                                        <span key={s} style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.85rem' }}>
                                            {s.trim()}
                                        </span>
                                    )) : <span style={{ color: 'var(--text-muted)' }}>لا توجد مهارات محددة</span>}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#eff6ff', padding: '1rem', borderRadius: '8px' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>إجمالي التصاميم</label>
                                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1d4ed8' }}>{selectedWorkshop._count?.products || 0}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>الطلبيات المُستلمة</label>
                                    <div style={{ fontWeight: '800', fontSize: '1.2rem', color: '#1d4ed8' }}>{selectedWorkshop._count?.leadDeliveries || 0}</div>
                                </div>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setSelectedWorkshop(null)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', background: 'var(--gray-200)', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                إغلاق
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workshops;
