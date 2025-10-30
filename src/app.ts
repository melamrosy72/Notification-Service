import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes";
import cors from "cors";
import { requestLogger } from "./middleware/logger";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";
import { apiKeyMiddleware } from "./middleware/apiKey";
import { rateLimiter } from "./middleware/rateLimiter";
import morgan from "morgan";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();

// app.use(morgan("combined"));
app.use(requestLogger);
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// rate limiting
app.use(rateLimiter);

app.get("/", (req, res) => {
  return res.status(200).json("(y)");
});

app.use("/api/v1/notifications", apiKeyMiddleware, notificationRoutes);

// 404 for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
});
