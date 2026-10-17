
const db = require("../config/db");

const getAllUsers = async () => {
    const [users] = await db.execute(`
        SELECT
            user_id,
            name,
            email,
            role,
            is_verified,
            created_at
        FROM users
        ORDER BY created_at DESC
    `);

    return users;
};

const getUserById = async (userId) => {
    const [users] = await db.execute(
        `SELECT user_id, role, is_verified
         FROM users
         WHERE user_id = ?`,
        [userId]
    );

    return users[0];
};

const updateUserVerification = async (userId, isVerified) => {
    const [result] = await db.execute(
        `UPDATE users
         SET is_verified = ?
         WHERE user_id = ?`,
        [isVerified, userId]
    );

    return result.affectedRows > 0;
};

const deletePost = async (postId) => {
    const [result] = await db.execute(
        "DELETE FROM posts WHERE post_id = ?",
        [postId]
    );

    return result.affectedRows > 0;
};

module.exports = {
    getAllUsers,
    getUserById,
    updateUserVerification,
    deletePost
};
