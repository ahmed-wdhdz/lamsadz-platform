import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Users, FileText, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Overview = () => {
    const { token } = useAuth();
    const { isArabic, t } = useLanguage();

    const { data: stats = null, isLoading: loading, error } = useQuery({
        queryKey: ['adminOverview', token],
        queryFn: async () => {
            if (!token) return null;
            const res = await fetch(`${API_URL}/admin/overview`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) throw new Error('Unauthorized');
                throw new Error(`Failed to fetch stats: ${res.statusText}`);
            }

            const data = await res.json();
            return {
                metrics: {
                    totalLeads: data.stats?.totalLeads || 0,
                    activeWorkshops: data.stats?.totalWorkshops || 0,
                    soldLeads: data.stats?.pendingWorkshops || 0,
                    conversionRate: 0
                },
                leadsByWilaya: []
            };
        },
        enabled: !!token
    });

    if (loading) return <div>{t('form.loading') || (isArabic ? 'جاري التحميل...' : 'Loading...')}</div>;
    if (error) return <div className="text-red-500">Error: {error.message}</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>{isArabic ? 'نظرة عامة' : 'Overview'}</h1>

            {stats && (
                <>
                    {/* Stats Grid */}
                    <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#e0f2fe', padding: '1rem', borderRadius: '50%', color: '#0369a1' }}>
                                <FileText size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isArabic ? 'إجمالي الطلبات' : 'Total Requests'}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.metrics.totalLeads}</h3>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '50%', color: '#15803d' }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isArabic ? 'الورش النشطة' : 'Active Workshops'}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.metrics.activeWorkshops}</h3>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#fef9c3', padding: '1rem', borderRadius: '50%', color: '#a16207' }}>
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isArabic ? 'طلبات مكتملة' : 'Completed Requests'}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.metrics.soldLeads}</h3>
                            </div>
                        </div>

                        <div className="card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ background: '#fce7f3', padding: '1rem', borderRadius: '50%', color: '#be185d' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{isArabic ? 'معدل التحويل' : 'Conversion Rate'}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.metrics.conversionRate}%</h3>
                            </div>
                        </div>
                    </div>

                    {/* Charts Details */}
                    <div className="card" style={{ padding: '2rem', maxWidth: '600px' }}>
                        <h3 style={{ fontWeight: 'bold', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Activity size={20} /> {isArabic ? 'المناطق الأكثر طلباً' : 'Most Requested Regions'}
                        </h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {stats.leadsByWilaya.map((item, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                        <span>{item.name}</span>
                                        <span style={{ fontWeight: 'bold' }}>{item.value}</span>
                                    </div>
                                    <div style={{ height: '8px', background: 'var(--gray-100)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${stats.metrics.totalLeads > 0 ? (item.value / stats.metrics.totalLeads) * 100 : 0}%`,
                                            background: 'var(--primary)',
                                            borderRadius: '4px'
                                        }}></div>
                                    </div>
                                </div>
                            ))}
                            {stats.leadsByWilaya.length === 0 && <p style={{ color: 'var(--text-muted)' }}>{isArabic ? 'لا توجد بيانات كافية' : 'Not enough data available'}</p>}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Overview;
