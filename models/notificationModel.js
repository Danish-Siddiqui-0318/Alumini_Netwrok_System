const db = require("../config/db");

const getNotifications = async (userId) => {
    const [rows] = await db.query(
        `SELECT notification_id,
                user_id,
                type,
                message,
                reference_id,
                is_read,
                created_at
         FROM notifications
         WHERE user_id = ?
         ORDER BY created_at DESC, notification_id DESC`,
        [userId]
    );

    return rows;
};

const getUnreadCount = async (userId) => {
    const [rows] = await db.query(
        `SELECT COUNT(*) AS unread_count
         FROM notifications
         WHERE user_id = ?
           AND is_read = FALSE`,
        [userId]
    );

    return rows[0].unread_count;
};

const getNotificationById = async (notificationId) => {
    const [rows] = await db.query(
        `SELECT notification_id,
                user_id,
                type,
                message,
                reference_id,
                is_read,
                created_at
         FROM notifications
         WHERE notification_id = ?`,
        [notificationId]
    );

    return rows[0];
};

const markAsRead = async (notificationId, userId) => {
    const [result] = await db.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE notification_id = ?
           AND user_id = ?`,
        [notificationId, userId]
    );

    return result.affectedRows;
};

const markAllAsRead = async (userId) => {
    const [result] = await db.query(
        `UPDATE notifications
         SET is_read = TRUE
         WHERE user_id = ?
           AND is_read = FALSE`,
        [userId]
    );

    return result.affectedRows;
};

const deleteNotification = async (notificationId, userId) => {
    const [result] = await db.query(
        `DELETE
         FROM notifications
         WHERE notification_id = ?
           AND user_id = ?`,
        [notificationId, userId]
    );

    return result.affectedRows;
};

// Use this helper from other controllers when an event occurs.
const createNotification = async (
    userId,
    type,
    message,
    referenceId = null
) => {
    const [result] = await db.query(
        `INSERT INTO notifications
             (user_id, type, message, reference_id)
         VALUES (?, ?, ?, ?)`,
        [userId, type, message, referenceId]
    );

    return result.insertId;
};

module.exports = {
    getNotifications,
    getUnreadCount,
    getNotificationById,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    createNotification
};
