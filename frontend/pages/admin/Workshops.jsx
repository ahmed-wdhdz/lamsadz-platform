import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Store, Check, X, Ban } from 'lucide-react';

const Workshops = () => {
    const { token } = useAuth();
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWorkshops();
    }, []);

    const fetchWorkshops = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/admin/workshops', {
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
            const res = await fetch(`http://localhost:3000/api/admin/workshops/${id}/status`, {
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
        </div>
    );
};

export default Workshops;
