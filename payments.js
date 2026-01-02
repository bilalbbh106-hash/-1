// نظام الدفع NowPayments لمتجر ماسكي
class PaymentSystem {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseURL = 'https://api.nowpayments.io/v1';
    }
    
    // إنشاء فاتورة دفع
    async createPayment(amount, currency = 'USD', productId) {
        try {
            const response = await fetch(`${this.baseURL}/invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.apiKey
                },
                body: JSON.stringify({
                    price_amount: amount,
                    price_currency: currency,
                    pay_currency: 'BTC',
                    order_id: `MASK-${Date.now()}-${productId}`,
                    order_description: `شراء منتج ${productId}`,
                    ipn_callback_url: window.location.origin + '/api/payment-callback',
                    success_url: window.location.origin + '/success.html',
                    cancel_url: window.location.origin + '/cancel.html'
                })
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('خطأ في إنشاء الدفع:', error);
            throw error;
        }
    }
    
    // الحصول على حالة الدفع
    async getPaymentStatus(paymentId) {
        try {
            const response = await fetch(`${this.baseURL}/payment/${paymentId}`, {
                headers: {
                    'x-api-key': this.apiKey
                }
            });
            
            return await response.json();
        } catch (error) {
            console.error('خطأ في الحصول على حالة الدفع:', error);
            throw error;
        }
    }
    
    // عرض واجهة الدفع
    showPaymentUI(product, amount) {
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
                border-radius: 20px;
                max-width: 500px;
                width: 90%;
                text-align: center;
            ">
                <h2 style="margin-bottom: 20px; color: #4f46e5;">💳 إتمام عملية الدفع</h2>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px;">
                    <p style="margin-bottom: 10px; color: #64748b;">المنتج: <strong>${product.title}</strong></p>
                    <p style="font-size: 1.8rem; font-weight: bold; color: #4f46e5;">${amount} $</p>
                </div>
                
                <div id="payment-qr" style="margin: 25px 0;">
                    <p style="color: #64748b; margin-bottom: 15px;">QR Code للدفع سيظهر هنا</p>
                    <div style="width: 200px; height: 200px; background: #f1f5f9; margin: 0 auto; border-radius: 12px;"></div>
                </div>
                
                <div style="color: #64748b; font-size: 0.9rem; margin-bottom: 25px;">
                    <p><i class="fas fa-info-circle"></i> سيتم إرسال المنتج تلقائياً بعد تأكيد الدفع</p>
                </div>
                
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button id="confirm-payment-btn" style="
                        padding: 15px 40px;
                        background: #10b981;
                        color: white;
                        border: none;
                        border-radius: 50px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-check"></i> تأكيد الدفع
                    </button>
                    
                    <button id="cancel-payment-btn" style="
                        padding: 15px 40px;
                        background: #ef4444;
                        color: white;
                        border: none;
                        border-radius: 50px;
                        font-size: 1.1rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-times"></i> إلغاء
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // أحداث الأزرار
        modal.querySelector('#cancel-payment-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        modal.querySelector('#confirm-payment-btn').addEventListener('click', async () => {
            try {
                const paymentData = await this.createPayment(amount, 'USD', product.id);
                
                if (paymentData.invoice_url) {
                    // افتح صفحة الدفع
                    window.open(paymentData.invoice_url, '_blank');
                    
                    // تتبع حالة الدفع
                    this.trackPayment(paymentData.id, product);
                    
                    document.body.removeChild(modal);
                    alert('✅ تم إنشاء فاتورة الدفع بنجاح! سيتم فتح صفحة الدفع.');
                }
            } catch (error) {
                alert('❌ حدث خطأ في إنشاء فاتورة الدفع');
                console.error(error);
            }
        });
    }
    
    // تتبع حالة الدفع
    async trackPayment(paymentId, product) {
        const checkStatus = async () => {
            try {
                const status = await this.getPaymentStatus(paymentId);
                
                if (status.payment_status === 'finished') {
                    // الدفع مكتمل - إرسال المنتج
                    await this.deliverProduct(product);
                    
                    // إرسال إشعار
                    alert('🎉 تم تأكيد الدفع بنجاح! سيتم إرسال المنتج إليك.');
                    
                    // تسجيل العملية
                    await this.recordTransaction(paymentId, product, 'completed');
                    
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('خطأ في تتبع الدفع:', error);
            }
        };
        
        // التحقق كل 10 ثواني
        const intervalId = setInterval(checkStatus, 10000);
        
        // التحقق فوراً
        checkStatus();
    }
    
    // تسليم المنتج
    async deliverProduct(product) {
        try {
            // جلب كود من المخزون
            const { data: digitalProduct, error } = await supabase
                .from('digital_products')
                .select('*')
                .eq('type', this.mapProductType(product))
                .eq('used', false)
                .limit(1)
                .single();
            
            if (error) throw error;
            
            if (digitalProduct) {
                // تحديث الكود كمستخدم
                await supabase
                    .from('digital_products')
                    .update({ used: true, used_at: new Date().toISOString() })
                    .eq('id', digitalProduct.id);
                
                // إرسال الكود للعميل (في الواقع سيتم إرساله بالبريد أو عرضه)
                this.showProductCode(digitalProduct.code, product);
                
                // تسجيل عملية البيع
                await this.recordSale(product, digitalProduct);
            }
        } catch (error) {
            console.error('خطأ في تسليم المنتج:', error);
            alert('❌ حدث خطأ في تسليم المنتج. يرجى التواصل مع الدعم.');
        }
    }
    
    // عرض الكود للعميل
    showProductCode(code, product) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="
                background: white;
                padding: 50px;
                border-radius: 20px;
                max-width: 600px;
                width: 90%;
                text-align: center;
                border: 3px solid #10b981;
            ">
                <div style="font-size: 3rem; color: #10b981; margin-bottom: 20px;">
                    <i class="fas fa-gift"></i>
                </div>
                
                <h2 style="margin-bottom: 20px; color: #1e293b;">🎉 تم الشراء بنجاح!</h2>
                
                <div style="background: linear-gradient(135deg, #10b981, #059669); 
                          color: white; 
                          padding: 25px; 
                          border-radius: 12px;
                          margin: 25px 0;
                          font-size: 1.2rem;">
                    <p style="margin-bottom: 10px;">${product.title}</p>
                    <p style="font-size: 1.8rem; font-weight: bold; letter-spacing: 2px;">${code}</p>
                </div>
                
                <div style="background: #fef3c7; color: #92400e; padding: 15px; border-radius: 8px; margin-bottom: 25px;">
                    <p><i class="fas fa-exclamation-triangle"></i> احفظ هذا الكود في مكان آمن ولا تشاركه مع أحد</p>
                </div>
                
                <button onclick="this.closest('div').style.display='none'" style="
                    padding: 15px 50px;
                    background: #4f46e5;
                    color: white;
                    border: none;
                    border-radius: 50px;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">
                    <i class="fas fa-check"></i> تم الاستلام
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
    }
    
    // تسجيل العملية
    async recordTransaction(paymentId, product, status) {
        try {
            await supabase
                .from('transactions')
                .insert([{
                    payment_id: paymentId,
                    product_id: product.id,
                    amount: this.extractPrice(product.price),
                    status: status,
                    created_at: new Date().toISOString()
                }]);
        } catch (error) {
            console.error('خطأ في تسجيل العملية:', error);
        }
    }
    
    // تسجيل عملية البيع
    async recordSale(product, digitalProduct) {
        try {
            await supabase
                .from('sales')
                .insert([{
                    product_id: product.id,
                    digital_product_id: digitalProduct.id,
                    amount: this.extractPrice(product.price),
                    sale_date: new Date().toISOString()
                }]);
        } catch (error) {
            console.error('خطأ في تسجيل البيع:', error);
        }
    }
    
    // مساعدة: استخراج السعر
    extractPrice(priceString) {
        const match = priceString.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : 0;
    }
    
    // مساعدة: تعيين نوع المنتج
    mapProductType(product) {
        const title = product.title.toLowerCase();
        
        if (title.includes('جواهر') || title.includes('gem')) return 'gem';
        if (title.includes('فيزا') || title.includes('visa')) return 'visa';
        if (title.includes('هدية') || title.includes('gift')) return 'gift';
        if (title.includes('لعبة') || title.includes('game')) return 'game';
        return 'code';
    }
}

// تهيئة نظام الدفع
let paymentSystem = null;

function initPaymentSystem(apiKey) {
    if (!apiKey || apiKey === 'ضع_مفتاح_API_الخاص_بك_هنا') {
        console.warn('⚠️ لم يتم إعداد مفتاح NowPayments API');
        return null;
    }
    
    paymentSystem = new PaymentSystem(apiKey);
    console.log('✅ نظام الدفع جاهز للعمل');
    return paymentSystem;
}

// تصدير الدوال
window.PaymentSystem = PaymentSystem;
window.initPaymentSystem = initPaymentSystem;
