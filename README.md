# متجر الزيتون 🫒

متجر إلكتروني متكامل لبيع الزيتون والمنتجات ذات الصلة

## المميزات

- 🛒 نظام سلة تسوق متقدم
- 👤 نظام إدارة المستخدمين
- 📧 إشعارات الطلبات عبر البريد الإلكتروني
- 💳 طرق دفع متعددة
- 📱 تصميم متجاوب
- 🔐 نظام أمان متقدم
- ⭐ نظام تقييم المنتجات

## التقنيات المستخدمة

- **Backend**: Node.js, Express.js
- **Database**: SQLite (محلي) / PostgreSQL (إنتاج)
- **Frontend**: HTML, CSS, JavaScript
- **Authentication**: JWT
- **Email**: Nodemailer

## التثبيت والتشغيل

### 1. تحميل المشروع
```bash
git clone [repository-url]
cd olive-store
```

### 2. تثبيت الحزم
```bash
npm install
```

### 3. إعداد متغيرات البيئة
أنشئ ملف `.env` في المجلد الرئيسي:
```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key

# إعدادات قاعدة البيانات (للإنتاج)
DATABASE_URL=your_postgresql_connection_string

# إعدادات البريد الإلكتروني
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_app_password
RECIPIENT_EMAIL=admin@example.com
```

### 4. تشغيل المشروع
```bash
# للتطوير
npm run dev

# للإنتاج
npm start
```

## النشر على Vercel

### 1. إعداد متغيرات البيئة في Vercel
في لوحة تحكم Vercel، أضف المتغيرات التالية:
- `NODE_ENV=production`
- `JWT_SECRET=your_jwt_secret`
- `DATABASE_URL=your_postgresql_url`
- `EMAIL_USER=your_gmail`
- `EMAIL_PASS=your_app_password`
- `RECIPIENT_EMAIL=admin_email`

### 2. ربط قاعدة البيانات
احصل على قاعدة بيانات PostgreSQL مجانية من:
- [Neon](https://neon.tech)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

### 3. النشر
```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel --prod
```

## إعداد البريد الإلكتروني

1. فعّل المصادقة الثنائية في Gmail
2. أنشئ كلمة مرور للتطبيق
3. استخدم كلمة مرور التطبيق في `EMAIL_PASS`

## الملفات المهمة

- `server.js` - الخادم الرئيسي
- `database.js` - إعدادات قاعدة البيانات
- `vercel.json` - إعدادات النشر على Vercel
- `public/` - الملفات الثابتة
- `.env.example` - مثال على متغيرات البيئة

## API Endpoints

### المنتجات
- `GET /api/products` - جلب جميع المنتجات
- `GET /api/products/:id` - جلب منتج محدد

### الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/admin/orders` - جلب جميع الطلبات (إدارة)

### المراجعات
- `GET /api/reviews` - جلب المراجعات المعتمدة
- `POST /api/reviews` - إضافة مراجعة جديدة

## الدعم

للحصول على المساعدة أو الإبلاغ عن مشاكل، يرجى فتح issue في المستودع.

## الترخيص

MIT License