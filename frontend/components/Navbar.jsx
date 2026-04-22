import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import NotificationBell from './NotificationBell';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const { t, isArabic } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav
            className={`navbar ${scrolled ? 'scrolled' : ''}`}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: '1rem 0',
                backgroundColor: scrolled ? 'var(--bg-card)' : 'transparent',
                backdropFilter: scrolled ? 'blur(12px)' : 'none',
                borderBottom: scrolled ? '1px solid var(--border)' : 'none',
                transition: 'all var(--transition-base)',
            }}
        >
            <div
                style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '0 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                {/* Logo */}
                <Link
                    to="/"
                    style={{
                        fontSize: '1.75rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                    }}
                >
                    Lamsadz
                </Link>

                {/* Desktop Navigation */}
                <div
                    className="hidden-mobile"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '2rem',
                    }}
                >
                    <Link to="/" className="nav-link" style={navLinkStyle}>{t('nav.home')}</Link>
                    <Link to="/designs" className="nav-link" style={navLinkStyle}>{t('nav.designs')}</Link>
                    <Link to="/custom-request" className="nav-link" style={{ ...navLinkStyle, color: '#3b82f6', fontWeight: '700' }}>{t('nav.customDesign')}</Link>
                    <Link to="/workshops" className="nav-link" style={navLinkStyle}>{t('nav.workshops')}</Link>
                    <Link to="/about" className="nav-link" style={navLinkStyle}>{t('nav.about')}</Link>

                    {user && user.role === 'ADMIN' && (
                        <Link to="/dashboard/admin" className="nav-link" style={navLinkStyle}>
                            {t('nav.adminPanel')}
                        </Link>
                    )}
                    {user && user.role === 'WORKSHOP' && (
                        <Link to="/dashboard/workshop" className="nav-link" style={navLinkStyle}>
                            {t('nav.workshopPanel')}
                        </Link>
                    )}
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <LanguageToggle />
                    <ThemeToggle />

                    {user && <NotificationBell />}

                    {/* Desktop: show user name + logout */}
                    <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    style={{
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        padding: '0.5rem 1rem',
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.9rem',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        padding: '0.5rem',
                                        color: 'var(--error)',
                                        backgroundColor: 'var(--error-light)',
                                        borderRadius: 'var(--radius-full)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <LogOut size={18} />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--text-inverse)',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: '600',
                                    fontSize: '0.9rem',
                                    transition: 'all var(--transition-base)',
                                }}
                            >
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>

                    {/* Mobile: login button (if not logged in) */}
                    {!user && (
                        <Link
                            className="mobile-only"
                            to="/login"
                            style={{
                                display: 'none',
                                padding: '0.5rem 1rem',
                                backgroundColor: 'var(--primary)',
                                color: 'var(--text-inverse)',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: '600',
                                fontSize: '0.85rem',
                            }}
                        >
                            {t('nav.login')}
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        className="mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        style={{
                            display: 'none',
                            padding: '0.5rem',
                            color: 'var(--text-primary)',
                            backgroundColor: 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                        }}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--bg-card)',
                        borderBottom: '1px solid var(--border)',
                        padding: '1rem 1.5rem',
                        boxShadow: 'var(--shadow-lg)',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.home')}</Link>
                        <Link to="/designs" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.designs')}</Link>
                        <Link to="/custom-request" onClick={() => setMobileMenuOpen(false)} style={{ ...mobileNavLinkStyle, color: '#3b82f6', fontWeight: '700' }}>{t('nav.customDesign')}</Link>
                        <Link to="/workshops" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.workshops')}</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.about')}</Link>
                        {user && user.role === 'ADMIN' && (
                            <Link to="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.adminPanel')}</Link>
                        )}
                        {user && user.role === 'WORKSHOP' && (
                            <Link to="/dashboard/workshop" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.workshopPanel')}</Link>
                        )}
                        {user && (
                            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                    👤 {user.name}
                                </Link>
                                <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} style={{ color: 'var(--error)', background: 'var(--error-light)', border: 'none', borderRadius: 'var(--radius-md)', padding: '0.5rem 1rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.85rem' }}>
                                    {t('nav.logout')}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .mobile-only { display: flex !important; }
                }
                .nav-link:hover {
                    color: var(--primary) !important;
                }
                @media (max-width: 400px) {
                    .mobile-only-login { display: flex !important; }
                }
            `}</style>
        </nav>
    );
};

const navLinkStyle = {
    color: 'var(--text-secondary)',
    fontWeight: '500',
    fontSize: '0.95rem',
    transition: 'color var(--transition-fast)',
};

const mobileNavLinkStyle = {
    display: 'block',
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-secondary)',
};

export default Navbar;
