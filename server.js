const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const db = require("./config/db");
// Route Imports

const profileRoutes = require("./routes/profileRoutes");
const directoryRoutes = require("./routes/directoryRoutes");
const postRoutes = require("./routes/postRoutes");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");



const app = express();

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT || 5000;



// Routes
app.use("/auth", authRoutes);
app.use("/profiles", profileRoutes);
app.use("/users", directoryRoutes); // Alummini Apis
app.use("/posts", postRoutes);
app.use("/api", commentRoutes);


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});