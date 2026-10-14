const express = require("express");
const {
    sendMessage,
    getConversations,
    getConversation,
    markAsRead,
    removeMessage
} = require("../controllers/messageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/conversations", authMiddleware, getConversations);
router.get("/:userId", authMiddleware, getConversation);
router.put("/:messageId/read", authMiddleware, markAsRead);
router.delete("/:messageId", authMiddleware, removeMessage);

module.exports = router;
