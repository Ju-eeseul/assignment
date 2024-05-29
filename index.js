const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Access Denied');
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

// 라우터 파일 호출
const authRouter = require('./routes/auth');
const characterRouter = require('./routes/character');
const itemRouter = require('./routes/item');

// 라우터 사용
app.use('/auth', authRouter);
app.use('/character', authRouter, characterRouter);
app.use('/item', itemRouter);

// 서버 시작
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
