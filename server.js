const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'olive_store_secret_key_2024';

// إعداد خدمة الإيميل
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// دالة إرسال إيميل الطلب
async function sendOrderEmail(orderData) {
    try {
        const orderDate = new Date(orderData.date).toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        let itemsHtml = '';
        orderData.items.forEach((item, index) => {
            itemsHtml += `
                <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">${index + 1}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.name}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.quantity}</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${item.price.toFixed(2)} ج.م</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${(item.price * item.quantity).toFixed(2)} ج.م</td>
                </tr>
            `;
        });

        const paymentMethodText = {
            'cash': 'دفع عند الاستلام',
            'transfer': 'تحويل بنكي',
            'whatsapp': 'طلب عبر واتساب'
        };

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; direction: rtl;">
                <h2 style="color: #2c5530; text-align: center;">🛒 طلب جديد من متجر الزيتون</h2>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c5530;">📋 معلومات الطلب</h3>
                    <p><strong>رقم الطلب:</strong> ${orderData.id}</p>
                    <p><strong>تاريخ الطلب:</strong> ${orderDate}</p>
                    <p><strong>حالة الطلب:</strong> قيد المعالجة</p>
                </div>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c5530;">👤 معلومات العميل</h3>
                    <p><strong>الاسم:</strong> ${orderData.customer_name}</p>
                    <p><strong>الهاتف:</strong> ${orderData.customer_phone || 'غير محدد'}</p>
                    <p><strong>عنوان التسليم:</strong> ${orderData.shipping_address}</p>
                </div>

                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #2c5530;">🛍️ تفاصيل المنتجات</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
                        <thead>
                            <tr style="background-color: #2c5530; color: white;">
                                <th style="padding: 10px; border: 1px solid #ddd;">#</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">اسم المنتج</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">الكمية</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">السعر</th>
                                <th style="padding: 10px; border: 1px solid #ddd;">الإجمالي</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                </div>

                <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                    <h3 style="color: #2c5530;">💰 المجموع الإجمالي: ${(orderData.total_amount || orderData.total || 0).toFixed(2)} ج.م</h3>
                    <p><strong>طريقة الدفع:</strong> ${paymentMethodText[orderData.paymentMethod] || orderData.paymentMethod}</p>
                </div>

                <div style="background-color: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; color: #856404;"><strong>ملاحظة:</strong> يرجى التواصل مع العميل في أقرب وقت لتأكيد الطلب وترتيب التسليم.</p>
                </div>
            </div>
        `;

        const mailOptions = {
            from: `متجر الزيتون <${process.env.EMAIL_USER}>`,
            to: process.env.RECIPIENT_EMAIL || 'elagamy@internet.ru',
            subject: `طلب جديد رقم ${orderData.id} - متجر الزيتون`,
            html: emailHtml
        };

        await transporter.sendMail(mailOptions);
        console.log('تم إرسال إيميل الطلب بنجاح إلى:', process.env.RECIPIENT_EMAIL || 'elagamy@internet.ru');
        return true;
    } catch (error) {
        console.error('خطأ في إرسال الإيميل:', error);
        return false;
    }
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// إنشاء قاعدة البيانات
const db = new sqlite3.Database('./olive_store.db', (err) => {
    if (err) {
        console.error('خطأ في الاتصال بقاعدة البيانات:', err.message);
    } else {
        console.log('تم الاتصال بقاعدة البيانات بنجاح');
        initializeDatabase();
    }
});

// إنشاء الجداول
function initializeDatabase() {
    // جدول المستخدمين
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        full_name TEXT NOT NULL,
        phone TEXT,
        address TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('خطأ في إنشاء جدول المستخدمين:', err);
        else console.log('تم إنشاء جدول المستخدمين');
    });

    // جدول المنتجات
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        category TEXT,
        stock_quantity INTEGER DEFAULT 0,
        origin TEXT,
        quality_grade TEXT,
        weight_kg REAL DEFAULT 10.0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error('خطأ في إنشاء جدول المنتجات:', err);
        else {
            console.log('تم إنشاء جدول المنتجات');
            // إضافة عمود الوزن إذا لم يكن موجوداً
            db.run(`ALTER TABLE products ADD COLUMN weight_kg REAL DEFAULT 10.0`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('خطأ في إضافة عمود الوزن:', err);
                } else {
                    console.log('تم إضافة عمود الوزن');
                }
            });
        }
    });

    // جدول سلة التسوق
    db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`, (err) => {
        if (err) console.error('خطأ في إنشاء جدول السلة:', err);
        else console.log('تم إنشاء جدول السلة');
    });

    // جدول الطلبات
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        total_amount REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        payment_method TEXT,
        shipping_address TEXT,
        customer_name TEXT,
        customer_phone TEXT,
        customer_email TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )`, (err) => {
        if (err) console.error('خطأ في إنشاء جدول الطلبات:', err);
        else {
            console.log('تم إنشاء جدول الطلبات');
            // إضافة الأعمدة الجديدة إذا لم تكن موجودة
            db.run(`ALTER TABLE orders ADD COLUMN customer_name TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('خطأ في إضافة عمود customer_name:', err);
                }
            });
            db.run(`ALTER TABLE orders ADD COLUMN customer_phone TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('خطأ في إضافة عمود customer_phone:', err);
                }
            });
            db.run(`ALTER TABLE orders ADD COLUMN customer_email TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('خطأ في إضافة عمود customer_email:', err);
                }
            });
        }
    });

    // جدول تفاصيل الطلبات
    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        price REAL,
        product_name TEXT,
        FOREIGN KEY (order_id) REFERENCES orders (id),
        FOREIGN KEY (product_id) REFERENCES products (id)
    )`, (err) => {
        if (err) console.error('خطأ في إنشاء جدول تفاصيل الطلبات:', err);
        else {
            console.log('تم إنشاء جدول تفاصيل الطلبات');
            // إضافة عمود اسم المنتج إذا لم يكن موجوداً
            db.run(`ALTER TABLE order_items ADD COLUMN product_name TEXT`, (err) => {
                if (err && !err.message.includes('duplicate column name')) {
                    console.error('خطأ في إضافة عمود product_name:', err);
                }
            });
        }
    });

    // جدول المراجعات والتقييمات
    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        customer_email TEXT,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        order_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_approved BOOLEAN DEFAULT 0,
        FOREIGN KEY (order_id) REFERENCES orders (id)
    )`, (err) => {
        if (err) console.error('خطأ في إنشاء جدول المراجعات:', err);
        else console.log('تم إنشاء جدول المراجعات');
    });

    // حذف جميع المنتجات الموجودة
    db.run('DELETE FROM products', (err) => {
        if (err) console.error('خطأ في حذف المنتجات:', err);
        else console.log('تم حذف جميع المنتجات الموجودة');
    });
}

// إدراج المنتجات الجديدة
function insertNewProducts() {
    console.log('إضافة المنتجات الجديدة...');
    
    const newProducts = [
        {
            name: 'بصل مصري',
            description: 'بصل مصري طازج عالي الجودة',
            price: 700.00,
            image_url: '/images/onion.jpg',
            category: 'خضروات',
            stock_quantity: 100,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'بوليف عادي',
            description: 'بوليف عادي طازج',
            price: 300.00,
            image_url: '/images/olive-regular.jpg',
            category: 'زيتون',
            stock_quantity: 80,
            origin: 'مصر',
            quality_grade: 'عادي',
            weight_kg: 10.0
        },
        {
            name: 'بوليف فاخر',
            description: 'بوليف فاخر عالي الجودة',
            price: 400.00,
            image_url: '/images/olive-premium.jpg',
            category: 'زيتون',
            stock_quantity: 60,
            origin: 'مصر',
            quality_grade: 'فاخر',
            weight_kg: 10.0
        },
        {
            name: 'حيار قشه مصري',
            description: 'خيار قشه مصري طازج',
            price: 715.00,
            image_url: '/images/cucumber-egyptian.jpg',
            category: 'خضروات',
            stock_quantity: 90,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'خيار فكوك سليم',
            description: 'خيار فكوك سليم طازج',
            price: 500.00,
            image_url: '/images/cucumber-whole.jpg',
            category: 'خضروات',
            stock_quantity: 70,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'خيار قشه مستورد',
            description: 'خيار قشه مستورد عالي الجودة',
            price: 2400.00,
            image_url: '/images/cucumber-imported.jpg',
            category: 'خضروات',
            stock_quantity: 40,
            origin: 'مستورد',
            quality_grade: 'فاخر',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اخضر سليم',
            description: 'زيتون أخضر سليم طازج',
            price: 1300.00,
            image_url: '/images/green-olives-whole.jpg',
            category: 'زيتون أخضر',
            stock_quantity: 100,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اخضر شرائح',
            description: 'زيتون أخضر مقطع شرائح',
            price: 1500.00,
            image_url: '/images/green-olives-sliced.jpg',
            category: 'زيتون أخضر',
            stock_quantity: 80,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اخضر محشي جزر',
            description: 'زيتون أخضر محشي بالجزر',
            price: 1600.00,
            image_url: '/images/green-olives-carrot.jpg',
            category: 'زيتون محشي',
            stock_quantity: 60,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اسباني جامبو',
            description: 'زيتون إسباني جامبو كبير الحجم',
            price: 1700.00,
            image_url: '/images/spanish-olives-jumbo.jpg',
            category: 'زيتون أخضر',
            stock_quantity: 50,
            origin: 'إسبانيا',
            quality_grade: 'فاخر',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اسباني سوبر',
            description: 'زيتون إسباني سوبر عالي الجودة',
            price: 1800.00,
            image_url: '/images/spanish-olives-super.jpg',
            category: 'زيتون أخضر',
            stock_quantity: 45,
            origin: 'إسبانيا',
            quality_grade: 'سوبر',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اسود شرائح',
            description: 'زيتون أسود مقطع شرائح',
            price: 1400.00,
            image_url: '/images/black-olives-sliced.jpg',
            category: 'زيتون أسود',
            stock_quantity: 70,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون اسود شرائح طبيعي',
            description: 'زيتون أسود شرائح طبيعي بدون إضافات',
            price: 1800.00,
            image_url: '/images/black-olives-natural.jpg',
            category: 'زيتون أسود',
            stock_quantity: 60,
            origin: 'مصر',
            quality_grade: 'طبيعي',
            weight_kg: 10.0
        },
        {
            name: 'زيتون دولسي',
            description: 'زيتون دولسي حلو المذاق',
            price: 1400.00,
            image_url: '/images/dolce-olives.jpg',
            category: 'زيتون',
            stock_quantity: 55,
            origin: 'إيطاليا',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون كالاماتا جامبو',
            description: 'زيتون كالاماتا جامبو كبير الحجم',
            price: 2000.00,
            image_url: '/images/kalamata-jumbo.jpg',
            category: 'زيتون أسود',
            stock_quantity: 40,
            origin: 'اليونان',
            quality_grade: 'فاخر',
            weight_kg: 10.0
        },
        {
            name: 'زيتون كالاماتا سوبر',
            description: 'زيتون كالاماتا سوبر عالي الجودة',
            price: 2300.00,
            image_url: '/images/kalamata-super.jpg',
            category: 'زيتون أسود',
            stock_quantity: 35,
            origin: 'اليونان',
            quality_grade: 'سوبر',
            weight_kg: 10.0
        },
        {
            name: 'زيتون كالاماتا مشرح زيت',
            description: 'زيتون كالاماتا مشرح بالزيت',
            price: 2500.00,
            image_url: '/images/kalamata-oil.jpg',
            category: 'زيتون أسود',
            stock_quantity: 30,
            origin: 'اليونان',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون مشوي',
            description: 'زيتون مشوي بنكهة مميزة',
            price: 2000.00,
            image_url: '/images/grilled-olives.jpg',
            category: 'زيتون',
            stock_quantity: 45,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'زيتون مفدغ زيت',
            description: 'زيتون مفدغ بالزيت',
            price: 1900.00,
            image_url: '/images/oil-cured-olives.jpg',
            category: 'زيتون',
            stock_quantity: 50,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'فلفل بلدي طنطاوي',
            description: 'فلفل بلدي طنطاوي حار',
            price: 350.00,
            image_url: '/images/pepper-local.jpg',
            category: 'فلفل',
            stock_quantity: 70,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'فلفل مكسيكي',
            description: 'فلفل مكسيكي حار',
            price: 450.00,
            image_url: '/images/pepper-mexican.jpg',
            category: 'فلفل',
            stock_quantity: 80,
            origin: 'المكسيك',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'فلفل هالبينو احمر واخضر',
            description: 'فلفل هالبينو أحمر وأخضر حار',
            price: 400.00,
            image_url: '/images/jalapeno-pepper.jpg',
            category: 'فلفل',
            stock_quantity: 60,
            origin: 'المكسيك',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'لوكس ساده وخلطه',
            description: 'لوكس سادة وخلطة متنوعة',
            price: 250.00,
            image_url: '/images/lux-mix.jpg',
            category: 'مخللات',
            stock_quantity: 90,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        },
        {
            name: 'ليمون مزبد',
            description: 'ليمون مزبد طازج',
            price: 250.00,
            image_url: '/images/pickled-lemon.jpg',
            category: 'مخللات',
            stock_quantity: 85,
            origin: 'مصر',
            quality_grade: 'ممتاز',
            weight_kg: 10.0
        }
    ];

    newProducts.forEach(product => {
        db.run(`INSERT INTO products (name, description, price, image_url, category, stock_quantity, origin, quality_grade, weight_kg) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [product.name, product.description, product.price, product.image_url, product.category, product.stock_quantity, product.origin, product.quality_grade, product.weight_kg],
            function(err) {
                if (err) {
                    console.error('خطأ في إضافة المنتج:', product.name, err);
                } else {
                    console.log('تم إضافة المنتج:', product.name);
                }
            });
    });
}

// استدعاء دالة إضافة المنتجات مرة واحدة فقط عند بدء الخادم
insertNewProducts();

// Middleware للتحقق من الرمز المميز
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'الرمز المميز مطلوب' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'رمز مميز غير صالح' });
        }
        req.user = user;
        next();
    });
}

// Routes

// تسجيل مستخدم جديد
app.post('/api/register', async (req, res) => {
    const { username, email, password, full_name, phone, address } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        db.run(`INSERT INTO users (username, email, password, full_name, phone, address) 
                VALUES (?, ?, ?, ?, ?, ?)`,
            [username, email, hashedPassword, full_name, phone, address],
            function(err) {
                if (err) {
                    return res.status(400).json({ error: 'خطأ في إنشاء الحساب' });
                }
                res.json({ message: 'تم إنشاء الحساب بنجاح', userId: this.lastID });
            });
    } catch (error) {
        res.status(500).json({ error: 'خطأ في الخادم' });
    }
});

// تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في الخادم' });
        }

        if (!user) {
            return res.status(401).json({ error: 'بيانات دخول غير صحيحة' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'بيانات دخول غير صحيحة' });
        }

        const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET);
        res.json({ token, user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name } });
    });
});

// الحصول على جميع المنتجات
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products ORDER BY created_at DESC', (err, products) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في جلب المنتجات' });
        }
        res.json(products);
    });
});

// الحصول على منتج واحد
app.get('/api/products/:id', (req, res) => {
    const { id } = req.params;
    
    db.get('SELECT * FROM products WHERE id = ?', [id], (err, product) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في جلب المنتج' });
        }
        if (!product) {
            return res.status(404).json({ error: 'المنتج غير موجود' });
        }
        res.json(product);
    });
});

// إضافة منتج إلى السلة
app.post('/api/cart/add', authenticateToken, (req, res) => {
    const { product_id, quantity = 1 } = req.body;
    const user_id = req.user.userId;

    // التحقق من وجود المنتج في السلة
    db.get('SELECT * FROM cart WHERE user_id = ? AND product_id = ?', [user_id, product_id], (err, existingItem) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في الخادم' });
        }

        if (existingItem) {
            // تحديث الكمية
            db.run('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, user_id, product_id], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'خطأ في تحديث السلة' });
                    }
                    res.json({ message: 'تم تحديث السلة بنجاح' });
                });
        } else {
            // إضافة منتج جديد
            db.run('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [user_id, product_id, quantity], (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'خطأ في إضافة المنتج للسلة' });
                    }
                    res.json({ message: 'تم إضافة المنتج للسلة بنجاح' });
                });
        }
    });
});

// الحصول على محتويات السلة
app.get('/api/cart', authenticateToken, (req, res) => {
    const user_id = req.user.userId;

    db.all(`SELECT c.*, p.name, p.price, p.image_url 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?`, [user_id], (err, cartItems) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في جلب السلة' });
        }
        res.json(cartItems);
    });
});

// تحديث كمية منتج في السلة
app.put('/api/cart/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.userId;

    db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?',
        [quantity, id, user_id], (err) => {
            if (err) {
                return res.status(500).json({ error: 'خطأ في تحديث السلة' });
            }
            res.json({ message: 'تم تحديث الكمية بنجاح' });
        });
});

// حذف منتج من السلة
app.delete('/api/cart/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const user_id = req.user.userId;

    db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [id, user_id], (err) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في حذف المنتج' });
        }
        res.json({ message: 'تم حذف المنتج من السلة' });
    });
});

// إرسال طلب جديد عبر الإيميل (من الواجهة الأمامية)
app.post('/api/send-order-email', async (req, res) => {
    try {
        const orderData = req.body;
        
        // التحقق من وجود البيانات المطلوبة
        if (!orderData.id || !orderData.customerName || !orderData.items || !orderData.total) {
            return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
        }

        // تحضير بيانات الطلب للإيميل
        const emailOrderData = {
            id: orderData.id,
            created_at: orderData.date || new Date().toISOString(),
            customer_name: orderData.customerName,
            customer_email: orderData.customerEmail || 'غير محدد',
            customer_phone: orderData.customerPhone || 'غير محدد',
            shipping_address: orderData.shippingAddress || 'غير محدد',
            total_amount: orderData.total,
            payment_method: orderData.paymentMethod || 'غير محدد',
            items: orderData.items.map(item => ({
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }))
        };

        // إرسال الإيميل
        const emailSent = await sendOrderEmail(emailOrderData);
        
        if (emailSent) {
            res.json({ 
                success: true, 
                message: 'تم إرسال الطلب بنجاح إلى الإيميل' 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                error: 'فشل في إرسال الإيميل' 
            });
        }
    } catch (error) {
        console.error('خطأ في معالجة الطلب:', error);
        res.status(500).json({ 
            success: false, 
            error: 'خطأ في الخادم' 
        });
    }
});

// إنشاء طلب جديد للمستخدمين المسجلين
app.post('/api/orders', authenticateToken, (req, res) => {
    const { payment_method, shipping_address } = req.body;
    const user_id = req.user.userId;

    // حساب المجموع الكلي
    db.all(`SELECT c.*, p.price 
            FROM cart c 
            JOIN products p ON c.product_id = p.id 
            WHERE c.user_id = ?`, [user_id], (err, cartItems) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في جلب السلة' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ error: 'السلة فارغة' });
        }

        const total_amount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

        // إنشاء الطلب
        db.run(`INSERT INTO orders (user_id, total_amount, payment_method, shipping_address) 
                VALUES (?, ?, ?, ?)`,
            [user_id, total_amount, payment_method, shipping_address],
            function(err) {
                if (err) {
                    return res.status(500).json({ error: 'خطأ في إنشاء الطلب' });
                }

                const order_id = this.lastID;

                // إضافة تفاصيل الطلب
                const orderItemsPromises = cartItems.map(item => {
                    return new Promise((resolve, reject) => {
                        db.run(`INSERT INTO order_items (order_id, product_id, quantity, price) 
                                VALUES (?, ?, ?, ?)`,
                            [order_id, item.product_id, item.quantity, item.price],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                    });
                });

                Promise.all(orderItemsPromises)
                    .then(() => {
                        // مسح السلة
                        db.run('DELETE FROM cart WHERE user_id = ?', [user_id], (err) => {
                            if (err) {
                                console.error('خطأ في مسح السلة:', err);
                            }
                            res.json({ 
                                message: 'تم إنشاء الطلب بنجاح', 
                                order_id: order_id,
                                total_amount: total_amount 
                            });
                        });
                    })
                    .catch(err => {
                        res.status(500).json({ error: 'خطأ في حفظ تفاصيل الطلب' });
                    });
            });
    });
});

// إنشاء طلب جديد للمستخدمين غير المسجلين
app.post('/api/orders/guest', (req, res) => {
    const { 
        customer_name, 
        customer_phone, 
        customer_email, 
        shipping_address, 
        payment_method, 
        items 
    } = req.body;

    if (!customer_name || !customer_phone || !items || items.length === 0) {
        return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
    }

    // حساب المجموع الكلي
    const total_amount = items.reduce((total, item) => total + (item.price * item.quantity), 0);

    // إنشاء الطلب
    db.run(`INSERT INTO orders (user_id, total_amount, payment_method, shipping_address, customer_name, customer_phone, customer_email) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [null, total_amount, payment_method, shipping_address, customer_name, customer_phone, customer_email],
        function(err) {
            if (err) {
                console.error('خطأ في إنشاء طلب الضيف:', err);
                return res.status(500).json({ error: 'خطأ في إنشاء الطلب' });
            }

            const order_id = this.lastID;

            // إضافة تفاصيل الطلب
            const orderItemsPromises = items.map(item => {
                return new Promise((resolve, reject) => {
                    // البحث عن المنتج للحصول على product_id
                    db.get('SELECT id FROM products WHERE name = ?', [item.name], (err, product) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        const product_id = product ? product.id : null;
                        
                        db.run(`INSERT INTO order_items (order_id, product_id, quantity, price, product_name) 
                                VALUES (?, ?, ?, ?, ?)`,
                            [order_id, product_id, item.quantity, item.price, item.name],
                            (err) => {
                                if (err) reject(err);
                                else resolve();
                            });
                    });
                });
            });

            Promise.all(orderItemsPromises)
                .then(() => {
                    res.json({ 
                        message: 'تم إنشاء الطلب بنجاح', 
                        order_id: order_id,
                        total_amount: total_amount 
                    });
                })
                .catch(err => {
                    console.error('خطأ في حفظ تفاصيل طلب الضيف:', err);
                    res.status(500).json({ error: 'خطأ في حفظ تفاصيل الطلب' });
                });
        });
});

// الحصول على طلبات المستخدم المسجل
app.get('/api/orders', authenticateToken, (req, res) => {
    const user_id = req.user.userId;

    const query = `
        SELECT o.*, 
               COALESCE(o.customer_name, u.full_name) as customer_name,
               COALESCE(o.customer_phone, u.phone) as customer_phone,
               COALESCE(o.customer_email, u.email) as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE o.user_id = ? 
        ORDER BY o.created_at DESC
    `;

    db.all(query, [user_id], (err, orders) => {
        if (err) {
            return res.status(500).json({ error: 'خطأ في جلب الطلبات' });
        }

        // جلب تفاصيل المنتجات لكل طلب
        const ordersWithItems = orders.map(order => {
            return new Promise((resolve, reject) => {
                const itemsQuery = `
                    SELECT 
                        oi.*,
                        COALESCE(oi.product_name, p.name) as product_name
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                `;

                db.all(itemsQuery, [order.id], (err, items) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...order,
                            items: items.map(item => ({
                                name: item.product_name,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        });
                    }
                });
            });
        });

        Promise.all(ordersWithItems)
            .then(ordersData => {
                res.json(ordersData);
            })
            .catch(error => {
                console.error('خطأ في جلب تفاصيل الطلبات:', error);
                res.status(500).json({ error: 'خطأ في جلب تفاصيل الطلبات' });
            });
    });
});

// الحصول على طلبات العميل بناءً على رقم الهاتف أو البريد الإلكتروني (للضيوف)
app.post('/api/orders/search', (req, res) => {
    const { phone, email } = req.body;

    if (!phone && !email) {
        return res.status(400).json({ error: 'يجب توفير رقم الهاتف أو البريد الإلكتروني' });
    }

    let query = `
        SELECT o.*, 
               COALESCE(o.customer_name, u.full_name) as customer_name,
               COALESCE(o.customer_phone, u.phone) as customer_phone,
               COALESCE(o.customer_email, u.email) as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        WHERE 
    `;
    
    const params = [];
    const conditions = [];

    if (phone) {
        conditions.push('(o.customer_phone = ? OR u.phone = ?)');
        params.push(phone, phone);
    }

    if (email) {
        conditions.push('(o.customer_email = ? OR u.email = ?)');
        params.push(email, email);
    }

    query += conditions.join(' OR ');
    query += ' ORDER BY o.created_at DESC';

    db.all(query, params, (err, orders) => {
        if (err) {
            console.error('خطأ في البحث عن الطلبات:', err);
            return res.status(500).json({ error: 'خطأ في البحث عن الطلبات' });
        }

        // جلب تفاصيل المنتجات لكل طلب
        const ordersWithItems = orders.map(order => {
            return new Promise((resolve, reject) => {
                const itemsQuery = `
                    SELECT 
                        oi.*,
                        COALESCE(oi.product_name, p.name) as product_name
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                `;

                db.all(itemsQuery, [order.id], (err, items) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...order,
                            items: items.map(item => ({
                                name: item.product_name,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        });
                    }
                });
            });
        });

        Promise.all(ordersWithItems)
            .then(ordersData => {
                res.json(ordersData);
            })
            .catch(error => {
                console.error('خطأ في جلب تفاصيل الطلبات:', error);
                res.status(500).json({ error: 'خطأ في جلب تفاصيل الطلبات' });
            });
    });
});

// ===== API endpoints للإدارة =====

// الحصول على جميع الطلبات للإدارة
app.get('/api/admin/orders', (req, res) => {
    const query = `
        SELECT 
            o.*,
            COALESCE(o.customer_name, u.full_name) as customer_name,
            COALESCE(o.customer_phone, u.phone) as customer_phone,
            COALESCE(o.customer_email, u.email) as customer_email
        FROM orders o
        LEFT JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `;

    db.all(query, [], (err, orders) => {
        if (err) {
            console.error('خطأ في جلب الطلبات للإدارة:', err);
            return res.status(500).json({ error: 'خطأ في جلب الطلبات' });
        }

        // جلب تفاصيل المنتجات لكل طلب
        const ordersWithItems = orders.map(order => {
            return new Promise((resolve, reject) => {
                const itemsQuery = `
                    SELECT 
                        oi.*,
                        COALESCE(oi.product_name, p.name) as product_name
                    FROM order_items oi
                    LEFT JOIN products p ON oi.product_id = p.id
                    WHERE oi.order_id = ?
                `;

                db.all(itemsQuery, [order.id], (err, items) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            ...order,
                            items: items.map(item => ({
                                name: item.product_name,
                                quantity: item.quantity,
                                price: item.price
                            }))
                        });
                    }
                });
            });
        });

        Promise.all(ordersWithItems)
            .then(ordersData => {
                res.json(ordersData);
            })
            .catch(error => {
                console.error('خطأ في جلب تفاصيل الطلبات:', error);
                res.status(500).json({ error: 'خطأ في جلب تفاصيل الطلبات' });
            });
    });
});

// تحديث حالة الطلب
app.put('/api/admin/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // التحقق من صحة الحالة
    const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'حالة غير صحيحة' });
    }

    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) {
            console.error('خطأ في تحديث حالة الطلب:', err);
            return res.status(500).json({ error: 'خطأ في تحديث حالة الطلب' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'الطلب غير موجود' });
        }

        res.json({ message: 'تم تحديث حالة الطلب بنجاح' });
    });
});

// حذف طلب
app.delete('/api/admin/orders/:id', (req, res) => {
    const { id } = req.params;

    // حذف تفاصيل الطلب أولاً
    db.run('DELETE FROM order_items WHERE order_id = ?', [id], (err) => {
        if (err) {
            console.error('خطأ في حذف تفاصيل الطلب:', err);
            return res.status(500).json({ error: 'خطأ في حذف الطلب' });
        }

        // ثم حذف الطلب
        db.run('DELETE FROM orders WHERE id = ?', [id], function(err) {
            if (err) {
                console.error('خطأ في حذف الطلب:', err);
                return res.status(500).json({ error: 'خطأ في حذف الطلب' });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'الطلب غير موجود' });
            }

            res.json({ message: 'تم حذف الطلب بنجاح' });
        });
    });
});

// إحصائيات الإدارة
app.get('/api/admin/stats', (req, res) => {
    const queries = {
        totalOrders: 'SELECT COUNT(*) as count FROM orders',
        pendingOrders: 'SELECT COUNT(*) as count FROM orders WHERE status = "pending"',
        completedOrders: 'SELECT COUNT(*) as count FROM orders WHERE status = "completed"',
        totalRevenue: 'SELECT SUM(total_amount) as total FROM orders WHERE status = "completed"'
    };

    const stats = {};
    const promises = Object.keys(queries).map(key => {
        return new Promise((resolve, reject) => {
            db.get(queries[key], [], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    stats[key] = row.count || row.total || 0;
                    resolve();
                }
            });
        });
    });

    Promise.all(promises)
        .then(() => {
            res.json(stats);
        })
        .catch(error => {
            console.error('خطأ في جلب الإحصائيات:', error);
            res.status(500).json({ error: 'خطأ في جلب الإحصائيات' });
        });
});

// ===== API endpoints للمراجعات =====

// إضافة مراجعة جديدة
app.post('/api/reviews', (req, res) => {
    const { customer_name, customer_email, rating, comment, order_id } = req.body;

    // التحقق من البيانات المطلوبة
    if (!customer_name || !rating || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'البيانات المطلوبة غير مكتملة أو غير صحيحة' });
    }

    const query = `
        INSERT INTO reviews (customer_name, customer_email, rating, comment, order_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [customer_name, customer_email, rating, comment, order_id], function(err) {
        if (err) {
            console.error('خطأ في إضافة المراجعة:', err);
            return res.status(500).json({ error: 'خطأ في إضافة المراجعة' });
        }

        res.status(201).json({ 
            message: 'تم إضافة المراجعة بنجاح وستظهر بعد الموافقة عليها',
            reviewId: this.lastID 
        });
    });
});

// الحصول على المراجعات المعتمدة
app.get('/api/reviews', (req, res) => {
    const query = `
        SELECT id, customer_name, rating, comment, created_at
        FROM reviews 
        WHERE is_approved = 1 
        ORDER BY created_at DESC
    `;

    db.all(query, [], (err, reviews) => {
        if (err) {
            console.error('خطأ في جلب المراجعات:', err);
            return res.status(500).json({ error: 'خطأ في جلب المراجعات' });
        }

        res.json(reviews);
    });
});

// الحصول على جميع المراجعات للإدارة
app.get('/api/admin/reviews', (req, res) => {
    const query = `
        SELECT r.*, o.id as order_number
        FROM reviews r
        LEFT JOIN orders o ON r.order_id = o.id
        ORDER BY r.created_at DESC
    `;

    db.all(query, [], (err, reviews) => {
        if (err) {
            console.error('خطأ في جلب المراجعات للإدارة:', err);
            return res.status(500).json({ error: 'خطأ في جلب المراجعات' });
        }

        res.json(reviews);
    });
});

// الموافقة على مراجعة
app.put('/api/admin/reviews/:id/approve', (req, res) => {
    const { id } = req.params;

    db.run('UPDATE reviews SET is_approved = 1 WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('خطأ في تحديث حالة المراجعة:', err);
            return res.status(500).json({ error: 'خطأ في تحديث حالة المراجعة' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'المراجعة غير موجودة' });
        }

        res.json({ message: 'تم اعتماد المراجعة بنجاح' });
    });
});

// حذف مراجعة
app.delete('/api/admin/reviews/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM reviews WHERE id = ?', [id], function(err) {
        if (err) {
            console.error('خطأ في حذف المراجعة:', err);
            return res.status(500).json({ error: 'خطأ في حذف المراجعة' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'المراجعة غير موجودة' });
        }

        res.json({ message: 'تم حذف المراجعة بنجاح' });
    });
});

// صفحة الإدارة
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// الصفحة الرئيسية
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// بدء الخادم
app.listen(PORT, () => {
    console.log(`الخادم يعمل على المنفذ ${PORT}`);
    console.log(`يمكنك زيارة الموقع على: http://localhost:${PORT}`);
});

// إغلاق قاعدة البيانات عند إيقاف الخادم
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('تم إغلاق قاعدة البيانات');
        process.exit(0);
    });
});