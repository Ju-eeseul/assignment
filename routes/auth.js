const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

// 회원가입
router.post('/register', async (req, res) => {
    const { username, password, confirmPassword, name } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Passwords do not match');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { username, password: hashedPassword, name };

    try {
        const result = await db.query('INSERT INTO users SET ?', user);
        res.status(201).send({ id: result.insertId, username, name });
    } catch (err) {
        res.status(500).send('User registration failed');
    }
});

// 로그인
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (user.length === 0) {
            return res.status(404).send('User not found');
        }

        const validPassword = await bcrypt.compare(password, user[0].password);
        if (!validPassword) {
            return res.status(400).send('Invalid password');
        }

        const token = jwt.sign({ id: user[0].id }, JWT_SECRET);
        res.send({ token });
    } catch (err) {
        res.status(500).send('Login failed');
    }
});

module.exports = router;
