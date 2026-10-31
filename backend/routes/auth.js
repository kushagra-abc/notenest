
const express = require('express');
const router = express.Router();

const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
}

// Generate JWT for an authenticated user
const generateAuthToken = (userId) => {
    return jwt.sign(
        { user: { id: userId } },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};


// ROUTE 1: Create a new user
// POST /api/auth/createuser
router.post('/createuser', [
    body('name')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Name must contain at least 3 characters'),

    body('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 5 })
        .withMessage('Password must contain at least 5 characters')

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, password } = req.body;

        // Check whether the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "A user with this email already exists"
            });
        }

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create the user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate authentication token
        const authToken = generateAuthToken(user.id);

        return res.status(201).json({
            success: true,
            authtoken: authToken
        });

    } catch (error) {
        console.error("Signup error:", error.message);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// ROUTE 2: Authenticate an existing user
// POST /api/auth/login
router.post('/login', [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Enter a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty()
        .withMessage('Password cannot be blank')

], async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                error: "Please try to login with correct credentials"
            });
        }

        // Compare entered password with stored password hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(400).json({
                success: false,
                error: "Please try to login with correct credentials"
            });
        }

        // Generate authentication token
        const authToken = generateAuthToken(user.id);

        return res.json({
            success: true,
            authtoken: authToken
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});


// ROUTE 3: Get logged-in user details
// POST /api/auth/getuser
router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userId = req.user.id;

        // Exclude password from the returned user data
        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.json(user);

    } catch (error) {
        console.error("Get user error:", error.message);

        return res.status(500).json({
            error: "Internal Server Error"
        });
    }
});

module.exports = router;
