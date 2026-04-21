import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, ShoppingBag } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ThankYou = () => {
    const navigate = useNavigate();
    const { isArabic } = useLanguage();

    return (
        <div style={{ padding: '8rem 1rem 6rem', minHeight: '100vh', background: 'linear-gradient(to bottom, var(--bg-body), #f8fafc)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} dir={isArabic ? "rtl" : "ltr"}>
            <div className="container" style={{ maxWidth: '600px', width: '100%' }}>
                <div style={{ 
                    background: 'white', 
                    borderRadius: '30px', 
                    padding: '4rem 3rem', 
                    boxShadow: '0 20px 50px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)', 
                    textAlign: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative element */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'var(--primary)' }} />
                    
                    <div style={{ 
                        margin: '0 auto 2rem auto', 
                        width: '100px', 
                        height: '100px', 
                        background: '#f0fdf4', 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        boxShadow: '0 0 0 10px #dcfce7'
                    }}>
                        <CheckCircle size={50} color="#16a34a" />
                    </div>
                    
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-color)', marginBottom: '1rem', letterSpacing: '-0.5px' }}>
                        {isArabic ? 'لقد أكملت طلبك بنجاح' : 'Request Completed Successfully!'}
                    </h1>
                    
                    <p style={{ color: '#64748b', fontSize: '1.25rem', lineHeight: '1.7', maxWidth: '400px', margin: '0 auto 3rem auto' }}>
                        {isArabic ? 'سوف يتصل بك الحرفي في أقرب وقت' : 'An artisan will contact you as soon as possible.'}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => navigate('/designs')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2rem',
                                borderRadius: '16px',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                color: 'var(--primary)',
                                background: '#eff6ff',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                flex: 1,
                                minWidth: '200px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
                        >
                            <ShoppingBag size={20} />
                            {isArabic ? 'تصفح المنتجات' : 'Browse Products'}
                        </button>

                        <button
                            onClick={() => navigate('/')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                padding: '1rem 2rem',
                                borderRadius: '16px',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                color: 'white',
                                background: 'var(--primary)',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 25px rgba(217, 119, 6, 0.25)',
                                flex: 1,
                                minWidth: '200px'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 30px rgba(217, 119, 6, 0.3)'; }}
                            onMouseOut={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(217, 119, 6, 0.25)'; }}
                        >
                            <Home size={20} />
                            {isArabic ? 'العودة للرئيسية' : 'Back to Home'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
