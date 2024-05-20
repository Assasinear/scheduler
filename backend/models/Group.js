const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
    number: { type: String, required: true, unique: true }
});

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;