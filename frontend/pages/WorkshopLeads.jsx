import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';
import { getOptimizedImage } from '../utils/optimizeImage';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const WorkshopLeads = () => {
    const { token } = useAuth();
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedLead, setExpandedLead] = useState(null);

    // Offer Form State
    const [offerForm, setOfferForm] = useState({ price: '', leadTimeDays: '', message: '' });
    const [submitting, setSubmitting] = useState(false);

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
            // Mark as viewed if not already
            if (!delivery.viewStatus) {
                try {
                    await fetch(`${API_URL}/deliveries/${delivery.id}/view`, {
                        method: 'POST',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Update local state to show 'read' status instantly
                    setLeads(prev => prev.map(l => l.id === delivery.id ? { ...l, viewStatus: true } : l));
                } catch (e) {
                    console.error(e);
                }
            }
        }
    };

    const submitOffer = async (deliveryId) => {
        setSubmitting(true);
        try {
            const res = await fetch(`${API_URL}/deliveries/${deliveryId}/offer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(offerForm)
            });

            if (res.ok) {
                alert('تم إرسال العرض بنجاح!');
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

    if (loading) return <div className="loading-screen">جاري تحميل الطلبات...</div>;

    return (
        <div className="dashboard-container" style={{ padding: '2rem' }} dir="rtl">
            <h1 className="text-2xl font-bold mb-6">طلبات الزبائن (Leads)</h1>

            <div className="space-y-4">
                {leads.length === 0 ? (
                    <div className="text-center p-8 bg-gray-50 rounded-lg text-gray-500">
                        لا توجد طلبات جديدة حالياً.
                    </div>
                ) : (
                    leads.map(delivery => {
                        const hasOffer = delivery.offers && delivery.offers.length > 0;
                        const isExpanded = expandedLead === delivery.id;

                        return (
                            <div key={delivery.id} className={`bg-white border rounded-lg shadow-sm transition-all ${!delivery.viewStatus ? 'border-l-4 border-l-indigo-500' : 'border-gray-200'}`}>
                                {/* Header / Summary Row */}
                                <div
                                    className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                    onClick={() => toggleExpand(delivery)}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${!delivery.viewStatus ? 'bg-indigo-500' : 'bg-gray-300'}`}></div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{delivery.lead.type}</h3>
                                            <p className="text-sm text-gray-500">الولاية: {delivery.lead.wilaya}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Clock size={16} />
                                            {new Date(delivery.deliveredAt).toLocaleDateString()}
                                        </div>
                                        {hasOffer ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                <CheckCircle size={14} /> تم التقديم
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                                                في الانتظار
                                            </span>
                                        )}
                                        {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <div className="p-4 border-t border-gray-100 bg-gray-50">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Lead Info */}
                                            <div>
                                                <h4 className="font-bold text-gray-800 mb-2">تفاصيل الطلب</h4>
                                                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{delivery.lead.description}</p>

                                                <div className="mb-4">
                                                    <span className="text-sm font-bold text-gray-600 block mb-1">الميزانية المقترحة:</span>
                                                    <span className="text-gray-900">
                                                        {delivery.lead.budgetMin && delivery.lead.budgetMax
                                                            ? `${delivery.lead.budgetMin} - ${delivery.lead.budgetMax} د.ج`
                                                            : (delivery.lead.budgetMin ? `من ${delivery.lead.budgetMin} د.ج` : 'غير محددة')}
                                                    </span>
                                                </div>

                                                {delivery.lead.images && delivery.lead.images !== '[]' && (
                                                    <div>
                                                        <h5 className="font-bold text-sm text-gray-600 mb-2">الصور المرفقة:</h5>
                                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                                            {JSON.parse(delivery.lead.images).map((img, idx) => (
                                                                    <a key={idx} href={(String(img).startsWith('http') ? img : `${API_URL.replace('/api', '')}/uploads/${img}`)} target="_blank" rel="noreferrer">
                                                                        <img src={getOptimizedImage(img, 100)} alt="Lead" className="h-20 w-20 object-cover rounded border" />
                                                                    </a>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Offer Section */}
                                            <div className="bg-white p-4 rounded border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                                    <Send size={18} /> تقديم عرض سعر
                                                </h4>

                                                {hasOffer ? (
                                                    <div className="bg-green-50 p-4 rounded text-center">
                                                        <CheckCircle className="mx-auto text-green-600 mb-2" size={32} />
                                                        <p className="font-bold text-green-800">تم إرسال عرضك بنجاح</p>
                                                        <p className="text-sm text-green-600 mt-1">السعر: {delivery.offers[0].price} د.ج | المدة: {delivery.offers[0].leadTimeDays} يوم</p>
                                                        <p className="text-sm text-gray-500 mt-2">سنقوم بإعلامك عند رد الزبون.</p>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">السعر المقترح (د.ج)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full border rounded p-2"
                                                                value={offerForm.price}
                                                                onChange={e => setOfferForm({ ...offerForm, price: e.target.value })}
                                                                placeholder="مثال: 45000"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">مدة الإنجاز (أيام)</label>
                                                            <input
                                                                type="number"
                                                                className="w-full border rounded p-2"
                                                                value={offerForm.leadTimeDays}
                                                                onChange={e => setOfferForm({ ...offerForm, leadTimeDays: e.target.value })}
                                                                placeholder="مثال: 15"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">رسالة للزبون</label>
                                                            <textarea
                                                                className="w-full border rounded p-2"
                                                                rows="3"
                                                                value={offerForm.message}
                                                                onChange={e => setOfferForm({ ...offerForm, message: e.target.value })}
                                                                placeholder="صف جودة عملك، المواد المستعملة، إلخ..."
                                                            ></textarea>
                                                        </div>
                                                        <button
                                                            onClick={() => submitOffer(delivery.id)}
                                                            disabled={submitting || !offerForm.price || !offerForm.leadTimeDays}
                                                            className={`w-full py-2 rounded font-bold text-white ${submitting ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                                                        >
                                                            {submitting ? 'جاري الإرسال...' : 'إرسال العرض'}
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default WorkshopLeads;
