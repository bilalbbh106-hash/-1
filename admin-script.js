// تهيئة لوحة التحكم
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من حالة تسجيل الدخول
    checkLoginStatus();
    
    // تهيئة الأحداث
    initAdminEvents();
    
    // تحميل البيانات
    loadAdminData();
});

// التحقق من حالة تسجيل الدخول
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('maski-admin-logged-in') === 'true';
    
    if (isLoggedIn) {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
    } else {
        document.getElementById('login-page').style.display = 'flex';
        document.getElementById('dashboard').style.display = 'none';
    }
}

// تسجيل الدخول
document.getElementById('login-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = document.getElementById('password').value;
    const errorElement = document.getElementById('login-error');
    
    // التحقق من كلمة المرور
    if (password === 'Maski2026') {
        // تسجيل الدخول الناجح
        localStorage.setItem('maski-admin-logged-in', 'true');
        checkLoginStatus();
    } else {
        // عرض خطأ
        errorElement.textContent = 'كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.';
        errorElement.style.display = 'block';
        
        // إخفاء الخطأ بعد 5 ثوانٍ
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
});

// إظهار/إخفاء كلمة المرور
document.getElementById('toggle-password')?.addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
});

// تسجيل الخروج
document.getElementById('logout-btn')?.addEventListener('click', function() {
    localStorage.removeItem('maski-admin-logged-in');
    checkLoginStatus();
});

// تهيئة أحداث لوحة التحكم
function initAdminEvents() {
    // التنقل بين الأقسام
    document.querySelectorAll('.admin-nav a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // إزالة النشط من جميع الروابط
            document.querySelectorAll('.admin-nav a').forEach(item => {
                item.classList.remove('active');
            });
            
            // إضافة النشط للرابط الحالي
            this.classList.add('active');
            
            // إخفاء جميع الأقسام
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            // إظهار القسم المحدد
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });
    
    // رفع الصور
    initImageUpload();
    
    // إضافة منشور
    document.getElementById('add-post-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        addNewPost();
    });
    
    // مسح نموذج إضافة المنشور
    document.getElementById('reset-form')?.addEventListener('click', function() {
        document.getElementById('add-post-form').reset();
        document.getElementById('image-preview').innerHTML = '';
        document.getElementById('post-images-input').value = '';
    });
    
    // إضافة مسابقة
    document.getElementById('add-contest-btn')?.addEventListener('click', function() {
        openContestModal();
    });
    
    // حفظ إعدادات الموقع
    document.getElementById('site-settings-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveSiteSettings();
    });
    
    // إغلاق النافذة المنبثقة
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('active');
            });
        });
    });
    
    // حفظ المسابقة
    document.getElementById('contest-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        saveContest();
    });
}

// تحميل بيانات لوحة التحكم
function loadAdminData() {
    // تحديث الإحصائيات
    updateStats();
    
    // تحميل المنشورات
    loadPosts();
    
    // تحميل المنتجات
    loadProductsAdmin();
    
    // تحميل المسابقات
    loadContestsAdmin();
}

// تحديث الإحصائيات
function updateStats() {
    // هنا يمكن جلب البيانات الفعلية من قاعدة البيانات
    const totalPosts = 8; // عدد افتراضي
    const totalProducts = 8; // عدد افتراضي
    const totalContests = 3; // عدد افتراضي
    
    document.getElementById('total-posts').textContent = totalPosts;
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-contests').textContent = totalContests;
}

// تهيئة رفع الصور
function initImageUpload() {
    const dropArea = document.getElementById('image-drop-area');
    const fileInput = document.getElementById('post-images-input');
    const preview = document.getElementById('image-preview');
    
    if (!dropArea || !fileInput || !preview) return;
    
    // فتح ملف عند النقر على منطقة الرفع
    dropArea.addEventListener('click', function() {
        fileInput.click();
    });
    
    // معالجة اختيار الملفات
    fileInput.addEventListener('change', function() {
        handleFiles(this.files);
    });
    
    // منع السلوك الافتراضي للسحب
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    // إضافة تأثيرات عند السحب
    ['dragenter', 'dragover'].forEach(eventName => {
        dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
        dropArea.style.borderColor = '#8e2de2';
        dropArea.style.backgroundColor = 'rgba(142, 45, 226, 0.05)';
    }
    
    function unhighlight() {
        dropArea.style.borderColor = '#ccc';
        dropArea.style.backgroundColor = '';
    }
    
    // معالجة الملفات المسقطة
    dropArea.addEventListener('drop', function(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    });
    
    // معالجة الملفات المحددة
    function handleFiles(files) {
        // التحقق من عدد الصور
        const existingImages = preview.querySelectorAll('.image-preview-item').length;
        const remainingSlots = 7 - existingImages;
        
        if (files.length > remainingSlots) {
            alert(`يمكنك رفع ${remainingSlots} صور كحد أقصى. لديك بالفعل ${existingImages} صور.`);
            return;
        }
        
        // عرض معاينة الصور
        for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
            const file = files[i];
            
            // التحقق من نوع الملف
            if (!file.type.startsWith('image/')) continue;
            
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const imgSrc = e.target.result;
                
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${imgSrc}" alt="معاينة الصورة">
                    <div class="remove-image" title="حذف الصورة">
                        <i class="fas fa-times"></i>
                    </div>
                `;
                
                preview.appendChild(previewItem);
                
                // إضافة حدث حذف الصورة
                previewItem.querySelector('.remove-image').addEventListener('click', function() {
                    previewItem.remove();
                });
            };
            
            reader.readAsDataURL(file);
        }
    }
}

// إضافة منشور جديد
function addNewPost() {
    const title = document.getElementById('post-title').value;
    const categoryId = document.getElementById('post-category').value;
    const price = document.getElementById('post-price').value;
    const description = document.getElementById('post-description').value;
    
    // التحقق من صحة البيانات
    if (!title || !categoryId || !description) {
        alert('الرجاء ملء جميع الحقول المطلوبة (العنوان، القسم، الوصف)');
        return;
    }
    
    // إضافة النشاط إلى قائمة النشاطات
    addActivity(`تم إضافة منشور جديد: "${title}"`);
    
    // تحديث الإحصائيات
    updateStats();
    
    // إعادة تعيين النموذج
    document.getElementById('add-post-form').reset();
    document.getElementById('image-preview').innerHTML = '';
    document.getElementById('post-images-input').value = '';
    
    // عرض رسالة نجاح
    alert('تم إضافة المنشور بنجاح!');
    
    // تحميل المنشورات مرة أخرى
    loadPosts();
}

// تحميل المنشورات
function loadPosts() {
    const tableBody = document.getElementById('posts-table-body');
    
    if (!tableBody) return;
    
    // هنا يمكن جلب البيانات الفعلية من قاعدة البيانات
    // في هذا المثال، سنستخدم بيانات افتراضية
    const posts = [
        { id: 1, title: 'حساب فري فاير مستوى 70', category: 'حسابات فري فاير', price: '299 ر.س', date: '2026-01-01' },
        { id: 2, title: 'حساب فري فاير مستوى 50', category: 'حسابات فري فاير', price: '199 ر.س', date: '2026-01-02' },
        { id: 3, title: 'شحن رصيد STC 100 ريال', category: 'عروض الشحن', price: '90 ر.س', date: '2026-01-03' },
        { id: 4, title: 'شحن رصيد موبايلي 50 ريال', category: 'عروض الشحن', price: '45 ر.س', date: '2026-01-04' },
        { id: 5, title: '1000 متابع انستقرام', category: 'خدمات وسائل التواصل', price: '49 ر.س', date: '2026-01-05' },
        { id: 6, title: '5000 إعجاب فيسبوك', category: 'خدمات وسائل التواصل', price: '79 ر.س', date: '2026-01-06' },
        { id: 7, title: 'مسابقة حساب فري فاير مجاني', category: 'المسابقات', price: 'مجاني', date: '2026-01-07' },
        { id: 8, title: 'مسابقة 1000 ريال نقداً', category: 'المسابقات', price: 'مجاني', date: '2026-01-08' }
    ];
    
    tableBody.innerHTML = '';
    
    if (posts.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">لا توجد منشورات بعد. أضف أول منشور من قسم "إضافة منشور".</td>
            </tr>
        `;
        return;
    }
    
    posts.forEach((post, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img src="https://via.placeholder.com/60x60/4a00e0/ffffff?text=صورة" class="post-image" alt="صورة المنتج"></td>
            <td>${post.title}</td>
            <td><span class="product-card-category">${post.category}</span></td>
            <td>${post.price}</td>
            <td>${post.date}</td>
            <td>
                <div class="table-actions">
                    <button class="edit-btn" data-id="${post.id}">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="delete-btn" data-id="${post.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // إضافة أحداث أزرار التعديل والحذف
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.id;
            editPost(postId);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const postId = this.dataset.id;
            if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
                deletePost(postId);
            }
        });
    });
}

// تحميل المنتجات في لوحة التحكم
function loadProductsAdmin() {
    const productsGrid = document.getElementById('products-grid-admin');
    
    if (!productsGrid) return;
    
    // هنا يمكن جلب البيانات الفعلية من قاعدة البيانات
    // في هذا المثال، سنستخدم بيانات افتراضية
    const products = [
        { id: 1, title: 'حساب فري فاير مستوى 70', category: 'حسابات فري فاير', price: '299 ر.س' },
        { id: 2, title: 'حساب فري فاير مستوى 50', category: 'حسابات فري فاير', price: '199 ر.س' },
        { id: 3, title: 'شحن رصيد STC 100 ريال', category: 'عروض الشحن', price: '90 ر.س' },
        { id: 4, title: 'شحن رصيد موبايلي 50 ريال', category: 'عروض الشحن', price: '45 ر.س' },
        { id: 5, title: '1000 متابع انستقرام', category: 'خدمات وسائل التواصل', price: '49 ر.س' },
        { id: 6, title: '5000 إعجاب فيسبوك', category: 'خدمات وسائل التواصل', price: '79 ر.س' },
        { id: 7, title: 'مسابقة حساب فري فاير مجاني', category: 'المسابقات', price: 'مجاني' },
        { id: 8, title: 'مسابقة 1000 ريال نقداً', category: 'المسابقات', price: 'مجاني' }
    ];
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card-admin';
        productCard.innerHTML = `
            <img src="https://via.placeholder.com/300x180/4a00e0/ffffff?text=${encodeURIComponent(product.title)}" alt="${product.title}">
            <div class="product-card-content">
                <h3 class="product-card-title">${product.title}</h3>
                <div class="product-card-category">${product.category}</div>
                <div class="product-card-price">${product.price}</div>
                <div class="product-card-actions">
                    <button class="btn btn-primary" data-id="${product.id}">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-secondary" data-id="${product.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

// تحميل المسابقات في لوحة التحكم
function loadContestsAdmin() {
    const contestsList = document.getElementById('contests-list-admin');
    
    if (!contestsList) return;
    
    // هنا يمكن جلب البيانات الفعلية من قاعدة البيانات
    const contests = [
        { id: 1, title: 'مسابقة حساب فري فاير مجاني', date: 'ينتهي في 15 ديسمبر 2026', description: 'شارك في المسابقة لربح حساب فري فاير مستوى 80 مع جميع الأبطال النادرين و 50000 ماسة مجاناً.', prize: 'حساب فري فاير مستوى 80' },
        { id: 2, title: 'مسابقة 1000 ريال نقداً', date: 'ينتهي في 31 ديسمبر 2026', description: 'احصل على فرصة ربح 1000 ريال نقداً. فقط اشترك في قناتنا على التليجرام وقم بدعوة 10 أصدقاء للانضمام.', prize: '1000 ريال نقداً' },
        { id: 3, title: 'مسابقة شحن رصيد مجاني', date: 'ينتهي في 10 يناير 2027', description: 'شارك في المسابقة لربح شحن رصيد بقيمة 500 ريال لأي شبكة اتصال تختارها.', prize: '500 ريال شحن رصيد' }
    ];
    
    contestsList.innerHTML = '';
    
    contests.forEach(contest => {
        const contestCard = document.createElement('div');
        contestCard.className = 'contest-card-admin';
        contestCard.innerHTML = `
            <div class="contest-card-header">
                <h3 class="contest-card-title">${contest.title}</h3>
                <div class="contest-card-date">${contest.date}</div>
            </div>
            <div class="contest-card-body">
                <p class="contest-card-description">${contest.description}</p>
                <div class="contest-card-prize">
                    <i class="fas fa-trophy"></i>
                    <span>${contest.prize}</span>
                </div>
                <div class="contest-card-actions">
                    <button class="btn btn-primary edit-contest" data-id="${contest.id}">
                        <i class="fas fa-edit"></i> تعديل
                    </button>
                    <button class="btn btn-secondary delete-contest" data-id="${contest.id}">
                        <i class="fas fa-trash"></i> حذف
                    </button>
                </div>
            </div>
        `;
        
        contestsList.appendChild(contestCard);
    });
    
    // إضافة أحداث أزرار المسابقات
    document.querySelectorAll('.edit-contest').forEach(btn => {
        btn.addEventListener('click', function() {
            const contestId = this.dataset.id;
            editContest(contestId);
        });
    });
    
    document.querySelectorAll('.delete-contest').forEach(btn => {
        btn.addEventListener('click', function() {
            const contestId = this.dataset.id;
            if (confirm('هل أنت متأكد من حذف هذه المسابقة؟')) {
                deleteContest(contestId);
            }
        });
    });
}

// فتح نافذة تعديل/إضافة مسابقة
function openContestModal(contestId = null) {
    const modal = document.getElementById('contest-modal');
    const form = document.getElementById('contest-form');
    
    if (contestId) {
        // وضع التعديل - تحميل بيانات المسابقة
        // هنا يمكن جلب بيانات المسابقة من قاعدة البيانات
        document.getElementById('contest-id').value = contestId;
        document.getElementById('contest-title').value = `مسابقة ${contestId}`;
        document.getElementById('contest-date').value = 'ينتهي في 31 ديسمبر 2026';
        document.getElementById('contest-description').value = 'وصف المسابقة هنا...';
        document.getElementById('contest-prize').value = 'جائزة المسابقة';
    } else {
        // وضع الإضافة - تفريغ النموذج
        form.reset();
        document.getElementById('contest-id').value = '';
    }
    
    modal.classList.add('active');
}

// حفظ المسابقة
function saveContest() {
    const contestId = document.getElementById('contest-id').value;
    const title = document.getElementById('contest-title').value;
    const date = document.getElementById('contest-date').value;
    const description = document.getElementById('contest-description').value;
    const prize = document.getElementById('contest-prize').value;
    
    // التحقق من صحة البيانات
    if (!title || !date || !description || !prize) {
        alert('الرجاء ملء جميع الحقول المطلوبة');
        return;
    }
    
    // إضافة النشاط
    const action = contestId ? 'تعديل' : 'إضافة';
    addActivity(`تم ${action} مسابقة: "${title}"`);
    
    // إغلاق النافذة المنبثقة
    document.getElementById('contest-modal').classList.remove('active');
    
    // عرض رسالة نجاح
    alert(`تم ${action} المسابقة بنجاح!`);
    
    // تحديث قائمة المسابقات
    loadContestsAdmin();
    updateStats();
}

// تعديل منشور
function editPost(postId) {
    // هنا يمكن فتح نافذة أو نموذج لتعديل المنشور
    alert(`سيتم فتح نافذة لتعديل المنشور رقم ${postId}`);
    // في التطبيق الكامل، ستقوم بجلب بيانات المنشور وعرضها في نموذج التعديل
}

// حذف منشور
function deletePost(postId) {
    // هنا يمكن إرسال طلب حذف إلى قاعدة البيانات
    addActivity(`تم حذف منشور رقم ${postId}`);
    alert(`تم حذف المنشور رقم ${postId}`);
    
    // تحديث قائمة المنشورات
    loadPosts();
    updateStats();
}

// تعديل مسابقة
function editContest(contestId) {
    openContestModal(contestId);
}

// حذف مسابقة
function deleteContest(contestId) {
    // هنا يمكن إرسال طلب حذف إلى قاعدة البيانات
    addActivity(`تم حذف مسابقة رقم ${contestId}`);
    alert(`تم حذف المسابقة رقم ${contestId}`);
    
    // تحديث قائمة المسابقات
    loadContestsAdmin();
    updateStats();
}

// حفظ إعدادات الموقع
function saveSiteSettings() {
    const siteTitle = document.getElementById('site-title').value;
    const siteDescription = document.getElementById('site-description').value;
    const contactPhone = document.getElementById('contact-phone').value;
    const contactEmail = document.getElementById('contact-email').value;
    const aAdsCode = document.getElementById('a-ads-code').value;
    const adsteraCode = document.getElementById('adstera-code').value;
    const adminPassword = document.getElementById('admin-password').value;
    
    // هنا يمكن حفظ الإعدادات في قاعدة البيانات
    
    // إضافة النشاط
    addActivity('تم تحديث إعدادات الموقع');
    
    // عرض رسالة نجاح
    alert('تم حفظ الإعدادات بنجاح!');
    
    // إذا تم تغيير كلمة المرور
    if (adminPassword) {
        // هنا يمكن تحديث كلمة المرور في قاعدة البيانات
        alert('تم تحديث كلمة المرور');
    }
}

// إضافة نشاط إلى قائمة النشاطات
function addActivity(text) {
    const activityList = document.getElementById('activity-list');
    
    if (!activityList) return;
    
    const now = new Date();
    const timeString = now.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    activityItem.innerHTML = `
        <div class="activity-icon">
            <i class="fas fa-check-circle"></i>
        </div>
        <div class="activity-content">
            <p>${text}</p>
        </div>
        <div class="activity-time">${timeString}</div>
    `;
    
    // إضافة النشاط في الأعلى
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // الاحتفاظ بـ 5 نشاطات فقط
    const items = activityList.querySelectorAll('.activity-item');
    if (items.length > 5) {
        activityList.removeChild(items[items.length - 1]);
    }
      }
