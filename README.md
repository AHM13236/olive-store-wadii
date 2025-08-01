# 🫒 Olive Store - متجر الزيتون الإلكتروني

<div align="center">

![Olive Store](https://img.shields.io/badge/Olive-Store-green?style=for-the-badge&logo=leaf)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=for-the-badge&logo=node.js)
![Express](https://img.shields.io/badge/Express-4.18-blue?style=for-the-badge&logo=express)
![SQLite](https://img.shields.io/badge/SQLite-3-blue?style=for-the-badge&logo=sqlite)

**متجر إلكتروني احترافي متخصص في بيع الزيتون والمخللات**

[🌐 عرض مباشر](https://your-site.railway.app) • [📖 التوثيق](./دليل_GitHub_Railway.md) • [🚀 النشر](./دليل_Railway_خطوة_بخطوة.md)

</div>

---

## ✨ المميزات الرئيسية

- 🛒 **كتالوج منتجات** - عرض شامل للزيتون والمخللات
- 📧 **نظام طلبات ذكي** - طلبات تلقائية عبر البريد الإلكتروني
- 📱 **تصميم متجاوب** - يعمل بكفاءة على جميع الأجهزة
- 🔒 **آمان عالي** - حماية البيانات والمعاملات
- ⚡ **أداء سريع** - تحميل فوري للصفحات
- 🎨 **واجهة عصرية** - تصميم جذاب وسهل الاستخدام

---

## 🛠️ التقنيات المستخدمة

| التقنية | الإصدار | الاستخدام |
|---------|---------|-----------||
| **Node.js** | 18.x | خادم الويب |
| **Express** | 4.18 | إطار العمل |
| **SQLite** | 5.1 | قاعدة البيانات |
| **Nodemailer** | 7.0 | نظام البريد |
| **JWT** | 9.0 | المصادقة |
| **Multer** | 1.4 | رفع الملفات |

---

## 🚀 التثبيت والتشغيل

### المتطلبات الأساسية
- Node.js (18.x أو أحدث)
- npm (8.x أو أحدث)

### خطوات التثبيت

```bash
# 1. استنساخ المشروع
git clone https://github.com/yourusername/olive-store.git
cd olive-store

# 2. تثبيت التبعيات
npm install

# 3. إعداد متغيرات البيئة
cp .env.example .env
# قم بتحرير ملف .env وإضافة بياناتك

# 4. تشغيل المشروع
npm start
```

### متغيرات البيئة المطلوبة

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
RECIPIENT_EMAIL=orders@yourstore.com
JWT_SECRET=your-secret-key-here
NODE_ENV=production
PORT=5000
```

---

## 🌐 النشر على الإنترنت

### Railway (موصى به) 🚂
```bash
# الطريقة السهلة
1. ارفع على GitHub
2. اربط مع Railway
3. أضف متغيرات البيئة
4. انشر تلقائياً!
```

### Vercel ⚡
```bash
# للمواقع السريعة
vercel --prod
```

### Render 🎨
```bash
# مجاني تماماً
# اربط مع GitHub مباشرة
```

---

## 📧 إعداد البريد الإلكتروني

### Gmail App Password:
1. اذهب إلى [Google Account Settings](https://myaccount.google.com)
2. الأمان → التحقق بخطوتين
3. كلمات مرور التطبيقات → إنشاء
4. استخدم كلمة المرور المُنشأة في `EMAIL_PASS`

---

## 📁 هيكل المشروع

```
olive-store/
├── 📄 server.js              # الخادم الرئيسي
├── 📄 package.json           # إعدادات المشروع
├── 📄 Procfile              # إعدادات النشر
├── 📁 public/               # الملفات العامة
│   ├── 🌐 index.html        # الصفحة الرئيسية
│   ├── 🎨 styles.css        # التصميم
│   ├── ⚡ script.js         # البرمجة
│   └── 👨‍💼 admin.html        # لوحة الإدارة
├── 📄 .env                  # متغيرات البيئة
├── 📄 .gitignore           # ملفات مستبعدة
└── 📚 docs/                # التوثيق
```

---

## 🎯 الاستخدام

### للعملاء:
1. تصفح المنتجات
2. إضافة للسلة
3. إرسال الطلب
4. استلام تأكيد بالبريد

### للإدارة:
1. الدخول إلى `/admin.html`
2. إدارة المنتجات
3. متابعة الطلبات
4. تحديث الأسعار

---

## 🤝 المساهمة

نرحب بمساهماتكم! 

1. Fork المشروع
2. إنشاء فرع جديد (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

---

## 📞 التواصل والدعم

- 📧 **البريد:** info@olivestore.com
- 🐙 **GitHub:** [Issues](https://github.com/yourusername/olive-store/issues)
- 📱 **واتساب:** +20-XXX-XXX-XXXX
- 🌐 **الموقع:** [olivestore.com](https://your-site.railway.app)

---

## 📄 الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE) - راجع ملف LICENSE للتفاصيل.

---

<div align="center">

**صُنع بـ ❤️ في مصر**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/olive-store?style=social)](https://github.com/yourusername/olive-store/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/olive-store?style=social)](https://github.com/yourusername/olive-store/network)

</div>

## هيكل قاعدة البيانات

### جدول المستخدمين (users)
- id (مفتاح أساسي)
- username (اسم المستخدم)
- email (البريد الإلكتروني)
- password (كلمة المرور مشفرة)
- full_name (الاسم الكامل)
- phone (رقم الهاتف)
- address (العنوان)
- created_at (تاريخ الإنشاء)

### جدول المنتجات (products)
- id (مفتاح أساسي)
- name (اسم المنتج)
- description (الوصف)
- price (السعر)
- image_url (رابط الصورة)
- category (الفئة)
- stock_quantity (الكمية المتوفرة)
- origin (المنشأ)
- quality_grade (درجة الجودة)
- created_at (تاريخ الإضافة)

### جدول سلة التسوق (cart)
- id (مفتاح أساسي)
- user_id (معرف المستخدم)
- product_id (معرف المنتج)
- quantity (الكمية)
- created_at (تاريخ الإضافة)

### جدول الطلبات (orders)
- id (مفتاح أساسي)
- user_id (معرف المستخدم)
- total_amount (المبلغ الإجمالي)
- status (حالة الطلب)
- payment_method (طريقة الدفع)
- shipping_address (عنوان التوصيل)
- created_at (تاريخ الطلب)

### جدول تفاصيل الطلبات (order_items)
- id (مفتاح أساسي)
- order_id (معرف الطلب)
- product_id (معرف المنتج)
- quantity (الكمية)
- price (السعر)

## APIs المتوفرة

### المصادقة
- `POST /api/register` - تسجيل مستخدم جديد
- `POST /api/login` - تسجيل الدخول

### المنتجات
- `GET /api/products` - جلب جميع المنتجات
- `GET /api/products/:id` - جلب منتج واحد

### سلة التسوق
- `POST /api/cart/add` - إضافة منتج للسلة
- `GET /api/cart` - جلب محتويات السلة
- `PUT /api/cart/:id` - تحديث كمية منتج في السلة
- `DELETE /api/cart/:id` - حذف منتج من السلة

### الطلبات
- `POST /api/orders` - إنشاء طلب جديد
- `GET /api/orders` - جلب طلبات المستخدم

## التشغيل

### المتطلبات
- Node.js (الإصدار 14 أو أحدث)
- npm

### خطوات التشغيل

1. **تثبيت التبعيات**:
   ```bash
   npm install
   ```

2. **تشغيل الخادم**:
   ```bash
   npm start
   ```
   أو للتطوير:
   ```bash
   npm run dev
   ```

3. **فتح الموقع**:
   افتح المتصفح وانتقل إلى: `http://localhost:3000`

## المنتجات التجريبية

يتم إدراج المنتجات التالية تلقائياً عند تشغيل التطبيق لأول مرة:

1. **زيتون أخضر مخلل** - 125.00 جنيه
2. **زيتون أسود كلاماتا** - 175.00 جنيه
3. **زيت زيتون بكر ممتاز** - 225.00 جنيه
4. **زيتون محشي جبن** - 150.00 جنيه

## طرق الدفع المدعومة

- الدفع عند الاستلام
- بطاقة ائتمان
- تحويل بنكي

## الأمان

- تشفير كلمات المرور باستخدام bcryptjs
- استخدام JWT للمصادقة
- حماية APIs بنظام المصادقة
- التحقق من صحة البيانات

## التصميم المتجاوب

الموقع مصمم ليعمل بشكل مثالي على:
- أجهزة الكمبيوتر المكتبية
- الأجهزة اللوحية
- الهواتف الذكية

## المساهمة

نرحب بالمساهمات! يرجى:
1. عمل Fork للمشروع
2. إنشاء فرع جديد للميزة
3. إجراء التغييرات
4. إرسال Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT.

## التواصل

للاستفسارات والدعم:
- البريد الإلكتروني: info@olivestore.com
- الهاتف: +966 50 123 4567

---

تم تطوير هذا المشروع بواسطة فريق متجر الزيتون © 2024