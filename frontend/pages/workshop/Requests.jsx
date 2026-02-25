const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, CheckCircle, ChevronDown, ChevronUp, Send, Inbox, MapPin, DollarSign, Calendar, MessageSquare, Image as ImageIcon, User, Phone, Filter, Truck, Package, Check, XCircle, AlertCircle } from 'lucide-react';

const Requests = () => {
    const { token } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLead, setExpandedLead] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [successMessage, setSuccessMessage] = useState('');

    // Offer Form State
    const [offerForm, setOfferForm] = useState({ price: '', leadTimeDays: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

    const updateStatus = async (id, status) => {
        try {
            setSubmitting(true);
            const res = await fetch(`${API_URL}/workshops/deliveries/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                const updated = await res.json();
                setLeads(prev => prev.map(l => l.id === id ? { ...l, status: status } : l));
                setSuccessMessage('تم تحديث حالة الطلب بنجاح');
                setTimeout(() => setSuccessMessage(''), 3000);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/workshops/leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = async (delivery) => {
        if (expandedLead === delivery.id) {
            setExpandedLead(null);
        } else {
            setExpandedLead(delivery.id);
            if (!delivery.viewStatus) {
                try {
                    await fetch(`${API_URL}/deliveries/${delivery.id}/view`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setLeads(prev => prev.map(l => l.id === delivery.id ? { ...l, viewStatus: true } : l));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    const submitOffer = async (deliveryId, directPrice = null, directDays = null) => {
        setSubmitting(true);
        try {
            const payload = {
                price: directPrice || offerForm.price,
                leadTimeDays: directDays || offerForm.leadTimeDays,
                message: offerForm.message
            };

            const res = await fetch(`${API_URL}/deliveries/${deliveryId}/offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccessMessage('تم إرسال العرض بنجاح! سنقوم بإعلامك عند رد الزبون.');
                setTimeout(() => setSuccessMessage(''), 4000);
                setOfferForm({ price: '', leadTimeDays: '', message: '' });
                setExpandedLead(null);
                fetchLeads();
            } else {
                alert('حدث خطأ أثناء إرسال العرض');
            }
        } catch (e) {
            console.error(e);
            alert('خطأ في الاتصال');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredLeads = leads.filter(l => {
        if (filterStatus === 'ALL') return true;
        if (filterStatus === 'NEW') return !l.viewStatus;
        if (filterStatus === 'CONFIRMED') return l.status === 'CONFIRMED';
        if (filterStatus === 'SHIPPED') return l.status === 'SHIPPED';
        if (filterStatus === 'DELIVERED') return l.status === 'DELIVERED';
        if (filterStatus === 'CANCELLED') return l.status === 'CANCELLED' || l.status === 'REJECTED';
        if (filterStatus === 'NO_RESPONSE') return l.status === 'NO_RESPONSE';
        return true;
    });

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        background: '#f9fafb',
        outline: 'none'
    };

    const stats = {
        total: leads.length,
        new: leads.filter(l => !l.viewStatus).length,
        confirmed: leads.filter(l => l.status === 'CONFIRMED').length,
        shipped: leads.filter(l => l.status === 'SHIPPED').length,
        delivered: leads.filter(l => l.status === 'DELIVERED').length,
        cancelled: leads.filter(l => l.status === 'CANCELLED' || l.status === 'REJECTED').length,
        no_response: leads.filter(l => l.status === 'NO_RESPONSE').length
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
                جاري تحميل الطلبات...
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '800',
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem'
                }}>
                    طلبات الزبائن
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>
                    استقبل الطلبات وأرسل عروض الأسعار للزبائن المهتمين
                </p>
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1e40af' }}>{stats.total}</div>
                    <div style={{ fontSize: '0.9rem', color: '#3b82f6', fontWeight: '600' }}>إجمالي الطلبات</div>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                    padding: '1.25rem',
                    borderRadius: '16px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2rem', fontWeight: '800', color: '#92400e' }}>{stats.new}</div>
                    <div style={{ fontSize: '0.9rem', color: '#d97706', fontWeight: '600' }}>طلبات جديدة</div>
                </div>

            </div>

            {/* Success Message */}
            {successMessage && (
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
                    {successMessage}
                </div>
            )}

            {/* Filters */}
            <div style={{
                display: 'flex',
                gap: '0.5rem',
                marginBottom: '1.5rem',
                flexWrap: 'wrap'
            }}>
                {[
                    { value: 'ALL', label: 'الكل', count: stats.total },
                    { value: 'NEW', label: 'جديدة', count: stats.new },
                    { value: 'CONFIRMED', label: 'مؤكدة', count: stats.confirmed },
                    { value: 'SHIPPED', label: 'تم الشحن', count: stats.shipped },
                    { value: 'DELIVERED', label: 'مستلمة', count: stats.delivered },
                    { value: 'NO_RESPONSE', label: 'لم يتم الرد', count: stats.no_response },
                    { value: 'CANCELLED', label: 'ملغاة', count: stats.cancelled }
                ].map(f => (
                    <button
                        key={f.value}
                        onClick={() => setFilterStatus(f.value)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            border: filterStatus === f.value ? 'none' : '1px solid #e5e7eb',
                            background: filterStatus === f.value ? '#3b82f6' : 'white',
                            color: filterStatus === f.value ? 'white' : '#6b7280',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            boxShadow: filterStatus === f.value ? '0 2px 8px rgba(59, 130, 246, 0.4)' : 'none'
                        }}
                    >
                        {f.label}
                        <span style={{
                            background: filterStatus === f.value ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '999px',
                            fontSize: '0.75rem'
                        }}>
                            {f.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Leads List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {filteredLeads.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'white',
                        borderRadius: '20px',
                        border: '2px dashed #e5e7eb'
                    }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem'
                        }}>
                            <Inbox size={36} style={{ color: '#9ca3af' }} />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#374151' }}>
                            لا توجد طلبات حالياً
                        </h3>
                        <p style={{ color: '#9ca3af', maxWidth: '400px', margin: '0 auto' }}>
                            سيتم إشعارك عند توفر طلبات جديدة في منطقتك أو تخصصك.
                        </p>
                    </div>
                ) : (
                    filteredLeads.map(delivery => {
                        const hasOffer = delivery.offers && delivery.offers.length > 0;
                        const isExpanded = expandedLead === delivery.id;
                        const isNew = !delivery.viewStatus;

                        return (
                            <div
                                key={delivery.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                    border: isNew ? '2px solid #3b82f6' : '1px solid #e5e7eb',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {/* Header Row */}
                                <div
                                    onClick={() => toggleExpand(delivery)}
                                    style={{
                                        padding: '1.25rem',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        background: isExpanded ? '#f9fafb' : 'white'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {/* Status Indicator */}
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '12px',
                                            background: isNew ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : '#f3f4f6',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: isNew ? 'white' : '#9ca3af'
                                        }}>
                                            {hasOffer ? <CheckCircle size={24} /> : <Inbox size={24} />}
                                        </div>
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                                                <h3 style={{ fontWeight: '700', fontSize: '1.1rem', color: '#1f2937' }}>
                                                    {delivery.lead?.type || 'طلب جديد'}
                                                </h3>
                                                {isNew && (
                                                    <span style={{
                                                        background: '#3b82f6',
                                                        color: 'white',
                                                        padding: '0.125rem 0.5rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.7rem',
                                                        fontWeight: '700'
                                                    }}>جديد</span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <MapPin size={14} /> {delivery.lead?.wilaya || 'غير محدد'}
                                                </span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Clock size={14} /> {new Date(delivery.deliveredAt).toLocaleDateString('ar-DZ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        {hasOffer ? (
                                            <span style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                padding: '0.5rem 1rem',
                                                background: '#dcfce7',
                                                color: '#166534',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                                fontWeight: '700'
                                            }}>
                                                <CheckCircle size={16} /> تم التقديم
                                            </span>
                                        ) : (
                                            <span style={{
                                                padding: '0.5rem 1rem',
                                                background: {
                                                    'PENDING': '#fef3c7',
                                                    'CONFIRMED': '#dcfce7',
                                                    'SHIPPED': '#dbeafe',
                                                    'DELIVERED': '#f3e8ff',
                                                    'CANCELLED': '#fee2e2',
                                                    'REJECTED': '#fee2e2',
                                                    'NO_RESPONSE': '#ffedd5'
                                                }[delivery.status] || '#f3f4f6',
                                                color: {
                                                    'PENDING': '#92400e',
                                                    'CONFIRMED': '#166534',
                                                    'SHIPPED': '#1e40af',
                                                    'DELIVERED': '#6b21a8',
                                                    'CANCELLED': '#991b1b',
                                                    'REJECTED': '#991b1b',
                                                    'NO_RESPONSE': '#9a3412'
                                                }[delivery.status] || '#374151',
                                                borderRadius: '999px',
                                                fontSize: '0.85rem',
                                                fontWeight: '700'
                                            }}>
                                                {{
                                                    'PENDING': 'في الانتظار',
                                                    'CONFIRMED': 'تم التأكيد',
                                                    'SHIPPED': 'تم الشحن',
                                                    'DELIVERED': 'تم التسليم',
                                                    'CANCELLED': 'ملغاة',
                                                    'REJECTED': 'مرفوضة',
                                                    'NO_RESPONSE': 'لم يتم الرد'
                                                }[delivery.status] || 'غير محدد'}
                                            </span>
                                        )}
                                        {isExpanded ?
                                            <ChevronUp size={24} style={{ color: '#9ca3af' }} /> :
                                            <ChevronDown size={24} style={{ color: '#9ca3af' }} />
                                        }
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '1.5rem',
                                        borderTop: '1px solid #f3f4f6',
                                        background: '#fafafa'
                                    }}>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                            gap: '1.5rem'
                                        }}>
                                            {/* Lead Details */}
                                            <div>
                                                <h4 style={{
                                                    fontWeight: '700',
                                                    marginBottom: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.5rem',
                                                    color: '#374151'
                                                }}>
                                                    📋 تفاصيل الطلب
                                                </h4>

                                                {/* Customer & Order Details */}
                                                <div style={{
                                                    background: 'white',
                                                    padding: '1.25rem',
                                                    borderRadius: '12px',
                                                    border: '1px solid #e5e7eb',
                                                    marginBottom: '1rem',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '1rem'
                                                }}>
                                                    {/* Client Info */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                        <div>
                                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>الزبون</p>
                                                            <p style={{ fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <User size={16} /> {delivery.lead?.clientName || 'غير متوفر'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>رقم الهاتف</p>
                                                            <p style={{ fontWeight: '600', color: '#111827', direction: 'ltr', textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                                {delivery.lead?.clientPhone || 'غير متوفر'} <Phone size={16} />
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div style={{ height: '1px', background: '#f3f4f6' }}></div>

                                                    {/* Location & Price */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                        <div>
                                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>الولاية</p>
                                                            <p style={{ fontWeight: '600', color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <MapPin size={16} /> {delivery.lead?.wilaya || 'غير محدد'}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>سعر المنتج</p>
                                                            <p style={{ fontWeight: '700', color: '#16a34a', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <DollarSign size={18} />
                                                                {delivery.lead?.design?.price
                                                                    ? `${Number(delivery.lead.design.price).toLocaleString()} د.ج`
                                                                    : (delivery.lead?.budgetMin ? `${Number(delivery.lead.budgetMin).toLocaleString()} د.ج` : '---')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dimensions if available */}
                                                {delivery.lead?.dimensions && (
                                                    <div style={{
                                                        background: 'white',
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        border: '1px solid #e5e7eb',
                                                        marginBottom: '1rem'
                                                    }}>
                                                        <h5 style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.5rem', color: '#374151' }}>الأبعاد المطلوبة:</h5>
                                                        <p style={{ color: '#4b5563' }}>{delivery.lead.dimensions}</p>
                                                    </div>
                                                )}

                                                {/* Budget removed as per user request */}

                                                {/* Images */}
                                                {delivery.lead?.images && delivery.lead.images !== '[]' && (
                                                    <div>
                                                        <p style={{
                                                            fontWeight: '600',
                                                            marginBottom: '0.5rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.5rem',
                                                            color: '#374151'
                                                        }}>
                                                            <ImageIcon size={16} /> الصور المرفقة:
                                                        </p>
                                                        <div style={{
                                                            display: 'flex',
                                                            gap: '0.5rem',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                            {JSON.parse(delivery.lead.images).map((img, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={`http://localhost:3000/uploads/${img}`}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                >
                                                                    <img
                                                                        src={`http://localhost:3000/uploads/${img}`}
                                                                        alt="Lead"
                                                                        style={{
                                                                            width: '80px',
                                                                            height: '80px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '10px',
                                                                            border: '2px solid #e5e7eb'
                                                                        }}
                                                                    />
                                                                </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Offer Section */}
                                            <div style={{
                                                background: 'white',
                                                padding: '1.5rem',
                                                borderRadius: '16px',
                                                border: '1px solid #e5e7eb'
                                            }}>
                                                <h4 style={{
                                                    fontWeight: '700',
                                                    marginBottom: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    color: '#374151'
                                                }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <Send size={18} /> تتبع الطلب
                                                    </span>
                                                    {delivery.status && delivery.status !== 'PENDING' && (
                                                        <span style={{
                                                            fontSize: '0.8rem',
                                                            background: '#dcfce7',
                                                            color: '#166534',
                                                            padding: '0.25rem 0.75rem',
                                                            borderRadius: '999px'
                                                        }}>
                                                            تم التأكيد
                                                        </span>
                                                    )}
                                                </h4>

                                                {delivery.status && delivery.status !== 'PENDING' && delivery.status !== 'NO_RESPONSE' && delivery.status !== 'REJECTED' && delivery.status !== 'CANCELLED' ? (
                                                    <div>
                                                        {/* Stepper */}
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', position: 'relative' }}>
                                                            {/* Connector Line */}
                                                            <div style={{ position: 'absolute', top: '15px', right: '10%', left: '10%', height: '3px', background: '#e5e7eb', zIndex: 0 }}></div>
                                                            <div style={{
                                                                position: 'absolute',
                                                                top: '15px',
                                                                right: '10%',
                                                                left: delivery.status === 'DELIVERED' ? '10%' : (delivery.status === 'SHIPPED' ? '40%' : '70%'),
                                                                height: '3px',
                                                                background: '#16a34a',
                                                                zIndex: 0,
                                                                transition: 'all 0.5s ease'
                                                            }}></div>

                                                            {[
                                                                { status: 'CONFIRMED', label: 'تم التأكيد', icon: CheckCircle },
                                                                { status: 'SHIPPED', label: 'تم الشحن', icon: Truck },
                                                                { status: 'DELIVERED', label: 'تم الاستلام', icon: Package }
                                                            ].map((step, idx) => {
                                                                const isCompleted = ['CONFIRMED', 'SHIPPED', 'DELIVERED'].indexOf(delivery.status) >= idx;
                                                                const isCurrent = delivery.status === step.status;
                                                                const Icon = step.icon;

                                                                return (
                                                                    <div key={step.status} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                                                                        <div style={{
                                                                            width: '32px',
                                                                            height: '32px',
                                                                            borderRadius: '50%',
                                                                            background: isCompleted ? '#16a34a' : 'white',
                                                                            border: isCompleted ? 'none' : '3px solid #e5e7eb',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            color: isCompleted ? 'white' : '#9ca3af',
                                                                            marginBottom: '0.5rem',
                                                                            transition: 'all 0.3s ease'
                                                                        }}>
                                                                            <Icon size={16} />
                                                                        </div>
                                                                        <span style={{
                                                                            fontSize: '0.8rem',
                                                                            fontWeight: isCurrent ? '700' : '500',
                                                                            color: isCompleted ? '#166534' : '#6b7280'
                                                                        }}>
                                                                            {step.label}
                                                                        </span>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>

                                                        {/* Actions */}
                                                        <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '12px', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                                            {delivery.status === 'CONFIRMED' && (
                                                                <button
                                                                    onClick={() => updateStatus(delivery.id, 'SHIPPED')}
                                                                    disabled={submitting}
                                                                    style={{
                                                                        padding: '0.75rem 1.5rem',
                                                                        background: '#3b82f6',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        fontWeight: '600',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <Truck size={18} /> تحديد كـ "تم الشحن"
                                                                </button>
                                                            )}
                                                            {delivery.status === 'SHIPPED' && (
                                                                <button
                                                                    onClick={() => updateStatus(delivery.id, 'DELIVERED')}
                                                                    disabled={submitting}
                                                                    style={{
                                                                        padding: '0.75rem 1.5rem',
                                                                        background: '#16a34a',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        fontWeight: '600',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: '0.5rem',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    <Package size={18} /> تحديد كـ "تم الاستلام"
                                                                </button>
                                                            )}
                                                            {delivery.status === 'DELIVERED' && (
                                                                <div style={{ textAlign: 'center', color: '#166534', fontWeight: '600' }}>
                                                                    ✅ اكتملت الطلبية بنجاح
                                                                </div>
                                                            )}
                                                            {delivery.status !== 'DELIVERED' && (
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm('هل أنت متأكد من إلغاء الطلب؟')) updateStatus(delivery.id, 'CANCELLED');
                                                                    }}
                                                                    disabled={submitting}
                                                                    style={{
                                                                        padding: '0.75rem 1.5rem',
                                                                        background: 'white',
                                                                        color: '#ef4444',
                                                                        border: '1px solid #ef4444',
                                                                        borderRadius: '8px',
                                                                        fontWeight: '600',
                                                                        cursor: 'pointer'
                                                                    }}
                                                                >
                                                                    إلغاء الطلب
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    hasOffer ? (
                                                        <div style={{}}>
                                                            {/* Existing Offer Sent View (Legacy for Custom Req) */}
                                                            <div style={{
                                                                textAlign: 'center',
                                                                padding: '1.5rem',
                                                                background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                                                                borderRadius: '12px'
                                                            }}>
                                                                <CheckCircle size={40} style={{ color: '#16a34a', margin: '0 auto 0.75rem' }} />
                                                                <p style={{ fontWeight: '700', color: '#166534', marginBottom: '0.5rem' }}>
                                                                    تم إرسال عرضك بنجاح!
                                                                </p>
                                                                {/* ... details ... */}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div style={{ padding: '1rem', background: '#eff6ff', borderRadius: '12px', marginBottom: '1rem' }}>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                                                                <span style={{ fontWeight: '700', color: '#1e3a8a' }}>المنتج:</span>
                                                                <span style={{ fontWeight: '600', color: '#374151' }}>
                                                                    {delivery.lead?.design?.title || delivery.lead?.type || 'طلب مخصص'}
                                                                </span>
                                                            </div>
                                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                                                <span style={{ fontWeight: '700', color: '#1e3a8a' }}>السعر:</span>
                                                                <span style={{ fontWeight: '800', fontSize: '1.25rem', color: '#2563eb' }}>
                                                                    {delivery.lead?.design?.price
                                                                        ? `${Number(delivery.lead.design.price).toLocaleString()} د.ج`
                                                                        : (delivery.lead?.budgetMin ? `${Number(delivery.lead.budgetMin).toLocaleString()} د.ج` : 'غير محدد')}
                                                                </span>
                                                            </div>

                                                            {/* Action Buttons Row */}
                                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                                                {/* Cancel Button */}
                                                                <button
                                                                    onClick={async () => {
                                                                        if (confirm('هل أنت متأكد من إلغاء الطلب؟')) await updateStatus(delivery.id, 'REJECTED');
                                                                    }}
                                                                    disabled={submitting}
                                                                    style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        padding: '0.75rem',
                                                                        background: 'white',
                                                                        color: '#ef4444',
                                                                        border: '1px solid #ef4444',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: '600',
                                                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                                                        transition: 'all 0.2s',
                                                                        gap: '0.25rem'
                                                                    }}
                                                                >
                                                                    <XCircle size={18} />
                                                                    إلغاء الطلب
                                                                </button>

                                                                {/* No Response Button */}
                                                                <button
                                                                    onClick={async () => {
                                                                        await updateStatus(delivery.id, 'NO_RESPONSE');
                                                                    }}
                                                                    disabled={submitting}
                                                                    style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        padding: '0.75rem',
                                                                        background: '#fff7ed',
                                                                        color: '#c2410c',
                                                                        border: '1px solid #fed7aa',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: '600',
                                                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                                                        transition: 'all 0.2s',
                                                                        gap: '0.25rem'
                                                                    }}
                                                                >
                                                                    <AlertCircle size={18} />
                                                                    لم يتم الرد
                                                                </button>

                                                                {/* Confirm Button */}
                                                                <button
                                                                    onClick={async () => {
                                                                        await updateStatus(delivery.id, 'CONFIRMED');
                                                                    }}
                                                                    disabled={submitting}
                                                                    style={{
                                                                        display: 'flex',
                                                                        flexDirection: 'column',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        padding: '0.75rem',
                                                                        background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
                                                                        color: 'white',
                                                                        border: 'none',
                                                                        borderRadius: '8px',
                                                                        fontSize: '0.8rem',
                                                                        fontWeight: '700',
                                                                        cursor: submitting ? 'not-allowed' : 'pointer',
                                                                        boxShadow: '0 4px 6px -1px rgba(22, 163, 74, 0.2)',
                                                                        gap: '0.25rem'
                                                                    }}
                                                                >
                                                                    <CheckCircle size={18} />
                                                                    تأكيد الطلب
                                                                </button>
                                                            </div>

                                                            {delivery.status === 'NO_RESPONSE' && (
                                                                <p style={{ fontSize: '0.8rem', color: '#ea580c', marginTop: '0.75rem', textAlign: 'center', fontWeight: '600' }}>
                                                                    ⚠️ تم تحديد الحالة: "لم يتم الرد". حاول الاتصال مجدداً.
                                                                </p>
                                                            )}

                                                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem', textAlign: 'center' }}>
                                                                * تأكد من الاتصال بالزبون قبل اتخاذ أي إجراء.
                                                            </p>
                                                        </div>
                                                    ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div >
        </div >
    );
};

export default Requests;
