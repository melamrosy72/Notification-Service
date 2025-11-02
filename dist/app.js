"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const cors_1 = __importDefault(require("cors"));
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const helmet_1 = __importDefault(require("helmet"));
const apiKey_1 = require("./middleware/apiKey");
const rateLimiter_1 = require("./middleware/rateLimiter");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// app.use(morgan("combined"));
app.use(logger_1.requestLogger);
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(express_1.default.json({ limit: "1mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "1mb" }));
// rate limiting
app.use(rateLimiter_1.rateLimiter);
app.get("/", (req, res) => {
    return res.status(200).json("(y)");
});
app.use("/api/v1/notifications", apiKey_1.apiKeyMiddleware, notificationRoutes_1.default);
// 404 for unknown routes
app.use(errorHandler_1.notFoundHandler);
// Global error handler
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => {
    console.log(`🚀 Notification service running on port ${PORT}`);
});
