const mongoose = require('mongoose');

const scheduleItemSchema = new mongoose.Schema({
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
    room: { type: mongoose.Schema.Types.ObjectId, ref: 'Room' },
    subject: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
});

const scheduleSchema = new mongoose.Schema({
    name: { type: String, required: true },
    items: [scheduleItemSchema],
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;