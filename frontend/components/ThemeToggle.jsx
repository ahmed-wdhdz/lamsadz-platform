import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const ThemeToggle = () => {
    const { toggleTheme, isDark } = useTheme();
    const { isArabic } = useLanguage();

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isArabic
                ? (isDark ? 'الوضع النهاري' : 'الوضع الليلي')
                : (isDark ? 'Light Mode' : 'Dark Mode')}
        >
            <div className={`toggle-track ${isDark ? 'dark' : 'light'}`}>
                <div className={`toggle-thumb ${isDark ? 'dark' : 'light'}`}>
                    {/* Sun Icon */}
                    <svg
                        className={`sun-icon ${isDark ? 'hidden' : 'visible'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="12" cy="12" r="5" />
                        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                    </svg>

                    {/* Moon Icon */}
                    <svg
                        className={`moon-icon ${isDark ? 'visible' : 'hidden'}`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                    </svg>
                </div>

                {/* Stars decoration for dark mode */}
                <div className={`stars ${isDark ? 'visible' : 'hidden'}`}>
                    <span className="star star-1">★</span>
                    <span className="star star-2">★</span>
                    <span className="star star-3">✦</span>
                </div>
            </div>

            <style jsx="true">{`
                .theme-toggle-btn {
                    background: none;
                    border: none;
                    padding: 4px;
                    cursor: pointer;
                    outline: none;
                    -webkit-tap-highlight-color: transparent;
                }
                
                .toggle-track {
                    position: relative;
                    width: 52px;
                    height: 26px;
                    border-radius: 13px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                }
                
                .toggle-track.light {
                    background: linear-gradient(135deg, #F5D4B3 0%, #E8C4A0 50%, #D4A574 100%);
                    box-shadow: 
                        inset 0 2px 4px rgba(0, 0, 0, 0.1),
                        0 2px 8px rgba(179, 107, 58, 0.2);
                }
                
                .toggle-track.dark {
                    background: linear-gradient(135deg, #1C1B19 0%, #2A2724 50%, #0F1211 100%);
                    box-shadow: 
                        inset 0 2px 4px rgba(0, 0, 0, 0.3),
                        0 2px 8px rgba(214, 154, 107, 0.2);
                }
                
                .toggle-thumb {
                    position: absolute;
                    top: 3px;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .toggle-thumb.light {
                    left: 3px;
                    background: linear-gradient(135deg, #B36B3A 0%, #9C5A33 100%);
                    box-shadow: 
                        0 2px 6px rgba(179, 107, 58, 0.5),
                        0 0 12px rgba(179, 107, 58, 0.3);
                }
                
                .toggle-thumb.dark {
                    left: 29px;
                    background: linear-gradient(135deg, #D69A6B 0%, #C08657 100%);
                    box-shadow: 
                        0 2px 6px rgba(214, 154, 107, 0.4),
                        0 0 8px rgba(214, 154, 107, 0.3);
                }
                
                .sun-icon, .moon-icon {
                    width: 12px;
                    height: 12px;
                    transition: all 0.3s ease;
                    position: absolute;
                }
                
                .sun-icon {
                    color: #FBF8F3;
                }
                
                .moon-icon {
                    color: #FBF8F3;
                }
                
                .sun-icon.visible, .moon-icon.visible {
                    opacity: 1;
                    transform: rotate(0deg) scale(1);
                }
                
                .sun-icon.hidden, .moon-icon.hidden {
                    opacity: 0;
                    transform: rotate(-90deg) scale(0.5);
                }
                
                .stars {
                    position: absolute;
                    inset: 0;
                    transition: opacity 0.4s ease;
                }
                
                .stars.visible {
                    opacity: 1;
                }
                
                .stars.hidden {
                    opacity: 0;
                }
                
                .star {
                    position: absolute;
                    color: #D69A6B;
                    font-size: 5px;
                    animation: twinkle 1.5s ease-in-out infinite;
                }
                
                .star-1 {
                    top: 5px;
                    left: 6px;
                    animation-delay: 0s;
                }
                
                .star-2 {
                    top: 14px;
                    left: 14px;
                    font-size: 4px;
                    animation-delay: 0.3s;
                }
                
                .star-3 {
                    top: 7px;
                    left: 20px;
                    font-size: 4px;
                    animation-delay: 0.6s;
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                
                .theme-toggle-btn:hover .toggle-track {
                    transform: scale(1.05);
                }
                
                .theme-toggle-btn:active .toggle-track {
                    transform: scale(0.98);
                }
            `}</style>
        </button>
    );
};

export default ThemeToggle;
