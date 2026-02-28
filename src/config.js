require('dotenv').config();

const config = {
    PORT: process.env.PORT || 5000,
    MONGO_URI: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mocktest',
    JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
    EMAIL_USER: process.env.EMAIL_USER || '',
    EMAIL_PASS: process.env.EMAIL_PASS || '',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};

module.exports = config;
