# دليل المساهمة في مشروع نظام الحماية المنزلية الذكي 🤝

شكراً لاهتمامك بالمساهمة في هذا المشروع! نحن نرحب بجميع المساهمات.

## كيفية المساهمة

### 1. عمل Fork للمستودع
```bash
git clone https://github.com/YOUR_USERNAME/stunning-spoon.git
cd stunning-spoon
```

### 2. إنشاء فرع جديد
```bash
git checkout -b feature/your-feature-name
# أو للإصلاحات
git checkout -b fix/your-fix-name
```

### 3. القواعس المتبعة

#### الكود
- استخدم ESLint للـ JavaScript
- اتبع PEP 8 للـ Python
- أضف تعليقات واضحة
- اكتب اختبارات للميزات الجديدة

#### الالتزامات (Commits)
```bash
# الصيغة
git commit -m "type: description"

# الأنواع
- feat: ميزة جديدة
- fix: إصلاح خطأ
- docs: توثيق
- refactor: إعادة هيكلة
- test: إضافة اختبارات
- style: تنسيق الكود
- chore: مهام أخرى

# أمثلة
git commit -m "feat: إضافة نموذج كشف الحرائق"
git commit -m "fix: إصلاح مشكلة الاتصال بـ MQTT"
git commit -m "docs: تحديث توثيق API"
```

### 4. معايير الكود

#### JavaScript/Node.js
```javascript
// استخدم const و let بدلاً من var
const MAX_ATTEMPTS = 5;

// أضف JSDoc للدوال
/**
 * تحقق من حالة القفل
 * @param {string} deviceId - معرف الجهاز
 * @returns {boolean} حالة القفل
 */
function checkLockStatus(deviceId) {
  // ...
}

// معالجة الأخطاء
try {
  await deviceService.activate(id);
} catch (error) {
  logger.error('Failed to activate device:', error);
  throw new AppError('فشل تفعيل الجهاز', 500);
}
```

#### Python
```python
"""وحدة معالجة الصور والفيديو."""

from typing import Optional
import logging

logger = logging.getLogger(__name__)

def detect_face(image_path: str) -> Optional[dict]:
    """
    كشف الوجوه في الصورة.
    
    Args:
        image_path: مسار الصورة
        
    Returns:
        قائمة الوجوه المكتشفة أو None
    """
    try:
        # implementation
        pass
    except Exception as e:
        logger.error(f"Face detection failed: {e}")
        return None
```

### 5. الاختبارات

```bash
# تشغيل الاختبارات
npm test              # للـ Node.js
python -m pytest      # للـ Python

# اختبار كامل
npm run test:all
```

### 6. الدفع والطلب (Push & Pull Request)

```bash
# دفع التغييرات
git push origin feature/your-feature-name

# ثم أنشئ Pull Request عبر GitHub
```

#### متطلبات PR
- [ ] العنوان واضح ووصفي
- [ ] الوصف يشرح التغييرات
- [ ] الاختبارات تمر بنجاح
- [ ] لا توجد تحذيرات من linter
- [ ] التوثيق محدث

#### مثال على وصف PR:
```markdown
## الوصف
إضافة نموذج ذكي جديد لكشف الأنماط المريبة.

## النوع
- [x] ميزة جديدة
- [ ] إصلاح خطأ
- [ ] تحديث التوثيق

## المتطلبات المختبرة
- [x] كشف الحركة غير العادية
- [x] معالجة الأخطاء
- [x] تخزين البيانات بنجاح

## صور توضيحية (إن وجدت)
![screenshot](url)

## ملاحظات إضافية
يرجى اختبار الميزة في بيئة الإنتاج أيضاً.
```

## معايير الجودة

### التغطية (Code Coverage)
- يجب أن تكون التغطية على الأقل 80%
- للميزات الحرجة: 90%

### الأداء
- استجابة API: أقل من 200ms
- معالجة الصور: أقل من 2 ثانية

### الأمان
- لا تسجيل بيانات حساسة
- تحقق من المدخلات دائماً
- استخدم المتغيرات البيئية للأسرار

## المشاكل المعروفة

قبل المساهمة، تحقق من:
- [القضايا المفتوحة](https://github.com/laminehamza983-wq/stunning-spoon/issues)
- [PRs قيد الانتظار](https://github.com/laminehamza983-wq/stunning-spoon/pulls)

## الحصول على المساعدة

- [فتح مشكلة جديدة](https://github.com/laminehamza983-wq/stunning-spoon/issues/new)
- البريد الإلكتروني: laminehamza983@gmail.com

## قواعس السلوك

- كن محترماً تجاه الآخرين
- لا تقم بتعليقات ذات طابع شخصي
- كن بناء وإيجابي

---

**شكراً على مساهمتك! 🌟**
