const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Plus, Edit, Trash2, Image as ImageIcon, X, Eye, EyeOff, Package, Filter, Grid, List, Search, CheckCircle, Rocket } from 'lucide-react';
import { categories } from '../../utils/categories';
import PromoteModal from '../../components/PromoteModal';

const MyDesigns = () => {
    const { token } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('ALL');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [promotingProduct, setPromotingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        title: '', category: 'Kitchen', description: '', price: '',
    });
    const [files, setFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');



    useEffect(() => {
        fetchProducts();
    }, [page]);

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${API_URL}/workshop/products?page=${page}&limit=12`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products || []);
                setTotalPages(data.pages || 1);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                title: product.title,
                category: product.category,
                description: product.description || '',
                price: product.price,
            });
        } else {
            setEditingProduct(null);
            setFormData({ title: '', category: 'Kitchen', description: '', price: '' });
        }
        setFiles([]);
        setPreviewUrls([]);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('هل أنت متأكد من حذف هذا التصميم؟')) return;
        try {
            const res = await fetch(`${API_URL}/workshop/products/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setSuccessMessage('تم حذف التصميم بنجاح');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchProducts();
            }
        } catch (e) { console.error(e); }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
        const urls = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(urls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        data.append('price', formData.price);

        files.forEach(file => {
            data.append('images', file);
        });

        const url = editingProduct
            ? `${API_URL}/workshop/products/${editingProduct.id}`
            : `${API_URL}/workshop/products`;

        const method = editingProduct ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${token}` },
                body: data
            });

            if (res.ok) {
                setIsModalOpen(false);
                setSuccessMessage(editingProduct ? 'تم تحديث التصميم بنجاح' : 'تم إضافة التصميم بنجاح');
                setTimeout(() => setSuccessMessage(''), 3000);
                fetchProducts();
            } else {
                alert('حدث خطأ أثناء الحفظ');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSubmitting(false);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'ALL' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const inputStyle = {
        width: '100%',
        padding: '0.875rem 1rem',
        border: '2px solid #e5e7eb',
        borderRadius: '12px',
        fontSize: '1rem',
        transition: 'all 0.2s ease',
        background: '#f9fafb',
        outline: 'none'
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Header */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                <div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        color: 'var(--text-primary)',
                        marginBottom: '0.5rem'
                    }}>تصاميمي</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        إدارة كتالوج المنتجات والأعمال السابقة ({products.length} تصميم)
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.5rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '1rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
                    }}
                >
                    <Plus size={20} /> إضافة تصميم جديد
                </button>
            </div>

            {/* Success Message */}
            {successMessage && (
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
                    borderRadius: '12px',
                    marginBottom: '1.5rem',
                    color: '#166534',
                    fontWeight: '600'
                }}>
                    <CheckCircle size={20} />
                    {successMessage}
                </div>
            )}

            {/* Filters Bar */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: '1', minWidth: '200px', maxWidth: '300px' }}>
                    <Search size={18} style={{
                        position: 'absolute',
                        right: '1rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af'
                    }} />
                    <input
                        type="text"
                        placeholder="بحث عن تصميم..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            ...inputStyle,
                            paddingRight: '3rem'
                        }}
                    />
                </div>

                {/* Category Filter */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => setFilterCategory('ALL')}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '999px',
                            border: filterCategory === 'ALL' ? 'none' : '1px solid #e5e7eb',
                            background: filterCategory === 'ALL' ? '#3b82f6' : 'white',
                            color: filterCategory === 'ALL' ? 'white' : '#6b7280',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        الكل
                    </button>
                    {categories.slice(0, 4).map(cat => (
                        <button
                            key={cat.value}
                            onClick={() => setFilterCategory(cat.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '999px',
                                border: filterCategory === cat.value ? 'none' : '1px solid #e5e7eb',
                                background: filterCategory === cat.value ? '#3b82f6' : 'white',
                                color: filterCategory === cat.value ? 'white' : '#6b7280',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            <cat.icon size={16} /> {cat.label}
                        </button>
                    ))}
                </div>

                {/* View Toggle */}
                <div style={{ display: 'flex', gap: '0.25rem', marginRight: 'auto' }}>
                    <button
                        onClick={() => setViewMode('grid')}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: viewMode === 'grid' ? '#e5e7eb' : 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        <Grid size={20} />
                    </button>
                    <button
                        onClick={() => setViewMode('list')}
                        style={{
                            padding: '0.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: viewMode === 'list' ? '#e5e7eb' : 'transparent',
                            cursor: 'pointer'
                        }}
                    >
                        <List size={20} />
                    </button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                    جاري التحميل...
                </div>
            ) : (
                <>
                    {filteredProducts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'white',
                            borderRadius: '20px',
                            border: '2px dashed #e5e7eb'
                        }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                background: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Package size={36} style={{ color: '#9ca3af' }} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem', color: '#374151' }}>
                                لم تقم بإضافة أي تصاميم بعد
                            </h3>
                            <p style={{ color: '#9ca3af', marginBottom: '1.5rem' }}>
                                أضف تصاميمك لتظهر للزبائن المحتملين
                            </p>
                            <button
                                onClick={() => handleOpenModal()}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.875rem 1.5rem',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '1rem',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                <Plus size={20} /> أضف أول تصميم
                            </button>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: viewMode === 'grid'
                                ? 'repeat(auto-fill, minmax(280px, 1fr))'
                                : '1fr',
                            gap: '1.5rem'
                        }}>
                            {filteredProducts.map(product => {
                                const images = JSON.parse(product.images || '[]');
                                const thumbnail = images.length > 0
                                    ? `http://localhost:3000/uploads/${images[0]}`
                                    : 'https://placehold.co/400x300?text=No+Image';
                                const category = categories.find(c => c.value === product.category);

                                const now = new Date();
                                const featuredUntilDate = product.featuredUntil ? new Date(product.featuredUntil) : null;
                                const isFeatured = featuredUntilDate && featuredUntilDate > now;
                                const featuredDaysLeft = isFeatured ? Math.ceil((featuredUntilDate - now) / (1000 * 60 * 60 * 24)) : 0;

                                return viewMode === 'grid' ? (
                                    // Grid Card
                                    <div key={product.id} style={{
                                        background: 'white',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #f3f4f6'
                                    }}>
                                        <div style={{
                                            height: '200px',
                                            background: '#f3f4f6',
                                            position: 'relative',
                                            overflow: 'hidden'
                                        }}>
                                            <img
                                                src={thumbnail}
                                                alt={product.title}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            <div style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                right: '0.75rem',
                                                background: 'rgba(255,255,255,0.95)',
                                                padding: '0.35rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.8rem',
                                                fontWeight: '600',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.25rem',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}>
                                                {category && category.icon && React.createElement(category.icon, { size: 14 })} {category?.label}
                                            </div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '0.75rem',
                                                left: '0.75rem',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.3rem',
                                                alignItems: 'flex-start'
                                            }}>
                                                {product.status === 'PUBLISHED' && (
                                                    <div style={{
                                                        background: '#22c55e',
                                                        color: 'white',
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700'
                                                    }}>
                                                        منشور
                                                    </div>
                                                )}
                                                {isFeatured && (
                                                    <div style={{
                                                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                                        color: 'white',
                                                        padding: '0.25rem 0.6rem',
                                                        borderRadius: '999px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '700',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                                                    }}>
                                                        <Rocket size={12} /> متبقي {featuredDaysLeft} أيام
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.25rem' }}>
                                            <h3 style={{
                                                fontWeight: '700',
                                                fontSize: '1.1rem',
                                                marginBottom: '0.5rem',
                                                color: '#1f2937'
                                            }}>{product.title}</h3>
                                            <div style={{
                                                fontSize: '1.25rem',
                                                fontWeight: '800',
                                                color: '#3b82f6',
                                                marginBottom: '1rem'
                                            }}>
                                                {Number(product.price).toLocaleString()} د.ج
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                borderTop: '1px solid #f3f4f6',
                                                paddingTop: '1rem'
                                            }}>
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    style={{
                                                        // flex: 1, removed to fit all three
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.625rem',
                                                        background: '#f3f4f6',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '600',
                                                        color: '#374151'
                                                    }}
                                                    title="تعديل"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setPromotingProduct(product)}
                                                    style={{
                                                        flex: 1,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.625rem',
                                                        background: '#dbeafe', // light blue
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        fontSize: '0.9rem',
                                                        fontWeight: '700',
                                                        color: '#1d4ed8' // darker blue
                                                    }}
                                                >
                                                    <Rocket size={16} /> ترويج
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    style={{
                                                        padding: '0.625rem',
                                                        background: '#fef2f2',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        cursor: 'pointer',
                                                        color: '#ef4444'
                                                    }}
                                                    title="حذف"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // List View
                                    <div key={product.id} style={{
                                        display: 'flex',
                                        gap: '1.5rem',
                                        background: 'white',
                                        borderRadius: '16px',
                                        padding: '1rem',
                                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                                        border: '1px solid #f3f4f6'
                                    }}>
                                        <img
                                            src={thumbnail}
                                            alt={product.title}
                                            style={{
                                                width: '120px',
                                                height: '100px',
                                                objectFit: 'cover',
                                                borderRadius: '12px'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <h3 style={{ fontWeight: '700', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        {product.title}
                                                        {isFeatured && (
                                                            <span style={{
                                                                background: '#fef3c7',
                                                                color: '#d97706',
                                                                padding: '0.15rem 0.5rem',
                                                                borderRadius: '999px',
                                                                fontSize: '0.75rem',
                                                                fontWeight: '700',
                                                                display: 'inline-flex',
                                                                alignItems: 'center',
                                                                gap: '0.2rem'
                                                            }}>
                                                                <Rocket size={12} /> متبقي {featuredDaysLeft} أيام
                                                            </span>
                                                        )}
                                                    </h3>
                                                    <span style={{
                                                        fontSize: '0.85rem',
                                                        color: '#6b7280',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem'
                                                    }}>
                                                        {category && category.icon && React.createElement(category.icon, { size: 14 })} {category?.label}
                                                    </span>
                                                </div>
                                                <span style={{ fontWeight: '800', color: '#3b82f6' }}>
                                                    {Number(product.price).toLocaleString()} د.ج
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                        padding: '0.5rem 1rem', background: '#f3f4f6',
                                                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                        fontSize: '0.85rem', fontWeight: '600'
                                                    }}
                                                >
                                                    <Edit size={14} /> تعديل
                                                </button>
                                                <button
                                                    onClick={() => setPromotingProduct(product)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                        padding: '0.5rem 1rem', background: '#dbeafe',
                                                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                        fontSize: '0.85rem', fontWeight: '700', color: '#1d4ed8'
                                                    }}
                                                >
                                                    <Rocket size={14} /> ترويج
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    style={{
                                                        display: 'flex', alignItems: 'center', gap: '0.25rem',
                                                        padding: '0.5rem 1rem', background: '#fef2f2',
                                                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                                                        fontSize: '0.85rem', fontWeight: '600', color: '#ef4444'
                                                    }}
                                                >
                                                    <Trash2 size={14} /> حذف
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem',
                            marginTop: '2rem'
                        }}>
                            <button
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: 'white',
                                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                                    opacity: page === 1 ? 0.5 : 1
                                }}
                            >
                                السابق
                            </button>
                            <span style={{ fontWeight: '600' }}>{page} / {totalPages}</span>
                            <button
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    background: 'white',
                                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                                    opacity: page === totalPages ? 0.5 : 1
                                }}
                            >
                                التالي
                            </button>
                        </div>
                    )}
                </>
            )}

            <PromoteModal
                product={promotingProduct}
                isOpen={!!promotingProduct}
                onClose={() => setPromotingProduct(null)}
            />

            {/* Modal */}
            {isModalOpen && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        maxWidth: '550px',
                        width: '100%',
                        maxHeight: '90vh',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Modal Header */}
                        <div style={{
                            padding: '1.5rem',
                            borderBottom: '1px solid #f3f4f6',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>
                                {editingProduct ? '✏️ تعديل التصميم' : '➕ إضافة تصميم جديد'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                style={{
                                    background: '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '36px',
                                    height: '36px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer'
                                }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSubmit} style={{
                            padding: '1.5rem',
                            overflowY: 'auto',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem'
                        }}>
                            {/* Title */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    عنوان التصميم
                                </label>
                                <input
                                    style={inputStyle}
                                    placeholder="مثال: مطبخ عصري أبيض"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            {/* Category & Price */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        الفئة
                                    </label>
                                    <select
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                        السعر (د.ج)
                                    </label>
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        placeholder="45000"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    الوصف
                                </label>
                                <textarea
                                    style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                                    placeholder="وصف تفصيلي للتصميم، المواد المستعملة، الأبعاد..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            {/* Images */}
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    صور التصميم
                                </label>
                                <div style={{
                                    border: '2px dashed #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    background: '#f9fafb',
                                    cursor: 'pointer'
                                }}>
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                                        <ImageIcon size={36} style={{ color: '#9ca3af', margin: '0 auto 0.5rem' }} />
                                        <p style={{ color: '#6b7280', marginBottom: '0.25rem' }}>
                                            اضغط لرفع الصور أو اسحبها هنا
                                        </p>
                                        <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>
                                            PNG, JPG حتى 5 صور (بحد أقصى 5MB لكل صورة)
                                        </p>
                                    </label>
                                </div>
                                {previewUrls.length > 0 && (
                                    <div style={{
                                        display: 'flex',
                                        gap: '0.5rem',
                                        marginTop: '1rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        {previewUrls.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt="Preview"
                                                style={{
                                                    width: '70px',
                                                    height: '70px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #e5e7eb'
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Submit */}
                            <div style={{
                                display: 'flex',
                                gap: '0.75rem',
                                paddingTop: '0.5rem'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{
                                        flex: 1,
                                        padding: '0.875rem',
                                        background: '#f3f4f6',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    style={{
                                        flex: 2,
                                        padding: '0.875rem',
                                        background: submitting ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        cursor: submitting ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {submitting ? 'جاري الحفظ...' : (editingProduct ? 'تحديث التصميم' : 'إضافة التصميم')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyDesigns;
