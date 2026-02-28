const mongoose = require('mongoose');

const mockSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    durationMinutes: {
        type: Number,
        required: true,
        default: 60
    },
    positiveMarks: {
        type: Number,
        required: true,
        default: 4
    },
    negativeMarks: {
        type: Number,
        required: true,
        default: 1
    },
    questions: [{
        text: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctOptionIndex: { type: Number, required: true }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Mock', mockSchema);
