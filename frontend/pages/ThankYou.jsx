import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ThankYou = () => {
    const navigate = useNavigate();
    const { isArabic } = useLanguage();

    return (
        <div style={{ padding: '8rem 1rem 4rem', minHeight: '100vh', background: 'var(--bg-body)', display: 'flex', justifyContent: 'center' }} dir={isArabic ? "rtl" : "ltr"}>
            <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ background: 'white', borderRadius: '24px', padding: '4rem 2rem', boxShadow: '0 10px 40px rgba(0,0,0,0.08)', textAlign: 'center' }}>
                    <CheckCircle size={80} color="#22c55e" style={{ margin: '0 auto 1.5rem auto' }} />
                    <h1 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-color)', marginBottom: '1rem' }}>
                        {isArabic ? 'لقد تم إرسال طلبك بنجاح' : 'Request Sent Successfully'}
                    </h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', lineHeight: '1.6', marginBottom: '3rem' }}>
                        {isArabic ? 'سوف يتصل بك الحرفي في أقرب وقت لتقديم عرض سعر.' : 'An artisan will contact you as soon as possible to provide a quote.'}
                    </p>
                    
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '1rem 2rem',
                            borderRadius: '12px',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            color: 'white',
                            background: 'var(--primary)',
                            border: 'none',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                        }}
                    >
                        <Home size={20} />
                        {isArabic ? 'العودة للصفحة الرئيسية' : 'Back to Home'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
