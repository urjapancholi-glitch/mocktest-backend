const express = require('express');
const cors = require('cors');
const connectDB = require('./src/db');
const config = require('./src/config');

const authRoutes = require('./src/routes/authRoutes');
const mockRoutes = require('./src/routes/mockRoutes');
const resultRoutes = require('./src/routes/resultRoutes');
const envRoutes = require('./src/routes/envRoutes');
const userRoutes = require('./src/routes/userRoutes');

const app = express();

app.use(cors({
    origin: config.FRONTEND_URL || '*'
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/mocks', mockRoutes);
app.use('/api/submit', resultRoutes);
app.use('/api/env', envRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => res.send('Mock Test API running'));

const PORT = process.env.PORT || config.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
