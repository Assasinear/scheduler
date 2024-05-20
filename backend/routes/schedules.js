const express = require('express');
const Schedule = require('../models/Schedule');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Создать расписание
router.post('/', authMiddleware, async (req, res) => {
    try {
        const schedule = new Schedule({ name: req.body.name });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Получить все расписания
router.get('/', authMiddleware, async (req, res) => {
    try {
        const schedules = await Schedule.find().populate('items.group items.teacher items.room');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получить расписание по ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate('items.group items.teacher items.room');
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновить расписание
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndUpdate(
            req.params.id,
            { name: req.body.name },
            { new: true }
        );
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Обновить элементы расписания
router.put('/:id/items', authMiddleware, async (req, res) => {
    try {
        const { items } = req.body;
        const updatedItems = items.map(item => ({
            ...item,
            startTime: new Date(item.startTime),
            endTime: new Date(item.endTime),
        }));

        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        schedule.items = updatedItems;
        await schedule.save();
        res.json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(err); // Логируем ошибку для отладки
    }
});

// Удалить расписание
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findByIdAndDelete(req.params.id);
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }
        res.json({ message: 'Schedule deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Оптимизировать расписание
router.post('/optimize/:id', authMiddleware, async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id).populate('items.group items.teacher items.room');
        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        schedule.items = optimizeSchedule(schedule.items);
        await schedule.save();

        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const optimizeSchedule = (items) => {
    // Пример простого жадного алгоритма распределения занятий по дням недели
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = ['08:30-10:05', '10:15-11:50', '12:10-13:45', '14:00-15:35'];

    let scheduleGrid = Array.from({ length: days.length }, () => Array(timeSlots.length).fill(null));

    items.forEach(item => {
        for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
            for (let slotIndex = 0; slotIndex < timeSlots.length; slotIndex++) {
                if (!scheduleGrid[dayIndex][slotIndex]) {
                    const [startHour, startMinute] = timeSlots[slotIndex].split('-')[0].split(':').map(Number);
                    const [endHour, endMinute] = timeSlots[slotIndex].split('-')[1].split(':').map(Number);
                    item.startTime = new Date();
                    item.startTime.setHours(startHour, startMinute);
                    item.endTime = new Date();
                    item.endTime.setHours(endHour, endMinute);

                    scheduleGrid[dayIndex][slotIndex] = item;
                    return;
                }
            }
        }
    });

    return scheduleGrid.flat().filter(item => item !== undefined);
};

module.exports = router;