import express from "express";
import dotenv from "dotenv";
import notificationRoutes from "./routes/notificationRoutes";
import cors from "cors";
import { requestLogger } from "./middleware/logger";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";
import helmet from "helmet";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(helmet())
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => {
  return res.status(200).json("(y)");
});

app.use("/api/v1/notifications", notificationRoutes);


// 404 for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`🚀 Notification service running on port ${PORT}`);
});
