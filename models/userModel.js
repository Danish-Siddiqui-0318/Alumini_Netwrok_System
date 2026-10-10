const db = require("../config/db");

// Find user by email
const findUserByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );

    return rows[0];
};

// Create new user
const createUser = async (name, email, passwordHash, role) => {
    const [result] = await db.query(
        `INSERT INTO users
        (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)`,
        [name, email, passwordHash, role]
    );

    return result.insertId;
};

// Find user by ID
const findUserById = async (userId) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE user_id = ?",
        [userId]
    );

    return rows[0];
};

module.exports = {
    findUserByEmail,
    createUser,
    findUserById
};