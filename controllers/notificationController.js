const notificationModel = require("../models/notificationModel");

const getNotifications = async (req, res) => {
    try {
        const notifications =
            await notificationModel.getNotifications(req.user.userId);

        return res.status(200).json({
            count: notifications.length,
            notifications
        });
    } catch (error) {
        console.error("Get notifications error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getUnreadCount = async (req, res) => {
    try {
        const unreadCount =
            await notificationModel.getUnreadCount(req.user.userId);

        return res.status(200).json({
            unread_count: unreadCount
        });
    } catch (error) {
        console.error("Get unread count error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const notificationId = Number(req.params.notificationId);

        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        const notification =
            await notificationModel.getNotificationById(notificationId);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        if (notification.user_id !== req.user.userId) {
            return res.status(403).json({
                message: "You can only update your own notifications"
            });
        }

        if (notification.is_read) {
            return res.status(200).json({
                message: "Notification is already marked as read"
            });
        }

        await notificationModel.markAsRead(
            notificationId,
            req.user.userId
        );

        return res.status(200).json({
            message: "Notification marked as read"
        });
    } catch (error) {
        console.error("Mark notification as read error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        const updatedCount =
            await notificationModel.markAllAsRead(req.user.userId);

        return res.status(200).json({
            message: "All notifications marked as read",
            updated_count: updatedCount
        });
    } catch (error) {
        console.error("Mark all notifications as read error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const removeNotification = async (req, res) => {
    try {
        const notificationId = Number(req.params.notificationId);

        if (!Number.isInteger(notificationId) || notificationId <= 0) {
            return res.status(400).json({
                message: "Invalid notification ID"
            });
        }

        const notification =
            await notificationModel.getNotificationById(notificationId);

        if (!notification) {
            return res.status(404).json({
                message: "Notification not found"
            });
        }

        if (notification.user_id !== req.user.userId) {
            return res.status(403).json({
                message: "You can only delete your own notifications"
            });
        }

        await notificationModel.deleteNotification(
            notificationId,
            req.user.userId
        );

        return res.status(200).json({
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.error("Delete notification error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    getNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification
};
