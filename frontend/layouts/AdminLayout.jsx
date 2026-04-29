import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Store, Package, CreditCard, MessageSquare, LogOut, Menu, X, Shield, ExternalLink, Rocket } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import ThemeToggle from '../components/ThemeToggle';
import LanguageToggle from '../components/LanguageToggle';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const { logout, user } = useAuth();
    const { t, isArabic } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/dashboard/admin', label: t('admin.overview'), icon: LayoutDashboard },
        { path: '/dashboard/admin/workshops', label: t('admin.workshops'), icon: Store },
        { path: '/dashboard/admin/users', label: t('admin.users'), icon: Users },
        { path: '/dashboard/admin/products', label: t('admin.products'), icon: Package },
        { path: '/dashboard/admin/payments', label: t('admin.payments'), icon: CreditCard },
        { path: '/dashboard/admin/promotions', label: t('admin.promotions'), icon: Rocket },
        { path: '/dashboard/admin/requests', label: t('admin.requests'), icon: MessageSquare },
    ];

    return (
        <div
            style={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: 'var(--bg-primary)'
            }}
            dir={isArabic ? 'rtl' : 'ltr'}
        >
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'var(--bg-overlay)',
                        zIndex: 40
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                            style={{
                                width: '42px',
                                height: '42px',
                                backgroundColor: 'var(--primary-light)',
                                borderRadius: 'var(--radius-md)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--primary)',
                            }}
                        >
                            <Shield size={22} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                                {t('admin.dashboard')}
                            </h1>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                                {user?.name}
                            </p>
                        </div>
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
                            {item.label}
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
                        {t('workshop.backToSite')}
                    </Link>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            padding: '0.875rem',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--error)',
                            backgroundColor: 'var(--error-light)',
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
                    width: '100%',
                    boxSizing: 'border-box',
                    maxWidth: '100vw',
                    overflowX: 'hidden'
                }}
                className="main-content"
            >
                {/* Mobile Header */}
                <header
                    style={{
                        padding: '1rem 1.5rem',
                        backgroundColor: 'var(--bg-card)',
                        borderBottom: '1px solid var(--border)',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                    className="mobile-header"
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
                    <span style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{t('admin.dashboard')}</span>
                    <ThemeToggle />
                </header>

                <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }} className="admin-inner-content">
                    <Outlet />
                </div>
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
                        width: 100% !important;
                        max-width: 100vw !important;
                        overflow-x: hidden !important;
                    }
                    .admin-inner-content {
                        padding: 1rem 0.5rem !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminLayout;
