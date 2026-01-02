// متجر ماسكي - الملف الرئيسي الكامل
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 متجر ماسكي جاهز للتشغيل');
    
    // تحميل إعدادات الموقع
    loadSiteSettings();
    
    // تحميل الإعلانات
    loadAds();
    
    // تهيئة المتجر
    await initStore();
    
    // تحميل الأقسام والمنتجات
    await loadCategories();
    await loadProducts();
    
    // إعداد الأحداث
    setupEvents();
    
    // تحديث معلومات الاتصال
    updateContactInfo();
});

// =========== تحميل إعدادات الموقع ===========
function loadSiteSettings() {
    const settings = JSON.parse(localStorage.getItem('maski-settings')) || {
        siteName: 'ماسكي',
        siteTagline: 'متجر المنتجات الرقمية الذكي',
        contactPhone: '+966 123 456 789',
        contactEmail: 'info@maski.store',
        siteDescription: 'متجر متخصص في بيع المنتجات الرقمية والخدمات الإلكترونية بأفضل الأسعار وأعلى جودة.'
    };
    
    // تحديث معلومات الموقع
    document.title = settings.siteName;
    
    // تحديث الشعار إذا كان موجوداً
    const logoElement = document.querySelector('.logo');
    if (logoElement) {
        logoElement.textContent = settings.siteName;
    }
    
    // تحديث الشعار الجانبي
    const taglineElement = document.querySelector('.site-tagline');
    if (taglineElement) {
        taglineElement.textContent = settings.siteTagline;
    }
    
    // حفظ الإعدادات للاستخدام لاحقاً
    window.siteSettings = settings;
    
    console.log('✅ تم تحميل إعدادات الموقع');
}

// =========== تحديث معلومات الاتصال ===========
function updateContactInfo() {
    const phoneElement = document.querySelector('.contact-phone');
    const emailElement = document.querySelector('.contact-email');
    const descriptionElement = document.querySelector('.site-description');
    
    if (phoneElement && window.siteSettings?.contactPhone) {
        phoneElement.textContent = window.siteSettings.contactPhone;
        phoneElement.href = `tel:${window.siteSettings.contactPhone.replace(/\s+/g, '')}`;
    }
    
    if (emailElement && window.siteSettings?.contactEmail) {
        emailElement.textContent = window.siteSettings.contactEmail;
        emailElement.href = `mailto:${window.siteSettings.contactEmail}`;
    }
    
    if (descriptionElement && window.siteSettings?.siteDescription) {
        descriptionElement.textContent = window.siteSettings.siteDescription;
    }
}

// =========== تحميل الإعلانات ===========
function loadAds() {
    // تحميل إعلانات A-ADS
    const aAdsHeader = localStorage.getItem('maski-aads-header');
    const aAdsSidebar = localStorage.getItem('maski-aads-sidebar');
    const aAdsFooter = localStorage.getItem('maski-aads-footer');
    
    // تحميل إعلانات Adstera
    const adsteraHeader = localStorage.getItem('maski-adstera-header');
    const adsteraSidebar = localStorage.getItem('maski-adstera-sidebar');
    const adsteraFooter = localStorage.getItem('maski-adstera-footer');
    
    // تطبيق الإعلانات
    applyAdToElement('a-ads-banner', aAdsHeader || adsteraHeader);
    applyAdToElement('adstera-sidebar', aAdsSidebar || adsteraSidebar);
    applyAdToElement('adstera-footer', aAdsFooter || adsteraFooter);
    
    console.log('✅ تم تحميل الإعلانات');
}

function applyAdToElement(elementId, adCode) {
    const element = document.getElementById(elementId);
    if (element && adCode) {
        element.innerHTML = adCode;
    }
}

// =========== تهيئة المتجر ===========
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
        showError('حدث خطأ في الاتصال بقاعدة البيانات. يرجى المحاولة لاحقاً.');
    }
}

// =========== تحميل الأقسام ===========
async function loadCategories() {
    const container = document.getElementById('categories-container');
    if (!container) return;
    
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .eq('active', true)
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
            card.style.background = category.color || 'linear-gradient(135deg, #4f46e5, #7c3aed)';
            card.innerHTML = `
                <i class="${category.icon || 'fas fa-box'}"></i>
                <h3 style="margin: 20px 0 10px; font-size: 1.5rem; color: white;">${category.name}</h3>
                <p style="color: rgba(255,255,255,0.9);">${category.description || 'تصفح المنتجات'}</p>
            `;
            card.addEventListener('click', () => switchCategory(category.id));
            container.appendChild(card);
        });
        
        console.log(`✅ تم تحميل ${categories.length} قسم`);
        
    } catch (error) {
        console.error('❌ خطأ في تحميل الأقسام:', error);
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>حدث خطأ في تحميل الأقسام</p>
            </div>
        `;
    }
}

// =========== تحميل المنتجات ===========
async function loadProducts(categoryId = 'all') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    // عرض حالة التحميل
    container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <div class="spinner" style="width: 40px; height: 40px; border: 4px solid #e2e8f0; border-top-color: #4f46e5; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="color: #64748b;">جاري تحميل المنتجات...</p>
        </div>
    `;
    
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
        displayProducts(products, container);
        
        console.log(`✅ تم تحميل ${products.length} منتج`);
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #ef4444;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>حدث خطأ في تحميل المنتجات</p>
                <button onclick="loadProducts('${categoryId}')" style="
                    margin-top: 15px;
                    padding: 10px 25px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                ">إعادة المحاولة</button>
            </div>
        `;
    }
}

// =========== عرض المنتجات ===========
function displayProducts(products, container) {
    container.innerHTML = '';
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 60px; color: #64748b;">
                <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <h3 style="margin-bottom: 10px;">لا توجد منتجات</h3>
                <p>لم يتم العثور على منتجات في هذا القسم</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div style="position: relative;">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px 12px 0 0;">` :
                    `<div style="width: 100%; height: 200px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.2rem;">
                        ${product.title}
                    </div>`
                }
                
                ${product.stock === 0 ? `
                    <div style="position: absolute; top: 15px; right: 15px; background: #ef4444; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                        <i class="fas fa-times"></i> نفذت الكمية
                    </div>
                ` : ''}
                
                ${product.badge ? `
                    <div style="position: absolute; top: 15px; left: 15px; background: #f59e0b; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; font-weight: 600;">
                        ${product.badge}
                    </div>
                ` : ''}
            </div>
            
            <div style="padding: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
                    <h3 style="margin: 0; font-size: 1.2rem; color: #1e293b; font-weight: 600;">${product.title}</h3>
                    <span style="background: #e0e7ff; color: #4f46e5; padding: 3px 10px; border-radius: 12px; font-size: 0.85rem;">
                        ${product.categories?.name || 'عام'}
                    </span>
                </div>
                
                <p style="color: #64748b; margin-bottom: 15px; line-height: 1.5; height: 60px; overflow: hidden;">
                    ${product.description || 'منتج رقمي عالي الجودة'}
                </p>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 20px;">
                    <div>
                        <div style="font-size: 1.8rem; font-weight: 800; color: #4f46e5;">
                            ${product.price || '$0.00'}
                        </div>
                        ${product.stock > 0 ? `
                            <div style="font-size: 0.9rem; color: #10b981;">
                                <i class="fas fa-check-circle"></i> متوفر (${product.stock})
                            </div>
                        ` : `
                            <div style="font-size: 0.9rem; color: #ef4444;">
                                <i class="fas fa-times-circle"></i> غير متوفر
                            </div>
                        `}
                    </div>
                    
                    <button class="buy-btn" data-id="${product.id}" style="
                        background: ${product.stock > 0 ? 'linear-gradient(135deg, #4f46e5, #7c3aed)' : '#94a3b8'};
                        color: white;
                        border: none;
                        padding: 12px 30px;
                        border-radius: 12px;
                        font-weight: 600;
                        cursor: ${product.stock > 0 ? 'pointer' : 'not-allowed'};
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    " ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${product.stock > 0 ? 'اشتري الآن' : 'نفذت الكمية'}
                    </button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // إضافة أحداث أزرار الشراء
    setupBuyButtons();
}

// =========== إعداد أزرار الشراء ===========
function setupBuyButtons() {
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            if (!this.disabled) {
                startPayment(productId);
            }
        });
    });
}

// =========== تبديل القسم ===========
async function switchCategory(categoryId) {
    console.log(`🔄 تبديل إلى القسم: ${categoryId}`);
    
    // تحديث العنصر النشط
    document.querySelectorAll('.category-card').forEach(card => {
        card.style.transform = 'scale(1)';
        card.style.borderColor = 'transparent';
    });
    
    const selectedCard = event?.currentTarget;
    if (selectedCard) {
        selectedCard.style.transform = 'scale(1.05)';
        selectedCard.style.border = '3px solid white';
    }
    
    // تحميل منتجات القسم
    await loadProducts(categoryId);
    
    // التمرير لقسم المنتجات
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// =========== بدء عملية الدفع ===========
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
        
        // التحقق من المخزون
        if (product.stock === 0) {
            showError('نفذت كمية هذا المنتج. يرجى اختيار منتج آخر.');
            return;
        }
        
        // عرض نافذة الدفع
        showPaymentModal(product);
        
    } catch (error) {
        console.error('❌ خطأ في بدء الدفع:', error);
        showError('حدث خطأ في بدء عملية الدفع. يرجى المحاولة مرة أخرى.');
    }
}

// =========== عرض نافذة الدفع ===========
function showPaymentModal(product) {
    const modal = document.createElement('div');
    modal.id = 'payment-modal';
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
        backdrop-filter: blur(5px);
    `;
    
    modal.innerHTML = `
        <div style="
            background: white;
            padding: 40px;
            border-radius: 20px;
            max-width: 500px;
            width: 90%;
            text-align: center;
            animation: modalSlideIn 0.3s ease;
        ">
            <button onclick="closePaymentModal()" style="
                position: absolute;
                top: 15px;
                left: 15px;
                background: none;
                border: none;
                font-size: 1.5rem;
                color: #64748b;
                cursor: pointer;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            ">
                <i class="fas fa-times"></i>
            </button>
            
            <div style="font-size: 3rem; color: #4f46e5; margin-bottom: 20px;">
                <i class="fas fa-shopping-bag"></i>
            </div>
            
            <h2 style="margin-bottom: 20px; color: #1e293b; font-size: 1.8rem;">إتمام الشراء</h2>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: right;">
                <p style="margin-bottom: 10px; color: #64748b; font-size: 1.1rem;">
                    <strong>المنتج:</strong> ${product.title}
                </p>
                <p style="margin-bottom: 10px; color: #64748b;">
                    ${product.description || ''}
                </p>
                <div style="font-size: 2rem; font-weight: 800; color: #4f46e5; margin-top: 15px;">
                    ${product.price}
                </div>
            </div>
            
            <div id="payment-methods" style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 20px; color: #1e293b; font-size: 1.3rem;">
                    <i class="fas fa-credit-card"></i> اختر طريقة الدفع
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 15px; margin-bottom: 25px;">
                    <button class="payment-method-btn" data-method="crypto" style="
                        padding: 20px 15px;
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        background: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-coins" style="font-size: 2rem; color: #f59e0b;"></i>
                        <span style="font-weight: 600;">عملات مشفرة</span>
                    </button>
                    
                    <button class="payment-method-btn" data-method="stc-pay" style="
                        padding: 20px 15px;
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        background: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-mobile-alt" style="font-size: 2rem; color: #10b981;"></i>
                        <span style="font-weight: 600;">STC Pay</span>
                    </button>
                    
                    <button class="payment-method-btn" data-method="bank" style="
                        padding: 20px 15px;
                        border: 2px solid #e2e8f0;
                        border-radius: 12px;
                        background: white;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        gap: 10px;
                    ">
                        <i class="fas fa-university" style="font-size: 2rem; color: #3b82f6;"></i>
                        <span style="font-weight: 600;">تحويل بنكي</span>
                    </button>
                </div>
                
                <div id="payment-details" style="display: none;">
                    <!-- سيتم عرض تفاصيل الدفع هنا -->
                </div>
            </div>
            
            <div style="display: flex; gap: 15px; justify-content: center;">
                <button id="confirm-payment-btn" style="
                    padding: 15px 40px;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    color: white;
                    border: none;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                ">
                    <i class="fas fa-check"></i> تأكيد الطلب
                </button>
            </div>
            
            <div style="margin-top: 25px; padding: 15px; background: #fef3c7; border-radius: 8px; color: #92400e; font-size: 0.9rem;">
                <p><i class="fas fa-info-circle"></i> سيصلك المنتج خلال 24 ساعة من تأكيد الدفع</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // إضافة أنماط الحركة
    const style = document.createElement('style');
    style.textContent = `
        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .payment-method-btn:hover {
            border-color: #4f46e5;
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .payment-method-btn.active {
            border-color: #4f46e5;
            background: #e0e7ff;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);
    
    // إعداد الأحداث
    setupPaymentModalEvents(modal, product);
}

// =========== إعداد أحداث نافذة الدفع ===========
function setupPaymentModalEvents(modal, product) {
    // زر الإغلاق
    modal.querySelector('button[onclick="closePaymentModal()"]').addEventListener('click', function() {
        closePaymentModal();
    });
    
    // أزرار طرق الدفع
    modal.querySelectorAll('.payment-method-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // إزالة النشط من جميع الأزرار
            modal.querySelectorAll('.payment-method-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            // إضافة النشط للزر المختار
            this.classList.add('active');
            
            // عرض تفاصيل طريقة الدفع
            showPaymentDetails(this.dataset.method, product);
        });
    });
    
    // زر تأكيد الطلب
    modal.querySelector('#confirm-payment-btn').addEventListener('click', async function() {
        const selectedMethod = modal.querySelector('.payment-method-btn.active');
        
        if (!selectedMethod) {
            showError('يرجى اختيار طريقة دفع');
            return;
        }
        
        const method = selectedMethod.dataset.method;
        
        // تعطيل الزر أثناء المعالجة
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري المعالجة...';
        
        try {
            await processPayment(product, method);
        } catch (error) {
            console.error('خطأ في المعالجة:', error);
            showError('حدث خطأ أثناء المعالجة');
            this.disabled = false;
            this.innerHTML = '<i class="fas fa-check"></i> تأكيد الطلب';
        }
    });
}

// =========== عرض تفاصيل الدفع ===========
function showPaymentDetails(method, product) {
    const detailsContainer = document.getElementById('payment-details');
    if (!detailsContainer) return;
    
    detailsContainer.style.display = 'block';
    
    let detailsHTML = '';
    
    switch(method) {
        case 'crypto':
            detailsHTML = `
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; text-align: right;">
                    <h4 style="margin-bottom: 15px; color: #1e293b;">
                        <i class="fas fa-coins"></i> الدفع بالعملات المشفرة
                    </h4>
                    <p style="color: #64748b; margin-bottom: 15px;">
                        بعد تأكيد الطلب، سيتم إرسال محفظة البيتكوين الخاصة بنا إليك لإتمام الدفع.
                    </p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 2px dashed #e2e8f0;">
                        <p style="margin: 0; font-family: monospace; font-weight: 600; color: #1e293b;">
                            BTC Address: 1MASKiXXXXXXXXXXXXXXXXXXXXXX
                        </p>
                    </div>
                </div>
            `;
            break;
            
        case 'stc-pay':
            detailsHTML = `
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; text-align: right;">
                    <h4 style="margin-bottom: 15px; color: #1e293b;">
                        <i class="fas fa-mobile-alt"></i> الدفع عبر STC Pay
                    </h4>
                    <p style="color: #64748b; margin-bottom: 15px;">
                        قم بتحويل المبلغ إلى الرقم التالي عبر تطبيق STC Pay:
                    </p>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #10b981;">
                        <p style="margin: 0; font-size: 1.5rem; font-weight: 800; color: #10b981; direction: ltr;">
                            ${window.siteSettings?.contactPhone || '+966 123 456 789'}
                        </p>
                    </div>
                    <p style="color: #64748b; margin-top: 15px; font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> أرسل إشعار الدفع إلى الواتساب بعد التحويل
                    </p>
                </div>
            `;
            break;
            
        case 'bank':
            detailsHTML = `
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; text-align: right;">
                    <h4 style="margin-bottom: 15px; color: #1e293b;">
                        <i class="fas fa-university"></i> التحويل البنكي
                    </h4>
                    <div style="background: white; padding: 15px; border-radius: 8px; border: 2px solid #3b82f6; margin-bottom: 15px;">
                        <p style="margin: 0 0 10px 0; color: #1e293b;">
                            <strong>اسم البنك:</strong> الراجحي
                        </p>
                        <p style="margin: 0 0 10px 0; color: #1e293b;">
                            <strong>رقم الحساب:</strong> SA00 8000 XXXX XXXX XXXX
                        </p>
                        <p style="margin: 0; color: #1e293b;">
                            <strong>اسم المستفيد:</strong> متجر ماسكي
                        </p>
                    </div>
                    <p style="color: #64748b; font-size: 0.9rem;">
                        <i class="fas fa-info-circle"></i> أرسل صورة التحويل إلى الواتساب بعد الإرسال
                    </p>
                </div>
            `;
            break;
    }
    
    detailsContainer.innerHTML = detailsHTML;
}

// =========== معالجة الدفع ===========
async function processPayment(product, method) {
    try {
        // إنشاء طلب جديد
        const orderData = {
            product_id: product.id,
            product_title: product.title,
            price: product.price,
            payment_method: method,
            status: 'pending',
            created_at: new Date().toISOString(),
            customer_contact: '' // سيتم إضافة معلومات العميل لاحقاً
        };
        
        // حفظ الطلب في قاعدة البيانات
        const { data: order, error } = await supabase
            .from('orders')
            .insert([orderData])
            .select()
            .single();
        
        if (error) throw error;
        
        // تقليل المخزون
        if (product.stock > 0) {
            const { error: updateError } = await supabase
                .from('products')
                .update({ stock: product.stock - 1 })
                .eq('id', product.id);
            
            if (updateError) throw updateError;
        }
        
        // عرض صفحة النجاح
        showSuccessPage(order, product, method);
        
    } catch (error) {
        console.error('خطأ في معالجة الدفع:', error);
        throw error;
    }
}

// =========== عرض صفحة النجاح ===========
function showSuccessPage(order, product, method) {
    closePaymentModal();
    
    const successModal = document.createElement('div');
    successModal.id = 'success-modal';
    successModal.style.cssText = `
        position: fixed;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        backdrop-filter: blur(10px);
    `;
    
    let contactInfo = '';
    if (method === 'stc-pay' || method === 'bank') {
        const whatsappNumber = window.siteSettings?.contactPhone?.replace(/\s+/g, '') || '966123456789';
        const whatsappMessage = `مرحباً، لقد قمت بطلب المنتج: ${product.title} - رقم الطلب: ${order.id}`;
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
        
        contactInfo = `
            <div style="background: linear-gradient(135deg, #25D366, #128C7E); color: white; padding: 20px; border-radius: 12px; margin: 20px 0;">
                <h4 style="margin-bottom: 15px;">
                    <i class="fab fa-whatsapp"></i> تواصل معنا عبر الواتساب
                </h4>
                <p style="margin-bottom: 15px;">
                    أرسل إشعار الدفع أو التحويل عبر الواتساب لتسريع العملية:
                </p>
                <a href="${whatsappUrl}" target="_blank" style="
                    display: inline-block;
                    background: white;
                    color: #25D366;
                    padding: 12px 30px;
                    border-radius: 50px;
                    text-decoration: none;
                    font-weight: 600;
                    transition: all 0.3s ease;
                ">
                    <i class="fab fa-whatsapp"></i> فتح الواتساب
                </a>
            </div>
        `;
    }
    
    successModal.innerHTML = `
        <div style="
            background: white;
            padding: 50px;
            border-radius: 20px;
            max-width: 600px;
            width: 90%;
            text-align: center;
            animation: modalSlideIn 0.3s ease;
            border: 3px solid #10b981;
        ">
            <div style="font-size: 4rem; color: #10b981; margin-bottom: 20px;">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h2 style="margin-bottom: 20px; color: #1e293b; font-size: 2rem;">🎉 تم استلام طلبك بنجاح!</h2>
            
            <div style="background: #f0fdf4; padding: 25px; border-radius: 12px; margin-bottom: 25px; text-align: right;">
                <p style="margin-bottom: 10px; color: #065f46;">
                    <strong>رقم الطلب:</strong> MASK-${order.id}
                </p>
                <p style="margin-bottom: 10px; color: #065f46;">
                    <strong>المنتج:</strong> ${product.title}
                </p>
                <p style="margin-bottom: 10px; color: #065f46;">
                    <strong>السعر:</strong> ${product.price}
                </p>
                <p style="margin-bottom: 10px; color: #065f46;">
                    <strong>طريقة الدفع:</strong> ${getPaymentMethodName(method)}
                </p>
                <p style="margin-bottom: 10px; color: #065f46;">
                    <strong>حالة الطلب:</strong> <span style="color: #f59e0b;">قيد المعالجة</span>
                </p>
            </div>
            
            ${contactInfo}
            
            <div style="background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p><i class="fas fa-clock"></i> سيتم إرسال المنتج إليك خلال 24 ساعة من تأكيد الدفع</p>
            </div>
            
            <button onclick="closeSuccessModal()" style="
                padding: 15px 50px;
                background: #4f46e5;
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1.1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-top: 20px;
            ">
                <i class="fas fa-home"></i> العودة للرئيسية
            </button>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
                <p style="color: #64748b; font-size: 0.9rem;">
                    <i class="fas fa-headset"></i> للاستفسارات: ${window.siteSettings?.contactPhone || '+966 123 456 789'}
                </p>
            </div>
        </div>
    `;
    
    document.body.appendChild(successModal);
}

// =========== الدوال المساعدة ===========
function getPaymentMethodName(method) {
    const methods = {
        'crypto': 'عملات مشفرة',
        'stc-pay': 'STC Pay',
        'bank': 'تحويل بنكي'
    };
    return methods[method] || method;
}

function closePaymentModal() {
    const modal = document.getElementById('payment-modal');
    if (modal) {
        modal.remove();
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.remove();
        location.reload(); // تحديث الصفحة
    }
}

function showError(message) {
    // إنشاء عنصر الخطأ
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #ef4444;
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    `;
    
    errorDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                margin-right: auto;
            ">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(errorDiv);
    
    // إزالة الرسالة بعد 5 ثواني
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

// =========== إعداد الأحداث ===========
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
        loadMoreBtn.addEventListener('click', async () => {
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري التحميل...';
            loadMoreBtn.disabled = true;
            
            // محاكاة تحميل المزيد
            setTimeout(() => {
                showError('ميزة تحميل المزيد قيد التطوير');
                loadMoreBtn.innerHTML = 'تحميل المزيد';
                loadMoreBtn.disabled = false;
            }, 1000);
        });
    }
    
    // البحث في المنتجات
    const searchInput = document.getElementById('search-products');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(function() {
            searchProducts(this.value);
        }, 300));
    }
    
    // إغلاق النوافذ بالضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closePaymentModal();
            closeSuccessModal();
        }
    });
    
    // إغلاق النوافذ بالنقر خارجها
    document.addEventListener('click', function(e) {
        if (e.target.id === 'payment-modal') {
            closePaymentModal();
        }
        if (e.target.id === 'success-modal') {
            closeSuccessModal();
        }
    });
}

// =========== البحث في المنتجات ===========
async function searchProducts(query) {
    if (!query.trim()) {
        await loadProducts('all');
        return;
    }
    
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
            .eq('active', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        const container = document.getElementById('products-container');
        if (container) {
            displayProducts(products, container);
        }
        
    } catch (error) {
        console.error('خطأ في البحث:', error);
    }
}

// =========== الدوال المساعدة ===========
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =========== تهيئة إضافية ===========
// إضافة أنماط CSS الديناميكية
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #e2e8f0;
        border-top-color: #4f46e5;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto;
    }
    
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .product-card {
        transition: all 0.3s ease;
    }
    
    .product-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    }
    
    .category-card {
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .category-card:hover {
        transform: translateY(-5px) scale(1.05);
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
    }
`;
document.head.appendChild(dynamicStyles);

// تصدير الدوال للاستخدام في console
window.maski = {
    loadProducts,
    switchCategory,
    startPayment,
    searchProducts,
    getSiteSettings: () => window.siteSettings,
    reloadStore: async () => {
        await loadCategories();
        await loadProducts();
    }
};

console.log('✅ تم تحميل متجر ماسكي بنجاح');
