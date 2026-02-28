const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const config = require('./src/config');

mongoose.connect(config.MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');
    const adminEmail = 'admin@mocks.com';
    const adminPassword = 'Admin123';

    let adminUser = await User.findOne({ email: adminEmail, role: 'admin' });
    if (!adminUser) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        adminUser = new User({
            name: 'Super Admin',
            email: adminEmail,
            password: hashedPassword,
            role: 'admin',
            isVerified: true
        });
        await adminUser.save();
        console.log(`Admin user seeded successfully.`);
    } else {
        console.log(`Admin user already exists.`);
    }

    console.log(`Admin ID: ${adminUser.email}`);
    console.log(`Admin Password: ${adminPassword}`);
    process.exit(0);
}).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});
