const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, CheckCircle, XCircle, Search, Rocket, X } from 'lucide-react';

const Promotions = () => {
    const { token } = useAuth();
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchPromotions();
    }, []);

    useEffect(() => {
        let res = promotions;
        if (search) {
            res = res.filter(p =>
                p.workshop?.name.toLowerCase().includes(search.toLowerCase()) ||
                p.product?.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterStatus !== 'ALL') {
            res = res.filter(p => p.status === filterStatus);
        }
        setFilteredPromotions(res);
    }, [promotions, search, filterStatus]);

    const fetchPromotions = async () => {
        try {
            const res = await fetch(`${API_URL}/promotions/admin`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                // Bug fix: The backend returns { promotions: [...] } not { promotionRequests: [...] }
                setPromotions(data.promotions || []);
                setFilteredPromotions(data.promotions || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status) => {
        if (!selectedPromo) return;

        try {
            const res = await fetch(`${API_URL}/promotions/${selectedPromo.id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status, adminNote })
            });

            if (res.ok) {
                setSelectedPromo(null);
                setAdminNote('');
                fetchPromotions();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>إدارة الترويجات 🚀</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="بحث عن ورشة أو تصميم..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map(s => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '999px',
                                border: '1px solid var(--gray-200)',
                                background: filterStatus === s ? 'var(--primary)' : 'white',
                                color: filterStatus === s ? 'white' : 'var(--text-color)',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            {s === 'ALL' ? 'الكل' : (s === 'PENDING' ? 'في الانتظار' : (s === 'APPROVED' ? 'مقبول' : 'مرفوض'))}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>الورشة</th>
                            <th style={{ padding: '1rem' }}>التصميم</th>
                            <th style={{ padding: '1rem' }}>المدة / المبلغ</th>
                            <th style={{ padding: '1rem' }}>الحالة</th>
                            <th style={{ padding: '1rem' }}>التاريخ</th>
                            <th style={{ padding: '1rem' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPromotions.map(promo => (
                            <tr key={promo.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{promo.workshop?.name}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <Rocket size={14} color="#f59e0b" />
                                        {promo.product?.title}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div>{promo.durationDays} يوم</div>
                                    <div style={{ fontWeight: 'bold', color: 'var(--primary)' }}>{promo.amount.toLocaleString()} د.ج</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: promo.status === 'APPROVED' ? '#dcfce7' : promo.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
                                        color: promo.status === 'APPROVED' ? '#15803d' : promo.status === 'REJECTED' ? '#991b1b' : '#a16207'
                                    }}>
                                        {promo.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                    {new Date(promo.createdAt).toLocaleDateString('ar-DZ')}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => setSelectedPromo(promo)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer', border: '1px solid var(--gray-200)', background: 'white' }}
                                    >
                                        <Eye size={16} /> معاينة
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedPromo && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>تفاصيل الترويج - {selectedPromo.workshop?.name}</h3>
                            <button onClick={() => setSelectedPromo(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center', background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                {selectedPromo.proofUrl ? (
                                    <a href={(String(selectedPromo.proofUrl).startsWith('http') ? selectedPromo.proofUrl : `${API_URL.replace('/api', '')}/uploads/${selectedPromo.proofUrl}`)} target="_blank" rel="noreferrer">
                                        <img
                                            src={(String(selectedPromo.proofUrl).startsWith('http') ? selectedPromo.proofUrl : `${API_URL.replace('/api', '')}/uploads/${selectedPromo.proofUrl}`)}
                                            alt="Proof"
                                            style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                        />
                                    </a>
                                ) : (
                                    <p>لا يوجد ملف إثبات</p>
                                )}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>التصميم</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedPromo.product?.title}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>المدة</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedPromo.durationDays} يوم</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>المبلغ</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedPromo.amount} د.ج</div>
                                </div>
                            </div>

                            {selectedPromo.status === 'PENDING' && (
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ملاحظة (في حالة الرفض)</label>
                                    <textarea
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="سبب الرفض..."
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--gray-300)', minHeight: '80px' }}
                                    />
                                </div>
                            )}
                        </div>
                        {selectedPromo.status === 'PENDING' && (
                            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button
                                    onClick={() => handleAction('REJECTED')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    <XCircle size={18} /> رفض
                                </button>
                                <button
                                    onClick={() => handleAction('APPROVED')}
                                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px', background: '#dcfce7', color: '#15803d', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    <CheckCircle size={18} /> قبول وتفعيل
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Promotions;
