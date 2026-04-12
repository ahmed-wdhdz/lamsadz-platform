import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Trash2, Eye } from 'lucide-react';
import { getOptimizedImage } from '../../utils/optimizeImage';
import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'https://lamsadz-api.onrender.com/api';

const Products = () => {
    const { token } = useAuth();
    const [page, setPage] = useState(1);
    const { data: { products = [], totalPages = 1 } = {}, isLoading: loading, refetch: refetchProducts, isFetching } = useQuery({
        queryKey: ['adminProducts', page, token],
        queryFn: async () => {
            if (!token) return { products: [], totalPages: 1 };
            const res = await fetch(`${API_URL}/admin/products?page=${page}&limit=20`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to fetch products');
            const data = await res.json();
            return { products: data.products || data || [], totalPages: data.pages || 1 };
        },
        enabled: !!token,
        placeholderData: (previousData) => previousData
    });

    const deleteProduct = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا التصميم؟')) return;

        try {
            const res = await fetch(`${API_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                refetchProducts();
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div>جاري التحميل...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '2rem' }}>إدارة التصاميم</h1>

            <div className="card" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'right', borderBottom: '1px solid var(--gray-200)' }}>
                            <th style={{ padding: '1rem' }}>الصورة</th>
                            <th style={{ padding: '1rem' }}>العنوان</th>
                            <th style={{ padding: '1rem' }}>الورشة</th>
                            <th style={{ padding: '1rem' }}>السعر</th>
                            <th style={{ padding: '1rem' }}>الحالة</th>
                            <th style={{ padding: '1rem' }}>إجراءات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <img
                                        src={product.images && product.images !== '[]'
                                            ? getOptimizedImage(JSON.parse(product.images)[0], 100)
                                            : 'https://placehold.co/100'}
                                        alt={product.title}
                                        style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </td>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>{product.title}</td>
                                <td style={{ padding: '1rem' }}>{product.workshop.name}</td>
                                <td style={{ padding: '1rem' }}>{product.price} د.ج</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        background: product.status === 'PUBLISHED' ? '#dcfce7' : '#f3f4f6',
                                        color: product.status === 'PUBLISHED' ? '#15803d' : '#374151'
                                    }}>
                                        {product.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <button
                                        onClick={() => deleteProduct(product.id)}
                                        style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                                        title="حذف"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white',
                            cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1, fontWeight: 'bold'
                        }}
                    >
                        السابق
                    </button>
                    <span style={{ fontWeight: 'bold', color: '#4b5563', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {page} / {totalPages} {isFetching && <span style={{fontSize: '0.8rem', color: '#9ca3af'}}>(...)</span>}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        style={{
                            padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid #e5e7eb', background: 'white',
                            cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1, fontWeight: 'bold'
                        }}
                    >
                        التالي
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
