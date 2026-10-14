const db = require("../config/db");

const createMessage = async (senderId, receiverId, message) => {
    const [result] = await db.query(
        `INSERT INTO messages (sender_id, receiver_id, message)
         VALUES (?, ?, ?)`,
        [senderId, receiverId, message]
    );

    return result.insertId;
};

const getUserById = async (userId) => {
    const [rows] = await db.query(
        "SELECT user_id, name FROM users WHERE user_id = ?",
        [userId]
    );

    return rows[0];
};

const getConversation = async (userId, otherUserId) => {
    const [rows] = await db.query(
        `SELECT m.message_id,
                m.sender_id,
                m.receiver_id,
                m.message,
                m.is_read,
                m.created_at,
                s.name AS sender_name,
                r.name AS receiver_name
         FROM messages m
                  INNER JOIN users s ON s.user_id = m.sender_id
                  INNER JOIN users r ON r.user_id = m.receiver_id
         WHERE (m.sender_id = ? AND m.receiver_id = ?)
            OR (m.sender_id = ? AND m.receiver_id = ?)
         ORDER BY m.created_at ASC, m.message_id ASC`,
        [userId, otherUserId, otherUserId, userId]
    );

    return rows;
};

const getConversations = async (userId) => {
    const [rows] = await db.query(
        `SELECT u.user_id                      AS other_user_id,
                u.name                         AS other_user_name,
                latest.message_id,
                latest.message                 AS last_message,
                latest.sender_id               AS last_sender_id,
                latest.created_at              AS last_message_at,
                (SELECT COUNT(*)
                 FROM messages unread
                 WHERE unread.sender_id = u.user_id
                   AND unread.receiver_id = ?
                   AND unread.is_read = FALSE) AS unread_count
         FROM users u
                  INNER JOIN (SELECT CASE
                                         WHEN sender_id = ? THEN receiver_id
                                         ELSE sender_id
                                         END         AS other_user_id,
                                     MAX(message_id) AS latest_message_id
                              FROM messages
                              WHERE sender_id = ?
                                 OR receiver_id = ?
                              GROUP BY other_user_id) conversation
                             ON conversation.other_user_id = u.user_id
                  INNER JOIN messages latest
                             ON latest.message_id = conversation.latest_message_id
         ORDER BY latest.message_id DESC`,
        [userId, userId, userId, userId]
    );

    return rows;
};

const getMessageById = async (messageId) => {
    const [rows] = await db.query(
        `SELECT message_id, sender_id, receiver_id, message, is_read
         FROM messages
         WHERE message_id = ?`,
        [messageId]
    );

    return rows[0];
};

const markMessageAsRead = async (messageId, receiverId) => {
    const [result] = await db.query(
        `UPDATE messages
         SET is_read = TRUE
         WHERE message_id = ?
           AND receiver_id = ?`,
        [messageId, receiverId]
    );

    return result.affectedRows;
};

const deleteMessage = async (messageId, senderId) => {
    const [result] = await db.query(
        `DELETE
         FROM messages
         WHERE message_id = ?
           AND sender_id = ?`,
        [messageId, senderId]
    );

    return result.affectedRows;
};

module.exports = {
    createMessage,
    getUserById,
    getConversation,
    getConversations,
    getMessageById,
    markMessageAsRead,
    deleteMessage
};
