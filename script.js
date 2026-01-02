// متجر ماسكي - الملف الرئيسي
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 متجر ماسكي جاهز للتشغيل');
    
    // تهيئة الموقع
    await initStore();
    
    // تحميل الأقسام والمنتجات
    await loadCategories();
    await loadProducts();
    
    // إعداد الأحداث
    setupEvents();
    
    // تحميل الإعلانات
    loadAds();
});

// تهيئة المتجر
async function initStore() {
    console.log('🔧 تهيئة المتجر...');
    
    // التحقق من اتصال Supabase
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('count')
            .limit(1);
        
        if (error) throw error;
        console.log('✅ اتصال Supabase ناجح');
    } catch (error) {
        console.error('❌ خطأ في الاتصال:', error);
    }
}

// تحميل الأقسام
async function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('order');
        
        if (error) throw error;
        
        // تحديث فلتر الأقسام
        const filter = document.getElementById('category-filter');
        if (filter) {
            filter.innerHTML = '<option value="all">جميع الأقسام</option>';
            categories.forEach(cat => {
                filter.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        }
        
        // عرض الأقسام
        container.innerHTML = '';
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <i class="${category.icon}"></i>
                <h3 style="margin: 20px 0 10px; font-size: 1.5rem;">${category.name}</h3>
                <p style="color: #666;">${category.description}</p>
            `;
            card.addEventListener('click', () => switchCategory(category.id));
            container.appendChild(card);
        });
        
        console.log(`✅ تم تحميل ${categories.length} قسم`);
    } catch (error) {
        console.error('❌ خطأ في تحميل الأقسام:', error);
        container.innerHTML = '<p style="text-align: center; color: #666;">حدث خطأ في تحميل الأقسام</p>';
    }
}

// تحميل المنتجات
async function loadProducts(categoryId = 'all') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    try {
        let query = supabase
            .from('products')
            .select('*, categories(name)')
            .eq('active', true);
        
        if (categoryId !== 'all') {
            query = query.eq('category_id', categoryId);
        }
        
        const { data: products, error } = await query.order('created_at', { ascending: false }).limit(12);
        
        if (error) throw error;
        
        // عرض المنتجات
        container.innerHTML = '';
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div style="padding: 20px;">
                    <div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        height: 200px;
                        border-radius: var(--radius);
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 1.5rem;
                        font-weight: bold;
                    ">
                        ${product.title}
                    </div>
                    <h3 style="margin-bottom: 10px; font-size: 1.3rem;">${product.title}</h3>
                    <p style="color: #666; margin-bottom: 15px; height: 60px; overflow: hidden;">
                        ${product.description}
                    </p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 1.5rem; font-weight: bold; color: var(--primary);">
                            ${product.price}
                        </span>
                        <button class="buy-btn" data-id="${product.id}" style="
                            background: var(--primary);
                            color: white;
                            border: none;
                            padding: 10px 25px;
                            border-radius: 50px;
                            cursor: pointer;
                            font-weight: bold;
                            transition: all 0.3s ease;
                        ">اشتري الآن</button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
        
        console.log(`✅ تم تحميل ${products.length} منتج`);
        
        // إضافة أحداث أزرار الشراء
        document.querySelectorAll('.buy-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = this.getAttribute('data-id');
                startPayment(productId);
            });
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
        container.innerHTML = '<p style="text-align: center; color: #666;">حدث خطأ في تحميل المنتجات</p>';
    }
}

// تبديل القسم
async function switchCategory(categoryId) {
    console.log(`🔄 تبديل إلى القسم: ${categoryId}`);
    await loadProducts(categoryId);
}

// بدء عملية الدفع
async function startPayment(productId) {
    console.log(`💳 بدء عملية الدفع للمنتج: ${productId}`);
    
    try {
        // جلب بيانات المنتج
        const { data: product, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (error) throw error;
        
        // عرض نافذة الدفع
        showPaymentModal(product);
        
    } catch (error) {
        console.error('❌ خطأ في بدء الدفع:', error);
        alert('حدث خطأ في بدء عملية الدفع');
    }
}

// عرض نافذة الدفع
function showPaymentModal(product) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: var(--radius);
            max-width: 500px;
            width: 90%;
            text-align: center;
        ">
            <h2 style="margin-bottom: 20px; color: var(--dark);">إتمام الشراء</h2>
            <p style="margin-bottom: 20px; color: #666;">${product.title}</p>
            <p style="font-size: 2rem; font-weight: bold; color: var(--primary); margin-bottom: 30px;">
                ${product.price}
            </p>
            
            <div id="payment-methods" style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;">اختر طريقة الدفع</h3>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <button class="pay-method" data-method="crypto" style="
                        padding: 15px;
                        border: 2px solid #ddd;
                        border-radius: var(--radius);
                        background: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-coins" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                        <p>عملات مشفرة</p>
                    </button>
                    
                    <button class="pay-method" data-method="card" style="
                        padding: 15px;
                        border: 2px solid #ddd;
                        border-radius: var(--radius);
                        background: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-credit-card" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                        <p>بطاقة ائتمان</p>
                    </button>
                    
                    <button class="pay-method" data-method="transfer" style="
                        padding: 15px;
                        border: 2px solid #ddd;
                        border-radius: var(--radius);
                        background: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-university" style="font-size: 1.5rem; margin-bottom: 10px;"></i>
                        <p>تحويل بنكي</p>
                    </button>
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="confirm-payment" style="
                    padding: 15px 40px;
                    background: var(--primary);
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">تأكيد الدفع</button>
                
                <button id="cancel-payment" style="
                    padding: 15px 40px;
                    background: #e2e8f0;
                    color: var(--dark);
                    border: none;
                    border-radius: 50px;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">إلغاء</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إضافة الأحداث
    modal.querySelector('#cancel-payment').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    modal.querySelector('#confirm-payment').addEventListener('click', async () => {
        // هنا سيتم تنفيذ عملية الدفع الفعلية
        alert('سيتم تنفيذ عملية الدفع قريباً!');
        document.body.removeChild(modal);
    });
}

// تحميل الإعلانات
function loadAds() {
    // A-ADS
    const aAdsContainer = document.getElementById('a-ads-banner');
    if (aAdsContainer && window.ADS_CONFIG?.aAds?.code) {
        aAdsContainer.innerHTML = window.ADS_CONFIG.aAds.code;
    }
    
    // Adstera Sidebar
    const adsteraSidebar = document.getElementById('adstera-sidebar');
    if (adsteraSidebar && window.ADS_CONFIG?.adstera?.sidebarCode) {
        adsteraSidebar.innerHTML = window.ADS_CONFIG.adstera.sidebarCode;
    }
    
    // Adstera Footer
    const adsteraFooter = document.getElementById('adstera-footer');
    if (adsteraFooter && window.ADS_CONFIG?.adstera?.footerCode) {
        adsteraFooter.innerHTML = window.ADS_CONFIG.adstera.footerCode;
    }
}

// إعداد الأحداث
function setupEvents() {
    // فلتر الأقسام
    const filter = document.getElementById('category-filter');
    if (filter) {
        filter.addEventListener('change', function() {
            loadProducts(this.value);
        });
    }
    
    // تحميل المزيد
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // هنا سيتم تحميل المزيد من المنتجات
            alert('سيتم تحميل المزيد من المنتجات قريباً!');
        });
    }
}

// دالة المساعدة: تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA');
        }
