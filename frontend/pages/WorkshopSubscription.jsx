const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Upload, Clock, AlertCircle, CreditCard, ShieldCheck, Star } from 'lucide-react';

const WorkshopSubscription = () => {
    const [workshop, setWorkshop] = useState(null);
    const [step, setStep] = useState(1); // 1: Plans, 2: Payment, 3: Status
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchWorkshop();
    }, []);

    const fetchWorkshop = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/workshops/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setWorkshop(data);

                if (data.status === 'APPROVED') {
                    navigate('/dashboard/workshop');
                } else if (data.status === 'WAITING_APPROVAL') {
                    setStep(3);
                } else if (data.status === 'REJECTED') {
                    setStep(1);
                    setMessage(`ملاحظة الإدارة: ${data.payments?.[0]?.adminNote || 'تم رفض الإيصال'}`);
                } else {
                    const pendingPayment = data.payments?.find(p => p.status === 'PENDING');
                    if (pendingPayment) {
                        setSelectedPlan(pendingPayment.plan.toLowerCase());
                        setStep(2);
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectPlan = async (plan) => {
        setSelectedPlan(plan);
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            await fetch(`${API_URL}/workshops/${workshop.id}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ plan })
            });
            setStep(2);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const f = e.target.files[0];
        if (f) {
            setFile(f);
            if (f.type.startsWith('image/')) {
                setPreviewUrl(URL.createObjectURL(f));
            } else {
                setPreviewUrl(null);
            }
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const formData = new FormData();
            formData.append('proof', file);

            const res = await fetch(`${API_URL}/workshops/${workshop.id}/payment-proof`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                setStep(3);
                fetchWorkshop();
            } else {
                setMessage('فشل عملية الرفع، يرجى المحاولة مرة أخرى.');
            }
        } catch (err) {
            setMessage(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (!workshop) return <div className="loading-screen">جاري التحميل...</div>;

    // --- STEP 1: PRICING PLANS ---
    if (step === 1) {
        return (
            <div className="subscription-page" dir="rtl">
                <div className="subscription-header">
                    <h2>اختر خطة الاشتراك المناسبة لك</h2>
                    <p>ابدأ بعرض خدماتك وحرفتك للآلاف من الزبائن المحتملين.</p>
                </div>

                {message && (
                    <div className="alert-error">
                        <AlertCircle size={20} /> {message}
                    </div>
                )}

                <div className="pricing-cards">
                    {/* Monthly Plan */}
                    <div className="pricing-card">
                        <h3>شهري</h3>
                        <div className="price">
                            <span className="amount">2,000</span>
                            <span className="unit">د.ج / شهر</span>
                        </div>
                        <p className="description">مثالي لتجربة المنصة والبدء السريع.</p>

                        <ul className="features-list">
                            {['ظهور في البحث المتقدم', 'معرض أعمال (Portfolio) محدود', 'دعم فني عبر البريد'].map((feat) => (
                                <li key={feat}>
                                    <Check className="icon-check" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('monthly')}
                            className="btn btn-outline-primary"
                        >
                            اختيار الباقة الشهرية
                        </button>
                    </div>

                    {/* Yearly Plan - Highlighted */}
                    <div className="pricing-card featured">
                        <div className="badge-best-value">الأفضل قيمة (توفير شهرين)</div>
                        <h3>سنوي</h3>
                        <div className="price">
                            <span className="amount">18,000</span>
                            <span className="unit">د.ج / سنة</span>
                        </div>
                        <p className="description">للورش المحترفة التي تبحث عن الاستمرارية.</p>

                        <ul className="features-list">
                            {['كل مميزات الباقة الشهرية', 'أولوية في نتائج البحث', 'معرض أعمال غير محدود', 'شارة "ورشة موثوقة"'].map((feat) => (
                                <li key={feat}>
                                    <Star className="icon-star" />
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleSelectPlan('yearly')}
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'جاري المعالجة...' : 'اختيار الباقة السنوية'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 2: PAYMENT INSTRUCTIONS ---
    if (step === 2) {
        return (
            <div className="subscription-page" dir="rtl">
                <div className="payment-container">
                    <div className="payment-header">
                        <h2>تأكيد الاشتراك والدفع</h2>
                        <button onClick={() => setStep(1)} className="link-back">تغيير الخطة</button>
                    </div>

                    <div className="payment-body">
                        <div className="plan-summary">
                            <div>
                                <span className="label">الخطة المختارة:</span>
                                <span className="value">{selectedPlan === 'monthly' ? 'اشتراك شهري' : 'اشتراك سنوي'}</span>
                            </div>
                            <div className="price-tag">
                                {selectedPlan === 'monthly' ? '2,000' : '18,000'} د.ج
                            </div>
                        </div>

                        <div className="payment-methods">
                            {/* CCP Box */}
                            <div className="payment-method-card ccp">
                                <div className="method-header">
                                    <ShieldCheck className="icon" />
                                    <h3>الدفع عبر CCP</h3>
                                </div>
                                <div className="method-details" dir="ltr">
                                    <div className="detail-row"><span>CCP:</span><strong>00000000 00</strong></div>
                                    <div className="detail-row"><span>Clé:</span><strong>00</strong></div>
                                    <div className="detail-row"><span>Name:</span><strong>Furniture Market</strong></div>
                                </div>
                            </div>

                            {/* BaridiMob Box */}
                            <div className="payment-method-card baridimob">
                                <div className="method-header">
                                    <CreditCard className="icon" />
                                    <h3>BaridiMob (RIP)</h3>
                                </div>
                                <div className="method-details" dir="ltr">
                                    <div className="detail-row"><span>RIP:</span><strong>007 999 990000000000 00</strong></div>
                                </div>
                                <p className="note">يرجى تحويل المبلغ كاملاً وإرفاق صورة تأكيد العملية.</p>
                            </div>
                        </div>

                        <div className="upload-section">
                            <h3>
                                <Upload className="icon" />
                                رفع إيصال الدفع
                            </h3>

                            <div className="upload-area" onClick={() => document.getElementById('file-upload').click()}>
                                <div className="upload-content">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" className="preview-image" />
                                    ) : (
                                        <div className="upload-placeholder">
                                            <Upload size={48} className="icon-placeholder" />
                                            <span>اضغط لرفع الملف (PNG, JPG, PDF)</span>
                                        </div>
                                    )}
                                    <input id="file-upload" type="file" hidden onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" />
                                </div>
                            </div>

                            <div className="action-row">
                                <button
                                    onClick={handleUpload}
                                    disabled={!file || loading}
                                    className="btn btn-primary btn-block"
                                >
                                    {loading ? 'جاري الرفع...' : 'لقد قمت بالدفع - إرسال الإيصال'}
                                </button>
                                {message && <p className="error-message">{message}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // --- STEP 3: WAITING APPROVAL ---
    if (step === 3) {
        return (
            <div className="subscription-page centered" dir="rtl">
                <div className="waiting-card">
                    <div className="icon-wrapper">
                        <Clock className="icon-clock" />
                    </div>
                    <h2>تم استلام طلبك بنجاح!</h2>
                    <p>شكراً لاشتراكك. يقوم فريقنا حالياً بمراجعة إيصال الدفع. ستتلقى إشعاراً وتفعيلاً لحسابك سريعاً.</p>

                    <div className="info-box">
                        <AlertCircle className="icon" />
                        <div>
                            <h3>وقت المراجعة المتوقع</h3>
                            <p>عادةً ما تتم المراجعة خلال 1-24 ساعة.</p>
                        </div>
                    </div>

                    <button onClick={fetchWorkshop} className="btn btn-text">تحديث الحالة</button>
                </div>
            </div>
        );
    }

    return null;
};

export default WorkshopSubscription;
