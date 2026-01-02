// لوحة تحكم ماسكي - النسخة المصححة
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 تحميل لوحة التحكم...');
    
    // التحقق من تسجيل الدخول
    const isLoggedIn = checkAdminLogin();
    
    if (isLoggedIn) {
        console.log('✅ المستخدم مسجل دخول بالفعل');
        showAdminDashboard();
    } else {
        console.log('❌ يحتاج لتسجيل الدخول');
        showLoginPage();
    }
});

// =========== صفحة تسجيل الدخول ===========
function showLoginPage() {
    // إخفاء لوحة التحكم إذا كانت ظاهرة
    const dashboard = document.getElementById('admin-dashboard');
    if (dashboard) dashboard.style.display = 'none';
    
    // إنشاء صفحة تسجيل الدخول إذا لم تكن موجودة
    if (!document.getElementById('login-page')) {
        const loginHTML = `
            <div id="login-page" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
            ">
                <div style="
                    background: white;
                    border-radius: 20px;
                    padding: 50px;
                    width: 100%;
                    max-width: 500px;
                    text-align: center;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
                ">
                    <div style="
                        font-size: 3rem;
                        font-weight: 900;
                        background: linear-gradient(45deg, #4f46e5, #7c3aed);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                        margin-bottom: 20px;
                    ">ماسكي</div>
                    
                    <h1 style="margin-bottom: 30px; color: #1e293b; font-size: 1.8rem;">
                        لوحة التحكم الذكية
                    </h1>
                    
                    <p style="color: #64748b; margin-bottom: 40px;">
                        أدخل كلمة المرور للدخول إلى نظام الإدارة
                    </p>
                    
                    <form id="login-form" style="margin-bottom: 30px;">
                        <div style="margin-bottom: 25px; text-align: right;">
                            <label for="admin-password" style="
                                display: block;
                                margin-bottom: 10px;
                                font-weight: 600;
                                color: #1e293b;
                                font-size: 1.1rem;
                            ">
                                <i class="fas fa-lock"></i> كلمة المرور
                            </label>
                            <input type="password" id="admin-password" style="
                                width: 100%;
                                padding: 15px 20px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1.1rem;
                                transition: all 0.3s ease;
                            " placeholder="أدخل كلمة المرور" required>
                        </div>
                        
                        <button type="submit" style="
                            width: 100%;
                            padding: 17px;
                            background: linear-gradient(45deg, #4f46e5, #7c3aed);
                            color: white;
                            border: none;
                            border-radius: 12px;
                            font-size: 1.2rem;
                            font-weight: 600;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            gap: 10px;
                        ">
                            <i class="fas fa-sign-in-alt"></i> دخول المدير
                        </button>
                    </form>
                    
                    <div id="login-error" style="
                        color: #ef4444;
                        margin-top: 15px;
                        padding: 12px;
                        background: rgba(239, 68, 68, 0.1);
                        border-radius: 8px;
                        display: none;
                        text-align: right;
                    "></div>
                    
                    <div style="
                        margin-top: 30px;
                        padding-top: 20px;
                        border-top: 1px solid #e2e8f0;
                        color: #64748b;
                        font-size: 0.9rem;
                    ">
                        <p><i class="fas fa-info-circle"></i> كلمة المرور الافتراضية: <strong>Maski2026</strong></p>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('afterbegin', loginHTML);
    } else {
        document.getElementById('login-page').style.display = 'flex';
    }
    
    // إضافة حدث تسجيل الدخول
    document.getElementById('login-form')?.addEventListener('submit', handleLogin);
}

// =========== التحقق من تسجيل الدخول ===========
function checkAdminLogin() {
    // التحقق من LocalStorage
    const isLoggedIn = localStorage.getItem('maski-admin-login') === 'true';
    
    // التحقق من SessionStorage أيضاً
    const sessionLoggedIn = sessionStorage.getItem('maski-admin-session') === 'true';
    
    console.log('🔍 حالة تسجيل الدخول:', { 
        localStorage: isLoggedIn, 
        sessionStorage: sessionLoggedIn 
    });
    
    return isLoggedIn || sessionLoggedIn;
}

// =========== معالجة تسجيل الدخول ===========
function handleLogin(e) {
    e.preventDefault();
    
    const passwordInput = document.getElementById('admin-password');
    const password = passwordInput.value;
    const errorElement = document.getElementById('login-error');
    
    console.log('🔐 محاولة تسجيل دخول بكلمة:', password);
    
    // التحقق من كلمة المرور
    if (password === 'Maski2026') {
        // تسجيل الدخول الناجح
        loginSuccess();
    } else {
        // فشل تسجيل الدخول
        loginFailed(errorElement);
    }
}

// =========== تسجيل الدخول الناجح ===========
function loginSuccess() {
    console.log('✅ تسجيل الدخول ناجح');
    
    // حفظ حالة تسجيل الدخول
    localStorage.setItem('maski-admin-login', 'true');
    localStorage.setItem('maski-admin-time', new Date().toISOString());
    
    // حفظ في الجلسة أيضاً
    sessionStorage.setItem('maski-admin-session', 'true');
    
    // إخفاء صفحة تسجيل الدخول
    const loginPage = document.getElementById('login-page');
    if (loginPage) {
        loginPage.style.display = 'none';
    }
    
    // عرض لوحة التحكم
    showAdminDashboard();
    
    // إظهار رسالة نجاح
    showMessage('تم تسجيل الدخول بنجاح!', 'success');
}

// =========== فشل تسجيل الدخول ===========
function loginFailed(errorElement) {
    console.log('❌ كلمة المرور خاطئة');
    
    if (errorElement) {
        errorElement.textContent = 'كلمة المرور غير صحيحة! الرجاء المحاولة مرة أخرى.';
        errorElement.style.display = 'block';
        
        // إخفاء الخطأ بعد 5 ثواني
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
    
    // اهتزاز حقل كلمة المرور
    const passwordInput = document.getElementById('admin-password');
    passwordInput.style.borderColor = '#ef4444';
    passwordInput.style.animation = 'shake 0.5s';
    
    setTimeout(() => {
        passwordInput.style.borderColor = '#e2e8f0';
        passwordInput.style.animation = '';
    }, 500);
}

// =========== إضافة أنماط الحركة ===========
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
        20%, 40%, 60%, 80% { transform: translateX(10px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
    }
`;
document.head.appendChild(animationStyles);

// =========== عرض لوحة التحكم ===========
function showAdminDashboard() {
    console.log('🚀 عرض لوحة التحكم...');
    
    // إخفاء صفحة تسجيل الدخول
    const loginPage = document.getElementById('login-page');
    if (loginPage) {
        loginPage.style.display = 'none';
    }
    
    // إنشاء لوحة التحكم إذا لم تكن موجودة
    if (!document.getElementById('admin-dashboard')) {
        createAdminDashboard();
    } else {
        // إذا كانت موجودة، فقط أظهرها
        document.getElementById('admin-dashboard').style.display = 'block';
    }
    
    // تهيئة لوحة التحكم
    initAdminDashboard();
}

// =========== إنشاء لوحة التحكم ===========
function createAdminDashboard() {
    const dashboardHTML = `
        <div id="admin-dashboard" style="display: block;">
            ${getAdminStyles()}
            
            <!-- الهيدر -->
            <header class="admin-header">
                <nav class="admin-nav">
                    <div class="admin-brand">
                        <div class="admin-logo">ماسكي</div>
                        <h1>لوحة التحكم الذكية</h1>
                    </div>
                    
                    <div class="admin-actions">
                        <div class="admin-user">
                            <div class="user-avatar">
                                <i class="fas fa-user-shield"></i>
                            </div>
                            <div class="user-info">
                                <div class="user-name">المدير</div>
                                <div class="user-role">مسؤول النظام</div>
                            </div>
                        </div>
                        
                        <button onclick="logoutAdmin()" class="logout-btn">
                            <i class="fas fa-sign-out-alt"></i> تسجيل الخروج
                        </button>
                    </div>
                </nav>
            </header>
            
            <!-- الشريط الجانبي -->
            <aside class="admin-sidebar">
                <nav class="sidebar-nav">
                    <div class="nav-section">
                        <h3>القائمة الرئيسية</h3>
                        <ul class="nav-links">
                            <li>
                                <a href="#dashboard" class="nav-link active" onclick="switchSection('dashboard')">
                                    <i class="fas fa-tachometer-alt"></i>
                                    <span>لوحة التحكم</span>
                                </a>
                            </li>
                            <li>
                                <a href="#products" class="nav-link" onclick="switchSection('products')">
                                    <i class="fas fa-box"></i>
                                    <span>المنتجات</span>
                                </a>
                            </li>
                            <li>
                                <a href="#digital" class="nav-link" onclick="switchSection('digital')">
                                    <i class="fas fa-code"></i>
                                    <span>الأكواد الرقمية</span>
                                </a>
                            </li>
                            <li>
                                <a href="#settings" class="nav-link" onclick="switchSection('settings')">
                                    <i class="fas fa-cog"></i>
                                    <span>إعدادات الموقع</span>
                                </a>
                            </li>
                            <li>
                                <a href="#ads" class="nav-link" onclick="switchSection('ads')">
                                    <i class="fas fa-ad"></i>
                                    <span>الإعلانات</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    
                    <div class="nav-section">
                        <h3>إحصائيات سريعة</h3>
                        <div class="quick-stats">
                            <div class="stat-item">
                                <div class="stat-number" id="stat-products">0</div>
                                <div class="stat-label">المنتجات</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="stat-sales">0</div>
                                <div class="stat-label">المبيعات</div>
                            </div>
                            <div class="stat-item">
                                <div class="stat-number" id="stat-earnings">$0</div>
                                <div class="stat-label">الأرباح</div>
                            </div>
                        </div>
                    </div>
                </nav>
            </aside>
            
            <!-- المحتوى الرئيسي -->
            <main class="admin-main">
                <!-- قسم لوحة التحكم -->
                <section id="dashboard-section" class="admin-section active">
                    <div class="section-header">
                        <h2><i class="fas fa-tachometer-alt"></i> لوحة التحكم الرئيسية</h2>
                        <p>مرحباً بك في نظام إدارة متجر ماسكي</p>
                    </div>
                    
                    <div class="welcome-card">
                        <div class="welcome-content">
                            <h3>مرحباً بك في لوحة التحكم الذكية</h3>
                            <p>من هنا يمكنك إدارة جميع جوانب متجرك الإلكتروني بسهولة وأمان.</p>
                            <div class="welcome-actions">
                                <button class="btn btn-primary" onclick="switchSection('products')">
                                    <i class="fas fa-plus-circle"></i> إضافة منتج جديد
                                </button>
                                <button class="btn btn-secondary" onclick="switchSection('digital')">
                                    <i class="fas fa-database"></i> إدارة المخزون
                                </button>
                            </div>
                        </div>
                        <div class="welcome-image">
                            <i class="fas fa-chart-line"></i>
                        </div>
                    </div>
                    
                    <div class="stats-cards">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <div class="stat-icon primary">
                                    <i class="fas fa-box"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-number" id="total-products-card">0</div>
                                    <div class="stat-label">المنتجات النشطة</div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon success">
                                    <i class="fas fa-shopping-cart"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-number" id="total-orders">0</div>
                                    <div class="stat-label">الطلبات اليوم</div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon warning">
                                    <i class="fas fa-dollar-sign"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-number" id="total-revenue">$0</div>
                                    <div class="stat-label">الإيرادات</div>
                                </div>
                            </div>
                            
                            <div class="stat-card">
                                <div class="stat-icon danger">
                                    <i class="fas fa-users"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-number" id="total-customers">0</div>
                                    <div class="stat-label">العملاء</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                <!-- قسم المنتجات -->
                <section id="products-section" class="admin-section">
                    <div class="section-header">
                        <h2><i class="fas fa-box"></i> إدارة المنتجات</h2>
                        <p>أضف، عدل، أو احذف منتجات المتجر</p>
                    </div>
                    
                    <div class="section-actions">
                        <button class="btn btn-primary" onclick="showAddProductModal()">
                            <i class="fas fa-plus-circle"></i> إضافة منتج جديد
                        </button>
                        
                        <div class="search-box">
                            <input type="text" id="search-products-input" placeholder="ابحث عن منتج...">
                            <i class="fas fa-search"></i>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <div class="table-loading">
                            <div class="spinner"></div>
                            <p>جاري تحميل المنتجات...</p>
                        </div>
                        
                        <table class="data-table" style="display: none;">
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
                </section>
                
                <!-- قسم الأكواد الرقمية -->
                <section id="digital-section" class="admin-section">
                    <div class="section-header">
                        <h2><i class="fas fa-code"></i> إدارة الأكواد الرقمية</h2>
                        <p>أضف وأدر أكواد المنتجات الرقمية</p>
                    </div>
                    
                    <div class="digital-actions">
                        <div class="action-card">
                            <h3><i class="fas fa-upload"></i> إضافة أكواد</h3>
                            <textarea id="digital-codes-input" placeholder="ضع الأكواد هنا... سطر لكل كود"></textarea>
                            <button class="btn btn-success" onclick="addDigitalCodes()">
                                <i class="fas fa-save"></i> حفظ الأكواد
                            </button>
                        </div>
                        
                        <div class="action-card">
                            <h3><i class="fas fa-database"></i> إحصائيات المخزون</h3>
                            <div class="inventory-stats" id="inventory-stats">
                                <!-- سيتم تعبئته بالإحصائيات -->
                            </div>
                        </div>
                    </div>
                    
                    <div class="table-container">
                        <table class="data-table">
                            <thead>
                                <tr>
                                    <th>الكود</th>
                                    <th>النوع</th>
                                    <th>القيمة</th>
                                    <th>الحالة</th>
                                    <th>التاريخ</th>
                                    <th>الإجراءات</th>
                                </tr>
                            </thead>
                            <tbody id="digital-table-body">
                                <!-- سيتم تعبئته بالبيانات -->
                            </tbody>
                        </table>
                    </div>
                </section>
                
                <!-- قسم إعدادات الموقع -->
                <section id="settings-section" class="admin-section">
                    <div class="section-header">
                        <h2><i class="fas fa-cog"></i> إعدادات الموقع</h2>
                        <p>عدل إعدادات متجرك الإلكتروني</p>
                    </div>
                    
                    <div class="settings-form">
                        <div class="form-group">
                            <label for="site-name"><i class="fas fa-store"></i> اسم المتجر</label>
                            <input type="text" id="site-name" value="ماسكي">
                        </div>
                        
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contact-phone"><i class="fas fa-phone"></i> رقم التواصل</label>
                                <input type="text" id="contact-phone" value="+966 123 456 789">
                            </div>
                            
                            <div class="form-group">
                                <label for="contact-email"><i class="fas fa-envelope"></i> البريد الإلكتروني</label>
                                <input type="email" id="contact-email" value="info@maski.store">
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="site-description"><i class="fas fa-align-left"></i> وصف المتجر</label>
                            <textarea id="site-description" rows="4">متجر متخصص في بيع المنتجات الرقمية</textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="admin-password-change"><i class="fas fa-lock"></i> تغيير كلمة المرور</label>
                            <input type="password" id="admin-password-change" placeholder="كلمة المرور الجديدة">
                            <input type="password" id="admin-password-confirm" placeholder="تأكيد كلمة المرور" style="margin-top: 10px;">
                        </div>
                        
                        <button class="btn btn-primary" onclick="saveSiteSettings()">
                            <i class="fas fa-save"></i> حفظ الإعدادات
                        </button>
                    </div>
                </section>
                
                <!-- قسم الإعلانات -->
                <section id="ads-section" class="admin-section">
                    <div class="section-header">
                        <h2><i class="fas fa-ad"></i> إدارة الإعلانات</h2>
                        <p>أدر إعلانات A-ADS و Adstera</p>
                    </div>
                    
                    <div class="ads-tabs">
                        <div class="tab-buttons">
                            <button class="tab-btn active" onclick="switchAdsTab('aads')">A-ADS</button>
                            <button class="tab-btn" onclick="switchAdsTab('adstera')">Adstera</button>
                        </div>
                        
                        <div class="tab-content">
                            <!-- تبويب A-ADS -->
                            <div id="aads-tab" class="tab-pane active">
                                <div class="form-group">
                                    <label>كود الهيدر (728x90)</label>
                                    <textarea id="aads-header-code" class="code-editor"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label>كود الشريط الجانبي (300x250)</label>
                                    <textarea id="aads-sidebar-code" class="code-editor"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label>كود الفوتر (468x60)</label>
                                    <textarea id="aads-footer-code" class="code-editor"></textarea>
                                </div>
                            </div>
                            
                            <!-- تبويب Adstera -->
                            <div id="adstera-tab" class="tab-pane">
                                <div class="form-group">
                                    <label>كود الهيدر (728x90)</label>
                                    <textarea id="adstera-header-code" class="code-editor"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label>كود الشريط الجانبي (300x250)</label>
                                    <textarea id="adstera-sidebar-code" class="code-editor"></textarea>
                                </div>
                                
                                <div class="form-group">
                                    <label>كود الفوتر (468x60)</label>
                                    <textarea id="adstera-footer-code" class="code-editor"></textarea>
                                </div>
                            </div>
                        </div>
                        
                        <button class="btn btn-success" onclick="saveAdsSettings()">
                            <i class="fas fa-save"></i> حفظ إعدادات الإعلانات
                        </button>
                    </div>
                </section>
            </main>
            
            <!-- الفوتر -->
            <footer class="admin-footer">
                <p>© 2024 متجر ماسكي | لوحة التحكم الذكية | الإصدار 2.0</p>
                <p class="footer-info">
                    <span id="login-time">آخر دخول: ${new Date().toLocaleString('ar-SA')}</span>
                </p>
            </footer>
            
            <!-- رسائل التنبيه -->
            <div id="message-container"></div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
}

// =========== الحصول على الأنماط ===========
function getAdminStyles() {
    return `
        <style>
            /* الأنماط الأساسية */
            :root {
                --primary: #4f46e5;
                --primary-dark: #4338ca;
                --primary-light: #e0e7ff;
                --secondary: #7c3aed;
                --success: #10b981;
                --warning: #f59e0b;
                --danger: #ef4444;
                --dark: #1e293b;
                --light: #f8fafc;
                --gray: #64748b;
                --border: #e2e8f0;
                --radius: 12px;
                --shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: 'Cairo', sans-serif;
            }
            
            body {
                background: var(--light);
                color: var(--dark);
            }
            
            /* الهيدر */
            .admin-header {
                background: white;
                box-shadow: var(--shadow);
                position: fixed;
                top: 0;
                right: 0;
                width: 100%;
                z-index: 1000;
                height: 70px;
            }
            
            .admin-nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 30px;
                height: 100%;
            }
            
            .admin-brand {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .admin-logo {
                font-size: 2rem;
                font-weight: 900;
                background: linear-gradient(45deg, var(--primary), var(--secondary));
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }
            
            .admin-actions {
                display: flex;
                align-items: center;
                gap: 20px;
            }
            
            .admin-user {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            
            .user-avatar {
                width: 45px;
                height: 45px;
                background: var(--primary-light);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--primary);
                font-size: 1.2rem;
            }
            
            .logout-btn {
                padding: 10px 25px;
                background: var(--danger);
                color: white;
                border: none;
                border-radius: var(--radius);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .logout-btn:hover {
                background: #dc2626;
                transform: translateY(-2px);
            }
            
            /* الشريط الجانبي */
            .admin-sidebar {
                position: fixed;
                top: 70px;
                right: 0;
                width: 280px;
                height: calc(100vh - 70px);
                background: white;
                box-shadow: var(--shadow);
                padding: 25px 0;
                overflow-y: auto;
            }
            
            .sidebar-nav {
                padding: 0 20px;
            }
            
            .nav-section {
                margin-bottom: 30px;
            }
            
            .nav-section h3 {
                color: var(--gray);
                font-size: 0.9rem;
                font-weight: 600;
                text-transform: uppercase;
                margin-bottom: 15px;
                padding-right: 15px;
            }
            
            .nav-links {
                list-style: none;
            }
            
            .nav-link {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 15px 20px;
                color: var(--dark);
                text-decoration: none;
                border-radius: var(--radius);
                margin-bottom: 5px;
                transition: all 0.3s ease;
            }
            
            .nav-link:hover,
            .nav-link.active {
                background: var(--primary-light);
                color: var(--primary);
            }
            
            .nav-link i {
                width: 20px;
                text-align: center;
            }
            
            /* المحتوى الرئيسي */
            .admin-main {
                margin-right: 280px;
                margin-top: 70px;
                padding: 30px;
                min-height: calc(100vh - 70px);
            }
            
            .admin-section {
                display: none;
                animation: fadeIn 0.3s ease;
            }
            
            .admin-section.active {
                display: block;
            }
            
            .section-header {
                margin-bottom: 30px;
            }
            
            .section-header h2 {
                font-size: 1.8rem;
                color: var(--dark);
                display: flex;
                align-items: center;
                gap: 15px;
                margin-bottom: 10px;
            }
            
            .section-header p {
                color: var(--gray);
            }
            
            /* البطاقات */
            .welcome-card {
                background: linear-gradient(135deg, var(--primary), var(--secondary));
                color: white;
                padding: 40px;
                border-radius: var(--radius);
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 30px;
            }
            
            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .stat-card {
                background: white;
                padding: 25px;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                display: flex;
                align-items: center;
                gap: 20px;
                transition: all 0.3s ease;
            }
            
            .stat-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            }
            
            .stat-icon {
                width: 60px;
                height: 60px;
                border-radius: var(--radius);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: white;
            }
            
            .stat-icon.primary { background: var(--primary); }
            .stat-icon.success { background: var(--success); }
            .stat-icon.warning { background: var(--warning); }
            .stat-icon.danger { background: var(--danger); }
            
            .stat-number {
                font-size: 2rem;
                font-weight: 800;
                color: var(--dark);
            }
            
            /* الجداول */
            .table-container {
                background: white;
                border-radius: var(--radius);
                box-shadow: var(--shadow);
                padding: 20px;
                overflow-x: auto;
            }
            
            .data-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .data-table th {
                background: var(--light);
                padding: 18px 15px;
                text-align: right;
                font-weight: 600;
                color: var(--dark);
                border-bottom: 2px solid var(--border);
            }
            
            .data-table td {
                padding: 15px;
                border-bottom: 1px solid var(--border);
                color: var(--gray);
            }
            
            .data-table tr:hover {
                background: var(--light);
            }
            
            /* الأزرار */
            .btn {
                padding: 12px 25px;
                border: none;
                border-radius: var(--radius);
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }
            
            .btn-primary {
                background: var(--primary);
                color: white;
            }
            
            .btn-primary:hover {
                background: var(--primary-dark);
                transform: translateY(-2px);
            }
            
            .btn-secondary {
                background: var(--light);
                color: var(--dark);
                border: 1px solid var(--border);
            }
            
            .btn-success {
                background: var(--success);
                color: white;
            }
            
            /* النماذج */
            .form-group {
                margin-bottom: 25px;
                text-align: right;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 10px;
                font-weight: 600;
                color: var(--dark);
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .form-group input,
            .form-group textarea,
            .form-group select {
                width: 100%;
                padding: 15px 20px;
                border: 2px solid var(--border);
                border-radius: var(--radius);
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }
            
            .form-group input:focus,
            .form-group textarea:focus {
                border-color: var(--primary);
                outline: none;
                box-shadow: 0 0 0 3px var(--primary-light);
            }
            
            .code-editor {
                font-family: 'Courier New', monospace;
                font-size: 14px;
                min-height: 150px;
                resize: vertical;
            }
            
            /* رسائل التنبيه */
            #message-container {
                position: fixed;
                top: 90px;
                left: 20px;
                z-index: 9999;
                max-width: 400px;
            }
            
            .message {
                padding: 15px 25px;
                border-radius: var(--radius);
                margin-bottom: 10px;
                animation: slideIn 0.3s ease;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: var(--shadow);
            }
            
            .message.success {
                background: var(--success);
                color: white;
            }
            
            .message.error {
                background: var(--danger);
                color: white;
            }
            
            .message.info {
                background: var(--primary);
                color: white;
            }
            
            /* التحميل */
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid var(--border);
                border-top-color: var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            
            /* تصميم متجاوب */
            @media (max-width: 1024px) {
                .admin-sidebar {
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                }
                
                .sidebar-open .admin-sidebar {
                    transform: translateX(0);
                }
                
                .admin-main {
                    margin-right: 0;
                }
            }
            
            @media (max-width: 768px) {
                .admin-nav {
                    padding: 0 15px;
                }
                
                .admin-main {
                    padding: 20px;
                }
                
                .stats-grid {
                    grid-template-columns: 1fr;
                }
                
                .welcome-card {
                    flex-direction: column;
                    text-align: center;
                    gap: 20px;
                }
            }
        </style>
    `;
}

// =========== تهيئة لوحة التحكم ===========
async function initAdminDashboard() {
    console.log('⚙️ تهيئة لوحة التحكم...');
    
    // تحميل الإحصائيات
    await loadDashboardStats();
    
    // تحميل المنتجات
    await loadProductsList();
    
    // تحميل الإعدادات
    loadSettings();
    
    // تحميل الإعلانات
    loadAdsSettings();
    
    console.log('✅ تم تهيئة لوحة التحكم');
}

// =========== تحميل الإحصائيات ===========
async function loadDashboardStats() {
    try {
        // عدد المنتجات
        const { count: productsCount } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('active', true);
        
        // تحديث العداد
        document.getElementById('stat-products').textContent = productsCount || 0;
        document.getElementById('total-products-card').textContent = productsCount || 0;
        
        // يمكنك إضافة المزيد من الإحصائيات هنا
        
    } catch (error) {
        console.error('❌ خطأ في تحميل الإحصائيات:', error);
    }
}

// =========== تحميل قائمة المنتجات ===========
async function loadProductsList() {
    const tbody = document.getElementById('products-table-body');
    const loading = document.querySelector('.table-loading');
    const table = document.querySelector('.data-table');
    
    if (!tbody) return;
    
    try {
        const { data: products, error } = await supabase
            .from('products')
            .select('*, categories(name)')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // إخفاء التحميل وإظهار الجدول
        if (loading) loading.style.display = 'none';
        if (table) table.style.display = 'table';
        
        tbody.innerHTML = '';
        
        if (!products || products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: var(--gray);">
                        <i class="fas fa-box-open" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <p>لا توجد منتجات بعد</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // عرض المنتجات
        products.forEach((product, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>
                    <div style="width: 50px; height: 50px; background: linear-gradient(135deg, var(--primary), var(--secondary)); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white;">
                        <i class="fas fa-box"></i>
                    </div>
                </td>
                <td style="font-weight: 600;">${product.title}</td>
                <td>
                    <span style="background: var(--primary-light); color: var(--primary); padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                        ${product.categories?.name || 'عام'}
                    </span>
                </td>
                <td style="font-weight: 700; color: var(--success);">${product.price}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <span style="background: ${product.active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'}; 
                          color: ${product.active ? '#065f46' : '#991b1b'}; 
                          padding: 5px 15px; 
                          border-radius: 20px;
                          font-size: 0.9rem;">
                        ${product.active ? 'نشط' : 'غير نشط'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-secondary btn-sm" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('❌ خطأ في تحميل المنتجات:', error);
        tbody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 40px; color: var(--danger);">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>حدث خطأ في تحميل البيانات</p>
                </td>
            </tr>
        `;
    }
}

// =========== تحميل الإعدادات ===========
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('maski-settings')) || {
        siteName: 'ماسكي',
        contactPhone: '+966 123 456 789',
        contactEmail: 'info@maski.store',
        siteDescription: 'متجر متخصص في بيع المنتجات الرقمية'
    };
    
    // تعبئة الحقول
    document.getElementById('site-name').value = settings.siteName;
    document.getElementById('contact-phone').value = settings.contactPhone;
    document.getElementById('contact-email').value = settings.contactEmail;
    document.getElementById('site-description').value = settings.siteDescription;
}

// =========== تحميل إعدادات الإعلانات ===========
function loadAdsSettings() {
    // A-ADS
    document.getElementById('aads-header-code').value = localStorage.getItem('maski-aads-header') || '';
    document.getElementById('aads-sidebar-code').value = localStorage.getItem('maski-aads-sidebar') || '';
    document.getElementById('aads-footer-code').value = localStorage.getItem('maski-aads-footer') || '';
    
    // Adstera
    document.getElementById('adstera-header-code').value = localStorage.getItem('maski-adstera-header') || '';
    document.getElementById('adstera-sidebar-code').value = localStorage.getItem('maski-adstera-sidebar') || '';
    document.getElementById('adstera-footer-code').value = localStorage.getItem('maski-adstera-footer') || '';
}

// =========== تبديل الأقسام ===========
function switchSection(sectionId) {
    // إخفاء جميع الأقسام
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // إزالة النشط من جميع الروابط
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // إظهار القسم المحدد
    const targetSection = document.getElementById(`${sectionId}-section`);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // إضافة النشط للرابط المحدد
    const targetLink = document.querySelector(`[onclick="switchSection('${sectionId}')"]`);
    if (targetLink) {
        targetLink.classList.add('active');
    }
    
    // تحميل بيانات القسم إذا لزم
    if (sectionId === 'products') {
        loadProductsList();
    }
}

// =========== حفظ إعدادات الموقع ===========
function saveSiteSettings() {
    const settings = {
        siteName: document.getElementById('site-name').value,
        contactPhone: document.getElementById('contact-phone').value,
        contactEmail: document.getElementById('contact-email').value,
        siteDescription: document.getElementById('site-description').value,
        updatedAt: new Date().toISOString()
    };
    
    // حفظ في LocalStorage
    localStorage.setItem('maski-settings', JSON.stringify(settings));
    
    // عرض رسالة نجاح
    showMessage('✅ تم حفظ الإعدادات بنجاح', 'success');
}

// =========== حفظ إعدادات الإعلانات ===========
function saveAdsSettings() {
    // حفظ A-ADS
    localStorage.setItem('maski-aads-header', document.getElementById('aads-header-code').value);
    localStorage.setItem('maski-aads-sidebar', document.getElementById('aads-sidebar-code').value);
    localStorage.setItem('maski-aads-footer', document.getElementById('aads-footer-code').value);
    
    // حفظ Adstera
    localStorage.setItem('maski-adstera-header', document.getElementById('adstera-header-code').value);
    localStorage.setItem('maski-adstera-sidebar', document.getElementById('adstera-sidebar-code').value);
    localStorage.setItem('maski-adstera-footer', document.getElementById('adstera-footer-code').value);
    
    showMessage('✅ تم حفظ إعدادات الإعلانات بنجاح', 'success');
}

// =========== عرض رسائل التنبيه ===========
function showMessage(text, type = 'info') {
    const container = document.getElementById('message-container');
    if (!container) return;
    
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'ch
