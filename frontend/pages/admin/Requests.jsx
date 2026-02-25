const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { MessageSquare, MapPin } from 'lucide-react';

const Requests = () => {
    const { token } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('READY'); // READY, CUSTOM

    const readyLeads = leads.filter(l => l.design);
    const customLeads = leads.filter(l => !l.design);
    const displayedLeads = activeTab === 'READY' ? readyLeads : customLeads;

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/leads', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                console.log('Leads Data:', data.leads);
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>مراقبة الطلبات</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--gray-200)', paddingBottom: '1px' }}>
                <button
                    onClick={() => setActiveTab('READY')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 'bold',
                        color: activeTab === 'READY' ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'READY' ? '2px solid var(--primary)' : '2px solid transparent',
                        background: 'none',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    طلبات جاهزة ({readyLeads.length})
                </button>
                <button
                    onClick={() => setActiveTab('CUSTOM')}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontWeight: 'bold',
                        color: activeTab === 'CUSTOM' ? 'var(--primary)' : 'var(--text-muted)',
                        borderBottom: activeTab === 'CUSTOM' ? '2px solid var(--primary)' : '2px solid transparent',
                        background: 'none',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    طلبات خاصة ({customLeads.length})
                </button>
            </div>

            <div className="card overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>العميل</th>
                            <th style={{ padding: '1rem' }}>{activeTab === 'READY' ? 'المنتج' : 'نوع الطلب'}</th>
                            <th style={{ padding: '1rem' }}>الورشة</th>
                            <th style={{ padding: '1rem' }}>{activeTab === 'READY' ? 'السعر (د.ج)' : 'الوصف / الميزانية'}</th>
                            <th style={{ padding: '1rem' }}>الموقع</th>
                            <th style={{ padding: '1rem' }}>الحالة</th>
                            <th style={{ padding: '1rem' }}>التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedLeads.map(lead => (
                            <tr key={lead.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{lead.clientName || 'عميل'}</td>
                                <td style={{ padding: '1rem' }}>
                                    {activeTab === 'READY' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {lead.design?.images && (
                                                <img
                                                    src={`http://localhost:3000/uploads/${JSON.parse(lead.design.images)[0]}`}
                                                    alt=""
                                                    style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                                                />
                                            )}
                                            {lead.design?.title || 'منتج محذوف'}
                                        </div>
                                    ) : (
                                        lead.type
                                    )}
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '200px' }}>
                                    {activeTab === 'READY' ? (
                                        <span style={{ fontWeight: '500', color: '#4b5563' }}>{lead.design?.workshop?.name || 'غير معروف'}</span>
                                    ) : (
                                        <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                                            {lead.deliveries && lead.deliveries.length > 0 ? (
                                                lead.deliveries.map(d => d.workshop?.name).join('، ')
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>في الانتظار...</span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                    {activeTab === 'READY' ? (
                                        <span style={{ fontWeight: 'bold' }}>{lead.design?.price?.toLocaleString()} د.ج</span>
                                    ) : (
                                        <div>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.25rem' }}>
                                                {lead.description || 'لا يوجد وصف'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {lead.budgetMin || 0} - {lead.budgetMax || '؟'} د.ج
                                            </div>
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
                                        <MapPin size={14} /> {lead.wilaya}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: lead.status === 'SOLD' ? '#dcfce7' : '#e0f2fe',
                                        color: lead.status === 'SOLD' ? '#15803d' : '#0369a1'
                                    }}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    {new Date(lead.createdAt).toLocaleDateString('ar-DZ')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {displayedLeads.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        لا توجد طلبات في هذا القسم.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
