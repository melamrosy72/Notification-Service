"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
dotenv_1.default.config();
const PORT = process.env.PORT || 4000;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.get('/', (req, res) => {
    return res.status(200).json("(y)");
});
app.use("/api/v1/notifications", notificationRoutes_1.default);
app.listen(PORT, () => {
    console.log(`🚀 Notification service running on port ${PORT}`);
});
