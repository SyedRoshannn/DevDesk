
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const issueRoutes = require("./routes/issueRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api/issues", issueRoutes);


app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "DevDesk API is running!",
  });
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`DevDesk API running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
