// تهيئة الموقع
document.addEventListener('DOMContentLoaded', function() {
    // إخفاء شاشة التحميل بعد 2 ثانية
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
    }, 2000);

    // تهيئة بيانات المتجر
    initStore();
    
    // تهيئة الأقسام القابلة للسحب
    initCategoriesSlider();
    
    // تحميل المنتجات
    loadProducts();
    
    // تحميل المسابقات
    loadContests();
    
    // تهيئة القائمة المتحركة للهواتف
    initMobileMenu();
    
    // تهيئة الأحداث
    initEvents();
    
    // إدراج الإعلانات
    insertAds();
});

// بيانات المتجر
const storeData = {
    categories: [
        {
            id: 1,
            name: "حسابات فري فاير",
            icon: "fas fa-gamepad",
            description: "أفضل الحسابات بأعلى المستويات وأرخص الأسعار",
            color: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)"
        },
        {
            id: 2,
            name: "عروض الشحن",
            icon: "fas fa-bolt",
            description: "عروض شحن رصيد مميزة بخصومات تصل إلى 30%",
            color: "linear-gradient(135deg, #ff4d94 0%, #ff8e53 100%)"
        },
        {
            id: 3,
            name: "خدمات وسائل التواصل",
            icon: "fas fa-users",
            description: "تعزيز ورفع متابعين لحسابات السوشيال ميديا",
            color: "linear-gradient(135deg, #00b09b 0%, #96c93d 100%)"
        },
        {
            id: 4,
            name: "المسابقات",
            icon: "fas fa-trophy",
            description: "شارك في مسابقاتنا واربح جوائز قيمة",
            color: "linear-gradient(135deg, #8e2de2 0%, #4a00e0 100%)"
        }
    ],
    products: [
        {
            id: 1,
            categoryId: 1,
            title: "حساب فري فاير مستوى 70",
            description: "حساب فري فاير مميز بمستوى 70 مع 10 أبطال نادرين و20000 ماسة",
            price: "299 ر.س",
            image: "https://via.placeholder.com/400x300/6a11cb/ffffff?text=Free+Fire+Account",
            badge: "الأكثر طلباً"
        },
        {
            id: 2,
            categoryId: 1,
            title: "حساب فري فاير مستوى 50",
            description: "حساب فري فاير بمستوى 50 مع 5 أبطال و10000 ماسة",
            price: "199 ر.س",
            image: "https://via.placeholder.com/400x300/2575fc/ffffff?text=Free+Fire+Account",
            badge: "عرض خاص"
        },
        {
            id: 3,
            categoryId: 2,
            title: "شحن رصيد STC 100 ريال",
            description: "شحن رصيد STC بقيمة 100 ريال بسعر 90 ريال فقط",
            price: "90 ر.س",
            image: "https://via.placeholder.com/400x300/ff4d94/ffffff?text=STC+Charge",
            badge: "تخفيض 10%"
        },
        {
            id: 4,
            categoryId: 2,
            title: "شحن رصيد موبايلي 50 ريال",
            description: "شحن رصيد موبايلي بقيمة 50 ريال بسعر 45 ريال فقط",
            price: "45 ر.س",
            image: "https://via.placeholder.com/400x300/ff8e53/ffffff?text=Mobily+Charge",
            badge: "تخفيض"
        },
        {
            id: 5,
            categoryId: 3,
            title: "1000 متابع انستقرام",
            description: "زيادة 1000 متابع حقيقي لحساب الانستقرام خلال 24 ساعة",
            price: "49 ر.س",
            image: "https://via.placeholder.com/400x300/00b09b/ffffff?text=Instagram+Followers",
            badge: "سريع"
        },
        {
            id: 6,
            categoryId: 3,
            title: "5000 إعجاب فيسبوك",
            description: "إضافة 5000 إعجاب حقيقي لمنشور الفيسبوك خلال 48 ساعة",
            price: "79 ر.س",
            image: "https://via.placeholder.com/400x300/96c93d/ffffff?text=Facebook+Likes",
            badge: "جديد"
        },
        {
            id: 7,
            categoryId: 4,
            title: "مسابقة حساب فري فاير مجاني",
            description: "شارك في المسابقة لربح حساب فري فاير مستوى 80 مجاناً",
            price: "مجاني",
            image: "https://via.placeholder.com/400x300/8e2de2/ffffff?text=Contest+Free",
            badge: "مجاني"
        },
        {
            id: 8,
            categoryId: 4,
            title: "مسابقة 1000 ريال نقداً",
            description: "شارك في المسابقة لربح 1000 ريال نقداً",
            price: "مجاني",
            image: "https://via.placeholder.com/400x300/4a00e0/ffffff?text=Contest+1000",
            badge: "جائزة كبرى"
        }
    ],
    contests: [
        {
            id: 1,
            title: "مسابقة حساب فري فاير مجاني",
            date: "ينتهي في 15 ديسمبر 2026",
            description: "شارك في المسابقة لربح حساب فري فاير مستوى 80 مع جميع الأبطال النادرين و 50000 ماسة مجاناً. المسابقة مفتوحة للجميع وللفوز فقط قم بمشاركة الرابط مع 5 أصدقاء.",
            prize: "حساب فري فاير مستوى 80",
            prizeIcon: "fas fa-gamepad"
        },
        {
            id: 2,
            title: "مسابقة 1000 ريال نقداً",
            date: "ينتهي في 31 ديسمبر 2026",
            description: "احصل على فرصة ربح 1000 ريال نقداً. فقط اشترك في قناتنا على التليجرام وقم بدعوة 10 أصدقاء للانضمام. السحب سيكون عشوائياً بين جميع المشاركين.",
            prize: "1000 ريال نقداً",
            prizeIcon: "fas fa-money-bill-wave"
        },
        {
            id: 3,
            title: "مسابقة شحن رصيد مجاني",
            date: "ينتهي في 10 يناير 2027",
            description: "شارك في المسابقة لربح شحن رصيد بقيمة 500 ريال لأي شبكة اتصال تختارها. المسابقة سهلة والمشاركة مجانية للجميع.",
            prize: "500 ريال شحن رصيد",
            prizeIcon: "fas fa-mobile-alt"
        }
    ]
};

// تهيئة المتجر
function initStore() {
    // تحميل الأقسام
    loadCategories();
}

// تحميل الأقسام
function loadCategories() {
    const categoriesTrack = document.getElementById('categories-track');
    const categoriesDots = document.getElementById('categories-dots');
    
    if (!categoriesTrack) return;
    
    categoriesTrack.innerHTML = '';
    categoriesDots.innerHTML = '';
    
    storeData.categories.forEach((category, index) => {
        // إنشاء بطاقة القسم
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.style.background = category.color;
        categoryCard.dataset.categoryId = category.id;
        categoryCard.innerHTML = `
            <i class="${category.icon}"></i>
            <h3>${category.name}</h3>
            <p>${category.description}</p>
        `;
        
        categoryCard.addEventListener('click', function() {
            switchCategory(category.id);
            updateActiveDot(index);
        });
        
        categoriesTrack.appendChild(categoryCard);
        
        // إنشاء نقطة التنقل
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', function() {
            moveToSlide(index);
            updateActiveDot(index);
        });
        
        categoriesDots.appendChild(dot);
    });
}

// تهيئة سلايدر الأقسام
function initCategoriesSlider() {
    const track = document.getElementById('categories-track');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!track) return;
    
    let currentSlide = 0;
    const slideCount = storeData.categories.length;
    const slideWidth = 320; // عرض البطاقة + الهوامش
    
    // زر التالي
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentSlide < slideCount - 1) {
                currentSlide++;
                moveToSlide(currentSlide);
                updateActiveDot(currentSlide);
            }
        });
    }
    
    // زر السابق
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentSlide > 0) {
                currentSlide--;
                moveToSlide(currentSlide);
                updateActiveDot(currentSlide);
            }
        });
    }
    
    // نقل السلايدر إلى شريحة محددة
    window.moveToSlide = function(slideIndex) {
        currentSlide = slideIndex;
        const translateX = -slideIndex * slideWidth;
        track.style.transform = `translateX(${translateX}px)`;
    };
    
    // تحديث النقطة النشطة
    window.updateActiveDot = function(slideIndex) {
        dots.forEach((dot, index) => {
            if (index === slideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };
    
    // جعل السلايدر قابلاً للسحب
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    
    track.addEventListener('mousedown', dragStart);
    track.addEventListener('touchstart', dragStart);
    
    track.addEventListener('mousemove', drag);
    track.addEventListener('touchmove', drag);
    
    track.addEventListener('mouseup', dragEnd);
    track.addEventListener('touchend', dragEnd);
    track.addEventListener('mouseleave', dragEnd);
    
    function dragStart(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault();
        }
        
        isDragging = true;
        track.style.transition = 'none';
    }
    
    function drag(e) {
        if (!isDragging) return;
        
        let currentPosition;
        if (e.type === 'touchmove') {
            currentPosition = e.touches[0].clientX;
        } else {
            currentPosition = e.clientX;
        }
        
        currentTranslate = prevTranslate + currentPosition - startPos;
    }
    
    function dragEnd() {
        if (!isDragging) return;
        
        isDragging = false;
        track.style.transition = 'transform 0.5s ease';
        
        const movedBy = currentTranslate - prevTranslate;
        
        // إذا كان السحب كبيراً بما يكفي، انتقل إلى الشريحة التالية أو السابقة
        if (movedBy < -50 && currentSlide < slideCount - 1) {
            currentSlide++;
        } else if (movedBy > 50 && currentSlide > 0) {
            currentSlide--;
        }
        
        moveToSlide(currentSlide);
        updateActiveDot(currentSlide);
        prevTranslate = -currentSlide * slideWidth;
    }
}

// تحميل المنتجات
function loadProducts(categoryId = 1) {
    const productsGrid = document.getElementById('products-grid');
    const sectionTitle = document.getElementById('section-title');
    
    if (!productsGrid) return;
    
    // تحديث عنوان القسم
    const category = storeData.categories.find(cat => cat.id == categoryId);
    if (category && sectionTitle) {
        sectionTitle.textContent = category.name;
    }
    
    // تصفية المنتجات حسب القسم
    const filteredProducts = storeData.products.filter(product => product.categoryId == categoryId);
    
    // عرض المنتجات
    displayProducts(filteredProducts);
}

// عرض المنتجات
function displayProducts(products) {
    const productsGrid = document.getElementById('products-grid');
    
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    if (products.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>لا توجد منتجات في هذا القسم حالياً</h3>
                <p>سيتم إضافة منتجات جديدة قريباً</p>
            </div>
        `;
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-content">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price}</div>
                <button class="product-button" data-product-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i> اطلب الآن
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // إضافة أحداث الأزرار
    document.querySelectorAll('.product-button').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            showProductModal(productId);
        });
    });
}

// تحميل المسابقات
function loadContests() {
    const contestsContainer = document.getElementById('contests-container');
    
    if (!contestsContainer) return;
    
    contestsContainer.innerHTML = '';
    
    storeData.contests.forEach(contest => {
        const contestCard = document.createElement('div');
        contestCard.className = 'contest-card';
        contestCard.innerHTML = `
            <div class="contest-header">
                <h3 class="contest-title">${contest.title}</h3>
                <p class="contest-date">${contest.date}</p>
            </div>
            <div class="contest-body">
                <p class="contest-description">${contest.description}</p>
                <div class="contest-prize">
                    <i class="${contest.prizeIcon}"></i>
                    <span>الجائزة: ${contest.prize}</span>
                </div>
                <button class="contest-button" data-contest-id="${contest.id}">
                    <i class="fas fa-trophy"></i> شارك الآن
                </button>
            </div>
        `;
        
        contestsContainer.appendChild(contestCard);
    });
    
    // إضافة أحداث أزرار المشاركة
    document.querySelectorAll('.contest-button').forEach(button => {
        button.addEventListener('click', function() {
            const contestId = this.dataset.contestId;
            alert(`شكراً لمشاركتك في المسابقة ${contestId}! سيتم الإعلان عن الفائزين في التاريخ المحدد.`);
        });
    });
}

// تبديل القسم
function switchCategory(categoryId) {
    // تحديث الروابط النشطة
    document.querySelectorAll('.category-card').forEach(card => {
        if (card.dataset.categoryId == categoryId) {
            card.classList.add('active');
        } else {
            card.classList.remove('active');
        }
    });
    
    // تحديث الروابط في التذييل
    document.querySelectorAll('[data-category]').forEach(link => {
        if (link.dataset.category == categoryId) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
    
    // تحميل منتجات القسم الجديد
    loadProducts(categoryId);
}

// عرض نافذة تفاصيل المنتج
function showProductModal(productId) {
    const product = storeData.products.find(p => p.id == productId);
    if (!product) return;
    
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('product-modal');
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="modal-product-details">
                <h2>${product.title}</h2>
                <p class="modal-product-description">${product.description}</p>
                <div class="modal-product-price">${product.price}</div>
                <div class="modal-product-info">
                    <h3>تفاصيل الطلب:</h3>
                    <ul>
                        <li>يتم إرسال المنتج خلال 24 ساعة من تأكيد الدفع</li>
                        <li>للاستفسار أو الطوارئ اتصل على: +966 123 456 789</li>
                        <li>الدفع عن طريق التحويل البنكي أو الآبل باي</li>
                    </ul>
                </div>
                <button class="modal-product-button">
                    <i class="fab fa-whatsapp"></i> تواصل عبر الواتساب للطلب
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // إغلاق النافذة المنبثقة
    document.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // زر التواصل عبر الواتساب
    document.querySelector('.modal-product-button').addEventListener('click', function() {
        const message = `مرحباً، أريد طلب المنتج: ${product.title} - السعر: ${product.price}`;
        const whatsappUrl = `https://wa.me/966123456789?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });
}

// إغلاق النافذة المنبثقة
function closeModal() {
    const modal = document.getElementById('product-modal');
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// تهيئة القائمة المتحركة للهواتف
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuBtn && mainNav) {
        menuBtn.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuBtn.innerHTML = mainNav.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
        
    // إغلاق القائمة عند النقر على رابط
    document.querySelectorAll('.main-nav a').forEach(link => {
        link.addEventListener('click', function() {
            mainNav.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}
}

// تهيئة الأحداث
function initEvents() {
    // تصفية المنتجات
    const filterSelect = document.getElementById('content-filter');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            // هنا يمكن تطبيق خوارزمية التصفية حسب القيمة المختارة
            alert(`سيتم تصفية المنتجات حسب: ${this.options[this.selectedIndex].text}`);
        });
    }
    
    // زر تحميل المزيد
    const loadMoreBtn = document.getElementById('load-more');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // محاكاة تحميل المزيد من المنتجات
            this.textContent = 'جاري التحميل...';
            this.disabled = true;
            
            setTimeout(() => {
                // هنا يمكن جلب المزيد من المنتجات من قاعدة البيانات
                this.textContent = 'تحميل المزيد';
                this.disabled = false;
                alert('تم تحميل المزيد من المنتجات');
            }, 1500);
        });
    }
    
    // الانتقال للأقسام من التذييل
    document.querySelectorAll('[data-category]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const categoryId = this.dataset.category;
            switchCategory(categoryId);
            
            // التمرير لقسم الأقسام
            document.getElementById('categories').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // إغلاق النافذة المنبثقة بالضغط على ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
}

// إدراج الإعلانات
function insertAds() {
    // إعلانات A-ADS
    const aAdsBanner = document.getElementById('a-ads-banner');
    if (aAdsBanner) {
        // استبدال العنصر النائب بإعلان A-ADS الفعلي
        aAdsBanner.innerHTML = `
            <!-- كود A-ADS -->
            <!-- استبدل هذا الكود بكود A-ADS الفعلي -->
            <div style="text-align: center; margin: 0 auto; max-width: 728px;">
                <img src="https://via.placeholder.com/728x90/6a11cb/ffffff?text=A-ADS+Banner+728x90" alt="إعلان A-ADS" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p style="font-size: 12px; color: #666; margin-top: 5px;">إعلان A-ADS</p>
            </div>
        `;
    }
    
    // إعلانات Adstera
    const adsteraSidebar = document.getElementById('adstera-sidebar');
    if (adsteraSidebar) {
        adsteraSidebar.innerHTML = `
            <!-- كود Adstera -->
            <!-- استبدل هذا الكود بكود Adstera الفعلي -->
            <div style="text-align: center; margin: 0 auto; max-width: 300px;">
                <img src="https://via.placeholder.com/300x250/2575fc/ffffff?text=Adstera+300x250" alt="إعلان Adstera" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p style="font-size: 12px; color: #666; margin-top: 5px;">إعلان Adstera</p>
            </div>
        `;
    }
    
    const adsteraFooter = document.getElementById('adstera-footer');
    if (adsteraFooter) {
        adsteraFooter.innerHTML = `
            <!-- كود Adstera -->
            <!-- استبدل هذا الكود بكود Adstera الفعلي -->
            <div style="text-align: center; margin: 0 auto; max-width: 468px;">
                <img src="https://via.placeholder.com/468x60/ff4d94/ffffff?text=Adstera+468x60" alt="إعلان Adstera" style="max-width: 100%; height: auto; border-radius: 8px;">
                <p style="font-size: 12px; color: #666; margin-top: 5px;">إعلان Adstera</p>
            </div>
        `;
    }
}
