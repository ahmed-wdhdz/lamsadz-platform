import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    const { t, isArabic } = useLanguage();

    return (
        <footer
            style={{
                backgroundColor: 'var(--bg-secondary)',
                borderTop: '1px solid var(--border)',
                marginTop: '4rem',
            }}
        >
            <div
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '4rem 1.5rem 2rem',
                }}
            >
                {/* Main Footer Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '3rem',
                        marginBottom: '3rem',
                    }}
                >
                    {/* Brand Column */}
                    <div>
                        <Link
                            to="/"
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: '800',
                                color: 'var(--text-primary)',
                                display: 'inline-block',
                                marginBottom: '1rem',
                            }}
                        >
                            Lamsadz
                        </Link>
                        <p
                            style={{
                                color: 'var(--text-muted)',
                                lineHeight: '1.8',
                                marginBottom: '1.5rem',
                            }}
                        >
                            {t('footer.aboutText')}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <a
                                href="#"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                <Instagram size={18} />
                            </a>
                            <a
                                href="#"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                <Facebook size={18} />
                            </a>
                            <a
                                href="#"
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius-md)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)',
                                    transition: 'all var(--transition-fast)',
                                }}
                            >
                                <Twitter size={18} />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4
                            style={{
                                fontWeight: '700',
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {t('footer.links')}
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li>
                                <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {t('nav.home')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/designs" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {t('nav.designs')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/workshops" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {t('nav.workshops')}
                                </Link>
                            </li>
                            <li>
                                <Link to="/register?role=workshop" style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                                    {isArabic ? 'انضم كحرفي' : 'Join as Artisan'}
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4
                            style={{
                                fontWeight: '700',
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {t('footer.contact')}
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span>{isArabic ? 'الجزائر العاصمة' : 'Algiers, Algeria'}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span dir="ltr">+213 555 123 456</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)' }}>
                                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span>hello@athath.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4
                            style={{
                                fontWeight: '700',
                                marginBottom: '1.5rem',
                                color: 'var(--text-primary)',
                            }}
                        >
                            {isArabic ? 'اشترك في النشرة' : 'Newsletter'}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>
                            {isArabic
                                ? 'احصل على آخر التصاميم والعروض'
                                : 'Get the latest designs and offers'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email'}
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                }}
                            />
                            <button
                                style={{
                                    padding: '0.75rem 1.25rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--text-inverse)',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                }}
                            >
                                {isArabic ? 'اشترك' : 'Subscribe'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div
                    style={{
                        borderTop: '1px solid var(--border)',
                        paddingTop: '2rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem',
                    }}
                >
                    <p>© 2024 Lamsadz. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
