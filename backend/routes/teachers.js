const express = require('express');
const Teacher = require('../models/Teacher');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

// Protected requests
// Создать преподавателя
router.post('/', authMiddleware, async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Обновить преподавателя
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json(teacher);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удалить преподавателя
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher) {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        res.json({ message: 'Teacher deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Unprotected requests
// Получить всех преподавателей
router.get('/', async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.json(teachers);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;