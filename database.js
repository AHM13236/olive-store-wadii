const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

// إعداد قاعدة البيانات حسب البيئة
function createDatabase() {
    if (process.env.NODE_ENV === 'production' && (process.env.POSTGRES_URL || process.env.DATABASE_URL)) {
        // استخدام PostgreSQL في الإنتاج (Vercel)
        console.log('استخدام PostgreSQL للإنتاج');
        const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;
        return new Pool({
            connectionString: connectionString,
            ssl: process.env.NODE_ENV === 'production' ? {
                rejectUnauthorized: false
            } : false,
            max: 20,
            idleTimeoutMillis: 30000,
            connectionTimeoutMillis: 2000,
        });
    } else {
        // استخدام SQLite في التطوير المحلي
        console.log('استخدام SQLite للتطوير المحلي');
        return new sqlite3.Database('./olive_store.db', (err) => {
            if (err) {
                console.error('خطأ في الاتصال بقاعدة البيانات:', err.message);
            } else {
                console.log('تم الاتصال بقاعدة البيانات بنجاح');
            }
        });
    }
}

// دالة تنفيذ الاستعلامات للـ PostgreSQL
async function runQuery(db, query, params = []) {
    if (process.env.NODE_ENV === 'production' && (process.env.POSTGRES_URL || process.env.DATABASE_URL)) {
        try {
            const result = await db.query(query, params);
            return result.rows;
        } catch (error) {
            console.error('خطأ في تنفيذ الاستعلام:', error);
            throw error;
        }
    } else {
        // للـ SQLite
        return new Promise((resolve, reject) => {
            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    }
}

// دالة تنفيذ استعلام واحد للـ PostgreSQL
async function runSingleQuery(db, query, params = []) {
    if (process.env.NODE_ENV === 'production' && (process.env.POSTGRES_URL || process.env.DATABASE_URL)) {
        try {
            const result = await db.query(query, params);
            return result.rows[0];
        } catch (error) {
            console.error('خطأ في تنفيذ الاستعلام:', error);
            throw error;
        }
    } else {
        // للـ SQLite
        return new Promise((resolve, reject) => {
            db.get(query, params, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });
    }
}

// دالة تنفيذ استعلام بدون إرجاع بيانات
async function runExecQuery(db, query, params = []) {
    if (process.env.NODE_ENV === 'production' && (process.env.POSTGRES_URL || process.env.DATABASE_URL)) {
        try {
            const result = await db.query(query, params);
            return { lastID: result.insertId, changes: result.rowCount };
        } catch (error) {
            console.error('خطأ في تنفيذ الاستعلام:', error);
            throw error;
        }
    } else {
        // للـ SQLite
        return new Promise((resolve, reject) => {
            db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ lastID: this.lastID, changes: this.changes });
                }
            });
        });
    }
}

// إنشاء الجداول للـ PostgreSQL
async function initializePostgresDatabase(db) {
    const queries = [
        // جدول المستخدمين
        `CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(255) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            full_name VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            address TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // جدول المنتجات
        `CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            image_url VARCHAR(500),
            category VARCHAR(100),
            stock_quantity INTEGER DEFAULT 0,
            origin VARCHAR(100),
            quality_grade VARCHAR(50),
            weight_kg DECIMAL(5,2) DEFAULT 10.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // جدول سلة التسوق
        `CREATE TABLE IF NOT EXISTS cart (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // جدول الطلبات
        `CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id),
            total_amount DECIMAL(10,2) NOT NULL,
            status VARCHAR(50) DEFAULT 'pending',
            payment_method VARCHAR(50),
            shipping_address TEXT,
            customer_name VARCHAR(255),
            customer_phone VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // جدول تفاصيل الطلبات
        `CREATE TABLE IF NOT EXISTS order_details (
            id SERIAL PRIMARY KEY,
            order_id INTEGER REFERENCES orders(id),
            product_id INTEGER REFERENCES products(id),
            quantity INTEGER NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`,
        
        // جدول المراجعات
        `CREATE TABLE IF NOT EXISTS reviews (
            id SERIAL PRIMARY KEY,
            product_id INTEGER REFERENCES products(id),
            user_id INTEGER REFERENCES users(id),
            rating INTEGER CHECK (rating >= 1 AND rating <= 5),
            comment TEXT,
            approved BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`
    ];

    for (const query of queries) {
        try {
            await db.query(query);
            console.log('تم إنشاء الجدول بنجاح');
        } catch (error) {
            console.error('خطأ في إنشاء الجدول:', error);
        }
    }
}

module.exports = {
    createDatabase,
    runQuery,
    runSingleQuery,
    runExecQuery,
    initializePostgresDatabase
};