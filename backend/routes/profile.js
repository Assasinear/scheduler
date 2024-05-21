const express = require('express');

const Group = require('../models/Group');

const Teacher = require('../models/Teacher');

const Room = require('../models/Room');

const Schedule = require('../models/Schedule');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();



router.get('/counts', authMiddleware, async (req, res) => {

    try {

        const groupsCount = await Group.countDocuments();

        const teachersCount = await Teacher.countDocuments();

        const roomsCount = await Room.countDocuments();

        const schedulesCount = await Schedule.countDocuments();

        res.json({

            groupsCount, teachersCount, roomsCount, schedulesCount

        });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



module.exports = router;