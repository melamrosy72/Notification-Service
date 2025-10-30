import express from "express";
import { NotificationService } from "../services/notificationService";
import { DeviceService } from "../services/deviceService";

const router = express.Router();

router.post("/register-token", async (req, res, next) => {
  try {
    const { token, deviceId, deviceInfo } = req.body;
    if (!token || !deviceId || !deviceInfo || !deviceInfo.platform) {
      return res.status(400).json({
        success: false,
        message: "token, deviceId and deviceInfo.platform are required",
      });
    }

    const result = await DeviceService.registerDevice(
      deviceId,
      token,
      deviceInfo
    );
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
});

router.post("/send-notification", async (req, res, next) => {
  try {
    const { deviceId, title, body, data } = req.body;
    if (!deviceId || !title || !body) {
      return res.status(400).json({
        success: false,
        message: "deviceId, title and body are required",
      });
    }
    const result = await NotificationService.sendToDeviceId(
      deviceId,
      title,
      body,
      data
    );
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
});

router.post("/send-notification-all", async (req, res, next) => {
  try {
    const { title, body, data } = req.body;
    if (!title || !body) {
      return res
        .status(400)
        .json({ success: false, message: "title and body are required" });
    }
    const result = await NotificationService.sendToAll(title, body, data);
    return res.json(result);
  } catch (err: any) {
    return next(err);
  }
});

router.get("/devices", async (_req, res) => {
  const devices = await DeviceService.getAllDevices();
  return res.json({ success: true, count: devices.length, devices });
});

router.patch("/remove-token/:deviceId", async (req, res) => {
  const { deviceId } = req.params;
  if (!deviceId)
    return res
      .status(400)
      .json({ success: false, message: "deviceId is required" });
  const result = await DeviceService.removeDeviceToken(deviceId);
  return res.json(result);
});

export default router;
