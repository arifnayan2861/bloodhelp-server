require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const donationRoutes = require("./routes/donationRoutes");
const blogRoutes = require("./routes/blogRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://bloodhelp-2024.web.app"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", donationRoutes);
app.use("/api", blogRoutes);
app.use("/api", paymentRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("BloodHelp is running...");
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`BloodHelp is running at port: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();