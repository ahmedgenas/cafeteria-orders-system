document.addEventListener('DOMContentLoaded', function() {
    // العناصر الأساسية
    const form = document.getElementById('order-form');
    const employeeInput = document.getElementById('employee-name');
    const optionButtons = document.querySelectorAll('.option-btn');
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const submitBtn = document.getElementById('submit-btn');
    
    let selectedItem = null;
    
    // إضافة تأثير التركيز على حقل الإدخال عند تحميل الصفحة
    setTimeout(() => {
        employeeInput.focus();
    }, 500);
    
    // التعامل مع اختيار العناصر
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // إزالة التحديد من جميع الأزرار
            optionButtons.forEach(btn => {
                btn.classList.remove('selected');
            });
            
            // إضافة التحديد للزر المضغوط
            this.classList.add('selected');
            selectedItem = this.getAttribute('data-item');
            
            // إخفاء رسائل الخطأ عند الاختيار
            hideMessages();
            
            // تأثير صوتي بصري
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
        
        // تأثير عند التمرير
        button.addEventListener('mouseenter', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = 'translateY(-3px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
            }
        });
    });
    
    // التعامل مع إرسال النموذج
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // إخفاء الرسائل السابقة
        hideMessages();
        
        // الحصول على البيانات
        const employeeName = employeeInput.value.trim();
        
        // التحقق من صحة البيانات
        if (!employeeName) {
            showError('رجاءً أدخل بصمة الموظف');
            employeeInput.focus();
            return;
        }
        
        if (!selectedItem) {
            showError('رجاءً اختر مشروباً أو صنفاً');
            return;
        }
        
        // تعطيل زر الإرسال أثناء المعالجة
        submitBtn.disabled = true;
        submitBtn.textContent = 'جاري الإرسال...';
        
        try {
            // إعداد البيانات للإرسال
            const orderData = {
                employee: employeeName,
                item: selectedItem,
                timestamp: new Date().toISOString(),
                source: 'mobile_app'
            };
            
            // إرسال الطلب إلى Google Apps Script
            const response = await fetch('https://script.google.com/macros/s/AKfycby3eIl58zIBZw-u5Nl3E_cBrwYJ-gQUahqah7-83odw3BAmyOAXOD2nvfWsQDogYbpkXw/exec', {
                method: 'POST',
                mode: 'no-cors', // مطلوب لـ Google Apps Script
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });
            
            // عرض رسالة النجاح
            showSuccess(`تم إرسال طلب ${selectedItem} للموظف ${employeeName} بنجاح! 🎉`);
            
            // إعادة تعيين النموذج
            resetForm();
            
        } catch (error) {
            console.error('خطأ في إرسال الطلب:', error);
            showError('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
        } finally {
            // إعادة تفعيل زر الإرسال
            submitBtn.disabled = false;
            submitBtn.textContent = 'إرسال الطلب';
        }
    });
    
    // التعامل مع الضغط على Enter في حقل الإدخال
    employeeInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedItem) {
                form.dispatchEvent(new Event('submit'));
            } else {
                // التركيز على أول زر إذا لم يتم اختيار شيء
                optionButtons[0].focus();
            }
        }
    });
    
    // إضافة دعم لوحة المفاتيح للأزرار
    optionButtons.forEach((button, index) => {
        button.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // إضافة tabindex للتنقل بالكيبورد
        button.setAttribute('tabindex', index + 2);
    });
    
    // وظائف مساعدة
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        successMessage.classList.add('hidden');
        
        // تمرير تلقائي للرسالة
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // إخفاء الرسالة تلقائياً بعد 5 ثوان
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 5000);
    }
    
    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.classList.remove('hidden');
        errorMessage.classList.add('hidden');
        
        // تمرير تلقائي للرسالة
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // إخفاء الرسالة تلقائياً بعد 7 ثوان
        setTimeout(() => {
            successMessage.classList.add('hidden');
        }, 7000);
    }
    
    function hideMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
    }
    
    function resetForm() {
        // مسح حقل الإدخال
        employeeInput.value = '';
        
        // إزالة التحديد من جميع الأزرار
        optionButtons.forEach(btn => {
            btn.classList.remove('selected');
        });
        
        // إعادة تعيين المتغير
        selectedItem = null;
        
        // التركيز على حقل الإدخال
        setTimeout(() => {
            employeeInput.focus();
        }, 1000);
    }
    
    // إضافة تأثيرات بصرية عند التحميل
    function addLoadingEffects() {
        const elements = document.querySelectorAll('.option-btn');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.5s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }
    
    // تشغيل التأثيرات عند التحميل
    setTimeout(addLoadingEffects, 300);
    
    // إضافة مستمع للنقر خارج النموذج لإخفاء الرسائل
    document.addEventListener('click', function(e) {
        if (!form.contains(e.target)) {
            setTimeout(hideMessages, 100);
        }
    });
    
    // حفظ البيانات محلياً (اختياري)
    function saveToLocalStorage(data) {
        try {
            const orders = JSON.parse(localStorage.getItem('cafeteriaOrders') || '[]');
            orders.push({
                ...data,
                id: Date.now(),
                date: new Date().toLocaleDateString('ar-SA')
            });
            
            // الاحتفاظ بآخر 50 طلب فقط
            if (orders.length > 50) {
                orders.splice(0, orders.length - 50);
            }
            
            localStorage.setItem('cafeteriaOrders', JSON.stringify(orders));
        } catch (error) {
            console.warn('لا يمكن حفظ البيانات محلياً:', error);
        }
    }
    
    // تحديث النموذج لحفظ البيانات محلياً
    const originalSubmitHandler = form.onsubmit;
    form.addEventListener('submit', function(e) {
        if (selectedItem && employeeInput.value.trim()) {
            saveToLocalStorage({
                employee: employeeInput.value.trim(),
                item: selectedItem
            });
        }
    });
    
    // إضافة دعم للسحب للتحديث (Pull to Refresh)
    let startY = 0;
    let currentY = 0;
    let pullDistance = 0;
    const pullThreshold = 100;
    
    document.addEventListener('touchstart', function(e) {
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', function(e) {
        currentY = e.touches[0].clientY;
        pullDistance = currentY - startY;
        
        if (pullDistance > 0 && window.scrollY === 0) {
            e.preventDefault();
            
            if (pullDistance > pullThreshold) {
                document.body.style.transform = `translateY(${Math.min(pullDistance * 0.5, 50)}px)`;
                document.body.style.opacity = '0.8';
            }
        }
    });
    
    document.addEventListener('touchend', function(e) {
        if (pullDistance > pullThreshold && window.scrollY === 0) {
            // تحديث الصفحة
            location.reload();
        }
        
        document.body.style.transform = '';
        document.body.style.opacity = '';
        pullDistance = 0;
    });
    
    console.log('تطبيق الكافتيريا جاهز! 🛒☕');
});
