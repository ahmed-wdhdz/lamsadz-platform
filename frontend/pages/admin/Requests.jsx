import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { MessageSquare, MapPin } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Requests = () => {
    const { token } = useAuth();
    const { isArabic, t } = useLanguage();
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
            const res = await fetch(`${API_URL}/admin/leads`, {
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

    if (loading) return <div>{t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')}</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>{isArabic ? 'مراقبة الطلبات' : 'Requests Monitoring'}</h1>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                borderBottom: '1px solid var(--gray-200)',
                overflowX: 'auto',
                flexWrap: 'nowrap',
                scrollbarWidth: 'none',
            }}>
                <button
                    onClick={() => setActiveTab('READY')}
                    style={{
                        padding: '0.65rem 1.1rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
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
                    {isArabic ? 'طلبات جاهزة' : 'Ready Products'} ({readyLeads.length})
                </button>
                <button
                    onClick={() => setActiveTab('CUSTOM')}
                    style={{
                        padding: '0.65rem 1.1rem',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        flexShrink: 0,
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
                    {isArabic ? 'طلبات خاصة' : 'Custom Designs'} ({customLeads.length})
                </button>
            </div>

            <div className="card overflow-x-auto">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'العميل' : 'Client'}</th>
                            <th style={{ padding: '1rem' }}>{activeTab === 'READY' ? (isArabic ? 'المنتج' : 'Product') : (isArabic ? 'نوع الطلب' : 'Request Type')}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'الورشة' : 'Workshop'}</th>
                            <th style={{ padding: '1rem' }}>{activeTab === 'READY' ? (isArabic ? 'السعر' : 'Price') + ` (${t('products.currency') || 'د.ج'})` : (isArabic ? 'الوصف / الميزانية' : 'Description / Budget')}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'الموقع' : 'Location'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'الحالة' : 'Status'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'التاريخ' : 'Date'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayedLeads.map(lead => (
                            <tr key={lead.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{lead.clientName || (isArabic ? 'عميل' : 'Client')}</td>
                                <td style={{ padding: '1rem' }}>
                                    {activeTab === 'READY' ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {lead.design?.images && (
                                                <img
                                                    src={(String(JSON.parse(lead.design.images)[0]).startsWith('http') ? JSON.parse(lead.design.images)[0] : `${API_URL.replace('/api', '')}/uploads/${JSON.parse(lead.design.images)[0]}`)}
                                                    alt=""
                                                    style={{ width: '32px', height: '32px', borderRadius: '4px', objectFit: 'cover' }}
                                                />
                                            )}
                                            {lead.design?.title || (isArabic ? 'منتج محذوف' : 'Deleted Product')}
                                        </div>
                                    ) : (
                                        lead.type
                                    )}
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '200px' }}>
                                    {activeTab === 'READY' ? (
                                        <span style={{ fontWeight: '500', color: '#4b5563' }}>{lead.design?.workshop?.name || (isArabic ? 'غير معروف' : 'Unknown')}</span>
                                    ) : (
                                        <div style={{ fontSize: '0.85rem', color: '#4b5563' }}>
                                            {lead.deliveries && lead.deliveries.length > 0 ? (
                                                lead.deliveries.map(d => d.workshop?.name).join('، ')
                                            ) : (
                                                <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>{isArabic ? 'في الانتظار...' : 'Waiting...'}</span>
                                            )}
                                        </div>
                                    )}
                                </td>
                                <td style={{ padding: '1rem', maxWidth: '300px' }}>
                                    {activeTab === 'READY' ? (
                                        <span style={{ fontWeight: 'bold' }}>{lead.design?.price?.toLocaleString()} {t('products.currency') || 'د.ج'}</span>
                                    ) : (
                                        <div>
                                            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.25rem' }}>
                                                {lead.description || (isArabic ? 'لا يوجد وصف' : 'No description')}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                {lead.budgetMin || 0} - {lead.budgetMax || '؟'} {t('products.currency') || 'د.ج'}
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
                                    {new Date(lead.createdAt).toLocaleDateString(
                                        isArabic ? 'ar-DZ' : 'en-GB',
                                        { day: '2-digit', month: '2-digit', year: 'numeric' }
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {displayedLeads.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        {isArabic ? 'لا توجد طلبات في هذا القسم.' : 'No requests found in this section.'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Requests;
