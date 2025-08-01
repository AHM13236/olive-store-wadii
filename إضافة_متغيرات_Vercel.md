# إضافة المتغيرات البيئية في Vercel

## 🎯 السبب المحتمل لعدم عمل API
المتغيرات البيئية غير مضافة في Vercel Dashboard

## 📋 الخطوات المطلوبة

### الخطوة 1: الدخول إلى Vercel Dashboard
1. اذهب إلى: https://vercel.com/dashboard
2. ابحث عن مشروع `oliive-store-wadii`
3. اضغط على المشروع

### الخطوة 2: إضافة المتغيرات البيئية
1. اذهب إلى **Settings** (الإعدادات)
2. اختر **Environment Variables** (المتغيرات البيئية)
3. اضغط **Add New** (إضافة جديد)

### الخطوة 3: إضافة كل متغير

#### المتغير 1: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environment:** Production, Preview, Development

#### المتغير 2: JWT_SECRET
- **Name:** `JWT_SECRET`
- **Value:** `olive_store_secret_key_2024_secure_wadii_store`
- **Environment:** Production, Preview, Development

#### المتغير 3: EMAIL_USER
- **Name:** `EMAIL_USER`
- **Value:** `your-email@gmail.com`
- **Environment:** Production, Preview, Development

#### المتغير 4: EMAIL_PASS
- **Name:** `EMAIL_PASS`
- **Value:** `your-app-password`
- **Environment:** Production, Preview, Development

#### المتغير 5: RECIPIENT_EMAIL
- **Name:** `RECIPIENT_EMAIL`
- **Value:** `elagamy@internet.ru`
- **Environment:** Production, Preview, Development

#### المتغير 6: DATABASE_URL (اختياري)
- **Name:** `DATABASE_URL`
- **Value:** `sqlite:./database.db`
- **Environment:** Production, Preview, Development

#### المتغير 7: CORS_ORIGIN
- **Name:** `CORS_ORIGIN`
- **Value:** `https://oliive-store-wadii.vercel.app`
- **Environment:** Production, Preview, Development

### الخطوة 4: إعادة النشر
بعد إضافة المتغيرات:
1. اذهب إلى **Deployments**
2. اضغط على آخر deployment
3. اضغط **Redeploy** (إعادة النشر)

## 🚀 البديل السريع: Git Push

إذا كنت تفضل الطريقة السريعة:

```bash
# إضافة التغييرات
git add .

# رفع التحديث
git commit -m "إصلاح API - إضافة متغيرات بيئية"

# نشر فوري
git push origin main
```

## 🔍 التحقق من النجاح

### 1. انتظر 2-3 دقائق للنشر

### 2. اختبر API:
```bash
# اختبار المنتجات
curl https://oliive-store-wadii.vercel.app/api/products

# اختبار الإحصائيات
curl https://oliive-store-wadii.vercel.app/api/admin/stats
```

### 3. في المتصفح:
```
https://oliive-store-wadii.vercel.app/api/products
```

## 📊 النتيجة المتوقعة

### إذا نجح الإصلاح:
```json
[
  {
    "id": 1,
    "name": "بصل مصري",
    "description": "بصل مصري طازج عالي الجودة",
    "price": 700,
    "image_url": "/images/onion.jpg",
    "category": "خضروات",
    "stock_quantity": 100,
    "origin": "مصر",
    "quality_grade": "ممتاز",
    "weight_kg": 10
  }
  // ... باقي المنتجات (24 منتج)
]
```

### إذا لم ينجح:
```json
{
  "error": "Internal Server Error"
}
```

## ⚠️ استكشاف الأخطاء

### خطأ 500 - Internal Server Error:
**السبب:** متغيرات بيئية مفقودة
**الحل:** تأكد من إضافة جميع المتغيرات في Vercel

### خطأ 404 - Not Found:
**السبب:** مسار API غير صحيح
**الحل:** تحقق من vercel.json

### خطأ CORS:
**السبب:** مشكلة في الأمان
**الحل:** أضف CORS_ORIGIN في المتغيرات

## 🛠️ إعدادات إضافية

### في Vercel Dashboard:
1. **Build Command:** (اتركه فارغ)
2. **Output Directory:** (اتركه فارغ)
3. **Install Command:** `npm install`
4. **Development Command:** `npm run dev`

### في package.json تأكد من:
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "build": "echo 'Build complete'"
  }
}
```

## 📱 اختبار شامل بعد الإصلاح

### 1. الصفحة الرئيسية:
```
https://oliive-store-wadii.vercel.app/
```

### 2. API المنتجات:
```
https://oliive-store-wadii.vercel.app/api/products
```

### 3. لوحة التحكم:
```
https://oliive-store-wadii.vercel.app/admin
```

### 4. API الإحصائيات:
```
https://oliive-store-wadii.vercel.app/api/admin/stats
```

## ✅ قائمة التحقق النهائية

- [ ] تم إضافة جميع المتغيرات البيئية في Vercel
- [ ] تم إعادة النشر
- [ ] API المنتجات يعمل
- [ ] API الإحصائيات يعمل
- [ ] الصفحة الرئيسية تعمل
- [ ] لوحة التحكم تعمل
- [ ] لا توجد أخطاء في Vercel Logs

---
**ملاحظة:** إضافة المتغيرات البيئية في Vercel ضرورية لعمل API بشكل صحيح