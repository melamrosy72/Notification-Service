"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationService_1 = require("../services/notificationService");
const deviceService_1 = require("../services/deviceService");
const router = express_1.default.Router();
router.post("/register-token", async (req, res) => {
    try {
        const { token, deviceId, deviceInfo } = req.body;
        if (!token || !deviceId || !deviceInfo || !deviceInfo.platform) {
            return res.status(400).json({
                success: false,
                message: "token, deviceId and deviceInfo.platform are required",
            });
        }
        const result = await deviceService_1.DeviceService.registerDevice(deviceId, token, deviceInfo);
        return res.json(result);
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
router.post("/send-notification", async (req, res) => {
    try {
        const { deviceId, title, body, data } = req.body;
        if (!deviceId || !title || !body) {
            return res.status(400).json({
                success: false,
                message: "deviceId, title and body are required",
            });
        }
        const result = await notificationService_1.NotificationService.sendToDeviceId(deviceId, title, body, data);
        return res.json(result);
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
router.post("/send-notification-all", async (req, res) => {
    try {
        const { title, body, data } = req.body;
        if (!title || !body) {
            return res
                .status(400)
                .json({ success: false, message: "title and body are required" });
        }
        const result = await notificationService_1.NotificationService.sendToAll(title, body, data);
        return res.json(result);
    }
    catch (err) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
});
router.get("/api/devices", async (_req, res) => {
    const devices = await deviceService_1.DeviceService.getAllDevices();
    return res.json({ success: true, count: devices.length, devices });
});
router.delete("/remove-token/:deviceId", async (req, res) => {
    const { deviceId } = req.params;
    if (!deviceId)
        return res
            .status(400)
            .json({ success: false, message: "deviceId is required" });
    const result = await deviceService_1.DeviceService.removeDevice(deviceId);
    return res.json(result);
});
exports.default = router;
