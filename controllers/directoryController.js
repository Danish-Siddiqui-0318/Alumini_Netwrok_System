const {
    getAllAlumni,
    searchUsersByName

} = require("../models/directoryModel");

// Get all alumni
const getAlumni = async (req, res) => {
    try {
        const alumni = await getAllAlumni();

        res.status(200).json({
            count: alumni.length,
            alumni
        });

    } catch (error) {
        console.error("Get alumni error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


const searchUsers = async (req, res) => {
    try {
        const {name} = req.query;

        if (!name || !name.trim()) {
            return res.status(400).json({
                message: "Name query parameter is required"
            });
        }

        const users = await searchUsersByName(name.trim());

        res.status(200).json({
            count: users.length,
            users
        });

    } catch (error) {
        console.error("Search users error:", error);

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    getAlumni,
    searchUsers
};