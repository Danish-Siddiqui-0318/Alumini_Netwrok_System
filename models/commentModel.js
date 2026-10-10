const db = require("../config/db");

// Create a comment
const createComment = async (postId, userId, content) => {
    const [result] = await db.query(
        `INSERT INTO comments (post_id, user_id, content)
         VALUES (?, ?, ?)`,
        [postId, userId, content]
    );

    return result.insertId;
};

// Get all comments for a post
const getCommentsByPostId = async (postId) => {
    const [rows] = await db.query(
        `SELECT c.comment_id,
                c.post_id,
                c.user_id,
                u.name            AS author_name,
                p.profile_picture AS author_profile_picture,
                c.content,
                c.created_at,
                c.updated_at
         FROM comments c
                  INNER JOIN users u ON c.user_id = u.user_id
                  LEFT JOIN profiles p ON c.user_id = p.user_id
         WHERE c.post_id = ?
         ORDER BY c.created_at ASC`,
        [postId]
    );

    return rows;
};

// Get a comment by ID
const getCommentById = async (commentId) => {
    const [rows] = await db.query(
        "SELECT * FROM comments WHERE comment_id = ?",
        [commentId]
    );

    return rows[0];
};

// Update a comment
const updateComment = async (commentId, content) => {
    await db.query(
        `UPDATE comments
         SET content = ?
         WHERE comment_id = ?`,
        [content, commentId]
    );
};

// Delete a comment
const deleteComment = async (commentId) => {
    const [result] = await db.query(
        "DELETE FROM comments WHERE comment_id = ?",
        [commentId]
    );

    return result.affectedRows;
};

module.exports = {
    createComment,
    getCommentsByPostId,
    getCommentById,
    updateComment,
    deleteComment
};
