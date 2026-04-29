import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
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

    // Close menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [navigate]);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
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
                padding: '0.875rem 0',
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
                    padding: '0 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                }}
            >
                {/* ═══ LOGO ═══ */}
                <Link
                    to="/"
                    style={{
                        fontSize: '1.6rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        flexShrink: 0,
                        letterSpacing: '-0.5px',
                    }}
                >
                    Lamsadz
                </Link>

                {/* ═══ DESKTOP NAV LINKS ═══ */}
                <div
                    className="hidden-mobile"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.75rem',
                        flex: 1,
                        justifyContent: 'center',
                    }}
                >
                    <Link to="/" className="nav-link" style={navLinkStyle}>{t('nav.home')}</Link>
                    <Link to="/designs" className="nav-link" style={navLinkStyle}>{t('nav.designs')}</Link>
                    <Link to="/custom-request" className="nav-link" style={{ ...navLinkStyle, color: 'var(--primary)', fontWeight: '700' }}>{t('nav.customDesign')}</Link>
                    <Link to="/workshops" className="nav-link" style={navLinkStyle}>{t('nav.workshops')}</Link>
                    <Link to="/about" className="nav-link" style={navLinkStyle}>{t('nav.about')}</Link>
                    {user?.role === 'ADMIN' && (
                        <Link to="/dashboard/admin" className="nav-link" style={navLinkStyle}>{t('nav.adminPanel')}</Link>
                    )}
                    {user?.role === 'WORKSHOP' && (
                        <Link to="/dashboard/workshop" className="nav-link" style={navLinkStyle}>{t('nav.workshopPanel')}</Link>
                    )}
                </div>

                {/* ═══ RIGHT ACTIONS ═══ */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>

                    {/* Desktop only: Lang + Theme */}
                    <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>

                    {/* Notification Bell (always if logged in) */}
                    {user && <NotificationBell />}

                    {/* Desktop: user chip + logout */}
                    <div className="hidden-mobile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    style={{
                                        fontWeight: '600',
                                        color: 'var(--text-primary)',
                                        padding: '0.45rem 0.9rem',
                                        backgroundColor: 'var(--bg-secondary)',
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: '0.875rem',
                                        whiteSpace: 'nowrap',
                                        border: '1px solid var(--border)',
                                    }}
                                >
                                    {user.name}
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    title="Logout"
                                    style={{
                                        padding: '0.45rem',
                                        color: 'var(--error)',
                                        backgroundColor: 'var(--error-light)',
                                        borderRadius: 'var(--radius-full)',
                                        border: 'none',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: '34px',
                                        height: '34px',
                                    }}
                                >
                                    <LogOut size={16} />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                style={{
                                    padding: '0.6rem 1.25rem',
                                    backgroundColor: 'var(--primary)',
                                    color: 'var(--text-inverse)',
                                    borderRadius: 'var(--radius-full)',
                                    fontWeight: '600',
                                    fontSize: '0.875rem',
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                {t('nav.login')}
                            </Link>
                        )}
                    </div>

                    {/* Mobile: compact login button (not logged in) */}
                    {!user && (
                        <Link
                            className="mobile-only"
                            to="/login"
                            style={{
                                display: 'none',
                                padding: '0.45rem 0.85rem',
                                backgroundColor: 'var(--primary)',
                                color: 'var(--text-inverse)',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            {t('nav.login')}
                        </Link>
                    )}

                    {/* Mobile: Hamburger */}
                    <button
                        className="mobile-only"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        aria-label="Menu"
                        style={{
                            display: 'none',
                            padding: '0.45rem',
                            color: 'var(--text-primary)',
                            backgroundColor: mobileMenuOpen ? 'var(--primary-light)' : 'var(--bg-secondary)',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border)',
                            cursor: 'pointer',
                            width: '36px',
                            height: '36px',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </div>

            {/* ═══ MOBILE DROPDOWN MENU ═══ */}
            {mobileMenuOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        backgroundColor: 'var(--bg-card)',
                        borderBottom: '2px solid var(--border)',
                        boxShadow: 'var(--shadow-xl)',
                        zIndex: 999,
                        animation: 'slideDown 0.2s ease',
                    }}
                >
                    {/* Controls row: Theme + Language */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.875rem 1.25rem',
                        borderBottom: '1px solid var(--border)',
                        backgroundColor: 'var(--bg-secondary)',
                    }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', flex: 1 }}>
                            {isArabic ? 'الإعدادات' : 'Settings'}
                        </span>
                        <ThemeToggle />
                        <LanguageToggle />
                    </div>

                    {/* Nav Links */}
                    <div style={{ padding: '0.75rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <Link to="/" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.home')}</Link>
                        <Link to="/designs" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.designs')}</Link>
                        <Link to="/custom-request" onClick={() => setMobileMenuOpen(false)} style={{ ...mobileNavLinkStyle, color: 'var(--primary)', fontWeight: '700', backgroundColor: 'var(--primary-light)' }}>{t('nav.customDesign')}</Link>
                        <Link to="/workshops" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.workshops')}</Link>
                        <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.about')}</Link>
                        {user?.role === 'ADMIN' && (
                            <Link to="/dashboard/admin" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.adminPanel')}</Link>
                        )}
                        {user?.role === 'WORKSHOP' && (
                            <Link to="/dashboard/workshop" onClick={() => setMobileMenuOpen(false)} style={mobileNavLinkStyle}>{t('nav.workshopPanel')}</Link>
                        )}
                    </div>

                    {/* Logged-in user footer */}
                    {user && (
                        <div style={{
                            padding: '0.875rem 1.25rem',
                            borderTop: '1px solid var(--border)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            backgroundColor: 'var(--bg-secondary)',
                        }}>
                            <Link
                                to="/dashboard"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    fontWeight: '700',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                }}
                            >
                                <span style={{
                                    width: '32px', height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: 'var(--primary)',
                                    color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '0.85rem', fontWeight: '800',
                                }}>
                                    {user.name?.charAt(0)?.toUpperCase()}
                                </span>
                                {user.name}
                            </Link>
                            <button
                                onClick={handleLogout}
                                style={{
                                    color: 'var(--error)',
                                    background: 'var(--error-light)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '0.5rem 1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontFamily: 'inherit',
                                    fontSize: '0.85rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                }}
                            >
                                <LogOut size={14} />
                                {t('nav.logout')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .hidden-mobile { display: none !important; }
                    .mobile-only { display: flex !important; }
                }
                .nav-link:hover { color: var(--primary) !important; }
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-8px); }
                    to   { opacity: 1; transform: translateY(0); }
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
    whiteSpace: 'nowrap',
};

const mobileNavLinkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.7rem 1rem',
    color: 'var(--text-primary)',
    fontWeight: '500',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-secondary)',
    fontSize: '0.95rem',
    transition: 'all 0.15s ease',
};

export default Navbar;
