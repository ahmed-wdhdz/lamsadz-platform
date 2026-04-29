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
                    padding: '3rem 1.25rem 2rem',
                }}
            >
                {/* Main Footer Grid */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '2.5rem',
                        marginBottom: '2.5rem',
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
                                marginBottom: '0.75rem',
                            }}
                        >
                            Lamsadz
                        </Link>
                        <p
                            style={{
                                color: 'var(--text-muted)',
                                lineHeight: '1.8',
                                marginBottom: '1.25rem',
                                fontSize: '0.9rem',
                            }}
                        >
                            {t('footer.aboutText')}
                        </p>
                        {/* Social Icons */}
                        <div style={{ display: 'flex', gap: '0.6rem' }}>
                            {[
                                { Icon: Instagram, label: 'Instagram' },
                                { Icon: Facebook, label: 'Facebook' },
                                { Icon: Twitter, label: 'Twitter' },
                            ].map(({ Icon, label }) => (
                                <a
                                    key={label}
                                    href="#"
                                    aria-label={label}
                                    style={{
                                        width: '38px',
                                        height: '38px',
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
                                    <Icon size={17} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1rem' }}>
                            {t('footer.links')}
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {[
                                { to: '/', label: t('nav.home') },
                                { to: '/designs', label: t('nav.designs') },
                                { to: '/workshops', label: t('nav.workshops') },
                                { to: '/register?role=workshop', label: isArabic ? 'انضم كحرفي' : 'Join as Artisan' },
                            ].map(({ to, label }) => (
                                <li key={to}>
                                    <Link to={to} style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1rem' }}>
                            {t('footer.contact')}
                        </h4>
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span>{isArabic ? 'الجزائر العاصمة' : 'Algiers, Algeria'}</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Phone size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span dir="ltr">+213 555 123 456</span>
                            </li>
                            <li style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                <Mail size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                                <span>hello@lamsadz.com</span>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 style={{ fontWeight: '700', marginBottom: '1.25rem', color: 'var(--text-primary)', fontSize: '1rem' }}>
                            {isArabic ? 'اشترك في النشرة' : 'Newsletter'}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.6' }}>
                            {isArabic ? 'احصل على آخر التصاميم والعروض' : 'Get the latest designs and offers'}
                        </p>
                        {/* flex-wrap = stacks on narrow screens */}
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <input
                                type="email"
                                placeholder={isArabic ? 'بريدك الإلكتروني' : 'Your email'}
                                style={{
                                    flex: '1 1 140px',
                                    minWidth: '0',
                                    padding: '0.7rem 0.9rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border)',
                                    backgroundColor: 'var(--bg-card)',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                style={{
                                    flex: '0 0 auto',
                                    padding: '0.7rem 1.1rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--text-inverse)',
                                    borderRadius: 'var(--radius-md)',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'nowrap',
                                    fontFamily: 'inherit',
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
                        paddingTop: '1.5rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem',
                    }}
                >
                    <p>© 2024 Lamsadz. {t('footer.rights')}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
