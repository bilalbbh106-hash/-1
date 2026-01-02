// لوحة تحكم ماسكي - النظام الذكي
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
});

// التحقق من تسجيل الدخول
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('maski-admin') === 'true';
    
    if (isLoggedIn) {
        showAdminDashboard();
    } else {
        document.getElementById('login-page').style.display = 'block';
    }
}

// تسجيل الدخول
document.getElementById('login-form')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const password = document.getElementById('admin-password').value;
    const errorElement = document.getElementById('login-error');
    
    // التحقق من كلمة المرور
    if (password === 'Maski2026') {
        localStorage.setItem('maski-admin', 'true');
        showAdminDashboard();
    } else {
        errorElement.textContent = 'كلمة المرور غير صحيحة!';
        errorElement.style.display = 'block';
    }
});

// عرض لوحة التحكم
function showAdminDashboard() {
    document.getElementById('login-page').style.display = 'none';
    
    const dashboard = document.getElementById('admin-dashboard');
    dashboard.style.display = 'block';
    dashboard.innerHTML = `
        <style>
            .admin-header {
                background: white;
                padding: 20px 0;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                z-index: 1000;
            }
            
            .admin-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 30px;
            }
            
            .admin-nav-links {
                display: flex;
                gap: 20px;
            }
            
            .admin-nav-link {
                padding: 12px 25px;
                background: var(--admin-light);
                border-radius: 50px;
                text-decoration: none;
                color: var(--admin-dark);
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .admin-nav-link:hover, .admin-nav-link.active {
                background: var(--admin-primary);
                color: white;
            }
            
            .admin-main {
                margin-top: 100px;
                padding: 30px;
            }
            
            .admin-section {
                display: none;
            }
            
            .admin-section.active {
                display: block;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 25px;
                margin-bottom: 40px;
            }
            
            .stat-card {
                background: white;
                padding: 30px;
                border-radius: var(--admin-radius);
                box-shadow: var(--admin-shadow);
                text-align: center;
                transition: all 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 800;
                color: var(--admin-primary);
                margin-bottom: 10px;
            }
            
            .form-card {
                background: white;
                padding: 40px;
                border-radius: var(--admin-radius);
                box-shadow: var(--admin-shadow);
                margin-bottom: 30px;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            }
            
            .table-container {
                overflow-x: auto;
                background: white;
                border-radius: var(--admin-radius);
                box-shadow: var(--admin-shadow);
                padding: 20px;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
            }
            
            th, td {
                padding: 15px;
                text-align: right;
                border-bottom: 1px solid #e2e8f0;
            }
            
            th {
                background: var(--admin-light);
                font-weight: 600;
            }
            
            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .btn-primary {
                background: var(--admin-primary);
                color: white;
            }
            
            .btn-danger {
                background: var(--admin-danger);
                color: white;
            }
            
            .btn-success {
                background: var(--admin-success);
                color: white;
            }
            
            textarea.code-input {
                width: 100%;
                height: 150px;
                padding: 15px;
                border: 2px solid #e2e8f0;
                border-radius: var(--admin-radius);
                font-family: monospace;
                font-size: 14px;
            }
        </style>
        
        <!-- الهيدر -->
        <header class="admin-header">
            <nav class="admin-nav">
                <div class="admin-logo" style="font-size: 2rem;">ماسكي - لوحة التحكم</div>
                <div class="admin-nav-links">
                    <a href="#dashboard" class="admin-nav-link active" data-section="dashboard">
                        <i class="fas fa-tachometer-alt"></i> الرئيسية
                    </a>
                    <a href="#products" class="admin-nav-link" data-section="products">
                        <i class="fas fa-box"></i> المنتجات
                    </a>
                    <a href="#digital" class="admin-nav-link" data-section="digital">
                        <i class="fas fa-code"></i> المنتجات الرقمية
                    </a>
                    <a href="#ads" class="admin-nav-link" data-section="ads">
                        <i class="fas fa-ad"></i> الإعلانات
                    </a>
                    <button onclick="logoutAdmin()" class="btn btn-danger">
                        <i class="fas fa-sign-out-alt"></i> خروج
                    </button>
                </div>
            </nav>
        </header>
        
        <!-- المحتوى الرئيسي -->
        <main class="admin-main container">
            <!-- قسم الرئيسية -->
            <section id="dashboard-section" class="admin-section active">
                <h1 style="margin-bottom: 30px; color: var(--admin-dark);">
                    <i class="fas fa-tachometer-alt"></i> لوحة التحكم الذكية
                </h1>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="total-products">0</div>
                        <p>المنتجات النشطة</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-number" id="total-sales">0</div>
                        <p>إجمالي المبيعات</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-number" id="total-earnings">$0</div>
                        <p>الأرباح الكلية</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-number" id="digital-stock">0</div>
                        <p>المخزون الرقمي</p>
                    </div>
                </div>
                
                <div class="form-card">
                    <h2 style="margin-bottom: 25px; color: var(--admin-dark);">
                        <i class="fas fa-plus-circle"></i> إضافة منتج جديد
                    </h2>
                    
                    <form id="add-product-form">
                        <div class="form-row">
                            <div>
                                <label>اسم المنتج</label>
                                <input type="text" id="product-name" required style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                            </div>
                            
                            <div>
                                <label>القسم</label>
                                <select id="product-category" required style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                                    <option value="">اختر القسم</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div>
                                <label>السعر ($)</label>
                                <input type="number" id="product-price" step="0.01" required style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                            </div>
                            
                            <div>
                                <label>الصورة (رابط)</label>
                                <input type="url" id="product-image" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 25px;">
                            <label>وصف المنتج</label>
                            <textarea id="product-description" rows="4" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;"></textarea>
                        </div>
                        
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> حفظ المنتج
                        </button>
                    </form>
                </div>
            </section>
            
            <!-- قسم المنتجات -->
            <section id="products-section" class="admin-section">
                <h1 style="margin-bottom: 30px; color: var(--admin-dark);">
                    <i class="fas fa-box"></i> إدارة المنتجات
                </h1>
                
                <div class="table-container">
                    <table id="products-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الصورة</th>
                                <th>الاسم</th>
                                <th>القسم</th>
                                <th>السعر</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="products-table-body">
                            <!-- سيتم تعبئته بالبيانات -->
                        </tbody>
                    </table>
                </div>
            </section>
            
            <!-- قسم المنتجات الرقمية -->
            <section id="digital-section" class="admin-section">
                <h1 style="margin-bottom: 30px; color: var(--admin-dark);">
                    <i class="fas fa-code"></i> إدارة المنتجات الرقمية
                </h1>
                
                <div class="form-card">
                    <h2 style="margin-bottom: 25px; color: var(--admin-dark);">
                        <i class="fas fa-upload"></i> إضافة أكواد جماعية
                    </h2>
                    
                    <div style="margin-bottom: 25px;">
                        <label>اختر نوع المنتج</label>
                        <select id="digital-type" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                            <option value="gem">أكواد جواهر</option>
                            <option value="visa">بطاقات فيزا</option>
                            <option value="gift">بطاقات هدايا</option>
                            <option value="game">حسابات ألعاب</option>
                            <option value="code">أكواد عامة</option>
                        </select>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label>الأكواد (سطر لكل كود)</label>
                        <textarea id="digital-codes" rows="10" class="code-input" placeholder="ضع أكواد هنا... كل كود في سطر جديد
مثال:
GEM-1234-5678
GEM-8765-4321
GEM-1111-2222"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label>القيمة ($)</label>
                        <input type="number" id="digital-value" value="1.10" step="0.01" style="width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px;">
                    </div>
                    
                    <button onclick="saveDigitalCodes()" class="btn btn-success" style="width: 100%; padding: 15px; font-size: 1.1rem;">
                        <i class="fas fa-save"></i> حفظ الأكواد في المخزون
                    </button>
                </div>
                
                <div class="form-card">
                    <h2 style="margin-bottom: 25px; color: var(--admin-dark);">
                        <i class="fas fa-database"></i> المخزون الحالي
                    </h2>
                    
                    <div id="digital-inventory">
                        <!-- سيتم عرض المخزون هنا -->
                    </div>
                </div>
            </section>
            
            <!-- قسم الإعلانات -->
            <section id="ads-section" class="admin-section">
                <h1 style="margin-bottom: 30px; color: var(--admin-dark);">
                    <i class="fas fa-ad"></i> إدارة الإعلانات
                </h1>
                
                <div class="form-card">
                    <h2 style="margin-bottom: 25px; color: var(--admin-dark);">
                        <i class="fab fa-a-ads"></i> إعدادات A-ADS
                    </h2>
                    
                    <div style="margin-bottom: 25px;">
                        <label>كود A-ADS (728x90)</label>
                        <textarea id="a-ads-code" class="code-input" placeholder="<script>...كود A-ADS هنا...</script>"></textarea>
                    </div>
                    
                    <button onclick="saveAdsConfig()" class="btn btn-primary">
                        <i class="fas fa-save"></i> حفظ إعدادات A-ADS
                    </button>
                </div>
                
                <div class="form-card">
                    <h2 style="margin-bottom: 25px; color: var(--admin-dark);">
                        <i class="fas fa-advertisement"></i> إعدادات Adstera
                    </h2>
                    
                    <div style="margin-bottom: 25px;">
                        <label>كود Adstera للشريط الجانبي (300x250)</label>
                        <textarea id="adstera-sidebar-code" class="code-input" placeholder="<script>...كود Adstera هنا...</script>"></textarea>
                    </div>
                    
                    <div style="margin-bottom: 25px;">
                        <label>كود Adstera للفوتر (468x60)</label>
                        <textarea id="adstera-footer-code" class="code-input" placeholder="<script>...كود Adstera هنا...</script>"></textarea>
                    </div>
                    
                    <button onclick="saveAdsConfig()" class="btn btn-primary">
                        <i class="fas fa-save"></i> حفظ إعدادات Adstera
                    </button>
                </div>
            </section>
        </main>
    `;
    
    // تهيئة لوحة التحكم
    initAdminDashboard();
}

// تهيئة لوحة التحكم
async function initAdminDashboard() {
    // تحميل الإحصائيات
    await loadAdminStats();
    
    // تحميل الأقسام
    await loadCategoriesForAdmin();
    
    // تحميل المنتجات
    await loadProductsForAdmin();
    
    // تحميل الإعلانات المحفوظة
    loadSavedAds();
    
    // إضافة الأحداث
    setupAdminEvents();
}

// تحميل الإحصائيات
async function loadAdminStats() {
    try {
        // عدد المنتجات
        const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);
        
        document.getElementById('total-products').textContent = productsCount || 0;
        
        // عدد المنتجات الرقمية
        const { count: digitalCount } = await supabase
            .from('digital_products')
            .select('*', { count: 'exact', head: true })
            .eq('used', false);
        
        document.getElementById('digital-stock').textContent = digitalCount || 0;
        
        // المبيعات (مثال)
        document.getElementById('total-sales').textContent = '0';
        document.getElementById('total-earnings').textContent = '$0';
        
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// تحميل الأقسام للإدارة
async function loadCategoriesForAdmin() {
    const select = document.getElementById('product-category');
    if (!select) return;
    
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('order');
        
        if (error) throw error;
        
        select.innerHTML = '<option value="">اختر القسم</option>';
        categories.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
        
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
    }
}

// تحميل المنتجات للإدارة
async function loadProductsForAdmin() {
    const tbody = document.getElementById('products-table-body');
    if (!tbody) return;
    
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        tbody.innerHTML = '';
        
        if (!products || products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #64748b;">
                        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>لا توجد منتجات بعد</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 8px;"></div>
                </td>
                <td>${product.title}</td>
                <td><span style="background: #e0e7ff; color: #4f46e5; padding: 5px 15px; border-radius: 20px;">${product.categories?.name || 'غير مصنف'}</span></td>
                <td><strong>${product.price}</strong></td>
                <td>
                    <span style="background: ${product.active ? '#d1fae5' : '#fee2e2'}; color: ${product.active ? '#065f46' : '#991b1b'}; padding: 5px 15px; border-radius: 20px;">
                        ${product.active ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <button onclick="editProduct(${product.id})" class="btn" style="background: #3b82f6; color: white; margin-left: 5px;">تعديل</button>
                    <button onclick="deleteProduct(${product.id})" class="btn" style="background: #ef4444; color: white;">حذف</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>حدث خطأ في تحميل البيانات</p>
                </td>
            </tr>
        `;
    }
}

// حفظ الأكواد الرقمية
async function saveDigitalCodes() {
    const type = document.getElementById('digital-type').value;
    const codesText = document.getElementById('digital-codes').value;
    const value = parseFloat(document.getElementById('digital-value').value);
    
    if (!codesText.trim()) {
        alert('يرجى إدخال الأكواد');
        return;
    }
    
    // تقسيم الأكواد حسب الأسطر
    const codes = codesText.split('\n').map(code => code.trim()).filter(code => code.length > 0);
    
    if (codes.length === 0) {
        alert('لم يتم العثور على أكواد صالحة');
        return;
    }
    
    try {
        // تحويل الأكواد إلى صفوف للقاعدة
        const digitalProducts = codes.map(code => ({
            code: code,
            type: type,
            value: value,
            used: false,
            created_at: new Date().toISOString()
        }));
        
        // إدخال جميع الأكواد مرة واحدة
        const { data, error } = await supabase
            .from('digital_products')
            .insert(digitalProducts);
        
        if (error) throw error;
        
        alert(`✅ تم حفظ ${codes.length} كود بنجاح في المخزون!`);
        document.getElementById('digital-codes').value = '';
        
        // تحديث الإحصائيات
        await loadAdminStats();
        
    } catch (error) {
        console.error('خطأ في حفظ الأكواد:', error);
        alert('❌ حدث خطأ في حفظ الأكواد');
    }
}

// تحميل الإعلانات المحفوظة
function loadSavedAds() {
    // A-ADS
    const aAdsCode = localStorage.getItem('maski-aads-code');
    if (aAdsCode) {
        document.getElementById('a-ads-code').value = aAdsCode;
    }
    
    // Adstera Sidebar
    const adsteraSidebar = localStorage.getItem('maski-adstera-sidebar');
    if (adsteraSidebar) {
        document.getElementById('adstera-sidebar-code').value = adsteraSidebar;
    }
    
    // Adstera Footer
    const adsteraFooter = localStorage.getItem('maski-adstera-footer');
    if (adsteraFooter) {
        document.getElementById('adstera-footer-code').value = adsteraFooter;
    }
}

// حفظ إعدادات الإعلانات
function saveAdsConfig() {
    // حفظ A-ADS
    const aAdsCode = document.getElementById('a-ads-code').value;
    localStorage.setItem('maski-aads-code', aAdsCode);
    
    // حفظ Adstera
    const adsteraSidebar = document.getElementById('adstera-sidebar-code').value;
    const adsteraFooter = document.getElementById('adstera-footer-code').value;
    
    localStorage.setItem('maski-adstera-sidebar', adsteraSidebar);
    localStorage.setItem('maski-adstera-footer', adsteraFooter);
    
    // تحديث الإعلانات في الموقع الرئيسي
    updateSiteAds();
    
    alert('✅ تم حفظ إعدادات الإعلانات بنجاح!');
}

// تحديث الإعلانات في الموقع
function updateSiteAds() {
    // هنا يمكن إضافة كود لتحديث الإعلانات في الموقع الرئيسي
    console.log('تم تحديث إعدادات الإعلانات');
}

// إعداد الأحداث في لوحة التحكم
function setupAdminEvents() {
    // التنقل بين الأقسام
    document.querySelectorAll('.admin-nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة النشط من جميع الروابط
            document.querySelectorAll('.admin-nav-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // إضافة النشط للرابط الحالي
            this.classList.add('active');
            
            // إخفاء جميع الأقسام
            document.querySelectorAll('.admin-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // إظهار القسم المحدد
            const sectionId = this.getAttribute('data-section');
            document.getElementById(`${sectionId}-section`).classList.add('active');
        });
    });
    
    // إضافة منتج جديد
    document.getElementById('add-product-form')?.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const productData = {
            title: document.getElementById('product-name').value,
            category_id: document.getElementById('product-category').value,
            price: document.getElementById('product-price').value + '$',
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value || 'default.jpg',
            active: true,
            created_at: new Date().toISOString()
        };
        
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([productData]);
            
            if (error) throw error;
            
            alert('✅ تم إضافة المنتج بنجاح!');
            this.reset();
            
            // تحديث القائمة
            await loadProductsForAdmin();
            await loadAdminStats();
            
        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            alert('❌ حدث خطأ في إضافة المنتج');
        }
    });
}

// تسجيل الخروج
function logoutAdmin() {
    localStorage.removeItem('maski-admin');
    location.reload();
}

// دالة مساعدة: تنسيق التاريخ
function formatAdminDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('ar-SA', options);
        }
