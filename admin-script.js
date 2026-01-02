// لوحة تحكم ماسكي - النظام الذكي (النسخة الكاملة)
document.addEventListener('DOMContentLoaded', function() {
    checkAdminLogin();
    initSupabaseStorage();
});

// تهيئة التخزين في Supabase
function initSupabaseStorage() {
    // إنشاء مجلد الصور إذا لم يكن موجوداً
    window.supabaseBucket = 'product-images';
}

// التحقق من تسجيل الدخول
function checkAdminLogin() {
    const isLoggedIn = localStorage.getItem('maski-admin') === 'true';
    
    if (isLoggedIn) {
        showAdminDashboard();
    } else {
        document.getElementById('login-page').style.display = 'block';
        document.getElementById('admin-dashboard').style.display = 'none';
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
            /* الأنماط الأساسية للوحة التحكم */
            .admin-container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            .admin-header {
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                color: white;
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
                gap: 15px;
                align-items: center;
            }
            
            .admin-nav-link {
                padding: 12px 25px;
                background: rgba(255, 255, 255, 0.15);
                border-radius: 50px;
                text-decoration: none;
                color: white;
                font-weight: 600;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .admin-nav-link:hover, .admin-nav-link.active {
                background: white;
                color: #4f46e5;
                transform: translateY(-2px);
            }
            
            .admin-main {
                margin-top: 100px;
                padding: 30px;
            }
            
            .admin-section {
                display: none;
                animation: fadeIn 0.5s ease;
            }
            
            .admin-section.active {
                display: block;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            /* البطاقات */
            .form-card {
                background: white;
                padding: 40px;
                border-radius: 16px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                margin-bottom: 30px;
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
                border-radius: 16px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                text-align: center;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
                border-color: #4f46e5;
                box-shadow: 0 10px 25px rgba(79, 70, 229, 0.15);
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 800;
                color: #4f46e5;
                margin-bottom: 10px;
            }
            
            /* النماذج */
            .form-row {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 25px;
                margin-bottom: 25px;
            }
            
            .form-group {
                margin-bottom: 25px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 10px;
                font-weight: 600;
                color: #1e293b;
                font-size: 1.1rem;
            }
            
            .form-group input,
            .form-group select,
            .form-group textarea {
                width: 100%;
                padding: 15px 20px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }
            
            .form-group input:focus,
            .form-group select:focus,
            .form-group textarea:focus {
                border-color: #4f46e5;
                outline: none;
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            /* رفع الصور */
            .image-upload-container {
                border: 3px dashed #e2e8f0;
                border-radius: 12px;
                padding: 40px;
                text-align: center;
                cursor: pointer;
                transition: all 0.3s ease;
                background: #f8fafc;
                margin-bottom: 20px;
            }
            
            .image-upload-container:hover {
                border-color: #4f46e5;
                background: rgba(79, 70, 229, 0.05);
            }
            
            .upload-placeholder {
                color: #64748b;
            }
            
            .upload-placeholder i {
                font-size: 3rem;
                margin-bottom: 15px;
                color: #94a3b8;
            }
            
            .preview-image-container {
                position: relative;
                max-width: 400px;
                margin: 0 auto;
            }
            
            .preview-image {
                width: 100%;
                height: 200px;
                object-fit: cover;
                border-radius: 12px;
            }
            
            .remove-image-btn {
                position: absolute;
                top: 10px;
                left: 10px;
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border: none;
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
            }
            
            .remove-image-btn:hover {
                background: #dc2626;
                transform: scale(1.1);
            }
            
            /* الأزرار */
            .btn {
                padding: 15px 30px;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #4f46e5, #7c3aed);
                color: white;
            }
            
            .btn-primary:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 20px rgba(79, 70, 229, 0.3);
            }
            
            .btn-secondary {
                background: #e2e8f0;
                color: #1e293b;
            }
            
            .btn-secondary:hover {
                background: #cbd5e1;
            }
            
            .btn-success {
                background: #10b981;
                color: white;
            }
            
            .btn-success:hover {
                background: #059669;
                transform: translateY(-3px);
            }
            
            .btn-danger {
                background: #ef4444;
                color: white;
            }
            
            .btn-danger:hover {
                background: #dc2626;
            }
            
            /* الجداول */
            .table-container {
                overflow-x: auto;
                background: white;
                border-radius: 16px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.08);
                padding: 20px;
            }
            
            table {
                width: 100%;
                border-collapse: collapse;
            }
            
            th {
                background: #f8fafc;
                padding: 18px 20px;
                text-align: right;
                font-weight: 600;
                color: #1e293b;
                border-bottom: 2px solid #e2e8f0;
            }
            
            td {
                padding: 16px 20px;
                border-bottom: 1px solid #e2e8f0;
                color: #475569;
            }
            
            tr:hover {
                background: #f8fafc;
            }
            
            .status-badge {
                padding: 6px 15px;
                border-radius: 20px;
                font-size: 0.9rem;
                font-weight: 600;
            }
            
            .status-active {
                background: rgba(16, 185, 129, 0.1);
                color: #065f46;
            }
            
            .status-inactive {
                background: rgba(239, 68, 68, 0.1);
                color: #991b1b;
            }
            
            /* إعدادات الإعلانات */
            .code-input {
                width: 100%;
                height: 150px;
                padding: 15px;
                border: 2px solid #e2e8f0;
                border-radius: 12px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
                background: #f8fafc;
            }
            
            /* رسائل التنبيه */
            .alert {
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                gap: 15px;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateX(20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .alert-success {
                background: rgba(16, 185, 129, 0.1);
                color: #065f46;
                border: 1px solid rgba(16, 185, 129, 0.2);
            }
            
            .alert-error {
                background: rgba(239, 68, 68, 0.1);
                color: #991b1b;
                border: 1px solid rgba(239, 68, 68, 0.2);
            }
            
            /* التحميل */
            .loading {
                text-align: center;
                padding: 40px;
                color: #64748b;
            }
            
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e2e8f0;
                border-top-color: #4f46e5;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* تصميم متجاوب */
            @media (max-width: 768px) {
                .admin-nav {
                    flex-direction: column;
                    gap: 15px;
                    padding: 15px;
                }
                
                .admin-nav-links {
                    flex-wrap: wrap;
                    justify-content: center;
                }
                
                .admin-main {
                    padding: 20px;
                }
                
                .form-card {
                    padding: 25px;
                }
                
                .form-row {
                    grid-template-columns: 1fr;
                }
            }
        </style>
        
        <!-- الهيدر -->
        <header class="admin-header">
            <nav class="admin-nav">
                <div style="display: flex; align-items: center; gap: 15px;">
                    <div style="
                        width: 50px;
                        height: 50px;
                        background: white;
                        border-radius: 12px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: #4f46e5;
                        font-size: 1.5rem;
                        font-weight: bold;
                    ">م</div>
                    <h1 style="font-size: 1.8rem; font-weight: 800;">لوحة تحكم ماسكي</h1>
                </div>
                
                <div class="admin-nav-links">
                    <a href="#dashboard" class="admin-nav-link active" data-section="dashboard">
                        <i class="fas fa-tachometer-alt"></i> الرئيسية
                    </a>
                    <a href="#products" class="admin-nav-link" data-section="products">
                        <i class="fas fa-box"></i> المنتجات
                    </a>
                    <a href="#digital" class="admin-nav-link" data-section="digital">
                        <i class="fas fa-code"></i> الأكواد الرقمية
                    </a>
                    <a href="#settings" class="admin-nav-link" data-section="settings">
                        <i class="fas fa-cog"></i> الإعدادات
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
                <h2 style="margin-bottom: 30px; color: #1e293b; font-size: 2rem;">
                    <i class="fas fa-tachometer-alt"></i> لوحة التحكم الرئيسية
                </h2>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number" id="total-products">0</div>
                        <p style="color: #64748b;">المنتجات النشطة</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-number" id="total-sales">0</div>
                        <p style="color: #64748b;">إجمالي المبيعات</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-number" id="total-earnings">$0</div>
                        <p style="color: #64748b;">الأرباح الكلية</p>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-number" id="digital-stock">0</div>
                        <p style="color: #64748b;">الأكواد المتاحة</p>
                    </div>
                </div>
                
                <div class="form-card">
                    <h3 style="margin-bottom: 25px; color: #1e293b; font-size: 1.5rem;">
                        <i class="fas fa-plus-circle"></i> إضافة منتج جديد
                    </h3>
                    
                    <form id="add-product-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="product-name"><i class="fas fa-heading"></i> اسم المنتج</label>
                                <input type="text" id="product-name" required placeholder="أدخل اسم المنتج">
                            </div>
                            
                            <div class="form-group">
                                <label for="product-category"><i class="fas fa-folder"></i> القسم</label>
                                <select id="product-category" required>
                                    <option value="">اختر القسم</option>
                                </select>
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="product-price"><i class="fas fa-dollar-sign"></i> السعر ($)</label>
                                <input type="number" id="product-price" step="0.01" required placeholder="مثال: 1.10">
                            </div>
                            
                            <div class="form-group">
                                <label for="product-stock"><i class="fas fa-boxes"></i> الكمية المتاحة</label>
                                <input type="number" id="product-stock" min="0" value="1">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="product-description"><i class="fas fa-align-left"></i> وصف المنتج</label>
                            <textarea id="product-description" rows="4" placeholder="أدخل وصفاً تفصيلياً للمنتج"></textarea>
                        </div>
                        
                        <!-- رفع الصورة -->
                        <div class="form-group">
                            <label><i class="fas fa-image"></i> صورة المنتج</label>
                            <div class="image-upload-container" id="image-upload-area">
                                <input type="file" id="product-image-upload" accept="image/*" style="display: none;">
                                <div id="image-preview">
                                    <div class="upload-placeholder">
                                        <i class="fas fa-cloud-upload-alt"></i>
                                        <p>انقر لاختيار صورة أو اسحبها هنا</p>
                                        <small>الحجم الأقصى: 5MB | الأنواع: JPG, PNG, GIF</small>
                                    </div>
                                </div>
                            </div>
                            <input type="hidden" id="product-image-url">
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <button type="submit" class="btn btn-primary" style="padding: 15px 50px; font-size: 1.1rem;">
                                <i class="fas fa-save"></i> حفظ المنتج
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            
            <!-- قسم المنتجات -->
            <section id="products-section" class="admin-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
                    <h2 style="color: #1e293b; font-size: 2rem;">
                        <i class="fas fa-box"></i> إدارة المنتجات
                    </h2>
                    <div style="display: flex; gap: 15px;">
                        <input type="text" id="search-products" placeholder="ابحث عن منتج..." style="
                            padding: 12px 20px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            width: 300px;
                        ">
                        <select id="filter-category" style="
                            padding: 12px 20px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                        ">
                            <option value="all">جميع الأقسام</option>
                        </select>
                    </div>
                </div>
                
                <div class="table-container">
                    <div id="products-loading" class="loading">
                        <div class="spinner"></div>
                        <p>جاري تحميل المنتجات...</p>
                    </div>
                    <table id="products-table" style="display: none;">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الصورة</th>
                                <th>الاسم</th>
                                <th>القسم</th>
                                <th>السعر</th>
                                <th>المخزون</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody id="products-table-body">
                            <!-- سيتم تعبئته بالبيانات -->
                        </tbody>
                    </table>
                </div>
                
                <div id="products-pagination" style="
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 30px;
                "></div>
            </section>
            
            <!-- قسم الأكواد الرقمية -->
            <section id="digital-section" class="admin-section">
                <h2 style="margin-bottom: 30px; color: #1e293b; font-size: 2rem;">
                    <i class="fas fa-code"></i> إدارة الأكواد الرقمية
                </h2>
                
                <div class="form-card">
                    <h3 style="margin-bottom: 25px; color: #1e293b; font-size: 1.5rem;">
                        <i class="fas fa-plus-circle"></i> إضافة أكواد جديدة
                    </h3>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="digital-type"><i class="fas fa-tag"></i> نوع الكود</label>
                            <select id="digital-type">
                                <option value="gem">أكواد جواهر</option>
                                <option value="visa">بطاقات فيزا</option>
                                <option value="gift">بطاقات هدايا</option>
                                <option value="game">حسابات ألعاب</option>
                                <option value="charge">رصيد شحن</option>
                                <option value="social">خدمات سوشيال</option>
                                <option value="other">أخرى</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="digital-value"><i class="fas fa-dollar-sign"></i> القيمة ($)</label>
                            <input type="number" id="digital-value" step="0.01" value="1.10">
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="digital-codes"><i class="fas fa-keyboard"></i> الأكواد (سطر لكل كود)</label>
                        <textarea id="digital-codes" rows="8" placeholder="ضع أكواد هنا...
مثال:
GEM-1234-5678-9012
GEM-9876-5432-1098
GEM-1111-2222-3333" style="font-family: 'Courier New', monospace;"></textarea>
                        <div style="display: flex; justify-content: space-between; margin-top: 10px;">
                            <small style="color: #64748b;">يمكنك لصق أكواد من Excel أو ملف نصي</small>
                            <button type="button" onclick="clearDigitalCodes()" class="btn btn-secondary btn-sm">
                                <i class="fas fa-trash"></i> مسح الكل
                            </button>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px;">
                        <button onclick="saveDigitalCodes()" class="btn btn-success" style="padding: 15px 50px; font-size: 1.1rem;">
                            <i class="fas fa-save"></i> حفظ الأكواد في المخزون
                        </button>
                    </div>
                </div>
                
                <div class="form-card">
                    <h3 style="margin-bottom: 25px; color: #1e293b; font-size: 1.5rem;">
                        <i class="fas fa-database"></i> المخزون الحالي
                    </h3>
                    
                    <div id="digital-inventory-stats" style="
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                        gap: 20px;
                        margin-bottom: 30px;
                    ">
                        <!-- سيتم تعبئته بالإحصائيات -->
                    </div>
                    
                    <div id="digital-inventory-table">
                        <div class="loading">
                            <div class="spinner"></div>
                            <p>جاري تحميل المخزون...</p>
                        </div>
                    </div>
                </div>
            </section>
            
            <!-- قسم الإعدادات -->
            <section id="settings-section" class="admin-section">
                <h2 style="margin-bottom: 30px; color: #1e293b; font-size: 2rem;">
                    <i class="fas fa-cog"></i> إعدادات الموقع
                </h2>
                
                <div class="form-card">
                    <h3 style="margin-bottom: 25px; color: #1e293b; font-size: 1.5rem;">
                        <i class="fas fa-store"></i> إعدادات المتجر
                    </h3>
                    
                    <form id="site-settings-form">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="site-name"><i class="fas fa-signature"></i> اسم المتجر</label>
                                <input type="text" id="site-name" value="ماسكي" required>
                            </div>
                            
                            <div class="form-group">
                                <label for="site-tagline"><i class="fas fa-quote-left"></i> الشعار</label>
                                <input type="text" id="site-tagline" placeholder="مثال: متجر المنتجات الرقمية" value="متجر المنتجات الرقمية الذكي">
                            </div>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-phone"><i class="fas fa-phone"></i> رقم التواصل</label>
                                <input type="text" id="contact-phone" placeholder="+966 123 456 789" value="+966 123 456 789">
                            </div>
                            
                            <div class="form-group">
                                <label for="contact-email"><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
                                <input type="email" id="contact-email" placeholder="info@maski.store" value="info@maski.store">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="site-description"><i class="fas fa-align-left"></i> وصف المتجر</label>
                            <textarea id="site-description" rows="4">متجر متخصص في بيع المنتجات الرقمية والخدمات الإلكترونية بأفضل الأسعار وأعلى جودة.</textarea>
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="admin-password-new"><i class="fas fa-lock"></i> كلمة مرور جديدة للمدير</label>
                                <input type="password" id="admin-password-new" placeholder="اتركه فارغاً إذا لم ترد التغيير">
                            </div>
                            
                            <div class="form-group">
                                <label for="admin-password-confirm"><i class="fas fa-lock"></i> تأكيد كلمة المرور</label>
                                <input type="password" id="admin-password-confirm" placeholder="أعد إدخال كلمة المرور">
                            </div>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <button type="submit" class="btn btn-primary" style="padding: 15px 50px; font-size: 1.1rem;">
                                <i class="fas fa-save"></i> حفظ الإعدادات
                            </button>
                        </div>
                    </form>
                </div>
            </section>
            
            <!-- قسم الإعلانات -->
            <section id="ads-section" class="admin-section">
                <h2 style="margin-bottom: 30px; color: #1e293b; font-size: 2rem;">
                    <i class="fas fa-ad"></i> إدارة الإعلانات
                </h2>
                
                <div class="form-card">
                    <h3 style="margin-bottom: 25px; color: #1e293b; font-size: 1.5rem;">
                        <i class="fab fa-a-ads"></i> إعلانات A-ADS
                    </h3>
                    
                    <div class="form-group">
                        <label for="a-ads-header">إعلان الهيدر (728x90)</label>
                        <textarea id="a-ads-header" class="code-input" placeholder="أدخل كود A-ADS للهيدر"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="a-ads-sidebar">إعلان الشريط الجانبي (300x250)</label>
                        <textarea id="a-ads-sidebar" class="code-input" placeholder="أدخل كود A-ADS للشريط الجانبي"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="a-ads-footer">إعلان الفوتر (468x60)</label>
                        <textarea id="a-ads-footer" class="code-input" placeholder="أدخل كود A-ADS للفوتر"></textarea>
                    </div>
                </div>
                
                <div class="form-card">
                    <h3 style="margin-bottom: 25px; color: #1e293b; font-size: 1.5rem;">
                        <i class="fas fa-advertisement"></i> إعلانات Adstera
                    </h3>
                    
                    <div class="form-group">
                        <label for="adstera-header">إعلان الهيدر (728x90)</label>
                        <textarea id="adstera-header" class="code-input" placeholder="أدخل كود Adstera للهيدر"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="adstera-sidebar">إعلان الشريط الجانبي (300x250)</label>
                        <textarea id="adstera-sidebar" class="code-input" placeholder="أدخل كود Adstera للشريط الجانبي"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="adstera-footer">إعلان الفوتر (468x60)</label>
                        <textarea id="adstera-footer" class="code-input" placeholder="أدخل كود Adstera للفوتر"></textarea>
                    </div>
                </div>
                
                <div style="text-align: center; margin-top: 30px;">
                    <button onclick="saveAdsSettings()" class="btn btn-success" style="padding: 15px 50px; font-size: 1.1rem;">
                        <i class="fas fa-save"></i> حفظ جميع إعدادات الإعلانات
                    </button>
                </div>
            </section>
        </main>
        
        <!-- الفوتر -->
        <footer style="
            text-align: center;
            padding: 25px;
            color: #64748b;
            margin-top: 50px;
            border-top: 1px solid #e2e8f0;
        ">
            <p>© 2024 متجر ماسكي | لوحة التحكم الذكية | الإصدار 2.0</p>
            <p style="margin-top: 10px; font-size: 0.9rem;">
                <i class="fas fa-sync-alt"></i> تم التحديث: <span id="last-update">الآن</span>
            </p>
        </footer>
        
        <!-- رسائل التنبيه -->
        <div id="alert-container" style="
            position: fixed;
            top: 120px;
            left: 20px;
            z-index: 9999;
            max-width: 400px;
        "></div>
    `;
    
    // تهيئة لوحة التحكم
    initAdminDashboard();
}

// =========== تهيئة لوحة التحكم ===========
async function initAdminDashboard() {
    console.log('🚀 تهيئة لوحة تحكم ماسكي...');
    
    // تحميل الإحصائيات
    await loadAdminStats();
    
    // تحميل الأقسام
    await loadCategoriesForAdmin();
    
    // تحميل المنتجات
    await loadProductsForAdmin();
    
    // تحميل المخزون الرقمي
    await loadDigitalInventory();
    
    // تحميل الإعدادات المحفوظة
    loadSavedSettings();
    loadSavedAds();
    
    // إعداد الأحداث
    setupAdminEvents();
    
    // إعداد رفع الصور
    initImageUploadSystem();
    
    // إعداد البحث والتصفية
    setupSearchAndFilter();
    
    console.log('✅ تم تهيئة لوحة التحكم بنجاح');
}

// =========== نظام رفع الصور ===========
function initImageUploadSystem() {
    const uploadArea = document.getElementById('image-upload-area');
    const fileInput = document.getElementById('product-image-upload');
    const preview = document.getElementById('image-preview');
    const imageUrlInput = document.getElementById('product-image-url');
    
    if (!uploadArea || !fileInput || !preview) return;
    
    // فتح ملف عند النقر على منطقة الرفع
    uploadArea.addEventListener('click', function(e) {
        if (!e.target.closest('.remove-image-btn')) {
            fileInput.click();
        }
    });
    
    // معالجة اختيار الملف
    fileInput.addEventListener('change', async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        // التحقق من نوع الملف
        if (!file.type.match('image/jpeg') && 
            !file.type.match('image/png') && 
            !file.type.match('image/gif')) {
            showAlert('يرجى اختيار صورة من نوع JPG، PNG أو GIF فقط', 'error');
            return;
        }
        
        // التحقق من الحجم (5MB كحد أقصى)
        if (file.size > 5 * 1024 * 1024) {
            showAlert('حجم الصورة كبير جداً! الحد الأقصى 5MB', 'error');
            return;
        }
        
        // عرض معاينة الصورة
        const reader = new FileReader();
        reader.onload = function(e) {
            preview.innerHTML = `
                <div class="preview-image-container">
                    <img src="${e.target.result}" alt="معاينة الصورة" class="preview-image">
                    <button type="button" class="remove-image-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
        
        // رفع الصورة إلى Supabase
        await uploadImageToSupabase(file);
    });
    
    // إزالة الصورة
    preview.addEventListener('click', function(e) {
        if (e.target.closest('.remove-image-btn')) {
            preview.innerHTML = `
                <div class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>انقر لاختيار صورة أو اسحبها هنا</p>
                    <small>الحجم الأقصى: 5MB | الأنواع: JPG, PNG, GIF</small>
                </div>
            `;
            fileInput.value = '';
            imageUrlInput.value = '';
        }
    });
    
    // سحب وإفلات
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#4f46e5';
        uploadArea.style.backgroundColor = 'rgba(79, 70, 229, 0.05)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e2e8f0';
        uploadArea.style.backgroundColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.style.borderColor = '#e2e8f0';
        uploadArea.style.backgroundColor = '';
        
        const file = e.dataTransfer.files[0];
        if (file) {
            fileInput.files = e.dataTransfer.files;
            fileInput.dispatchEvent(new Event('change'));
        }
    });
}

// رفع الصورة إلى Supabase
async function uploadImageToSupabase(file) {
    try {
        showAlert('جاري رفع الصورة...', 'info');
        
        // إنشاء اسم فريد للصورة
        const fileName = `product_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `products/${fileName}`;
        
        // رفع الصورة
        const { data, error } = await supabase
            .storage
            .from('product-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });
        
        if (error) throw error;
        
        // الحصول على رابط عام للصورة
        const { data: { publicUrl } } = supabase
            .storage
            .from('product-images')
            .getPublicUrl(filePath);
        
        // حفظ الرابط في الحقل المخفي
        document.getElementById('product-image-url').value = publicUrl;
        
        showAlert('✅ تم رفع الصورة بنجاح!', 'success');
        console.log('تم رفع الصورة:', publicUrl);
        
        return publicUrl;
        
    } catch (error) {
        console.error('خطأ في رفع الصورة:', error);
        showAlert('❌ فشل رفع الصورة. تأكد من إعدادات التخزين في Supabase', 'error');
        return null;
    }
}

// =========== تحميل الإحصائيات ===========
async function loadAdminStats() {
    try {
        // عدد المنتجات
        const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);
        
        // عدد الأكواد الرقمية المتاحة
        const { count: digitalCount } = await supabase
            .from('digital_products')
            .select('*', { count: 'exact', head: true })
            .eq('used', false);
        
        // تحديث واجهة المستخدم
        document.getElementById('total-products').textContent = productsCount || 0;
        document.getElementById('digital-stock').textContent = digitalCount || 0;
        
        // يمكنك إضافة المزيد من الإحصائيات هنا
        document.getElementById('total-sales').textContent = '0';
        document.getElementById('total-earnings').textContent = '$0';
        
    } catch (error) {
        console.error('خطأ في تحميل الإحصائيات:', error);
    }
}

// =========== تحميل الأقسام ===========
async function loadCategoriesForAdmin() {
    const categorySelects = document.querySelectorAll('#product-category, #filter-category');
    
    try {
        const { data: categories, error } = await supabase
            .from('categories')
            .select('*')
            .order('order');
        
        if (error) throw error;
        
        categorySelects.forEach(select => {
            select.innerHTML = '<option value="all">جميع الأقسام</option>';
            categories.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
            });
        });
        
    } catch (error) {
        console.error('خطأ في تحميل الأقسام:', error);
    }
}

// =========== تحميل المنتجات ===========
async function loadProductsForAdmin() {
    const table = document.getElementById('products-table');
    const tbody = document.getElementById('products-table-body');
    const loading = document.getElementById('products-loading');
    
    if (!table || !tbody) return;
    
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // إخفاء التحميل
        if (loading) loading.style.display = 'none';
        table.style.display = 'table';
        
        tbody.innerHTML = '';
        
        if (!products || products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: #64748b;">
                        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>لا توجد منتجات بعد. أضف أول منتج من قسم "الرئيسية".</p>
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
                    ${product.image ? 
                        `<img src="${product.image}" alt="${product.title}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` :
                        `<div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4f46e5, #7c3aed); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                            <i class="fas fa-box"></i>
                        </div>`
                    }
                </td>
                <td style="font-weight: 600;">${product.title}</td>
                <td>
                    <span style="background: #e0e7ff; color: #4f46e5; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                        ${product.categories?.name || 'غير مصنف'}
                    </span>
                </td>
                <td style="font-weight: 700; color: #059669;">${product.price}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <span class="status-badge ${product.active ? 'status-active' : 'status-inactive'}">
                        ${product.active ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <button onclick="editProduct(${product.id})" class="btn btn-secondary btn-sm" style="margin-left: 5px;">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button onclick="toggleProductStatus(${product.id}, ${product.active})" class="btn ${product.active ? 'btn-warning' : 'btn-success'} btn-sm">
                        <i class="fas fa-power-off"></i> ${product.active ? 'إيقاف' : 'تفعيل'}
                    </button>
                    <button onclick="deleteProduct(${product.id})" class="btn btn-danger btn-sm">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // إضافة ترقيم الصفحات
        setupPagination();
        
    } catch (error) {
        console.error('خطأ في تحميل المنتجات:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>حدث خطأ في تحميل البيانات</p>
                </td>
            </tr>
        `;
    }
}

// =========== إضافة منتج جديد ===========
document.addEventListener('submit', async function(e) {
    if (e.target.id === 'add-product-form') {
        e.preventDefault();
        
        const formData = {
            title: document.getElementById('product-name').value,
            category_id: document.getElementById('product-category').value,
            price: '$' + document.getElementById('product-price').value,
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image-url').value || null,
            stock: document.getElementById('product-stock').value || 0,
            active: true,
            created_at: new Date().toISOString()
        };
        
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([formData]);
            
            if (error) throw error;
            
            showAlert('✅ تم إضافة المنتج بنجاح!', 'success');
            
            // إعادة تعيين النموذج
            e.target.reset();
            document.getElementById('image-preview').innerHTML = `
                <div class="upload-placeholder">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>انقر لاختيار صورة أو اسحبها هنا</p>
                    <small>الحجم الأقصى: 5MB | الأنواع: JPG, PNG, GIF</small>
                </div>
            `;
            
            // تحديث القوائم
            await loadAdminStats();
            await loadProductsForAdmin();
            
        } catch (error) {
            console.error('خطأ في إضافة المنتج:', error);
            showAlert('❌ حدث خطأ في إضافة المنتج', 'error');
        }
    }
    
    if (e.target.id === 'site-settings-form') {
        e.preventDefault();
        saveSiteSettings();
    }
});

// =========== إدارة الأكواد الرقمية ===========
async function saveDigitalCodes() {
    const type = document.getElementById('digital-type').value;
    const codesText = document.getElementById('digital-codes').value;
    const value = parseFloat(document.getElementById('digital-value').value) || 1.10;
    
    if (!codesText.trim()) {
        showAlert('يرجى إدخال الأكواد', 'error');
        return;
    }
    
    // تقسيم الأكواد
    const codes = codesText.split('\n')
        .map(code => code.trim())
        .filter(code => code.length > 0);
    
    if (codes.length === 0) {
        showAlert('لم يتم العثور على أكواد صالحة', 'error');
        return;
    }
    
    try {
        // تحضير البيانات
        const digitalProducts = codes.map(code => ({
            code: code,
            type: type,
            value: value,
            used: false,
            created_at: new Date().toISOString()
        }));
        
        // إدخال البيانات
        const { data, error } = await supabase
            .from('digital_products')
            .insert(digitalProducts);
        
        if (error) throw error;
        
        showAlert(`✅ تم حفظ ${codes.length} كود بنجاح في المخزون!`, 'success');
        
        // مسح الحقل
        document.getElementById('digital-codes').value = '';
        
        // تحديث الإحصائيات والمخزون
        await loadAdminStats();
        await loadDigitalInventory();
        
    } catch (error) {
        console.error('خطأ في حفظ الأكواد:', error);
        showAlert('❌ حدث خطأ في حفظ الأكواد', 'error');
    }
}

// مسح الأكواد
function clearDigitalCodes() {
    document.getElementById('digital-codes').value = '';
}

// تحميل المخزون الرقمي
async function loadDigitalInventory() {
    const container = document.getElementById('digital-inventory-table');
    const statsContainer = document.getElementById('digital-inventory-stats');
    
    if (!container) return;
    
    try {
        const { data: digitalProducts, error } = await supabase
            .from('digital_products')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);
        
        if (error) throw error;
        
        // إحصائيات المخزون
        const total = digitalProducts.length;
        const available = digitalProducts.filter(p => !p.used).length;
        const used = digitalProducts.filter(p => p.used).length;
        
        if (statsContainer) {
            statsContainer.innerHTML = `
                <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff; text-align: center;">
                    <div style="font-size: 2rem; font-weight: 800; color: #4f46e5;">${total}</div>
      
