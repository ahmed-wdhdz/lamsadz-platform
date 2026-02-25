import React, { useState } from 'react';
import { X, Upload, CreditCard, CheckCircle } from 'lucide-react';
import Button from './Button';
import { requestPromotion } from '../api/promotions';
import { useAuth } from '../context/AuthContext';

const PromoteModal = ({ product, isOpen, onClose }) => {
    const { token } = useAuth();
    const [durationDays, setDurationDays] = useState(7);
    const [proofImage, setProofImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !product) return null;

    const ratePerWeek = 1000;
    const weeks = Math.ceil(durationDays / 7);
    const totalAmount = weeks * ratePerWeek;

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setProofImage(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!proofImage) {
            setError('يرجى إرفاق صورة وصول الدفع.');
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('productId', product.id);
            formData.append('durationDays', durationDays);
            formData.append('proofImage', proofImage);

            await requestPromotion(token, formData);
            setSuccess(true);
        } catch (err) {
            setError(err.message || 'حدث خطأ أثناء طلب الترويج.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSuccess(false);
        setError('');
        setProofImage(null);
        setDurationDays(7);
        onClose();
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '24px', padding: '2rem',
                width: '100%', maxWidth: '500px', position: 'relative',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
            }}>
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute', top: '1.5rem', left: '1.5rem',
                        background: '#f1f5f9', border: 'none', borderRadius: '50%',
                        width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: '#64748b'
                    }}
                >
                    <X size={18} />
                </button>

                {success ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                        <div style={{ width: '64px', height: '64px', background: '#dcfce7', color: '#16a34a', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <CheckCircle size={32} />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>تم إرسال الطلب بنجاح!</h2>
                        <p style={{ color: '#475569', marginBottom: '2rem', lineHeight: '1.6' }}>تم استلام طلب الترويج لتصميم <strong>{product.title}</strong>. سيتم مراجعة الدفع وتفعيل الترويج قريباً.</p>
                        <Button onClick={handleClose} variant="primary" style={{ width: '100%' }}>العودة للوحة التحكم</Button>
                    </div>
                ) : (
                    <>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#0f172a' }}>ترقية التصميم 🚀</h2>
                        <p style={{ color: '#64748b', marginBottom: '2rem' }}>اجعل تصميمك <strong>"{product.title}"</strong> يظهر في أعلى الصفحة الرئيسية.</p>

                        {error && (
                            <div style={{ color: '#ef4444', backgroundColor: '#fef2f2', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>مدة الترويج</label>
                                <select
                                    value={durationDays}
                                    onChange={(e) => setDurationDays(parseInt(e.target.value))}
                                    style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', background: 'white', fontSize: '1rem' }}
                                >
                                    <option value={7}>أسبوع واحد ({ratePerWeek} د.ج)</option>
                                    <option value={14}>أسبوعين ({ratePerWeek * 2} د.ج)</option>
                                    <option value={30}>شهر ({(ratePerWeek * 4) - 500} د.ج - تخفيض)</option>
                                </select>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: '#0f172a' }}>
                                    <CreditCard size={20} color="#3b82f6" />
                                    <span style={{ fontWeight: '700', fontSize: '1rem' }}>معلومات الدفع</span>
                                </div>
                                <p style={{ fontSize: '0.95rem', color: '#475569', marginBottom: '0.5rem', lineHeight: '1.6' }}>
                                    يرجى تحويل مبلغ <strong style={{ color: '#0f172a' }}>{totalAmount} د.ج</strong> إلى الحساب التالي:
                                </p>
                                <div style={{ background: 'white', padding: '0.8rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center', marginBottom: '1rem' }}>
                                    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.2rem' }}>بريدي موب / CCP</div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981', letterSpacing: '1px' }}>007 99999 99 99</div>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: '#64748b' }}>ثم قم بإرفاق صورة وصل التحويل أدناه لتأكيد طلبك.</p>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>إرفاق وصل الدفع <span style={{ color: '#ef4444' }}>*</span></label>
                                <label style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '2rem 1rem',
                                    cursor: 'pointer', background: proofImage ? '#f0fdf4' : '#f8fafc',
                                    transition: 'all 0.2s', borderColor: proofImage ? '#22c55e' : '#cbd5e1'
                                }}>
                                    <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} required />
                                    {proofImage ? (
                                        <>
                                            <CheckCircle size={32} color="#22c55e" style={{ marginBottom: '0.5rem' }} />
                                            <span style={{ fontSize: '0.95rem', color: '#16a34a', fontWeight: '600' }}>تم إرفاق الصورة ({proofImage.name})</span>
                                        </>
                                    ) : (
                                        <>
                                            <Upload size={32} color="#94a3b8" style={{ marginBottom: '0.5rem' }} />
                                            <span style={{ fontSize: '0.95rem', color: '#64748b', fontWeight: '500' }}>اضغط لاختيار صورة الوصل</span>
                                            <span style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.25rem' }}>PNG, JPG</span>
                                        </>
                                    )}
                                </label>
                            </div>

                            <Button type="submit" variant="primary" loading={loading} style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                                تأكيد الترويج ({totalAmount} د.ج)
                            </Button>

                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default PromoteModal;
