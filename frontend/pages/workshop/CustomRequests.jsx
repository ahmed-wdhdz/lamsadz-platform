import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Clock, DollarSign, MapPin, Send, MessageSquare, Image as ImageIcon, Ruler, Archive, Phone, User, CheckCircle, XCircle, BellOff } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const CustomRequests = () => {
    const { token } = useAuth();
    const { isArabic, t } = useLanguage();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLead, setExpandedLead] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [updating, setUpdating] = useState(null);

    const filteredLeads = leads.filter(entry => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'NEW') return entry.lead.status === 'NEW' || entry.lead.status === 'SENT';
        return entry.lead.status === activeFilter;
    });

    const updateStatus = async (leadId, status) => {
        try {
            setUpdating(leadId);
            const res = await fetch(`${API_URL}/workshop/custom-leads/${leadId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setLeads(leads.map(item =>
                    item.lead.id === leadId
                        ? { ...item, lead: { ...item.lead, status } }
                        : item
                ));
                setSuccessMessage(isArabic ? 'تم تحديث الحالة ✓' : 'Status updated ✓');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(null);
        }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/workshop/leads?type=custom`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchLeads(); }, []);

    const newCount = leads.filter(l => l.lead.status === 'NEW' || l.lead.status === 'SENT').length;
    const confirmedCount = leads.filter(l => l.lead.status === 'CONFIRMED').length;
    const noResponseCount = leads.filter(l => l.lead.status === 'NO_RESPONSE').length;
    const cancelledCount = leads.filter(l => l.lead.status === 'CANCELLED').length;

    return (
        <div className="custom-req-page" style={{ maxWidth: '900px', margin: '0 auto', padding: '1rem', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
            {/* Page Title */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h1 style={{
                    fontSize: 'clamp(1.4rem, 4vw, 1.8rem)',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '0.35rem'
                }}>
                    {isArabic ? 'الطلبات الخاصة' : 'Custom Requests'}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {isArabic ? 'طلبات الزبائن في ولايتك' : 'Client requests in your wilaya'}
                </p>
            </div>

            {/* Success Toast */}
            {successMessage && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    padding: '0.75rem 1rem',
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    borderRadius: '10px',
                    marginBottom: '1rem',
                    color: '#166534', fontWeight: '600', fontSize: '0.9rem'
                }}>
                    <CheckCircle size={18} /> {successMessage}
                </div>
            )}

            {/* Stats - always 2 cols */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '0.75rem',
                marginBottom: '1.25rem'
            }}>
                <div style={{ background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e40af' }}>{leads.length}</div>
                    <div style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.85rem' }}>{isArabic ? 'إجمالي الطلبات' : 'Total Requests'}</div>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #fef3c7, #fde68a)', borderRadius: '14px', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#92400e' }}>{newCount}</div>
                    <div style={{ color: '#d97706', fontWeight: '600', fontSize: '0.85rem' }}>{isArabic ? 'طلبات جديدة' : 'New Requests'}</div>
                </div>
            </div>

            {/* Filter Bar - horizontal scroll, no wrap */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                overflowX: 'auto',
                flexWrap: 'nowrap',
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingBottom: '4px',
                marginBottom: '1.25rem',
                width: '100%',
                maxWidth: '100%'
            }}>
                {[
                    { id: 'all',         label: isArabic ? 'الكل'        : 'All',         count: leads.length },
                    { id: 'NEW',         label: isArabic ? 'جديدة'       : 'New',         count: newCount },
                    { id: 'CONFIRMED',   label: isArabic ? 'تم الاتفاق'  : 'Agreed',      count: confirmedCount },
                    { id: 'NO_RESPONSE', label: isArabic ? 'لم يتم الرد' : 'No Reply',    count: noResponseCount },
                    { id: 'CANCELLED',   label: isArabic ? 'ملغاة'       : 'Cancelled',   count: cancelledCount },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id)}
                        style={{
                            padding: '0.45rem 0.85rem',
                            borderRadius: '999px',
                            border: activeFilter === tab.id ? 'none' : '1px solid #e2e8f0',
                            background: activeFilter === tab.id ? '#3b82f6' : 'var(--bg-card)',
                            color: activeFilter === tab.id ? 'white' : 'var(--text-muted)',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                            fontSize: '0.82rem',
                            fontWeight: '600',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s',
                            boxShadow: activeFilter === tab.id ? '0 2px 8px rgba(59,130,246,0.35)' : 'none',
                        }}
                    >
                        {tab.label}
                        <span style={{
                            background: activeFilter === tab.id ? 'rgba(255,255,255,0.25)' : '#f3f4f6',
                            color: activeFilter === tab.id ? 'white' : '#6b7280',
                            padding: '0.1rem 0.4rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                        }}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Cards List */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    {t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')}
                </div>
            ) : filteredLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: 'var(--bg-card)', borderRadius: '16px' }}>
                    <Archive size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-muted)' }}>{isArabic ? 'لا توجد طلبات في هذا التصنيف.' : 'No requests found.'}</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', minWidth: 0 }}>
                    {filteredLeads.map(entry => {
                        const l = entry.lead;
                        const images = l.images ? JSON.parse(l.images) : [];
                        const isExpanded = expandedLead === l.id;
                        const statusColor = {
                            CONFIRMED: '#16a34a', NO_RESPONSE: '#eab308',
                            CANCELLED: '#ef4444', NEW: '#3b82f6', SENT: '#3b82f6'
                        }[l.status] || '#6b7280';

                        return (
                            <div key={l.id} style={{
                                background: 'var(--bg-card)',
                                borderRadius: '16px',
                                padding: '1.25rem',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: '1px solid var(--border)',
                                overflow: 'hidden',
                                width: '100%',
                                minWidth: 0,
                                boxSizing: 'border-box'
                            }}>
                                {/* Card Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                                        <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.78rem', fontWeight: '700' }}>
                                            {l.category || l.type || (isArabic ? 'طلب خاص' : 'Custom')}
                                        </span>
                                        <span style={{ background: 'var(--bg-secondary)', color: 'var(--text-muted)', padding: '0.2rem 0.65rem', borderRadius: '99px', fontSize: '0.78rem', border: '1px solid var(--border)' }}>
                                            {new Date(l.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                        </span>
                                    </div>
                                    {/* Status badge */}
                                    <span style={{
                                        background: statusColor + '18',
                                        color: statusColor,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '99px',
                                        fontSize: '0.72rem',
                                        fontWeight: '700',
                                        whiteSpace: 'nowrap',
                                        flexShrink: 0,
                                    }}>
                                        {l.status === 'CONFIRMED' ? (isArabic ? 'متفق' : 'Agreed') :
                                         l.status === 'NO_RESPONSE' ? (isArabic ? 'لم يرد' : 'No Reply') :
                                         l.status === 'CANCELLED' ? (isArabic ? 'ملغى' : 'Cancelled') :
                                         (isArabic ? 'جديد' : 'New')}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.4rem', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                    {l.dimensions
                                        ? `${isArabic ? 'أبعاد:' : 'Dimensions:'} ${l.dimensions}`
                                        : (isArabic ? 'طلب تصميم خاص' : 'Custom Design Request')}
                                </h3>

                                {/* Description */}
                                {l.description && (
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '0.75rem', wordBreak: 'break-word', whiteSpace: 'normal' }}>
                                        {l.description}
                                    </p>
                                )}

                                {/* Location & Budget */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                                    {l.wilaya && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <MapPin size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                            {l.wilaya}
                                        </span>
                                    )}
                                    {l.budgetMax && (
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#16a34a', fontWeight: '600' }}>
                                            <DollarSign size={14} style={{ flexShrink: 0 }} />
                                            {isArabic ? 'الميزانية:' : 'Budget:'} {l.budgetMax} {t('products.currency') || 'د.ج'}
                                        </span>
                                    )}
                                </div>

                                {/* Reference image (small) */}
                                {images.length > 0 && (
                                    <div style={{ marginBottom: '1rem' }}>
                                        <img
                                            src={String(images[0]).startsWith('http') ? images[0] : `${API_URL.replace('/api', '')}/uploads/${images[0]}`}
                                            alt="Reference"
                                            style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', border: '1px solid var(--border)' }}
                                        />
                                    </div>
                                )}

                                {/* Divider */}
                                <div style={{ height: '1px', background: 'var(--border)', marginBottom: '1rem' }} />

                                {/* Client Info Row */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center', marginBottom: '1rem' }}>
                                    {/* Client name */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto', minWidth: '120px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <User size={18} color="#64748b" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isArabic ? 'الزبون' : 'Client'}</div>
                                            <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                                {l.clientName || (isArabic ? 'غير معروف' : 'Unknown')}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Phone */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 auto', minWidth: '120px' }}>
                                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Phone size={18} color="#16a34a" />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{isArabic ? 'الهاتف' : 'Phone'}</div>
                                            <div style={{ fontWeight: '700', color: '#16a34a', direction: 'ltr', fontSize: '0.9rem', wordBreak: 'break-all' }}>
                                                {l.clientPhone || '---'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Call Button */}
                                    <a
                                        href={`tel:${l.clientPhone}`}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                                            background: '#eff6ff', color: '#3b82f6',
                                            padding: '0.5rem 0.9rem', borderRadius: '8px',
                                            textDecoration: 'none', fontWeight: '600', fontSize: '0.85rem',
                                            border: '1px solid #dbeafe', flexShrink: 0,
                                        }}
                                    >
                                        <Phone size={14} /> {isArabic ? 'اتصال' : 'Call'}
                                    </a>
                                </div>

                                {/* Action Buttons - flex wrap for mobile */}
                                <div className="stack-on-mobile" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', width: '100%' }}>
                                    <button
                                        className="action-btn"
                                        onClick={() => updateStatus(l.id, 'CONFIRMED')}
                                        disabled={updating === l.id}
                                        style={{
                                            flex: '1 1 calc(33% - 0.5rem)', minWidth: '85px',
                                            padding: '0.6rem 0.75rem', borderRadius: '10px',
                                            border: `1.5px solid #16a34a`,
                                            background: l.status === 'CONFIRMED' ? '#16a34a' : 'white',
                                            color: l.status === 'CONFIRMED' ? 'white' : '#16a34a',
                                            cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        ✅ {isArabic ? 'اتفاق' : 'Agreed'}
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => updateStatus(l.id, 'NO_RESPONSE')}
                                        disabled={updating === l.id}
                                        style={{
                                            flex: '1 1 calc(33% - 0.5rem)', minWidth: '85px',
                                            padding: '0.6rem 0.75rem', borderRadius: '10px',
                                            border: `1.5px solid #eab308`,
                                            background: l.status === 'NO_RESPONSE' ? '#eab308' : 'white',
                                            color: l.status === 'NO_RESPONSE' ? 'white' : '#ca8a04',
                                            cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        📵 {isArabic ? 'لم يرد' : 'No Reply'}
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => updateStatus(l.id, 'CANCELLED')}
                                        disabled={updating === l.id}
                                        style={{
                                            flex: '1 1 calc(33% - 0.5rem)', minWidth: '85px',
                                            padding: '0.6rem 0.75rem', borderRadius: '10px',
                                            border: `1.5px solid #ef4444`,
                                            background: l.status === 'CANCELLED' ? '#ef4444' : 'white',
                                            color: l.status === 'CANCELLED' ? 'white' : '#ef4444',
                                            cursor: 'pointer', fontWeight: '700', fontSize: '0.82rem',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        ❌ {isArabic ? 'إلغاء' : 'Cancel'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .custom-req-page .filter-bar::-webkit-scrollbar { display: none; }
                @media (max-width: 768px) {
                    .custom-req-page button[style] { font-size: 0.78rem !important; }
                    .custom-req-page .action-btn { flex: 1 1 100% !important; min-width: 100% !important; margin-bottom: 0.25rem; }
                }
            `}</style>
        </div>
    );
};

export default CustomRequests;
