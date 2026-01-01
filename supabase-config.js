// تكوين Supabase
// استبدل هذه القيم بمعلومات مشروع Supabase الفعلي الخاص بك

const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// تهيئة عميل Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// دالة لجلب الأقسام من Supabase
async function fetchCategories() {
    try {
        const { data, error } = await supabaseClient
            .from('categories')
            .select('*')
            .order('order', { ascending: true });
        
        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// دالة لجلب المنتجات من Supabase
async function fetchProducts(categoryId = null) {
    try {
        let query = supabaseClient
            .from('products')
            .select('*')
            .eq('active', true);
        
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
            console.error('Error fetching products:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// دالة لجلب المسابقات من Supabase
async function fetchContests() {
    try {
        const { data, error } = await supabaseClient
            .from('contests')
            .select('*')
            .eq('active', true)
            .order('end_date', { ascending: true });
        
        if (error) {
            console.error('Error fetching contests:', error);
            return [];
        }
        
        return data || [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

// دالة لإضافة منتج جديد
async function addProduct(productData) {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .insert([productData])
            .select();
        
        if (error) {
            console.error('Error adding product:', error);
            return { success: false, error };
        }
        
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

// دالة لتحديث منتج
async function updateProduct(productId, productData) {
    try {
        const { data, error } = await supabaseClient
            .from('products')
            .update(productData)
            .eq('id', productId)
            .select();
        
        if (error) {
            console.error('Error updating product:', error);
            return { success: false, error };
        }
        
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

// دالة لحذف منتج
async function deleteProduct(productId) {
    try {
        const { error } = await supabaseClient
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) {
            console.error('Error deleting product:', error);
            return { success: false, error };
        }
        
        return { success: true };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

// دالة للتحقق من صحة تسجيل دخول المدير
async function validateAdminLogin(password) {
    try {
        const { data, error } = await supabaseClient
            .from('admin_settings')
            .select('admin_password')
            .eq('id', 1)
            .single();
        
        if (error) {
            console.error('Error validating login:', error);
            return false;
        }
        
        // في التطبيق الحقيقي، يجب استخدام التجزئة (hashing) للمقارنة
        return data.admin_password === password;
    } catch (error) {
        console.error('Error:', error);
        return false;
    }
}

// دالة لجلب إعدادات الموقع
async function fetchSiteSettings() {
    try {
        const { data, error } = await supabaseClient
            .from('site_settings')
            .select('*')
            .eq('id', 1)
            .single();
        
        if (error) {
            console.error('Error fetching site settings:', error);
            return null;
        }
        
        return data;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// دالة لحفظ إعدادات الموقع
async function saveSiteSettings(settings) {
    try {
        const { data, error } = await supabaseClient
            .from('site_settings')
            .update(settings)
            .eq('id', 1)
            .select();
        
        if (error) {
            console.error('Error saving site settings:', error);
            return { success: false, error };
        }
        
        return { success: true, data: data[0] };
    } catch (error) {
        console.error('Error:', error);
        return { success: false, error };
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
window.supabaseConfig = {
    fetchCategories,
    fetchProducts,
    fetchContests,
    addProduct,
    updateProduct,
    deleteProduct,
    validateAdminLogin,
    fetchSiteSettings,
    saveSiteSettings
};
