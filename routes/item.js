const express = require('express');
const db = require('../db');
const router = express.Router();

// 아이템 생성
router.post('/create', async (req, res) => {
    const { item_code, item_name, item_stat, item_price } = req.body;

    const item = { item_code, item_name, item_stat, item_price };

    try {
        const result = await db.query('INSERT INTO items SET ?', item);
        res.status(201).send({ id: result.insertId, ...item });
    } catch (err) {
        res.status(500).send('Item creation failed');
    }
});

// 아이템 수정
router.put('/:id', async (req, res) => {
    const itemId = req.params.id;
    const { item_name, item_stat } = req.body;

    try {
        const result = await db.query('UPDATE items SET item_name = ?, item_stat = ? WHERE id = ?', [item_name, item_stat, itemId]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Item not found');
        }
        res.send('Item updated');
    } catch (err) {
        res.status(500).send('Item update failed');
    }
});

// 아이템 목록
router.get('/', async (req, res) => {
    try {
        const items = await db.query('SELECT item_code, item_name, item_price FROM items');
        res.send(items);
    } catch (err) {
        res.status(500).send('Items retrieval failed');
    }
});

// 아이템 상세
router.get('/:id', async (req, res) => {
    const itemId = req.params.id;

    try {
        const items = await db.query('SELECT * FROM items WHERE id = ?', [itemId]);
        if (items.length === 0) {
            return res.status(404).send('Item not found');
        }
        res.send(items[0]);
    } catch (err) {
        res.status(500).send('Item retrieval failed');
    }
});

module.exports = router;
