const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Journal = mongoose.model('journal', JournalSchema);
  