import express from "express";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
app.use(express.json()); //to parse req.body
app.use(express.urlencoded({ extended: true })); //to parse from data (urlenoded)
app.use(cookieParser());
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
