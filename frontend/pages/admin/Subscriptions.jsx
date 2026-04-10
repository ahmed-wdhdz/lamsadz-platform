const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Eye, CheckCircle, XCircle, Search, Calendar, CreditCard, X } from 'lucide-react';

const Subscriptions = () => {
    const { token } = useAuth();
    const [payments, setPayments] = useState([]);
    const [filteredPayments, setFilteredPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [adminNote, setAdminNote] = useState('');
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        fetchPayments();
    }, []);

    useEffect(() => {
        let res = payments;
        if (search) {
            res = res.filter(p =>
                p.workshop?.name.toLowerCase().includes(search.toLowerCase()) ||
                p.workshop?.owner?.email.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (filterStatus !== 'ALL') {
            if (filterStatus === 'UPLOADED') {
                res = res.filter(p => p.status === 'UPLOADED' || p.status === 'PENDING');
            } else {
                res = res.filter(p => p.status === filterStatus);
            }
        }
        setFilteredPayments(res);
    }, [payments, search, filterStatus]);

    const fetchPayments = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/payments`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setPayments(data);
                setFilteredPayments(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action) => {
        if (!selectedPayment) return;
        const endpoint = action === 'approve' ? 'approve' : 'reject';

        try {
            const res = await fetch(`${API_URL}/admin/payments/${selectedPayment.id}/${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ adminNote })
            });

            if (res.ok) {
                setSelectedPayment(null);
                setAdminNote('');
                fetchPayments();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>إدارة الاشتراكات</h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ position: 'relative', maxWidth: '400px' }}>
                    <Search style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
                    <input
                        type="text"
                        placeholder="بحث عن ورشة..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem 3rem 0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--gray-300)' }}
                    />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['ALL', 'UPLOADED', 'VALIDATED', 'REJECTED'].map(s => (
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
                            {s === 'ALL' ? 'الكل' : (s === 'UPLOADED' ? 'في الانتظار' : (s === 'VALIDATED' ? 'مقبول' : 'مرفوض'))}
                        </button>
                    ))}
                </div>
            </div>

            <div className="card overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>الورشة</th>
                            <th style={{ padding: '1rem' }}>الخطة</th>
                            <th style={{ padding: '1rem' }}>المبلغ</th>
                            <th style={{ padding: '1rem' }}>الحالة</th>
                            <th style={{ padding: '1rem' }}>التاريخ</th>
                            <th style={{ padding: '1rem' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPayments.map(payment => (
                            <tr key={payment.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{payment.workshop?.name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{payment.workshop?.owner?.email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                        <CreditCard size={14} />
                                        {payment.plan === 'MONTHLY' ? 'شهري' : 'سنوي'}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{payment.amount.toLocaleString()} د.ج</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: payment.status === 'VALIDATED' ? '#dcfce7' : payment.status === 'REJECTED' ? '#fee2e2' : '#fef9c3',
                                        color: payment.status === 'VALIDATED' ? '#15803d' : payment.status === 'REJECTED' ? '#991b1b' : '#a16207'
                                    }}>
                                        {payment.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.85rem' }}>
                                    {new Date(payment.createdAt).toLocaleDateString('ar-DZ')}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => setSelectedPayment(payment)}
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

            {selectedPayment && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
                    <div className="card" style={{ width: '100%', maxWidth: '600px', padding: '0', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>تفاصيل الدفع - {selectedPayment.workshop?.name}</h3>
                            <button onClick={() => setSelectedPayment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
                        </div>
                        <div style={{ padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center', background: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
                                {selectedPayment.proofUrl ? (
                                    <a href={(String(selectedPayment.proofUrl).startsWith('http') ? selectedPayment.proofUrl : `${API_URL.replace('/api', '')}/uploads/${selectedPayment.proofUrl}`)} target="_blank" rel="noreferrer">
                                        <img
                                            src={(String(selectedPayment.proofUrl).startsWith('http') ? selectedPayment.proofUrl : `${API_URL.replace('/api', '')}/uploads/${selectedPayment.proofUrl}`)}
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
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>الخطة</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedPayment.plan}</div>
                                </div>
                                <div>
                                    <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>المبلغ</label>
                                    <div style={{ fontWeight: 'bold' }}>{selectedPayment.amount} د.ج</div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>ملاحظة (في حالة الرفض)</label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="سبب الرفض..."
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--gray-300)', minHeight: '80px' }}
                                />
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={() => handleAction('reject')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px', background: '#fee2e2', color: '#991b1b', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                <XCircle size={18} /> رفض
                            </button>
                            <button
                                onClick={() => handleAction('approve')}
                                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '6px', background: '#dcfce7', color: '#15803d', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                            >
                                <CheckCircle size={18} /> قبول وتفعيل
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
