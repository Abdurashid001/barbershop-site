const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'super_secret_barbershop_key';

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '')));

// Initialize DB Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // TODO: change to your mysql username
    password: '',      // TODO: change to your mysql password
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к MySQL:', err);
        return;
    }
    console.log('Успешное подключение к MySQL');

    // Create database and tables if they don't exist
    db.query('CREATE DATABASE IF NOT EXISTS barbershop_db', (err) => {
        if (err) console.error('Ошибка создания базы данных:', err);
        
        db.query('USE barbershop_db', (err) => {
            if (err) console.error('Ошибка выбора базы данных', err);
            
            db.query(`CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255) UNIQUE,
                password VARCHAR(255)
            )`);
        
            db.query(`CREATE TABLE IF NOT EXISTS contacts (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                subject VARCHAR(255),
                message TEXT,
                date DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);

            db.query(`CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255),
                phone VARCHAR(50),
                service_type VARCHAR(255),
                booking_date VARCHAR(50),
                booking_time VARCHAR(50),
                status VARCHAR(50) DEFAULT 'Новая',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
        });
    });
});

// API endpoint for registration
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения (Имя, Email, Пароль)' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err, results) {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'Пользователь с таким email уже существует' });
                }
                return res.status(500).json({ error: 'Ошибка базы данных' });
            }
            res.json({ success: true, message: 'Успешная регистрация', id: results.insertId });
        });
    } catch (e) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// API endpoint for login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Введите email и пароль' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Ошибка базы данных' });
        if (results.length === 0) return res.status(400).json({ error: 'Пользователь не найден' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Неверный пароль' });

        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ success: true, token, name: user.name });
    });
});

// API endpoint for contact (booking/messages)
app.post('/api/contact', (req, res) => {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Имя, Email и Сообщение обязательны' });
    }

    db.query('INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)', 
        [name, email, subject, message], 
        function(err, results) {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при сохранении сообщения' });
            }
            res.json({ success: true, message: 'Ваше сообщение успешно отправлено!' });
        }
    );
});

// API endpoint for admin to get users
app.get('/api/admin/users', (req, res) => {
    db.query('SELECT id, name, email FROM users ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Ошибка базы данных' });
        res.json(results);
    });
});

// API endpoint for admin to get contacts (questions / bookings)
app.get('/api/admin/contacts', (req, res) => {
    db.query('SELECT id, name, email, subject, message, date FROM contacts ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Ошибка базы данных' });
        res.json(results);
    });
});

// API endpoint for customer to book an appointment
app.post('/api/book', (req, res) => {
    const { name, phone, service_type, booking_date, booking_time } = req.body;
    if (!name || !phone || !service_type || !booking_date || !booking_time) {
        return res.status(400).json({ error: 'Все поля обязательны для заполнения!' });
    }

    db.query('INSERT INTO bookings (name, phone, service_type, booking_date, booking_time) VALUES (?, ?, ?, ?, ?)', 
        [name, phone, service_type, booking_date, booking_time], 
        function(err, results) {
            if (err) {
                return res.status(500).json({ error: 'Ошибка сервера' });
            }
            res.json({ success: true, message: 'Вы успешно записаны в очередь!' });
        }
    );
});

// API endpoint for admin to get bookings
app.get('/api/admin/bookings', (req, res) => {
    db.query('SELECT * FROM bookings ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json({ error: 'Ошибка базы данных' });
        res.json(results);
    });
});

// Catch all for HTML (SPA-ish fallback or direct page requests)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
