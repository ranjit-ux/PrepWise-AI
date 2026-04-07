import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import interviewRoutes from "./src/routes/interviewRoutes.js";
dotenv.config();
import codeRoutes from "./src/routes/codeRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("PrepWise API Running 🚀");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/interview",interviewRoutes)
app.use("/api/code",codeRoutes);
// DB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected ✅");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

// Start server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} 🔥`);
  });
});