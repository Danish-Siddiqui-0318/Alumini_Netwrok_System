const db = require("../config/db");

// Add a like
const addLike = async (postId, userId) => {
    const [result] = await db.query(
        `INSERT INTO post_likes (post_id, user_id)
VALUES (?, ?)`,
        [postId, userId]
    );

    return result.insertId;
};

// Remove a like
const removeLike = async (postId, userId) => {
    const [result] = await db.query(
        `DELETE FROM post_likes
WHERE post_id = ? AND user_id = ?`,
        [postId, userId]
    );

    return result.affectedRows;
};

// Check whether a user liked a post
const checkLike = async (postId, userId) => {
    const [rows] = await db.query(
        `SELECT like_id
FROM post_likes
WHERE post_id = ? AND user_id = ?
    LIMIT 1`,
        [postId, userId]
    );

    return rows.length > 0;
};

// Get total likes for a post
const getLikeCount = async (postId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS like_count
FROM post_likes
WHERE post_id = ?`,
        [postId]
    );

    return rows[0].like_count;
};

module.exports = {
    addLike,
    removeLike,
    checkLike,
    getLikeCount
};
