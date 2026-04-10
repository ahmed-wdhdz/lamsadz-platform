import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};

export const LanguageProvider = ({ children }) => {
    const getInitialLanguage = () => {
        const saved = localStorage.getItem('language');
        return saved || 'ar';
    };

    const [language, setLanguage] = useState(getInitialLanguage);

    useEffect(() => {
        // Apply direction and lang to document
        document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
        document.documentElement.setAttribute('lang', language);
        localStorage.setItem('language', language);
    }, [language]);

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
    };

    const t = (key) => {
        const translations = language === 'ar' ? arTranslations : enTranslations;
        return translations[key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, t, isArabic: language === 'ar' }}>
            {children}
        </LanguageContext.Provider>
    );
};

// Arabic Translations
const arTranslations = {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.about': 'من نحن',
    'nav.designs': 'المنتجات',
    'nav.workshops': 'الورش',
    'nav.login': 'دخول',
    'nav.register': 'تسجيل',
    'nav.logout': 'خروج',
    'nav.dashboard': 'لوحة التحكم',
    'nav.adminPanel': 'لوحة الإدارة',
    'nav.workshopPanel': 'لوحة الورشة',

    // Client Dashboard
    'client.dashboard': 'لوحة التحكم الخاصة بك',
    'client.welcome': 'مرحباً',
    'client.overview': 'نظرة عامة',
    'client.myOrders': 'طلباتي',
    'client.totalOrders': 'إجمالي الطلبات',
    'client.recentOrders': 'آخر الطلبات',
    'client.designReq': 'طلب تصميم',
    'client.customReq': 'طلب تصنيع',
    'client.kitchen': 'مطبخ',
    'client.viewAllOrders': 'عرض كل الطلبات',
    'client.noOrdersYet': 'لم تقم بأي طلبات بعد',
    'client.trackMyOrders': 'متابعة طلباتي',
    'client.readyDesignReq': 'طلب تصميم جاهز',
    'client.specialCustomReq': 'طلب تصنيع خاص',
    'client.wilaya': 'ولاية',
    'client.details': 'التفاصيل',
    'client.noOrdersAtAll': 'لا توجد طلبات حتى الآن.',
    'client.settings': 'إعدادات الحساب',
    'client.fullName': 'الاسم الكامل',
    'client.newPassword': 'كلمة المرور الجديدة',
    'client.leaveEmpty': 'اتركها فارغة إذا لم ترد التغيير',
    'client.saving': 'جاري الحفظ...',
    'client.saveChanges': 'حفظ التعديلات',

    // Order Status
    'status.new': 'قيد المراجعة',
    'status.sent': 'أرسل للورش',
    'status.responded': 'يوجد عروض',
    'status.sold': 'تم الاتفاق',

    // Hero Section
    'hero.title': 'أثاث جزائري أصيل',
    'hero.subtitle': 'من يد الحرفي ... إلى بيتك',
    'hero.description': 'اكتشف منتجات فريدة من أمهر الحرفيين في الجزائر. أثاث تقليدي وعصري يحكي قصة إبداع.',
    'hero.cta': 'تصفح المنتجات',
    'hero.secondary': 'انضم كحرفي',

    // Features
    'features.quality.title': 'جودة عالية',
    'features.quality.desc': 'خشب طبيعي 100% وحرفية متقنة',
    'features.custom.title': 'تصميم حسب الطلب',
    'features.custom.desc': 'صمم أثاثك كما تريده بالضبط',
    'features.delivery.title': 'توصيل آمن',
    'features.delivery.desc': 'نوصل لكل ولايات الوطن',
    'features.payment.title': 'الدفع عند الاستلام',
    'features.payment.desc': 'ادفع بأمان عند وصول طلبيتك',

    // Products
    'products.title': 'أحدث المنتجات',
    'products.subtitle': 'منتجات مختارة بعناية من أفضل الورش',
    'products.viewAll': 'عرض الكل',
    'products.requestQuote': 'اطلب الان',
    'products.from': 'يبدأ من',
    'products.currency': 'د.ج',

    // Workshop Dashboard
    'workshop.dashboard': 'لوحة الورشة',
    'workshop.home': 'الرئيسية',
    'workshop.designs': 'منتجاتي',
    'workshop.requests': 'الطلبات',
    'workshop.settings': 'الإعدادات',
    'workshop.subscription': 'الاشتراك',
    'workshop.backToSite': 'العودة للموقع',
    'workshop.welcome': 'مرحباً',
    'workshop.overview': 'نظرة عامة على نشاطك',
    'workshop.totalDesigns': 'المنتجات',
    'workshop.totalRequests': 'الطلبات',
    'workshop.unreadRequests': 'غير مقروءة',
    'workshop.addDesign': 'إضافة منتج',
    'workshop.viewRequests': 'مراجعة الطلبات',
    'workshop.recentActivity': 'آخر النشاطات',
    'workshop.noActivity': 'لا توجد نشاطات حديثة',

    // Admin Dashboard
    'admin.dashboard': 'لوحة الإدارة',
    'admin.overview': 'نظرة عامة',
    'admin.statistics': 'الإحصائيات',
    'admin.workshops': 'الورش',
    'admin.users': 'المستخدمين',
    'admin.products': 'المنتجات',
    'admin.payments': 'المدفوعات',
    'admin.requests': 'طلبات التسجيل',

    // Forms
    'form.name': 'الاسم',
    'form.email': 'البريد الإلكتروني',
    'form.phone': 'رقم الهاتف',
    'form.password': 'كلمة المرور',
    'form.message': 'الرسالة',
    'form.submit': 'إرسال',
    'form.cancel': 'إلغاء',
    'form.save': 'حفظ',
    'form.loading': 'جاري التحميل...',

    // Subscription
    'subscription.title': 'خطط الاشتراك',
    'subscription.monthly': 'شهري',
    'subscription.yearly': 'سنوي',
    'subscription.popular': 'الأكثر طلباً',
    'subscription.choose': 'اختيار',
    'subscription.features': 'المميزات',
    'subscription.uploadProof': 'رفع إيصال الدفع',
    'subscription.pending': 'جاري المراجعة',
    'subscription.active': 'نشط',

    // General
    'general.search': 'بحث...',
    'general.filter': 'تصفية',
    'general.sort': 'ترتيب',
    'general.all': 'الكل',
    'general.new': 'جديد',
    'general.view': 'عرض',
    'general.edit': 'تعديل',
    'general.delete': 'حذف',
    'general.confirm': 'تأكيد',
    'general.error': 'حدث خطأ',
    'general.success': 'تم بنجاح',
    'general.noData': 'لا توجد بيانات',
    'general.loading': 'جاري التحميل...',
    'general.viewall': 'عرض الكل',

    // Footer
    'footer.about': 'عن Lamsadz',
    'footer.aboutText': 'منصة تجمع بين الحرفيين الجزائريين والباحثين عن أثاث فريد وأصيل.',
    'footer.links': 'روابط سريعة',
    'footer.contact': 'تواصل معنا',
    'footer.rights': 'جميع الحقوق محفوظة',
};

// English Translations
const enTranslations = {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About Us',
    'nav.designs': 'Products',
    'nav.workshops': 'Workshops',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.dashboard': 'Dashboard',
    'nav.adminPanel': 'Admin Panel',
    'nav.workshopPanel': 'Workshop Panel',

    // Client Dashboard
    'client.dashboard': 'Your Dashboard',
    'client.welcome': 'Welcome',
    'client.overview': 'Overview',
    'client.myOrders': 'My Orders',
    'client.totalOrders': 'Total Orders',
    'client.recentOrders': 'Recent Orders',
    'client.designReq': 'Design Request',
    'client.customReq': 'Custom Manufacturing',
    'client.kitchen': 'Kitchen',
    'client.viewAllOrders': 'View All Orders',
    'client.noOrdersYet': 'You have no orders yet',
    'client.trackMyOrders': 'Track My Orders',
    'client.readyDesignReq': 'Ready Design Request',
    'client.specialCustomReq': 'Special Custom Request',
    'client.wilaya': 'State',
    'client.details': 'Details',
    'client.noOrdersAtAll': 'No orders yet.',
    'client.settings': 'Account Settings',
    'client.fullName': 'Full Name',
    'client.newPassword': 'New Password',
    'client.leaveEmpty': 'Leave empty if you don\'t want to change',
    'client.saving': 'Saving...',
    'client.saveChanges': 'Save Changes',

    // Order Status
    'status.new': 'Under Review',
    'status.sent': 'Sent to Workshops',
    'status.responded': 'Offers Available',
    'status.sold': 'Agreed',

    // Hero Section
    'hero.title': 'Authentic Algerian Furniture',
    'hero.subtitle': 'From the Artisan... To Your Home',
    'hero.description': 'Discover unique products from skilled artisans in Algeria. Traditional and modern furniture telling a story of creativity.',
    'hero.cta': 'Browse Products',
    'hero.secondary': 'Join as Artisan',

    // Features
    'features.quality.title': 'High Quality',
    'features.quality.desc': '100% natural wood and expert craftsmanship',
    'features.custom.title': 'Custom Design',
    'features.custom.desc': 'Design your furniture exactly as you want',
    'features.delivery.title': 'Secure Delivery',
    'features.delivery.desc': 'We deliver to all states',
    'features.payment.title': 'Flexible Payment',
    'features.payment.desc': 'Pay on delivery or in installments',

    // Products
    'products.title': 'Latest Products',
    'products.subtitle': 'Handpicked products from the best workshops',
    'products.viewAll': 'View All',
    'products.requestQuote': 'Request Quote',
    'products.from': 'From',
    'products.currency': 'DZD',

    // Workshop Dashboard
    'workshop.dashboard': 'Workshop Dashboard',
    'workshop.home': 'Home',
    'workshop.designs': 'My Products',
    'workshop.requests': 'Requests',
    'workshop.settings': 'Settings',
    'workshop.subscription': 'Subscription',
    'workshop.backToSite': 'Back to Site',
    'workshop.welcome': 'Welcome',
    'workshop.overview': 'Overview of your activity',
    'workshop.totalDesigns': 'Products',
    'workshop.totalRequests': 'Requests',
    'workshop.unreadRequests': 'Unread',
    'workshop.addDesign': 'Add Product',
    'workshop.viewRequests': 'View Requests',
    'workshop.recentActivity': 'Recent Activity',
    'workshop.noActivity': 'No recent activity',

    // Admin Dashboard
    'admin.dashboard': 'Admin Dashboard',
    'admin.statistics': 'Statistics',
    'admin.workshops': 'Workshops',
    'admin.users': 'Users',
    'admin.products': 'Products',
    'admin.payments': 'Payments',
    'admin.requests': 'Requests',

    // Forms
    'form.name': 'Name',
    'form.email': 'Email',
    'form.phone': 'Phone',
    'form.password': 'Password',
    'form.message': 'Message',
    'form.submit': 'Submit',
    'form.cancel': 'Cancel',
    'form.save': 'Save',
    'form.loading': 'Loading...',

    // Subscription
    'subscription.title': 'Subscription Plans',
    'subscription.monthly': 'Monthly',
    'subscription.yearly': 'Yearly',
    'subscription.popular': 'Most Popular',
    'subscription.choose': 'Choose',
    'subscription.features': 'Features',
    'subscription.uploadProof': 'Upload Payment Proof',
    'subscription.pending': 'Under Review',
    'subscription.active': 'Active',

    // General
    'general.search': 'Search...',
    'general.filter': 'Filter',
    'general.sort': 'Sort',
    'general.all': 'All',
    'general.new': 'New',
    'general.view': 'View',
    'general.edit': 'Edit',
    'general.delete': 'Delete',
    'general.confirm': 'Confirm',
    'general.error': 'An error occurred',
    'general.success': 'Success',
    'general.noData': 'No data available',

    // Footer
    'footer.about': 'About Athath.com',
    'footer.aboutText': 'A platform connecting Algerian artisans with those seeking unique and authentic furniture.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved',
};

export default LanguageContext;
