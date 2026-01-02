// إعدادات Supabase لمتجر ماسكي
const SUPABASE_URL = 'https://jdiljlwdnynzngbqlkqp.supabase.co';
const SUPABASE_KEY = 'sb_publishable_aSfEU4eWVbudVM-3O-hKAQ__Ukcg0PN';

// إنشاء عميل Supabase
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// NowPayments API Key
const NOWPAYMENTS_API_KEY = 'ضع_مفتاح_API_الخاص_بك_هنا';

// إعدادات الإعلانات
const ADS_CONFIG = {
    aAds: {
        enabled: true,
        headerCode: localStorage.getItem('maski-aads-header') || '',
        sidebarCode: localStorage.getItem('maski-aads-sidebar') || '',
        footerCode: localStorage.getItem('maski-aads-footer') || ''
    },
    adstera: {
        enabled: true,
        headerCode: localStorage.getItem('maski-adstera-header') || '',
        sidebarCode: localStorage.getItem('maski-adstera-sidebar') || '',
        footerCode: localStorage.getItem('maski-adstera-footer') || ''
    }
};

// إعدادات الموقع
const SITE_SETTINGS = JSON.parse(localStorage.getItem('maski-settings')) || {
    siteName: 'ماسكي',
    siteTagline: 'متجر المنتجات الرقمية الذكي',
    contactPhone: '+966 123 456 789',
    contactEmail: 'info@maski.store',
    siteDescription: 'متجر متخصص في بيع المنتجات الرقمية والخدمات الإلكترونية بأفضل الأسعار وأعلى جودة.'
};

// دالة لإنشاء دلو التخزين إذا لم يكن موجوداً
async function createStorageBucketIfNotExists() {
    try {
        const { data: buckets, error } = await supabase
            .storage
            .listBuckets();
        
        if (error) throw error;
        
        const bucketExists = buckets.some(bucket => bucket.name === 'product-images');
        
        if (!bucketExists) {
            const { data, error } = await supabase
                .storage
                .createBucket('product-images', {
                    public: true,
                    fileSizeLimit: 5242880, // 5MB
                    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif']
                });
            
            if (error) throw error;
            console.log('✅ تم إنشاء دلو تخزين الصور');
        }
    } catch (error) {
        console.error('❌ خطأ في إنشاء دلو التخزين:', error);
    }
}

// استدعاء الدالة عند التحميل
createStorageBucketIfNotExists();

console.log('✅ تهيئة Supabase بنجاح');
