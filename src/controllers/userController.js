const User = require('../models/User');
const Result = require('../models/Result');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password -otp -otpExpires');
        const results = await Result.find().populate('mockId', 'title');

        const userData = users.map(user => {
            const userResults = results.filter(result => result.userId.toString() === user._id.toString());
            return {
                ...user._doc,
                results: userResults
            };
        });

        res.json(userData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
