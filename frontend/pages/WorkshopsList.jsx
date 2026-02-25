const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const WorkshopsList = () => {
    const [workshops, setWorkshops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkshops = async () => {
            try {
                const res = await fetch(`${API_URL}/workshops`);
                const data = await res.json();
                setWorkshops(data.workshops || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchWorkshops();
    }, []);

    if (loading) return <div className="container" style={{ padding: '8rem 1rem' }}>Processing...</div>;

    return (
        <div className="container" style={{ padding: '8rem 1rem' }}>
            <h1 style={{ marginBottom: '2rem', fontWeight: '800' }}>استكشف الورش المعتمدة</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>أفضل الحرفيين والخبراء المحليين لإنجاز مشاريع الأثاث الخاصة بك.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
                {workshops.map(workshop => (
                    <div key={workshop.id} style={{
                        background: 'white',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                        padding: '1.5rem',
                        transition: 'var(--smooth)',
                        border: '1px solid var(--gray-200)'
                    }} className="hover-lift">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{workshop.name}</h2>
                            <span style={{
                                background: '#e0f2fe',
                                color: '#0369a1',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '999px',
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>{workshop.location}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: '1.6' }}>
                            {workshop.description.substring(0, 100)}...
                        </p>

                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                            {workshop.skills.split(',').slice(0, 3).map((skill, index) => (
                                <span key={index} style={{
                                    background: 'var(--gray-100)',
                                    fontSize: '0.8rem',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px'
                                }}>{skill.trim()}</span>
                            ))}
                        </div>

                        <Link to={`/workshops/${workshop.id}`}>
                            <Button variant="outline" style={{ width: '100%' }}>عرض التفاصيل</Button>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkshopsList;
