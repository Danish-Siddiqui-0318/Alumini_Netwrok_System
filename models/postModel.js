const db = require("../config/db");

// Create a post
const createPost = async (userId, content, imageUrl) => {
    const [result] = await db.query(
        `INSERT INTO posts (user_id, content, image_url)
         VALUES (?, ?, ?)`,
        [userId, content, imageUrl || null]
    );

    return result.insertId;
};

// Get all posts
const getAllPosts = async () => {
    const [rows] = await db.query(
        `SELECT
             p.post_id,
             p.user_id,
             u.name AS author_name,
             pr.profile_picture AS author_profile_picture,
             p.content,
             p.image_url,
             p.created_at,
             p.updated_at,
             (SELECT COUNT(*) FROM comments c
              WHERE c.post_id = p.post_id) AS comment_count,
             (SELECT COUNT(*) FROM post_likes pl
              WHERE pl.post_id = p.post_id) AS like_count
         FROM posts p
                  INNER JOIN users u ON p.user_id = u.user_id
                  LEFT JOIN profiles pr ON p.user_id = pr.user_id
         ORDER BY p.created_at DESC`
    );

    return rows;
};

// Get a post by ID
const getPostById = async (postId) => {
    const [rows] = await db.query(
        "SELECT * FROM posts WHERE post_id = ?",
        [postId]
    );

    return rows[0];
};

// Update a post
const updatePost = async (postId, content, imageUrl) => {
    await db.query(
        `UPDATE posts
         SET content = ?, image_url = ?
         WHERE post_id = ?`,
        [content, imageUrl, postId]
    );
};

// Delete a post
const deletePost = async (postId) => {
    const [result] = await db.query(
        "DELETE FROM posts WHERE post_id = ?",
        [postId]
    );

    return result.affectedRows;
};

module.exports = {
    createPost,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
};