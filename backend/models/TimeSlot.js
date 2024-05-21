const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    default: { type: Boolean, default: false },
    slots: [{ type: String }],
});

const TimeSlot = mongoose.model('TimeSlot', timeSlotSchema);

module.exports = TimeSlot;