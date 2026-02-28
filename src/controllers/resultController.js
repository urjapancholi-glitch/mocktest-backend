const Mock = require('../models/Mock');
const Result = require('../models/Result');

exports.submitMock = async (req, res) => {
    const { mockId, answers } = req.body;

    try {
        const mock = await Mock.findById(mockId);
        if (!mock) return res.status(404).json({ message: 'Mock not found' });

        let correctCount = 0;
        let incorrectCount = 0;
        let unattemptedCount = 0;

        mock.questions.forEach((q, index) => {
            const answer = answers.find(a => a.questionIndex === index);
            if (!answer || answer.selectedOptionIndex === null || answer.selectedOptionIndex === undefined) {
                unattemptedCount++;
            } else if (answer.selectedOptionIndex === q.correctOptionIndex) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        });

        const finalScore = (correctCount * mock.positiveMarks) - (incorrectCount * mock.negativeMarks);

        const result = new Result({
            userId: req.user.id,
            mockId,
            correctCount,
            incorrectCount,
            unattemptedCount,
            finalScore
        });

        await result.save();

        res.status(201).json({ result, mock });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getUserResults = async (req, res) => {
    try {
        const results = await Result.find({ userId: req.user.id }).populate('mockId', 'title');
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
