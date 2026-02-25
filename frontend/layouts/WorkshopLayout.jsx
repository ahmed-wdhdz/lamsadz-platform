import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';
import {
    LayoutDashboard, Package, Inbox, User, LogOut, Menu, X, CreditCard, ExternalLink, MessageSquare
} from 'lucide-react';

const WorkshopLayout = () => {
    const { logout, user } = useAuth();
    const { t, isArabic } = useLanguage();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navItems = [
        { path: '/dashboard/workshop', label: t('workshop.home'), icon: LayoutDashboard },
        { path: '/dashboard/workshop/products', label: t('workshop.designs'), icon: Package },
        { path: '/dashboard/workshop/requests', label: t('workshop.requests'), icon: Inbox },
        { path: '/dashboard/workshop/custom-requests', label: 'الطلبات الخاصة', icon: MessageSquare },
        { path: '/dashboard/workshop/profile', label: t('workshop.settings'), icon: User },
        { path: '/dashboard/workshop/subscribe', label: t('workshop.subscription'), icon: CreditCard },
    ];

    const isActive = (path) => {
        if (path === '/dashboard/workshop' && location.pathname === '/dashboard/workshop') return true;
        if (path !== '/dashboard/workshop' && location.pathname.startsWith(path)) return true;
        return false;
    };

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'var(--bg-primary)',
            }}
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            {/* Mobile Header */}
            <div
                className="mobile-header"
                style={{
                    display: 'none',
                    position: 'fixed',
                    top: 0,
                    width: '100%',
                    backgroundColor: 'var(--bg-card)',
                    borderBottom: '1px solid var(--border)',
                    padding: '1rem 1.5rem',
                    zIndex: 50,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <button
                    onClick={() => setSidebarOpen(true)}
                    style={{
                        padding: '0.5rem',
                        color: 'var(--text-primary)',
                        backgroundColor: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    <Menu size={24} />
                </button>
                <div style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)' }}>
                    Lamsadz
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <ThemeToggle />
                </div>
            </div>

            {/* Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'var(--bg-overlay)',
                        zIndex: 40,
                    }}
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                style={{
                    width: '280px',
                    backgroundColor: 'var(--bg-card)',
                    borderLeft: isArabic ? '1px solid var(--border)' : 'none',
                    borderRight: isArabic ? 'none' : '1px solid var(--border)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'fixed',
                    height: '100vh',
                    right: isArabic ? 0 : 'auto',
                    left: isArabic ? 'auto' : 0,
                    zIndex: 50,
                    transition: 'transform 0.3s ease',
                }}
                className={`sidebar ${sidebarOpen ? 'open' : ''}`}
            >
                {/* Header */}
                <div
                    style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '4px' }}>
                            {t('workshop.dashboard')}
                        </h2>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {t('workshop.welcome')}, {user?.name}
                        </p>
                    </div>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="mobile-only"
                        style={{
                            color: 'var(--text-muted)',
                            backgroundColor: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'none',
                        }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Theme & Language Controls */}
                <div
                    style={{
                        padding: '1rem 1.5rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        gap: '0.75rem',
                    }}
                >
                    <ThemeToggle />
                    <LanguageToggle />
                </div>

                {/* Navigation */}
                <nav style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.875rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                color: isActive(item.path) ? 'var(--primary)' : 'var(--text-secondary)',
                                backgroundColor: isActive(item.path) ? 'var(--primary-light)' : 'transparent',
                                fontWeight: isActive(item.path) ? '700' : '500',
                                transition: 'all var(--transition-fast)',
                            }}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
                    <Link
                        to="/"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem',
                            color: 'var(--text-muted)',
                            marginBottom: '0.5rem',
                        }}
                    >
                        <ExternalLink size={18} />
                        <span>{t('workshop.backToSite')}</span>
                    </Link>
                    <button
                        onClick={logout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem',
                            backgroundColor: 'var(--error-light)',
                            color: 'var(--error)',
                            borderRadius: 'var(--radius-md)',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontFamily: 'inherit',
                        }}
                    >
                        <LogOut size={18} />
                        {t('nav.logout')}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main
                style={{
                    flex: 1,
                    marginRight: isArabic ? '280px' : 0,
                    marginLeft: isArabic ? 0 : '280px',
                    padding: '2rem',
                    minHeight: '100vh',
                }}
                className="main-content"
            >
                <Outlet />
            </main>

            <style>{`
                @media (max-width: 1024px) {
                    .mobile-header {
                        display: flex !important;
                    }
                    .sidebar {
                        transform: ${isArabic ? 'translateX(100%)' : 'translateX(-100%)'};
                    }
                    .sidebar.open {
                        transform: translateX(0);
                    }
                    .mobile-only {
                        display: block !important;
                    }
                    .main-content {
                        margin-right: 0 !important;
                        margin-left: 0 !important;
                        padding-top: 5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default WorkshopLayout;
