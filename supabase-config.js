// إعدادات Supabase لمتجر ماسكي
const SUPABASE_URL = 'https://jdiljlwdnynzngbqlkqp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aSfEU4eWVbudVM-3O-hKAQ__Ukcg0PN';

// إنشاء عميل Supabase
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// NowPayments API Key (ضعه هنا عند الحصول عليه)
const NOWPAYMENTS_API_KEY = 'ضع_مفتاح_API_الخاص_بك_هنا';

// إعدادات الإعلانات
const ADS_CONFIG = {
    aAds: {
        enabled: true,
        code: '' // ضع كود A-ADS هنا
    },
    adstera: {
        enabled: true,
        sidebarCode: '', // ضع كود Adstera للشريط الجانبي هنا
        footerCode: '' // ضع كود Adstera للفوتر هنا
    }
};

console.log('✅ تهيئة Supabase بنجاح');
