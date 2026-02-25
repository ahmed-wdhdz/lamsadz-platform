const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Trash2, Eye } from 'lucide-react';

const Products = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/products', {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setProducts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteProduct = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا التصميم؟')) return;

        try {
            const res = await fetch(`${API_URL}/admin/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
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
                                            ? `http://localhost:3000/uploads/${JSON.parse(product.images)[0]}`
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
        </div>
    );
};

export default Products;
