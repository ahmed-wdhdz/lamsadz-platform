import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Clock, Heart, Users, CheckCircle, ArrowRight, Lightbulb, Hammer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
    const { isArabic } = useLanguage();

    const steps = isArabic ? [
        { icon: <Users size={32} />, title: '01. الطلب', text: 'الزبون يتصفح التصاميم أو يرسل طلب مخصص لاحتياجاته.' },
        { icon: <Hammer size={32} />, title: '02. العروض', text: 'الورشات تستقبل الطلبات وتقدم عروض أسعارها ومدد التنفيذ.' },
        { icon: <CheckCircle size={32} />, title: '03. التنفيذ', text: 'التواصل والدفع يتم مباشرة بين الطرفين لضمان الشفافية.' }
    ] : [
        { icon: <Users size={32} />, title: '01. Request', text: 'The client browses designs or sends a custom request for their needs.' },
        { icon: <Hammer size={32} />, title: '02. Offers', text: 'Workshops receive requests and submit their price offers and timelines.' },
        { icon: <CheckCircle size={32} />, title: '03. Execution', text: 'Communication and payment happen directly between both parties for full transparency.' }
    ];

    const benefits = isArabic ? [
        { text: 'ورشات محلية موثوقة ومختارة بعناية', icon: <ShieldCheck size={24} color="#16a34a" /> },
        { text: 'بدون عمولات خفية على الزبائن', icon: <CheckCircle size={24} color="#3b82f6" /> },
        { text: 'تصاميم حسب الطلب تناسب ذوقك', icon: <Heart size={24} color="#ec4899" /> },
        { text: 'تجربة بسيطة وسريعة', icon: <Clock size={24} color="#f59e0b" /> }
    ] : [
        { text: 'Trusted and carefully selected local workshops', icon: <ShieldCheck size={24} color="#16a34a" /> },
        { text: 'No hidden commissions for clients', icon: <CheckCircle size={24} color="#3b82f6" /> },
        { text: 'Custom designs tailored to your taste', icon: <Heart size={24} color="#ec4899" /> },
        { text: 'Simple and fast experience', icon: <Clock size={24} color="#f59e0b" /> }
    ];

    return (
        <div style={{ paddingBottom: '4rem' }} dir={isArabic ? 'rtl' : 'ltr'}>
            {/* Hero Section */}
            <div style={{
                background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                padding: '8rem 1.5rem 6rem',
                color: '#0f172a',
                textAlign: 'center',
                marginBottom: '4rem'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: '800',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2',
                        color: '#0f172a'
                    }}>
                        {isArabic ? 'من نحن؟' : 'About Us'}
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: '#475569',
                        lineHeight: '1.8',
                        fontWeight: '500'
                    }}>
                        {isArabic
                            ? 'منصة جزائرية تربطك بأفضل ورشات الأثاث حسب الطلب.'
                            : 'An Algerian platform connecting you with the best custom furniture workshops.'}
                    </p>
                </div>
            </div>

            <div className="container">
                {/* Section 1: Our Mission */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '4rem',
                    alignItems: 'center',
                    marginBottom: '6rem'
                }}>
                    <div>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: '#eff6ff',
                            color: '#3b82f6',
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            marginBottom: '1.5rem'
                        }}>
                            <Lightbulb size={18} /> {isArabic ? 'مهمتنا' : 'Our Mission'}
                        </div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem', color: '#1e293b' }}>
                            {isArabic ? 'مهمتنا' : 'Our Mission'}
                        </h2>
                        <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: '#475569', marginBottom: '2rem' }}>
                            {isArabic
                                ? 'Lamsadz هي منصة رقمية جزائرية هدفها تسهيل العثور على ورشات أثاث موثوقة، ومساعدة الحرفيين على الوصول لزبائن جدد بدون تعقيد.'
                                : 'Lamsadz is an Algerian digital platform aimed at making it easy to find trusted furniture workshops, and helping artisans reach new clients without complexity.'}
                        </p>
                    </div>
                    <div style={{
                        background: '#f8fafc',
                        padding: '3rem',
                        borderRadius: '32px',
                        border: '1px solid #e2e8f0',
                        position: 'relative'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: '-20px',
                            left: isArabic ? 'auto' : '-20px',
                            right: isArabic ? '-20px' : 'auto',
                            background: '#3b82f6',
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            boxShadow: '0 10px 25px rgba(59, 130, 246, 0.3)'
                        }}>
                            <Heart size={40} />
                        </div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#0f172a' }}>
                            {isArabic ? 'شغف الحرفية' : 'Artisan Passion'}
                        </h3>
                        <p style={{ color: '#64748b', lineHeight: '1.7' }}>
                            {isArabic
                                ? 'نحن نؤمن بأن الأثاث ليس مجرد خشب، بل هو فن وحكاية. نسعى لدعم الحرفيين المحليين وإبراز جودة أعمالهم للجميع.'
                                : 'We believe furniture is not just wood — it is art and story. We strive to support local artisans and showcase the quality of their work to everyone.'}
                        </p>
                    </div>
                </div>

                {/* Section 2: How It Works */}
                <div style={{ marginBottom: '6rem', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem', color: '#1e293b' }}>
                        {isArabic ? 'كيف تعمل المنصة؟' : 'How Does the Platform Work?'}
                    </h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {steps.map((step, idx) => (
                            <div key={idx} style={{
                                background: 'white',
                                padding: '2.5rem',
                                borderRadius: '24px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                border: '1px solid #f1f5f9',
                                transition: 'transform 0.3s ease',
                                cursor: 'default'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                            >
                                <div style={{
                                    width: '70px',
                                    height: '70px',
                                    background: idx === 1 ? '#eff6ff' : (idx === 2 ? '#f0fdf4' : '#fff7ed'),
                                    color: idx === 1 ? '#3b82f6' : (idx === 2 ? '#16a34a' : '#ea580c'),
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 1.5rem auto'
                                }}>
                                    {step.icon}
                                </div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: '#0f172a' }}>
                                    {step.title}
                                </h3>
                                <p style={{ color: '#64748b', lineHeight: '1.6' }}>
                                    {step.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 3: Why Us */}
                <div style={{
                    background: '#f8fafc',
                    borderRadius: '40px',
                    padding: '4rem',
                    marginBottom: '6rem'
                }}>
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '3rem', textAlign: 'center', color: '#1e293b' }}>
                            {isArabic ? 'لماذا Lamsadz؟' : 'Why Lamsadz?'}
                        </h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: '2rem'
                        }}>
                            {benefits.map((item, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: 'white',
                                    padding: '1.5rem',
                                    borderRadius: '16px',
                                    boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
                                }}>
                                    <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '12px' }}>
                                        {item.icon}
                                    </div>
                                    <span style={{ fontWeight: '600', color: '#334155', fontSize: '1.1rem' }}>
                                        {item.text}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 4: For Workshops CTA */}
                <div style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    borderRadius: '40px',
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '150px', height: '150px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%' }}></div>

                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '700px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>
                            {isArabic ? 'للورشات' : 'For Workshops'}
                        </h2>
                        <p style={{
                            fontSize: '1.25rem',
                            lineHeight: '1.7',
                            marginBottom: '2.5rem',
                            color: '#dbeafe'
                        }}>
                            {isArabic
                                ? 'إذا كنت تملك ورشة نجارة أو تصنيع أثاث، Lamsadz تساعدك على زيادة الطلبات والوصول لزبائن جدد عبر الإنترنت بسهولة.'
                                : 'If you own a carpentry or furniture manufacturing workshop, Lamsadz helps you increase orders and reach new clients online with ease.'}
                        </p>
                        <Link
                            to="/register"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                background: 'white',
                                color: '#2563eb',
                                padding: '1rem 2.5rem',
                                borderRadius: '999px',
                                fontWeight: '700',
                                fontSize: '1.1rem',
                                transition: 'all 0.2s',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}
                        >
                            {isArabic ? 'سجل ورشتك الآن' : 'Register Your Workshop Now'}
                            <ArrowRight size={20} style={{ transform: isArabic ? 'rotate(180deg)' : 'none' }} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
