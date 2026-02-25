const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Ban, CheckCircle } from 'lucide-react';

const UsersList = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

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
        if (!confirm(currentStatus ? 'هل أنت متأكد من فك الحظر؟' : 'هل أنت متأكد من حظر المستخدم؟')) return;

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

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>إدارة المستخدمين</h1>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>الاسم</th>
                            <th style={{ padding: '1rem' }}>البريد الإلكتروني</th>
                            <th style={{ padding: '1rem' }}>الدور</th>
                            <th style={{ padding: '1rem' }}>تاريخ التسجيل</th>
                            <th style={{ padding: '1rem' }}>الحالة</th>
                            <th style={{ padding: '1rem' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
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
                                            <Ban size={14} /> محظور
                                        </span>
                                    ) : (
                                        <span style={{ color: 'green', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <CheckCircle size={14} /> نشط
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
                                            title={user.blocked ? 'فك الحظر' : 'حظر'}
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
