import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const LanguageToggle = () => {
    const { language, toggleLanguage, isArabic } = useLanguage();

    return (
        <button
            onClick={toggleLanguage}
            className="language-toggle"
            aria-label={isArabic ? 'Switch to English' : 'التبديل للعربية'}
            title={isArabic ? 'English' : 'العربية'}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
            }}
            onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'var(--primary-light)';
                e.target.style.color = 'var(--primary)';
                e.target.style.borderColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-secondary)';
                e.target.style.borderColor = 'var(--border)';
            }}
        >
            <span style={{
                fontFamily: isArabic ? 'Inter, sans-serif' : 'Cairo, sans-serif',
                opacity: 0.6
            }}>
                {isArabic ? 'EN' : 'ع'}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 10l5 5 5-5" />
            </svg>
        </button>
    );
};

export default LanguageToggle;
