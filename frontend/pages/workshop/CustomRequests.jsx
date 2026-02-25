const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, DollarSign, MapPin, Send, MessageSquare, Image as ImageIcon, Ruler, Archive, Phone, User } from 'lucide-react';

const CustomRequests = () => {
    const { token } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLead, setExpandedLead] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchLeads();
    }, []);

    const [activeFilter, setActiveFilter] = useState('all');

    const filteredLeads = leads.filter(entry => {
        if (activeFilter === 'all') return true;
        return entry.lead.status === activeFilter;
    });

    const updateStatus = async (leadId, status) => {
        try {
            const res = await fetch(`${API_URL}/workshop/custom-leads/${leadId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Update local state
                setLeads(leads.map(item =>
                    item.lead.id === leadId
                        ? { ...item, lead: { ...item.lead, status: status } }
                        : item
                ));
                alert('تم تحديث حالة الطلب');
            } else {
                alert('حدث خطأ أثناء تحديث الحالة');
            }
        } catch (error) {
            console.error(error);
            alert('خطأ في الاتصال');
        }
    };

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/workshop/leads?type=custom', {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []); // Backend returns structure { leads: [], ... }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <div style={{ padding: '2rem' }}>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem', color: '#1e293b' }}>الطلبات الخاصة (نفس الولاية)</h1>

            {successMessage && (
                <div style={{ padding: '1rem', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '1rem' }}>
                    {successMessage}
                </div>
            )}

            {/* Dashboard Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: '#dbeafe', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#1e40af' }}>{leads.length}</span>
                    <span style={{ color: '#3b82f6', fontWeight: '600' }}>إجمالي الطلبات</span>
                </div>
                <div style={{ background: '#fef3c7', borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#92400e' }}>{leads.filter(l => l.lead.status === 'NEW').length}</span>
                    <span style={{ color: '#d97706', fontWeight: '600' }}>طلبات جديدة</span>
                </div>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1rem', scrollbarWidth: 'none' }}>
                {[
                    { id: 'all', label: 'الكل' },
                    { id: 'NEW', label: 'جديدة' },
                    { id: 'CONFIRMED', label: 'تم الاتفاق' },
                    { id: 'NO_RESPONSE', label: 'لم يتم الرد' },
                    { id: 'CANCELLED', label: 'ملغاة' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveFilter(tab.id)}
                        style={{
                            padding: '0.5rem 1.25rem',
                            borderRadius: '99px',
                            border: activeFilter === tab.id ? 'none' : '1px solid #e2e8f0',
                            background: activeFilter === tab.id ? '#3b82f6' : 'white',
                            color: activeFilter === tab.id ? 'white' : '#64748b',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.9rem',
                            fontWeight: activeFilter === tab.id ? '600' : '500',
                            transition: 'all 0.2s'
                        }}
                    >
                        {tab.label}
                        <span style={{ marginRight: '0.5rem', fontSize: '0.8rem', opacity: 0.8 }}>
                            {tab.id === 'all' ? leads.length : leads.filter(l => l.lead.status === tab.id).length}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div>جاري التحميل...</div>
            ) : filteredLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'white', borderRadius: '16px' }}>
                    <Archive size={48} color="#cbd5e1" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: '#64748b' }}>لا توجد طلبات في هذا التصنيف.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {filteredLeads.map(entry => {
                        const l = entry.lead; // Access inner lead object from our backend transform
                        const images = l.images ? JSON.parse(l.images) : [];

                        return (
                            <div key={l.id} style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                            <span style={{ background: '#eff6ff', color: '#3b82f6', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: '700' }}>
                                                {l.category || l.type || 'طلب خاص'}
                                            </span>
                                            <span style={{ background: '#f8fafc', color: '#64748b', padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', border: '1px solid #e2e8f0' }}>
                                                {new Date(l.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
                                            {l.dimensions ? `أبعاد: ${l.dimensions}` : 'طلب تصميم خاص'}
                                        </h3>
                                        <p style={{ color: '#475569', maxWidth: '600px', lineHeight: '1.6' }}>
                                            {l.description}
                                        </p>

                                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <MapPin size={16} /> {l.wilaya}
                                            </div>
                                            {l.budgetMax && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: '600' }}>
                                                    <DollarSign size={16} /> الميزانية: {l.budgetMax} د.ج
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {images.length > 0 && (
                                        <div style={{ width: '100px', height: '100px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                            <img src={`http://localhost:3000/uploads/${images[0]}`} alt="Reference" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </div>
                                    )}
                                </div>

                                {/* Client Info & Actions */}
                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'center', justifyContent: 'space-between' }}>

                                    {/* Contact Info */}
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <User size={20} color="#64748b" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>الزبون</div>
                                                <div style={{ fontWeight: '600', color: '#334155' }}>{l.clientName || 'غير معروف'}</div>
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <Phone size={20} color="#16a34a" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>الهاتف</div>
                                                <div style={{ fontWeight: '700', color: '#16a34a', direction: 'ltr' }}>{l.clientPhone || '---'}</div>
                                            </div>
                                        </div>

                                        <a href={`tel:${l.clientPhone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#eff6ff', color: '#3b82f6', padding: '0.5rem 1rem', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '0.9rem', border: '1px solid #dbeafe' }}>
                                            <Phone size={16} /> اتصال
                                        </a>
                                    </div>

                                    {/* Status Actions */}
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            onClick={() => updateStatus(l.id, 'CONFIRMED')}
                                            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #16a34a', background: l.status === 'CONFIRMED' ? '#16a34a' : 'white', color: l.status === 'CONFIRMED' ? 'white' : '#16a34a', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                                            title="تم الاتفاق"
                                        >
                                            ✅ تم الاتفاق
                                        </button>
                                        <button
                                            onClick={() => updateStatus(l.id, 'NO_RESPONSE')}
                                            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #eab308', background: l.status === 'NO_RESPONSE' ? '#eab308' : 'white', color: l.status === 'NO_RESPONSE' ? 'white' : '#ca8a04', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                                            title="لم يرد"
                                        >
                                            📵 لم يرد
                                        </button>
                                        <button
                                            onClick={() => updateStatus(l.id, 'CANCELLED')}
                                            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #ef4444', background: l.status === 'CANCELLED' ? '#ef4444' : 'white', color: l.status === 'CANCELLED' ? 'white' : '#ef4444', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}
                                            title="ملغاة"
                                        >
                                            ❌ ملغاة
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default CustomRequests;
