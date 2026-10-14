const messageModel = require("../models/messageModel");

const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const {receiver_id, message} = req.body;
        const receiverId = Number(receiver_id);

        if (!Number.isInteger(receiverId) || receiverId <= 0) {
            return res.status(400).json({
                message: "A valid receiver_id is required"
            });
        }

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({
                message: "Message content is required"
            });
        }

        if (message.trim().length > 5000) {
            return res.status(400).json({
                message: "Message cannot exceed 5000 characters"
            });
        }

        if (senderId === receiverId) {
            return res.status(400).json({
                message: "You cannot send a message to yourself"
            });
        }

        const receiver = await messageModel.getUserById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        const messageId = await messageModel.createMessage(
            senderId,
            receiverId,
            message.trim()
        );

        return res.status(201).json({
            message: "Message sent successfully",
            message_id: messageId
        });
    } catch (error) {
        console.error("Send message error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getConversations = async (req, res) => {
    try {
        const conversations = await messageModel.getConversations(
            req.user.userId
        );

        return res.status(200).json({
            count: conversations.length,
            conversations
        });
    } catch (error) {
        console.error("Get conversations error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const getConversation = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const otherUserId = Number(req.params.userId);

        if (!Number.isInteger(otherUserId) || otherUserId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        if (currentUserId === otherUserId) {
            return res.status(400).json({
                message: "You cannot open a conversation with yourself"
            });
        }

        const otherUser = await messageModel.getUserById(otherUserId);

        if (!otherUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const messages = await messageModel.getConversation(
            currentUserId,
            otherUserId
        );

        return res.status(200).json({
            other_user: otherUser,
            count: messages.length,
            messages
        });
    } catch (error) {
        console.error("Get conversation error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const markAsRead = async (req, res) => {
    try {
        const messageId = Number(req.params.messageId);

        if (!Number.isInteger(messageId) || messageId <= 0) {
            return res.status(400).json({
                message: "Invalid message ID"
            });
        }

        const message = await messageModel.getMessageById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        if (message.receiver_id !== req.user.userId) {
            return res.status(403).json({
                message: "You can only mark messages sent to you as read"
            });
        }

        if (message.is_read) {
            return res.status(200).json({
                message: "Message is already marked as read"
            });
        }

        await messageModel.markMessageAsRead(
            messageId,
            req.user.userId
        );

        return res.status(200).json({
            message: "Message marked as read"
        });
    } catch (error) {
        console.error("Mark message as read error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

const removeMessage = async (req, res) => {
    try {
        const messageId = Number(req.params.messageId);

        if (!Number.isInteger(messageId) || messageId <= 0) {
            return res.status(400).json({
                message: "Invalid message ID"
            });
        }

        const message = await messageModel.getMessageById(messageId);

        if (!message) {
            return res.status(404).json({
                message: "Message not found"
            });
        }

        if (message.sender_id !== req.user.userId) {
            return res.status(403).json({
                message: "You can only delete messages you sent"
            });
        }

        await messageModel.deleteMessage(messageId, req.user.userId);

        return res.status(200).json({
            message: "Message deleted successfully"
        });
    } catch (error) {
        console.error("Delete message error:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
};

module.exports = {
    sendMessage,
    getConversations,
    getConversation,
    markAsRead,
    removeMessage
};
