const express = require('express');
const db = require('../db');
const router = express.Router();

// 캐릭터 생성
router.post('/create', async (req, res) => {
    const { name } = req.body;
    const userId = req.user.id;
    const character = { name, health: 500, power: 100, money: 10000, userId };

    try {
        const result = await db.query('INSERT INTO characters SET ?', character);
        res.status(201).send({ id: result.insertId, ...character });
    } catch (err) {
        res.status(500).send('Character creation failed');
    }
});

// 캐릭터 삭제
router.delete('/:id', async (req, res) => {
    const characterId = req.params.id;
    const userId = req.user.id;

    try {
        const result = await db.query('DELETE FROM characters WHERE id = ? AND userId = ?', [characterId, userId]);
        if (result.affectedRows === 0) {
            return res.status(404).send('Character not found or not owned by user');
        }
        res.send('Character deleted');
    } catch (err) {
        res.status(500).send('Character deletion failed');
    }
});

// 캐릭터 상세
router.get('/:id', async (req, res) => {
    const characterId = req.params.id;
    const userId = req.user.id;

    try {
        const characters = await db.query('SELECT * FROM characters WHERE id = ?', [characterId]);
        if (characters.length === 0) {
            return res.status(404).send('Character not found');
        }

        const character = characters[0];
        if (character.userId !== userId) {
            delete character.money;
        }
        res.send(character);
    } catch (err) {
        res.status(500).send('Character retrieval failed');
    }
});

module.exports = router;
