const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
    findUserByEmail,
    createUser,
    findUserById
} = require("../models/userModel");

// Register
const register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const existingUser = await findUserByEmail(email);

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const userRole = role === "alumni" ? "alumni" : "student";

        const userId = await createUser(
            name,
            email,
            passwordHash,
            userRole
        );

        res.status(201).json({
            message: "User registered successfully"
        });

    } catch (error) {
        console.error("Register error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// Login
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // Find user
        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await findUserById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                is_verified: user.is_verified,
                created_at: user.created_at
            }
        });

    } catch (error) {
        console.error("Get me error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    register,
    login,
    getMe
};