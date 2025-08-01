# إصلاح مشكلة API - دليل شامل

## 🔍 تشخيص المشكلة

### المشاكل المحتملة:
1. **مسارات API غير صحيحة في vercel.json**
2. **عدم وجود متغيرات البيئة**
3. **مشكلة في قاعدة البيانات**
4. **عدم تحميل المنتجات**

## ✅ الحلول المطبقة

### 1. إنشاء ملف .env
تم إنشاء ملف `.env` مع المتغيرات المطلوبة:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=olive_store_secret_key_2024_secure
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=elagamy@internet.ru
DATABASE_URL=./olive_store.db
CORS_ORIGIN=*
```

### 2. تحديث vercel.json
تم إصلاح مسارات API في vercel.json:
```json
{
  "src": "/api/(.*)",
  "dest": "/server.js"
}
```

### 3. إضافة متغيرات البيئة في Vercel
يجب إضافة متغيرات البيئة في Vercel Dashboard:

## 🚀 خطوات الإصلاح

### الخطوة 1: تحديث متغيرات البيئة في Vercel
1. اذهب إلى [Vercel Dashboard](https://vercel.com/dashboard)
2. اختر مشروع `oliive-store-wadii`
3. اذهب إلى **Settings** → **Environment Variables**
4. أضف المتغيرات التالية:

```
NODE_ENV = production
JWT_SECRET = olive_store_secret_key_2024_secure
EMAIL_USER = your-email@gmail.com
EMAIL_PASS = your-app-password
RECIPIENT_EMAIL = elagamy@internet.ru
```

### الخطوة 2: إعادة النشر
```bash
git add .
git commit -m "إصلاح API - إضافة متغيرات البيئة"
git push origin main
```

### الخطوة 3: اختبار API

#### اختبار المنتجات:
```bash
curl https://oliive-store-wadii.vercel.app/api/products
```

#### اختبار منتج واحد:
```bash
curl https://oliive-store-wadii.vercel.app/api/products/1
```

#### اختبار إحصائيات الإدارة:
```bash
curl https://oliive-store-wadii.vercel.app/api/admin/stats
```

## 🔧 اختبار سريع في المتصفح

### 1. اختبار API المنتجات
افتح في المتصفح:
```
https://oliive-store-wadii.vercel.app/api/products
```
**النتيجة المتوقعة:** قائمة JSON بالمنتجات

### 2. اختبار API الإحصائيات
افتح في المتصفح:
```
https://oliive-store-wadii.vercel.app/api/admin/stats
```
**النتيجة المتوقعة:** JSON بالإحصائيات

### 3. اختبار الصفحة الرئيسية
افتح في المتصفح:
```
https://oliive-store-wadii.vercel.app/
```
**النتيجة المتوقعة:** صفحة المتجر تعمل

## 🛠️ استكشاف الأخطاء

### إذا لم تعمل API:

#### 1. تحقق من Logs في Vercel:
1. اذهب إلى Vercel Dashboard
2. اختر المشروع
3. اذهب إلى **Functions** → **View Function Logs**

#### 2. تحقق من حالة قاعدة البيانات:
```bash
# في المتصفح، افتح Developer Tools (F12)
# اذهب إلى Console واكتب:
fetch('/api/products').then(r => r.json()).then(console.log)
```

#### 3. تحقق من CORS:
إذا كانت هناك مشكلة CORS، ستظهر في Console

### رسائل الخطأ الشائعة:

#### "500 Internal Server Error"
- **السبب:** مشكلة في قاعدة البيانات أو متغيرات البيئة
- **الحل:** تحقق من Vercel Logs

#### "404 Not Found"
- **السبب:** مسار API غير صحيح
- **الحل:** تحقق من vercel.json

#### "CORS Error"
- **السبب:** مشكلة في إعدادات CORS
- **الحل:** تحقق من إعدادات CORS في server.js

## 📊 API Endpoints المتاحة

### المنتجات:
- `GET /api/products` - جميع المنتجات
- `GET /api/products/:id` - منتج واحد

### المستخدمين:
- `POST /api/register` - تسجيل مستخدم جديد
- `POST /api/login` - تسجيل الدخول

### السلة:
- `GET /api/cart` - محتويات السلة
- `POST /api/cart/add` - إضافة للسلة
- `PUT /api/cart/:id` - تحديث السلة
- `DELETE /api/cart/:id` - حذف من السلة

### الطلبات:
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders` - طلبات المستخدم
- `POST /api/send-order-email` - إرسال طلب بالإيميل

### الإدارة:
- `GET /api/admin/orders` - جميع الطلبات
- `GET /api/admin/stats` - الإحصائيات
- `PUT /api/admin/orders/:id` - تحديث طلب
- `DELETE /api/admin/orders/:id` - حذف طلب

### المراجعات:
- `GET /api/reviews` - المراجعات المعتمدة
- `POST /api/reviews` - إضافة مراجعة
- `GET /api/admin/reviews` - جميع المراجعات
- `PUT /api/admin/reviews/:id/approve` - اعتماد مراجعة
- `DELETE /api/admin/reviews/:id` - حذف مراجعة

## 🎯 خطة الاختبار

### 1. اختبار أساسي (5 دقائق):
```bash
# 1. المنتجات
curl https://oliive-store-wadii.vercel.app/api/products

# 2. الإحصائيات
curl https://oliive-store-wadii.vercel.app/api/admin/stats

# 3. المراجعات
curl https://oliive-store-wadii.vercel.app/api/reviews
```

### 2. اختبار متقدم (10 دقائق):
- تسجيل مستخدم جديد
- تسجيل الدخول
- إضافة منتج للسلة
- إنشاء طلب

### 3. اختبار الإدارة (5 دقائق):
- فتح لوحة التحكم
- عرض الطلبات
- عرض الإحصائيات

## 📞 في حالة استمرار المشكلة

### معلومات للدعم:
- **المشروع:** oliive-store-wadii
- **النوع:** Node.js + Express + SQLite
- **الاستضافة:** Vercel
- **المشكلة:** API لا يعمل

### خطوات الطوارئ:
1. **إعادة النشر الكامل:**
   ```bash
   git add .
   git commit -m "إعادة نشر كامل"
   git push origin main --force
   ```

2. **إعادة بناء في Vercel:**
   - اذهب إلى Vercel Dashboard
   - اختر "Redeploy" → "Rebuild"

3. **تحقق من Function Logs:**
   - راجع الأخطاء في Vercel Logs
   - ابحث عن رسائل الخطأ

---
**تاريخ الإصلاح:** الآن
**الحالة:** جاهز للاختبار