const Mock = require('../models/Mock');

// Admin only
exports.createMock = async (req, res) => {
    try {
        const mock = new Mock(req.body);
        await mock.save();
        res.status(201).json(mock);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.getMocksAdmin = async (req, res) => {
    try {
        // Find all mocks. The correctOptionIndex is included by default since we don't exclude it here.
        const mocks = await Mock.find();
        res.json(mocks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.updateMock = async (req, res) => {
    try {
        const mock = await Mock.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mock) return res.status(404).json({ message: 'Mock not found' });
        res.json(mock);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.deleteMock = async (req, res) => {
    try {
        const mock = await Mock.findByIdAndDelete(req.params.id);
        if (!mock) return res.status(404).json({ message: 'Mock not found' });
        res.json({ message: 'Mock deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Users
exports.getMocks = async (req, res) => {
    try {
        // Exclude actual correct answers from user fetch
        const mocks = await Mock.find().select('-questions.correctOptionIndex');
        res.json(mocks);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getMockById = async (req, res) => {
    try {
        const mock = await Mock.findById(req.params.id).select('-questions.correctOptionIndex');
        if (!mock) return res.status(404).json({ message: 'Mock not found' });
        res.json(mock);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
