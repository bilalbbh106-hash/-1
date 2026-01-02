// نظام إدارة المخزون لمتجر ماسكي
class InventorySystem {
    constructor() {
        this.products = [];
        this.digitalProducts = [];
    }
    
    // تحميل المخزون
    async loadInventory() {
        try {
            // تحميل المنتجات العادية
            const { data: products, error: productsError } = await supabase
                .from('products')
                .select('*')
                .eq('active', true);
            
            if (productsError) throw productsError;
            this.products = products;
            
            // تحميل المنتجات الرقمية
            const { data: digitalProducts, error: digitalError } = await supabase
                .from('digital_products')
                .select('*')
                .eq('used', false);
            
            if (digitalError) throw digitalError;
            this.digitalProducts = digitalProducts;
            
            console.log(`✅ تم تحميل ${products.length} منتج و ${digitalProducts.length} منتج رقمي`);
            return { products, digitalProducts };
            
        } catch (error) {
            console.error('❌ خطأ في تحميل المخزون:', error);
            throw error;
        }
    }
    
    // جلب منتج رقمي متاح
    async getAvailableDigitalProduct(type) {
        try {
            const { data: products, error } = await supabase
                .from('digital_products')
                .select('*')
                .eq('type', type)
                .eq('used', false)
                .limit(1);
            
            if (error) throw error;
            
            if (products.length > 0) {
                return products[0];
            }
            
            return null;
        } catch (error) {
            console.error('❌ خطأ في جلب المنتج الرقمي:', error);
            throw error;
        }
    }
    
    // استخدام منتج رقمي
    async useDigitalProduct(productId) {
        try {
            const { error } = await supabase
                .from('digital_products')
                .update({ 
                    used: true,
                    used_at: new Date().toISOString()
                })
                .eq('id', productId);
            
            if (error) throw error;
            
            console.log(`✅ تم استخدام المنتج الرقمي: ${productId}`);
            return true;
        } catch (error) {
            console.error('❌ خطأ في استخدام المنتج الرقمي:', error);
            throw error;
        }
    }
    
    // إضافة منتجات رقمية جديدة
    async addDigitalProducts(products) {
        try {
            const { data, error } = await supabase
                .from('digital_products')
                .insert(products);
            
            if (error) throw error;
            
            console.log(`✅ تم إضافة ${products.length} منتج رقمي`);
            return data;
        } catch (error) {
            console.error('❌ خطأ في إضافة المنتجات الرقمية:', error);
            throw error;
        }
    }
    
    // عرض تقرير المخزون
    async generateInventoryReport() {
        try {
            const { data: categories, error: catError } = await supabase
                .from('categories')
                .select('*');
            
            if (catError) throw catError;
            
            const { data: products, error: prodError } = await supabase
                .from('products')
                .select('*, categories(name)');
            
            if (prodError) throw prodError;
            
            const { data: digitalProducts, error: digError } = await supabase
                .from('digital_products')
                .select('*');
            
            if (digError) throw digError;
            
            // تحليل المخزون
            const usedDigital = digitalProducts.filter(p => p.used).length;
            const availableDigital = digitalProducts.filter(p => !p.used).length;
            
            const report = {
                categories: categories.length,
                products: products.length,
                digitalProducts: {
                    total: digitalProducts.length,
                    used: usedDigital,
                    available: availableDigital,
                    types: this.groupByType(digitalProducts)
                },
                generated_at: new Date().toISOString()
            };
            
            return report;
        } catch (error) {
            console.error('❌ خطأ في إنشاء تقرير المخزون:', error);
            throw error;
        }
    }
    
    // تجميع حسب النوع
    groupByType(products) {
        const groups = {};
        products.forEach(product => {
            if (!groups[product.type]) {
                groups[product.type] = { total: 0, available: 0, used: 0 };
            }
            groups[product.type].total++;
            if (product.used) {
                groups[product.type].used++;
            } else {
                groups[product.type].available++;
            }
        });
        return groups;
    }
    
    // تصدير المخزون كـ CSV
    exportToCSV(products) {
        if (products.length === 0) return '';
        
        const headers = ['الكود', 'النوع', 'القيمة', 'الحالة', 'تاريخ الإنشاء'];
        const rows = products.map(product => [
            product.code,
            product.type,
            product.value,
            product.used ? 'مستخدم' : 'متاح',
            new Date(product.created_at).toLocaleDateString('ar-SA')
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        return csvContent;
    }
    
    // إنشاء جدول للمخزون
    createInventoryTable(products) {
        if (products.length === 0) {
            return '<p style="text-align: center; color: #64748b;">لا توجد منتجات في المخزون</p>';
        }
        
        let html = `
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="background: #f8fafc;">
                        <th style="padding: 15px; text-align: right;">الكود</th>
                        <th style="padding: 15px; text-align: right;">النوع</th>
                        <th style="padding: 15px; text-align: right;">القيمة</th>
                        <th style="padding: 15px; text-align: right;">الحالة</th>
                        <th style="padding: 15px; text-align: right;">التاريخ</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        products.forEach(product => {
            html += `
                <tr style="border-bottom: 1px solid #e2e8f0;">
                    <td style="padding: 15px; font-family: monospace;">${product.code}</td>
                    <td style="padding: 15px;">
                        <span style="background: #e0e7ff; color: #4f46e5; padding: 5px 15px; border-radius: 20px;">
                            ${this.getTypeName(product.type)}
                        </span>
                    </td>
                    <td style="padding: 15px; font-weight: bold;">$${product.value}</td>
                    <td style="padding: 15px;">
                        <span style="background: ${product.used ? '#fee2e2' : '#d1fae5'}; 
                              color: ${product.used ? '#991b1b' : '#065f46'}; 
                              padding: 5px 15px; 
                              border-radius: 20px;">
                            ${product.used ? 'مستخدم' : 'متاح'}
                        </span>
                    </td>
                    <td style="padding: 15px; color: #64748b;">
                        ${new Date(product.created_at).toLocaleDateString('ar-SA')}
                    </td>
                </tr>
            `;
        });
        
        html += '</tbody></table>';
        return html;
    }
    
    // الحصول على اسم النوع
    getTypeName(type) {
        const types = {
            'gem': 'أكواد جواهر',
            'visa': 'بطاقات فيزا',
            'gift': 'بطاقات هدايا',
            'game': 'حسابات ألعاب',
            'code': 'أكواد عامة'
        };
        return types[type] || type;
    }
}

// تهيئة نظام المخزون
let inventorySystem = null;

function initInventorySystem() {
    inventorySystem = new InventorySystem();
    console.log('✅ نظام المخزون جاهز للعمل');
    return inventorySystem;
}

// دالة مساعدة: تحميل المخزون وعرضه
async function loadAndDisplayInventory() {
    if (!inventorySystem) {
        inventorySystem = initInventorySystem();
    }
    
    try {
        const { digitalProducts } = await inventorySystem.loadInventory();
        
        // عرض المخزون
        const container = document.getElementById('digital-inventory');
        if (container) {
            const report = await inventorySystem.generateInventoryReport();
            
            container.innerHTML = `
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #4f46e5; margin-bottom: 15px;">📊 إحصائيات المخزون</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #e0e7ff;">
                            <div style="font-size: 2rem; font-weight: bold; color: #4f46e5;">
                                ${report.digitalProducts.total}
                            </div>
                            <p>إجمالي المنتجات</p>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #d1fae5;">
                            <div style="font-size: 2rem; font-weight: bold; color: #10b981;">
                                ${report.digitalProducts.available}
                            </div>
                            <p>متاحة للبيع</p>
                        </div>
                        
                        <div style="background: white; padding: 20px; border-radius: 12px; border: 2px solid #fee2e2;">
                            <div style="font-size: 2rem; font-weight: bold; color: #ef4444;">
                                ${report.digitalProducts.used}
                            </div>
                            <p>مباعة</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #4f46e5; margin-bottom: 15px;">📋 تفاصيل المخزون</h3>
                    ${inventorySystem.createInventoryTable(digitalProducts)}
                </div>
            `;
        }
        
        return digitalProducts;
    } catch (error) {
        console.error('❌ خطأ في تحميل المخزون:', error);
        
        const container = document.getElementById('digital-inventory');
        if (container) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #ef4444;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 15px;"></i>
                    <p>حدث خطأ في تحميل المخزون</p>
                </div>
            `;
        }
        
        throw error;
    }
}

// تصدير الدوال
window.InventorySystem = InventorySystem;
window.initInventorySystem = initInventorySystem;
window.loadAndDisplayInventory = loadAndDisplayInventory;
