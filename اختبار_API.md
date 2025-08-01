# اختبار API - أوامر سريعة

## 🚀 اختبار فوري (نسخ ولصق)

### 1. اختبار المنتجات (الأهم):
```bash
curl -X GET "https://oliive-store-wadii.vercel.app/api/products" -H "Content-Type: application/json"
```

### 2. اختبار الإحصائيات:
```bash
curl -X GET "https://oliive-store-wadii.vercel.app/api/admin/stats" -H "Content-Type: application/json"
```

### 3. اختبار المراجعات:
```bash
curl -X GET "https://oliive-store-wadii.vercel.app/api/reviews" -H "Content-Type: application/json"
```

## 🌐 اختبار في المتصفح

### افتح هذه الروابط مباشرة:

#### 1. API المنتجات:
```
https://oliive-store-wadii.vercel.app/api/products
```

#### 2. API الإحصائيات:
```
https://oliive-store-wadii.vercel.app/api/admin/stats
```

#### 3. API المراجعات:
```
https://oliive-store-wadii.vercel.app/api/reviews
```

#### 4. الصفحة الرئيسية:
```
https://oliive-store-wadii.vercel.app/
```

#### 5. لوحة التحكم:
```
https://oliive-store-wadii.vercel.app/admin
```

## 🔍 اختبار JavaScript في المتصفح

### افتح Developer Tools (F12) واكتب:

#### 1. اختبار المنتجات:
```javascript
fetch('/api/products')
  .then(response => response.json())
  .then(data => console.log('المنتجات:', data))
  .catch(error => console.error('خطأ:', error));
```

#### 2. اختبار الإحصائيات:
```javascript
fetch('/api/admin/stats')
  .then(response => response.json())
  .then(data => console.log('الإحصائيات:', data))
  .catch(error => console.error('خطأ:', error));
```

#### 3. اختبار شامل:
```javascript
// اختبار جميع APIs
const testAPIs = async () => {
  const apis = [
    '/api/products',
    '/api/admin/stats',
    '/api/reviews'
  ];
  
  for (const api of apis) {
    try {
      const response = await fetch(api);
      const data = await response.json();
      console.log(`✅ ${api}:`, data);
    } catch (error) {
      console.error(`❌ ${api}:`, error);
    }
  }
};

testAPIs();
```

## 📊 النتائج المتوقعة

### 1. API المنتجات:
```json
[
  {
    "id": 1,
    "name": "بصل مصري",
    "description": "بصل مصري طازج عالي الجودة",
    "price": 700,
    "category": "خضروات",
    "stock_quantity": 100
  }
]
```

### 2. API الإحصائيات:
```json
{
  "totalOrders": 0,
  "pendingOrders": 0,
  "completedOrders": 0,
  "totalRevenue": 0
}
```

### 3. API المراجعات:
```json
[]
```

## ⚠️ رسائل الخطأ الشائعة

### 1. "404 Not Found"
**المعنى:** API غير موجود
**الحل:** تحقق من الرابط

### 2. "500 Internal Server Error"
**المعنى:** خطأ في الخادم
**الحل:** تحقق من Vercel Logs

### 3. "CORS Error"
**المعنى:** مشكلة في الأمان
**الحل:** تحقق من إعدادات CORS

### 4. "Network Error"
**المعنى:** مشكلة في الاتصال
**الحل:** تحقق من الإنترنت

## 🛠️ إصلاح سريع

### إذا لم تعمل APIs:

#### 1. إعادة النشر:
```bash
git add .
git commit -m "إصلاح API"
git push origin main
```

#### 2. مسح Cache:
```
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)
```

#### 3. تحقق من Vercel:
- اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
- تحقق من آخر deployment
- راجع Function Logs

## 📱 اختبار على الهاتف

### افتح في متصفح الهاتف:
1. **الموقع:** https://oliive-store-wadii.vercel.app/
2. **لوحة التحكم:** https://oliive-store-wadii.vercel.app/admin
3. **API المنتجات:** https://oliive-store-wadii.vercel.app/api/products

## ✅ قائمة التحقق

- [ ] API المنتجات يعمل
- [ ] API الإحصائيات يعمل  
- [ ] API المراجعات يعمل
- [ ] الصفحة الرئيسية تعمل
- [ ] لوحة التحكم تعمل
- [ ] لا توجد أخطاء في Console
- [ ] البيانات تظهر بشكل صحيح

## 🎯 اختبار متقدم

### تسجيل مستخدم جديد:
```javascript
fetch('/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    username: 'test_user',
    email: 'test@example.com',
    password: 'password123',
    full_name: 'مستخدم تجريبي',
    phone: '01234567890',
    address: 'عنوان تجريبي'
  })
})
.then(response => response.json())
.then(data => console.log('تسجيل المستخدم:', data));
```

### تسجيل الدخول:
```javascript
fetch('/api/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => console.log('تسجيل الدخول:', data));
```

---
**آخر تحديث:** الآن
**الحالة:** جاهز للاختبار