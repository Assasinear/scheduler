const express = require('express');
const Group = require('../models/Group');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected requests
// Создать группу студентов
router.post('/', authMiddleware, async (req, res) => {
    try {
        const group = new Group(req.body);
        await group.save();
        res.status(201).json(group);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Обновить группу студентов
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json(group);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить группу студентов
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json({ message: 'Group deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unprotected request
// Получить все группы студентов
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;