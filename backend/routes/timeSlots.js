const express = require('express');

const TimeSlot = require('../models/TimeSlot');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();



router.get('/', authMiddleware, async (req, res) => {

    try {

        const timeSlots = await TimeSlot.findOne({ user: req.user.id });

        res.json(timeSlots);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



router.post('/', authMiddleware, async (req, res) => {

    try {

        const timeSlots = new TimeSlot({ ...req.body, user: req.user.id });

        await timeSlots.save();

        res.status(201).json(timeSlots);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

});



router.put('/:id', authMiddleware, async (req, res) => {

    try {

        const timeSlots = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!timeSlots) {

            return res.status(404).json({ error: 'Time slots not found' });

        }

        res.json(timeSlots);

    } catch (err) {

        res.status(400).json({ error: err.message });

    }

});

module.exports = router;