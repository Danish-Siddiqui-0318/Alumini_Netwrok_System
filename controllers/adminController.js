
const adminModel = require("../models/adminModel");

const getAllUsers = async (req, res) => {
    try {
        const users = await adminModel.getAllUsers();

        return res.status(200).json({
            count: users.length,
            users
        });
    } catch (error) {
        console.error("Get all users error:", error);
        return res.status(500).json({
            message: "Failed to retrieve users"
        });
    }
};

const verifyUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        if (!Number.isSafeInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const { is_verified } = req.body;

        if (typeof is_verified !== "boolean") {
            return res.status(400).json({
                message: "is_verified must be true or false"
            });
        }

        const user = await adminModel.getUserById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const updated = await adminModel.updateUserVerification(
            userId,
            is_verified
        );

        if (!updated) {
            // MySQL may report zero changed rows when the value
            // already matches the requested value.
            if (user.is_verified === is_verified) {
                return res.status(200).json({
                    message: `User is already ${
                        is_verified ? "verified" : "unverified"
                    }`,
                    user_id: userId,
                    is_verified
                });
            }

            return res.status(500).json({
                message: "Failed to update user verification"
            });
        }

        return res.status(200).json({
            message: `User ${
                is_verified ? "verified" : "unverified"
            } successfully`,
            user_id: userId,
            is_verified
        });
    } catch (error) {
        console.error("Verify user error:", error);
        return res.status(500).json({
            message: "Failed to update user verification"
        });
    }
};

const removePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);

        if (!Number.isSafeInteger(postId) || postId <= 0) {
            return res.status(400).json({
                message: "Invalid post ID"
            });
        }

        const deleted = await adminModel.deletePost(postId);

        if (!deleted) {
            return res.status(404).json({
                message: "Post not found"
            });
        }

        return res.status(200).json({
            message: "Post removed successfully"
        });
    } catch (error) {
        console.error("Admin delete post error:", error);
        return res.status(500).json({
            message: "Failed to remove post"
        });
    }
};

module.exports = {
    getAllUsers,
    verifyUser,
    removePost
};
