import { Request, Response, NextFunction } from "express";
import { DeviceService } from "../services/deviceService";
import { NotificationService } from "../services/notificationService";

import {
  registerTokenSchema,
  sendAllNotificationSchema,
  sendNotificationSchema,
} from "./ValidationSchemas";

// --- Controller functions ---
export const registerDeviceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = registerTokenSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid body",
        errors: parsed.error,
      });
    }
    const { deviceId, token, deviceInfo } = parsed.data;
    const result = await DeviceService.registerDevice(
      deviceId,
      token,
      deviceInfo
    );
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const sendNotificationHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = sendNotificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid body",
        errors: parsed.error,
      });
    }
    const { deviceId, title, body, data } = parsed.data;
    const result = await NotificationService.sendToDeviceId(
      deviceId,
      title,
      body,
      data
    );
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const sendToAllHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parsed = sendAllNotificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid body",
        errors: parsed.error,
      });
    }
    const { title, body, data } = parsed.data;
    const result = await NotificationService.sendToAll(title, body, data);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};

export const allDevicesHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const devices = await DeviceService.getAllDevices();
    return res.json({ success: true, count: devices.length, devices });
  } catch (err) {
    return next(err);
  }
};

export const removeTokenHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { deviceId } = req.params;
    if (!deviceId) {
      return res
        .status(400)
        .json({ success: false, message: "deviceId is required" });
    }
    const existingDevice = await DeviceService.getDeviceById(deviceId);
    if (!existingDevice)
      return res.status(400).json({
        success: false,
        message: "There are no existing device with this deviceId",
      });
    const result = await DeviceService.removeDeviceToken(deviceId);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
};
