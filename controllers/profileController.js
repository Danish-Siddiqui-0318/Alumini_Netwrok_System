const {
    findProfileByUserId,
    createProfile,
    updateProfile,
    getPublicProfileByUserId

} = require("../models/profileModel");

// Get current user's profile
const getMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const profile = await findProfileByUserId(userId);

        if (!profile) {
            return res.status(404).json({
                message: "Profile not found"
            });
        }

        res.status(200).json({
            profile
        });

    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

// Create or update current user's profile
const saveMyProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const profileData = req.body;

        const existingProfile = await findProfileByUserId(userId);

        if (existingProfile) {
            await updateProfile(userId, profileData);
        } else {
            await createProfile(userId, profileData);
        }


        res.status(200).json({
            message: existingProfile
                ? "Profile updated successfully"
                : "Profile created successfully",
        });

    } catch (error) {
        console.error("Save profile error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const getPublicProfile = async (req, res) => {
    try {
        const userId = Number(req.params.userId);

        if (!Number.isInteger(userId) || userId <= 0) {
            return res.status(400).json({
                message: "Invalid user ID"
            });
        }

        const profile = await getPublicProfileByUserId(userId);

        if (!profile) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            profile
        });

    } catch (error) {
        console.error("Get public profile error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getMyProfile,
    saveMyProfile,
    getPublicProfile
};