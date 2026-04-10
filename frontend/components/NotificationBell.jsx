const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';
import React, { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const NotificationBell = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/notifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications);
                setUnreadCount(data.unreadCount);
            }
        } catch (e) {
            console.error('Failed to fetch notifications', e);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [token]);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markAsRead = async (id, link) => {
        try {
            await fetch(`${API_URL}/notifications/${id}/read`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            // Update local state
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            setIsOpen(false);
            if (link) navigate(link);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="notification-btn"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'relative',
                    padding: '0.75rem',
                    color: isOpen ? 'var(--primary)' : 'var(--text-secondary)',
                    backgroundColor: isOpen ? 'var(--bg-secondary)' : 'transparent',
                    border: 'none',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Bell size={24} strokeWidth={isOpen ? 2.5 : 2} />
                {unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            backgroundColor: 'var(--error)',
                            color: 'white',
                            fontSize: '0.7rem',
                            fontWeight: '800',
                            borderRadius: '999px',
                            height: '18px',
                            minWidth: '18px',
                            padding: '0 4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid var(--bg-card)',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        left: '0', // Mobile-first default, should check RTL context if global dir is set
                        right: 'auto', // Adjust based on layout
                        width: '360px',
                        maxWidth: '90vw',
                        backgroundColor: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid var(--border)',
                        zIndex: 1000,
                        overflow: 'hidden',
                        animation: 'slideUp 0.2s ease-out',
                        transformOrigin: 'top left'
                    }}
                    dir="rtl" // Ensuring content inside is RTL since it's an Arabic app
                >
                    <div style={{
                        padding: '1rem',
                        borderBottom: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: 'var(--bg-secondary)'
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-primary)' }}>
                            الإشعارات
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                style={{
                                    fontSize: '0.8rem',
                                    color: 'var(--primary)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                                onClick={() => {/* Logic to mark all as read could go here */ }}
                            >
                                تحديد الكل كمقروء
                            </button>
                        )}
                    </div>

                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div style={{
                                padding: '3rem 1.5rem',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    backgroundColor: 'var(--bg-secondary)',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'var(--text-muted)'
                                }}>
                                    <Bell size={28} />
                                </div>
                                <div>
                                    <p style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>لا توجد إشعارات حالياً</p>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>سنخبرك فور وصول أي تحديث جديد</p>
                                </div>
                            </div>
                        ) : (
                            notifications.map(notification => (
                                <div
                                    key={notification.id}
                                    onClick={() => markAsRead(notification.id, notification.link)}
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid var(--border-light)',
                                        cursor: 'pointer',
                                        backgroundColor: !notification.read ? 'var(--primary-light)' : 'transparent',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseOver={(e) => {
                                        if (notification.read) e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                                    }}
                                    onMouseOut={(e) => {
                                        if (notification.read) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '50%',
                                            backgroundColor: !notification.read ? 'var(--primary)' : 'transparent',
                                            flexShrink: 0,
                                            marginTop: '6px'
                                        }} />
                                        <div>
                                            <p style={{
                                                fontSize: '0.95rem',
                                                fontWeight: !notification.read ? '700' : '400',
                                                color: !notification.read ? 'var(--text-primary)' : 'var(--text-secondary)',
                                                lineHeight: '1.4',
                                                marginBottom: '0.4rem'
                                            }}>
                                                {notification.message}
                                            </p>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                                {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default NotificationBell;
