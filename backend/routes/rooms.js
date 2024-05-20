const express = require('express');
const Room = require('../models/Room');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Protected requests
// Создать аудиторию
router.post('/', authMiddleware, async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Обновить аудиторию
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить аудиторию
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const room = await Room.findByIdAndDelete(req.params.id);
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }
        res.json({ message: 'Room deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unprotected request
// Получить все аудитории
router.get('/', async (req, res) => {
    try {
        const rooms = await Room.find();
        res.json(rooms);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;