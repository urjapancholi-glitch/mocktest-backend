const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('../config');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, config.JWT_SECRET, { expiresIn: '1d' });
};

exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    try {
        const user = await User.findOne({ email, role: 'admin' });
        if (!user) return res.status(404).json({ message: 'Invalid admin credentials' });

        // Since we are seeding, ensure user password exists
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid admin credentials' });

        const token = generateToken(user._id, 'admin');
        res.json({ token, role: 'admin', email: user.email, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Server error during admin login', error: error.message });
    }
};

exports.register = async (req, res) => {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email, and password required' });

    try {
        let user = await User.findOne({ email });

        // If user exists and is already verified
        if (user && user.isVerified) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        if (user && !user.isVerified) {
            // Update the unverified user with new details and OTP
            user.name = name;
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save();
        } else {
            // Create a new unverified user
            await User.create({
                name,
                email,
                password: hashedPassword,
                otp,
                otpExpires,
                isVerified: false,
                role: 'user'
            });
        }

        if (config.EMAIL_USER && config.EMAIL_PASS) {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: { user: config.EMAIL_USER, pass: config.EMAIL_PASS }
            });
            await transporter.sendMail({
                from: config.EMAIL_USER,
                to: email,
                subject: 'Mock Test Platform Registration OTP',
                text: `Your registration OTP is ${otp}. It expires in 10 minutes.`
            });
        } else {
            console.log(`[DEV] Registration OTP for ${email}: ${otp}`);
        }

        res.json({ message: 'Registration initiated. Please check your email for the OTP.' });
    } catch (error) {
        res.status(500).json({ message: 'Error during registration', error: error.message });
    }
};

exports.verifyRegistration = async (req, res) => {
    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.isVerified) return res.status(400).json({ message: 'User is already verified' });
        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired' });

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user._id, user.role);
        res.json({ token, role: user.role, email: user.email, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Server error during verification', error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Invalid credentials' });

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your account using the OTP sent to your email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        const token = generateToken(user._id, user.role);
        res.json({ token, role: user.role, email: user.email, name: user.name });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
};
