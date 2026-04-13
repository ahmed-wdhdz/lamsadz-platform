import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { User, Ban, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const UsersList = () => {
    const { token } = useAuth();
    const { isArabic, t } = useLanguage();
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState('ALL');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (roleFilter === 'ALL') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(u => u.role === roleFilter));
        }
    }, [users, roleFilter]);

    const fetchUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsers(data.users || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const toggleBlock = async (userId, currentStatus) => {
        if (!confirm(currentStatus ? (isArabic ? 'هل أنت متأكد من فك الحظر؟' : 'Are you sure you want to unblock this user?') : (isArabic ? 'هل أنت متأكد من حظر المستخدم؟' : 'Are you sure you want to block this user?'))) return;

        try {
            const res = await fetch(`${API_URL}/admin/users/${userId}/block`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ blocked: !currentStatus })
            });

            if (res.ok) {
                setUsers(users.map(u => u.id === userId ? { ...u, blocked: !currentStatus } : u));
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>{t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')}</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>{isArabic ? 'إدارة المستخدمين' : 'Users Management'}</h1>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {['ALL', 'CLIENT', 'WORKSHOP', 'ADMIN'].map(role => (
                    <button
                        key={role}
                        onClick={() => setRoleFilter(role)}
                        style={{
                            padding: '0.4rem 1rem',
                            borderRadius: '999px',
                            border: roleFilter === role ? 'none' : '1px solid var(--gray-200)',
                            background: roleFilter === role ? '#0f172a' : 'white',
                            color: roleFilter === role ? 'white' : 'var(--text-color)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: roleFilter === role ? 'bold' : 'normal',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {role === 'ALL' ? (isArabic ? 'الكل' : 'All') : role === 'CLIENT' ? (isArabic ? 'الزبائن' : 'Clients') : role === 'WORKSHOP' ? (isArabic ? 'أصحاب الورش' : 'Workshops') : (isArabic ? 'الإدارة' : 'Admins')}
                    </button>
                ))}
            </div>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'الاسم' : 'Name'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'البريد الإلكتروني' : 'Email'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'الدور' : 'Role'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'تاريخ التسجيل' : 'Registration Date'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'الحالة' : 'Status'}</th>
                            <th style={{ padding: '1rem' }}>{isArabic ? 'إجراءات' : 'Actions'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ background: 'var(--gray-100)', padding: '0.5rem', borderRadius: '50%' }}>
                                        <User size={16} />
                                    </div>
                                    {user.name}
                                </td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '999px',
                                        fontSize: '0.85rem',
                                        background: user.role === 'ADMIN' ? '#fee2e2' : user.role === 'WORKSHOP' ? '#e0f2fe' : '#f3f4f6',
                                        color: user.role === 'ADMIN' ? '#991b1b' : user.role === 'WORKSHOP' ? '#075985' : '#374151'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(user.createdAt).toLocaleDateString('ar-DZ')}</td>
                                <td style={{ padding: '1rem' }}>
                                    {user.blocked ? (
                                        <span style={{ color: 'red', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Ban size={14} /> {isArabic ? 'محظور' : 'Blocked'}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={14} /> {isArabic ? 'نشط' : 'Active'}
                                        </span>
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    {user.role !== 'ADMIN' && (
                                        <button
                                            onClick={() => toggleBlock(user.id, user.blocked)}
                                            style={{
                                                padding: '0.5rem',
                                                borderRadius: '6px',
                                                border: '1px solid var(--gray-200)',
                                                color: user.blocked ? 'green' : 'red',
                                                cursor: 'pointer'
                                            }}
                                            title={user.blocked ? (isArabic ? 'فك الحظر' : 'Unblock') : (isArabic ? 'حظر' : 'Block')}
                                        >
                                            {user.blocked ? <CheckCircle size={18} /> : <Ban size={18} />}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsersList;
