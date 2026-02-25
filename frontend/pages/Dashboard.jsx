import React, { useState, useEffect } from 'react';
import { User, Package, Settings, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Dashboard = () => {
    const { user, token, logout } = useAuth();
    const { t, isArabic } = useLanguage();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Profile update states
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [updateMsg, setUpdateMsg] = useState({ type: '', text: '' });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (user) setName(user.name);
    }, [user]);

    useEffect(() => {
        if (token) fetchLeads();
    }, [token]);

    const fetchLeads = async () => {
        try {
            const res = await fetch(`${API_URL}/client/leads`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setLeads(data.leads || []);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdateMsg({ type: '', text: '' });
        setUpdating(true);
        try {
            const body = { name };
            if (password) body.password = password;

            const res = await fetch(`${API_URL}/me`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });
            const data = await res.json();
            if (res.ok) {
                setUpdateMsg({ type: 'success', text: t('general.success') + ' ✅' });
                setPassword('');
            } else {
                setUpdateMsg({ type: 'error', text: data.message || t('general.error') });
            }
        } catch (error) {
            setUpdateMsg({ type: 'error', text: t('general.error') });
        } finally {
            setUpdating(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { id: 'overview', icon: FileText, label: t('client.overview') },
        { id: 'orders', icon: Package, label: t('client.myOrders') },
        { id: 'settings', icon: Settings, label: t('client.settings') },
        { id: 'logout', icon: LogOut, label: t('nav.logout'), danger: true, action: handleLogout },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'NEW': return { bg: '#fef3c7', col: '#d97706', text: t('status.new') || 'قيد المراجعة' };
            case 'SENT': return { bg: '#dbeafe', col: '#1d4ed8', text: t('status.sent') || 'أرسل للورش' };
            case 'RESPONDED': return { bg: '#dcfce7', col: '#15803d', text: t('status.responded') || 'يوجد عروض' };
            case 'SOLD': return { bg: '#dcfce7', col: '#15803d', text: t('status.sold') || 'تم الاتفاق' };
            default: return { bg: '#f3f4f6', col: '#4b5563', text: status };
        }
    };

    if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>{t('general.loading')}</div>;

    const recentLeads = leads.slice(0, 3);

    return (
        <div style={{ paddingTop: '100px', minHeight: '100vh', background: 'var(--bg-primary)' }} dir={isArabic ? "rtl" : "ltr"}>
            <div className="container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h1 style={{ fontWeight: '800', margin: 0, fontSize: '1.8rem' }}>{t('client.welcome')}, {user?.name}</h1>
                        <p style={{ color: 'var(--text-muted)', margin: 0 }}>{t('client.dashboard')}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
                    {/* Sidebar */}
                    <aside style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', height: 'fit-content', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <ul className="space-y-2">
                            {menuItems.map((item) => (
                                <li key={item.id}>
                                    <button
                                        onClick={() => item.action ? item.action() : setActiveTab(item.id)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '1rem',
                                            width: '100%',
                                            padding: '0.875rem 1rem',
                                            borderRadius: 'var(--radius-md)',
                                            background: activeTab === item.id ? 'var(--primary-light, rgba(217, 119, 6, 0.1))' : 'transparent',
                                            color: item.danger ? '#ef4444' : (activeTab === item.id ? 'var(--primary)' : 'var(--text-primary)'),
                                            fontWeight: activeTab === item.id ? '700' : '500',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            border: 'none',
                                            textAlign: isArabic ? 'right' : 'left'
                                        }}>
                                        <item.icon size={20} />
                                        {item.label}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </aside>

                    {/* Main Content */}
                    <main className="animate-fade-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', padding: '2rem', borderRadius: 'var(--radius-lg)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>{t('client.overview')}</h2>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Package size={18} /> {t('client.totalOrders')}
                                        </h3>
                                        <span style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary)' }}>{leads.length}</span>
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>{t('client.recentOrders')}</h3>
                                {recentLeads.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {recentLeads.map(lead => {
                                            const status = getStatusStyle(lead.status);
                                            const isDesignLead = !!lead.design;
                                            const mainImage = isDesignLead && lead.design.images ? JSON.parse(lead.design.images)[0] : null;

                                            return (
                                                <div key={lead.id} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                        {isDesignLead && mainImage && (
                                                            <div style={{ width: '60px', height: '60px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                                                <img src={`${API_URL.replace('/api', '')}/uploads/${mainImage}`} alt={lead.design.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                            </div>
                                                        )}
                                                        <div>
                                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                                                {isDesignLead ? `${t('client.designReq')}: ${lead.design.title}` : `${t('client.customReq')}: ${lead.type === 'kitchen' ? t('client.kitchen') : lead.type}`}
                                                            </div>
                                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(lead.createdAt).toLocaleDateString('ar-DZ')}</div>
                                                        </div>
                                                    </div>
                                                    <span style={{ background: status.bg, color: status.col, padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700' }}>
                                                        {status.text}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                        <button onClick={() => setActiveTab('orders')} style={{ marginTop: '1rem', color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>{t('client.viewAllOrders')}</button>
                                    </div>
                                ) : (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', border: '2px dashed var(--border)', borderRadius: '16px', background: 'var(--bg-secondary)' }}>
                                        <Package size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                        <p style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{t('client.noOrdersYet')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Orders Tab */}
                        {activeTab === 'orders' && (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>{t('client.trackMyOrders')}</h2>
                                </div>

                                {leads.length > 0 ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {leads.map(lead => {
                                            const status = getStatusStyle(lead.status);
                                            const isDesignLead = !!lead.design;
                                            const mainImage = isDesignLead && lead.design.images ? JSON.parse(lead.design.images)[0] : null;

                                            return (
                                                <div key={lead.id} style={{ padding: '1.5rem', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--bg-card)' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                            {isDesignLead && mainImage && (
                                                                <div style={{ width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0 }}>
                                                                    <img src={`${API_URL.replace('/api', '')}/uploads/${mainImage}`} alt={lead.design.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
                                                                    {isDesignLead ? `${t('client.readyDesignReq')}: ${lead.design.title}` : `${t('client.specialCustomReq')}: ${lead.type}`}
                                                                </div>
                                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{new Date(lead.createdAt).toLocaleDateString(isArabic ? 'ar-DZ' : 'en-US')} | {t('client.wilaya')} {lead.wilaya}</div>
                                                            </div>
                                                        </div>
                                                        <span style={{ background: status.bg, color: status.col, padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: '700' }}>
                                                            {status.text}
                                                        </span>
                                                    </div>
                                                    <div style={{ background: 'var(--bg-secondary)', padding: '1rem', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                                                        <strong style={{ color: 'var(--text-primary)' }}>{t('client.details')}:</strong> {lead.description}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                                        {t('client.noOrdersAtAll')}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <div style={{ maxWidth: '400px' }}>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem' }}>{t('client.settings')}</h2>

                                {updateMsg.text && (
                                    <div style={{ padding: '1rem', marginBottom: '1.5rem', borderRadius: '8px', background: updateMsg.type === 'success' ? '#dcfce7' : '#fee2e2', color: updateMsg.type === 'success' ? '#15803d' : '#991b1b', fontWeight: 'bold' }}>
                                        {updateMsg.text}
                                    </div>
                                )}

                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('client.fullName')}</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>{t('client.newPassword')}</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t('client.leaveEmpty')}
                                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={updating}
                                        style={{ width: '100%', padding: '1rem', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: updating ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '1rem' }}
                                    >
                                        {updating ? t('client.saving') : t('client.saveChanges')}
                                    </button>
                                </form>
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
