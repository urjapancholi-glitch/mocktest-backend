const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mockId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mock',
        required: true
    },
    correctCount: {
        type: Number,
        required: true,
        default: 0
    },
    incorrectCount: {
        type: Number,
        required: true,
        default: 0
    },
    unattemptedCount: {
        type: Number,
        required: true,
        default: 0
    },
    finalScore: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
