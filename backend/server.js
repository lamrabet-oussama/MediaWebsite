import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import path from "path";
import connectDB from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

// Initialisation
dotenv.config();
const app = express();
const __dirname = path.resolve();
// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; media-src 'self' https://res.cloudinary.com"
  );
  next();
});

// Middlewares de sécurité
app.use(helmet()); // Sécuriser les en-têtes HTTP
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000, // Limite : 100 requêtes par heure
//   message: "Too many requests from this IP, please try again in an hour!",
//   handler: (req, res) => {
//     res.status(429).json({
//       status: "error",
//       error: "Too many requests from this IP, please try again in an hour",
//     });
//   },
// });
// app.use(limiter);
app.use(express.json({ limit: "5mb" })); // Limiter la taille des requêtes
app.use(express.urlencoded({ extended: true })); // Analyser les données URL-encoded
app.use(cookieParser()); // Analyser les cookies

// Assainissement des données
app.use(mongoSanitize()); // Prévenir les injections MongoDB
app.use(xss()); // Protéger contre les attaques XSS

app.use(express.json());
// Routes de l'application
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
